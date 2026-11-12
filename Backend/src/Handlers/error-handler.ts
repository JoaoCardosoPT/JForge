// How to answer when a route or endpoint is not found in Fastify
// This is a custom error handler for 404 Not Found errors
// It will return a JSON response with a message and the status code

import type { FastifyReply, FastifyRequest } from 'fastify'

const notFoundHandler = (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(404).send({
        message: 'Route not found',
        statusCode: 404,
    })
}

export = notFoundHandler