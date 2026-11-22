import type { FastifyPluginAsync } from "fastify";

const discordRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post<{
        Params: {channelId: string};
        Body: {content: string };
    }>(
        "/channels/:channelId/messages",
        {
            // Validation Rules
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
        },
        async (request, reply) => {
            const token = process.env.DISCORD_BOT_TOKEN;

            if (!token)
                return reply.code(500).send({
                    error: "No configured Discord Token in env"
                });

            const { channelId } = request.params;
            const { content } = request.body;
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
              // edge cases for error handling in our discord api
              if (discordResponse.status === 429) {
                  const retryAfter = discordResponse.headers.get("Retry-After");
                  if (retryAfter) reply.header("Retry-After", retryAfter);

                  return reply.code(429).send({
                    error: "Rate limit Reached. Try again Later",
                  });
              }

              if (!discordResponse.ok) {
                  return reply.code(502).send({ error: "Discord rejected the message" });
              }

              const data: unknown = await discordResponse.json();
              if (typeof data !== "object" || data === null || !("id" in data) || typeof data.id !== "string") {
                  return reply.code(502).send({ error: "Invalid message response from Discord" });
              }

              return reply.code(201).send({ messageId: data.id });
            } catch (error) {
              if (signal.aborted) {
                  return reply.code(504).send({ error: "Discord request timed out" });
              }

              request.log.error({ err: error }, "Discord request failed");
              return reply.code(502).send({ error: "Discord request failed" });
            }
        },
    );
};

export = discordRoutes;
