// starts the server and listens on port 5000
import buildApp = require("./app");

async function startServer() {
    const app = buildApp();
    try {
        await app.listen({ port: 5000})
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

startServer();