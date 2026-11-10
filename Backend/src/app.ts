import Fastify = require('fastify')
import fastifyConfig = require('./config/fastifty')
import routes = require('./routes/index')
import notFoundHandler = require('./Handlers/error-handler')

function buildApp() {
    const app = Fastify(fastifyConfig)

    app.register(routes, { prefix: '/api' })
    app.setNotFoundHandler(notFoundHandler)
    return app
}

export = buildApp