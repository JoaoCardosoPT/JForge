/*
    We are defining the endpoits, not only on these file but on routes/
*/ 

import type { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/', async () => {
        return { messages: 'Backend Working' };
    });
};

export = routes;