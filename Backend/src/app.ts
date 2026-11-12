import Fastify = require('fastify')
import fastifyConfig = require('./config/fastifty')
import routes = require('./routes/index')
import notFoundHandler = require('./Handlers/error-handler')
import database = require('./database/database')

async function buildApp() {
    try {
        await database.connectDatabase()
        const app = Fastify(fastifyConfig)
        
        app.addHook("onClose", async () =>{
            await database.pool.end()
        })

        app.register(routes, { prefix: '/api' })
        app.setNotFoundHandler(notFoundHandler)
        return app
    } catch (error) {
        console.error('Error building app:', error)
        throw error
    }
}

export = buildApp