import type { FastifyPluginAsync } from "fastify";
import { apiKeyAuth } from "../../../middleware/api_key";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

const discordRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post<{
        Params: {channelId: string};
        Body: {content: string };
    }>(
        "/channels/:channelId/messages",
        {
            // Validation Rules
            onRequest: apiKeyAuth,
            schema: {
                params: {
                    type: "object",
                    required: ["channelId"],
                    properties: {
                        channelId: {
                            type: "string",
                            pattern: "^[0-9]+$",
                            maxLength: 20,
                        },
                    },
                },
                // Data Sent by client
                body: {
                    type: "object",
                    required: ["content"],
                    properties: {
                        content: {
                            type: "string",
                            minLength: 1,
                            maxLength: 2000,
                            pattern: "\\S",
                        },
                    },
                },
            },
            errorHandler(error, request, reply) {
                const statusCode = error.statusCode ?? 500;
                const isClientError = statusCode >= 400 && statusCode < 500;
                const code = isClientError ? "INVALID_REQUEST" : "INTERNAL_ERROR";
                const details = {
                    requestId: request.id,
                    code,
                    errorCode: error.code,
                    validationContext: error.validationContext,
                    validation: error.validation,
                };

                if (isClientError) {
                    request.log.warn(details, "Invalid Discord API request");
                } else {
                    request.log.error(details, "Unexpected Discord API error");
                }

                return reply.code(isClientError ? statusCode : 500).send({
                    error: isClientError
                        ? error.validation
                            ? `Invalid request: ${error.message}`
                            : "Invalid request. Check the JSON body and Content-Type."
                        : "An unexpected error occurred.",
                    code,
                    requestId: request.id,
                });
            },
        },
        async (request, reply) => {
            const { channelId } = request.params;
            const { content } = request.body;
            const startedAt = Date.now();
            const logContext = () => ({
                requestId: request.id,
                channelId,
                durationMs: Date.now() - startedAt,
            });
            const sendError = (statusCode: number, code: string, error: string) => {
                return reply.code(statusCode).send({ error, code, requestId: request.id });
            };
            const token = process.env.DISCORD_BOT_TOKEN;

            if (!token) {
                request.log.error({ ...logContext(), code: "DISCORD_NOT_CONFIGURED" }, "Discord bot token is missing");
                return sendError(500, "DISCORD_NOT_CONFIGURED", "Discord integration is not configured.");
            }

            const signal = AbortSignal.timeout(10_000);

            try {
              // send message using our bot stored in the backend
              const discordResponse = await fetch(
                `https://discord.com/api/v10/channels/${channelId}/messages`,
                {
                    method: "POST",
                    headers: {
                      Authorization: `Bot ${token}`,
                      "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                      content,
                      allowed_mentions: {parse: [] },
                    }),
                    signal,
                },
              );
              let data: unknown = null;
              try {
                  data = await discordResponse.json();
              } catch (error) {
                  // Keep the HTTP diagnosis when Discord returns a non-JSON error page.
                  if (signal.aborted) throw error;
              }

              if (!discordResponse.ok) {
                  const discord: { status: number; code?: number; message?: string } = {
                      status: discordResponse.status,
                  };

                  if (isRecord(data)) {
                      if (typeof data.code === "number") {
                          discord.code = data.code;
                      }
                      if (typeof data.message === "string") {
                          discord.message = data.message;
                      }
                  }

                  const details = { ...logContext(), discord };
                  if (discord.status >= 500 || discord.status === 401) {
                      request.log.error(details, "Discord rejected the message");
                  } else {
                      request.log.warn(details, "Discord rejected the message");
                  }

                  switch (discord.status) {
                      case 400:
                          return sendError(400, "DISCORD_INVALID_REQUEST", "Discord rejected the message data.");
                      case 401:
                          return sendError(502, "DISCORD_AUTH_FAILED", "Discord bot authentication failed.");
                      case 403:
                          return sendError(403, "DISCORD_FORBIDDEN", "The bot cannot access this channel or send messages there.");
                      case 404:
                          return sendError(404, "DISCORD_CHANNEL_NOT_FOUND", "The Discord channel was not found.");
                      // Error for too many requests
                      case 429: {
                          const retryAfterHeader = discordResponse.headers.get("Retry-After");
                          const headerSeconds = retryAfterHeader?.trim() ? Number(retryAfterHeader) : NaN;
                          const bodySeconds = isRecord(data) && typeof data.retry_after === "number"
                              ? data.retry_after
                              : NaN;
                          const retryAfter = Number.isFinite(headerSeconds) && headerSeconds >= 0
                              ? headerSeconds
                              : bodySeconds;
                          const retryDetails: { retryAfter?: number } = {};

                          if (Number.isFinite(retryAfter) && retryAfter >= 0) {
                              reply.header("Retry-After", Math.ceil(retryAfter));
                              retryDetails.retryAfter = retryAfter;
                          }

                          return reply.code(429).send({
                              error: "Discord rate limit reached. Try again later.",
                              code: "DISCORD_RATE_LIMITED",
                              requestId: request.id,
                              ...retryDetails,
                          });
                      }
                      default:
                          return sendError(502, "DISCORD_UNAVAILABLE", "Discord could not process the message.");
                  }
              }

              if (!isRecord(data) || typeof data.id !== "string" || !/^[0-9]{1,20}$/.test(data.id)) {
                  request.log.error({ ...logContext(), discordStatus: discordResponse.status, code: "DISCORD_INVALID_RESPONSE" }, "Discord returned an invalid message response");
                  return sendError(502, "DISCORD_INVALID_RESPONSE", "Discord returned an invalid message response.");
              }

              return reply.code(201).send({ messageId: data.id });
            } catch (error) {
              if (signal.aborted) {
                  request.log.warn({ ...logContext(), code: "DISCORD_TIMEOUT" }, "Discord request timed out");
                  return sendError(504, "DISCORD_TIMEOUT", "Discord request timed out.");
              }

              const cause = error instanceof Error ? error.cause : undefined;
              request.log.error({
                  ...logContext(),
                  code: "DISCORD_UNAVAILABLE",
                  errorName: error instanceof Error ? error.name : "UnknownError",
                  networkCode: isRecord(cause) && typeof cause.code === "string" ? cause.code : undefined,
              }, "Discord request failed");
              return sendError(502, "DISCORD_UNAVAILABLE", "Unable to contact Discord.");
            }
        },
    );
};

export = discordRoutes;
