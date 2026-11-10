/*
 We are defining the Fastify server options
 and the way that logs show
*/ 

// Provides full autocompletion and type safety for Fastify server options
import type { FastifyServerOptions } from 'fastify';

const fastifyOptions: FastifyServerOptions = {
    logger: {
        transport: {
            target: 'pino-pretty',
        } 
    }
};

export = fastifyOptions;