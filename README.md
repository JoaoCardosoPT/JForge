<h1 align="center">JForge</h1>

<p align="center"><strong>Connect Your Major Needs and Automate Them</strong></p>

<p align="center">
  <a href="https://jforge.joaopmrcardoso.workers.dev/"><strong> Website</strong></a>
  &nbsp;·&nbsp;
  <a href="#architecture-discord-example">Architecture</a>
</p>

---

JForge is a workflow automation project done by me to improve my full-stack skills as well as retrive to the community. the website itself for now its on beta and shows just the basic UI of the plantform itself

## Architecture Discord Example

![An API client sends an authenticated POST to Fastify. Fastify checks its PostgreSQL connection at startup and posts messages to Discord.](docs/discord-architecture.png)

## Run locally (For Tests While the main plantform is not active)

Use Node.js 22.12 or newer with npm. Running the API also requires a reachable PostgreSQL instance.

```bash
git clone https://github.com/JoaoCardosoPT/JForge.git
cd JForge
```

### Preview the website

```bash
npm --prefix Website ci
npm --prefix Website run dev
```

Open the [local website](http://localhost:5174).

### Start the API

Create `Backend/.env` with the connection string for your PostgreSQL instance.

```dotenv
DATABASE_URL=postgresql://jforge:your-password@localhost:5432/jforge
```

```bash
npm --prefix Backend ci
npm --prefix Backend run dev
```

In another terminal, check that the API is responding.

```bash
curl http://localhost:5000/api/health
```

### Open the status UI

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

Vite forwards `/api` requests to `http://localhost:5000` by default. If the API runs on a different origin, set `API_TARGET` in `frontend/.env`. [Local status UI](http://localhost:5173)

## Discord integration
As of now these is a really beta version, but later the authentication and use of personal API keys will be made inside of the plantform 

To send a message, set `JFORGE_API_KEY` and `DISCORD_BOT_TOKEN` in `Backend/.env`. The bot needs permission to send messages in the destination channel.

```http
POST /api/discord/channels/<channelId>/messages
Authorization: Bearer <JFORGE_API_KEY>
Content-Type: application/json

{"content":"A new JForge release is available."}
```

A successful request returns `201 Created` with a `messageId`. [Discord route implementation](Backend/src/config/integrations/discord/routes.ts)

## Contributing

Bug reports, integration ideas, documentation improvements, and pull requests are welcome. [Open an issue](https://github.com/JoaoCardosoPT/JForge/issues)
