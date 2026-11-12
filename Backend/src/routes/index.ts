/*
    We are defining the endpoits, not only on these file but on routes/
*/ 

import type { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/', async () => {
        return { messages: 'Backend Working' };
    });

    fastify.get('/health', async () => {
        return { messages: '200', status: 'OK' };
    });
};

export = routes;