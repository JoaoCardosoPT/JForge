import { timingSafeEqual } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function apiKeyAuth(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const apiKey = process.env.JFORGE_API_KEY;

    if (!apiKey) {
        request.log.error("JFORGE_API_KEY is not configured");

        return reply.code(503).send({
            error: "SERVICE_UNAVAILABLE"
        });
    }

    const authorization = request.headers.authorization;
    const match = /^Bearer ([^\s]+)$/.exec(authorization ?? "");
    
    if (!match || !match[1]) {
        return reply.code(401).send({
            error: "UNAUTHORIZED"
        });
    }

    const providedKey = Buffer.from(match[1], "utf8");
    const expectedKey = Buffer.from(apiKey, "utf8");

    if (
        providedKey.length !== expectedKey.length ||
        !timingSafeEqual(providedKey, expectedKey)
    ) {
        return reply.code(401).send({
            error: "UNAUTHORIZED"
        });
    }
}