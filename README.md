<p align="center">
  <img src="docs/jforge-logo.png" width="104" height="104" alt="JForge monogram">
</p>

<h1 align="center">JForge</h1>

<p align="center">Open-source workflow automation, starting with Discord.</p>

<p align="center">
  <a href="https://jforge.joaopmrcardoso.workers.dev/"><strong>Visit the website ↗</strong></a>
  &nbsp;·&nbsp; <a href="#run-locally">Run locally</a>
  &nbsp;·&nbsp; <a href="#discord-integration">Discord API</a>
</p>

[![The JForge homepage shows a new release passing through the API to the Discord channels #announcements and #changelog, then scrolls to the integrations section.](docs/homepage-preview.gif)](https://jforge.joaopmrcardoso.workers.dev/)

I started JForge to practice full-stack development and share what I build. The public beta previews a release announcement workflow. You can try its Discord action locally by sending a message to a channel you manage.

## Run locally

Use Node.js 22.12 or newer and npm. The website runs on its own. To run the API, you’ll also need a reachable PostgreSQL instance.

```bash
git clone https://github.com/JoaoCardosoPT/JForge.git
cd JForge
```

### Preview the website

```bash
npm --prefix Website ci
npm --prefix Website run dev
```

Open the [local homepage](http://localhost:5174) and select **Test** to replay the release workflow.

### Start the API

Create `Backend/.env` with your PostgreSQL connection string.

```dotenv
DATABASE_URL=postgresql://jforge:your-password@localhost:5432/jforge
```

```bash
npm --prefix Backend ci
npm --prefix Backend run dev
```

Check the health endpoint from another terminal.

```bash
curl http://localhost:5000/api/health
```

### Open the local frontend

Leave the API running and start the frontend in another terminal.

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

Open the [local frontend](http://localhost:5173). Vite forwards `/api` requests to the local backend on port `5000` by default. Set `API_TARGET` in `frontend/.env` to use a different origin.

## Discord integration

The beta uses a shared API key. Personal keys managed through the platform are planned.

Give your Discord bot permission to send messages in the destination channel. Add the following values to `Backend/.env`, then restart the API.

| Variable | What to set |
| --- | --- |
| `JFORGE_API_KEY` | A secret you choose. Clients send it as a bearer token when calling JForge. |
| `DISCORD_BOT_TOKEN` | Your Discord bot token. The backend uses it to post the message. |

To send a release announcement, replace `<channelId>` with your Discord channel ID and `<JFORGE_API_KEY>` with your configured key.

```http
POST /api/discord/channels/<channelId>/messages
Authorization: Bearer <JFORGE_API_KEY>
Content-Type: application/json

{"content":"A new JForge release is available."}
```

A successful request returns `201 Created` with the Discord `messageId`. [Discord route implementation](Backend/src/config/integrations/discord/routes.ts)

<a id="architecture-discord-example"></a>

<details>
<summary><strong>How a message reaches Discord</strong></summary>

![The API checks its PostgreSQL connection at startup. For each message, Fastify authenticates the client’s request and forwards the content to Discord using the bot token.](docs/discord-architecture.png)

</details>

## Contributing

Have a tool you’d like to connect? [Suggest an integration or report a bug](https://github.com/JoaoCardosoPT/JForge/issues). Documentation improvements and pull requests are welcome.
