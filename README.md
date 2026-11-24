<h1 align="center">JForge</h1>

<p align="center"><strong>Connect your tools and automate repetitive work.</strong></p>

<p align="center">
  <a href="https://jforge.joaopmrcardoso.workers.dev/"><strong>Visit the website</strong></a>
  &nbsp;·&nbsp;
  <a href="#architecture">Architecture</a>
  &nbsp;·&nbsp;
  <a href="#run-locally">Run locally</a>
</p>

---

JForge is a workflow automation project with Discord as its first integration. The website previews how a new GitHub release could trigger posts in `#announcements` and `#changelog`. Use **Test** on the site to replay the demo, or call the JForge API to send a message to a Discord channel.

## Architecture

```mermaid
flowchart LR
    subgraph web["Browser apps"]
        site["Website<br/>Workflow demo"]
        status["Status UI"]
    end

    status -->|"GET /api/health"| api["Fastify API"]
    client["API client"] -->|"Authenticated POST"| api
    api -->|"Startup connection check"| db[("PostgreSQL")]
    api -->|"Post channel message"| discord["Discord API"]
```

| Component | Stack | Responsibility |
| --- | --- | --- |
| [Website](Website/) | React, TypeScript, Vite | Renders the landing page and the interactive workflow demo. |
| [Status UI](frontend/) | React, Vite | Calls `/api/health` and displays the backend’s HTTP status. |
| [API](Backend/) | Fastify, TypeScript | Serves health endpoints, validates Discord message requests, and calls Discord with a server-side bot token. |
| [Database](Backend/src/database/database.ts) | PostgreSQL, `pg` | Provides a connection pool. The API checks connectivity before it starts listening. |

The website runs on Cloudflare Workers. The API runs on Railway and exposes a public health endpoint. [Live API health check](https://jforge-production.up.railway.app/api/health)

## Run locally

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
