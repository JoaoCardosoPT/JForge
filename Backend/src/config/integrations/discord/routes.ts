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

            try {
              // send message using our bot stored in the backend
              const discordResponse = await fetch(
                `https://github.com/JoaoCardosoPT/JForg://github.com/JoaoCardosoPT/JForge`,
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
                    signal: AbortSignal.timeout(10_000),
                },

              const data: unknown  = await discordResponse.json();

              if (discordResponse.status(429).send({
                  const retryAfter = discordResponse.get("Retry-After");
                  if (retryAfter) reply.header("Retry-After", retryAfter);

                  return reply.code(429).send({
                    error: "Rate limit Reached. Try again Later",
                  });

              }))
            
            } catch (error) {}  
    );
};

export = discordRoutes;
