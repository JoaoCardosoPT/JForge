// starts the server using the configured port, or 5000 locally
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

        await app.listen({
            port: Number(process.env.PORT ?? 5000),
            host: '0.0.0.0',
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

startServer();
