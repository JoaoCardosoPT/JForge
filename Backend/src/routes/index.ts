/*
    We are defining the endpoits, not only on these file but on routes/
*/ 

import type { FastifyPluginAsync } from 'fastify';
import discordRoutes = require('../config/integrations/discord/routes');

const routes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/', async () => {
        return { messages: 'Backend Working' };
    });

    fastify.get('/health', async () => {
        return { messages: '200', status: 'OK' };
    });

    // discord API
    fastify.register(discordRoutes, {prefix: "/discord"})

    fastify.get('/discord', async () => {
        return { messages: '200', status: 'OK' };
    });
};

export = routes;
