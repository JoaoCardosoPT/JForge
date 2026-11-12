// starts the server and listens on port 5000
import buildApp = require("./app");

let isShuttingDown = false;

async function startServer() {
    try {
        const app = await buildApp();

        async function shutdown(signal: string) {
            if (isShuttingDown) return;

            isShuttingDown = true;

            try {
                app.log.info(`Received ${signal}. Shutting down...`);
                await app.close();
                process.exitCode = 0;
            } catch (error) {
                app.log.error(error, "Shutdown Failed");
                process.exitCode = 1;
            }
        }

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

        await app.listen({ port: 5000 });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

startServer();