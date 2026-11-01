# Remote MCP Server

A demo MCP server built with TypeScript, the Model Context Protocol SDK, and Hono. The HTTP server listens on port `3000` and exposes the MCP endpoint at `/mcp`.

## Requirements

- Node.js (current LTS recommended)
- npm
- ngrok for exposing the local HTTP server over HTTPS during a remote-client demo

## Install and run

```sh
npm install
npm run build
npm run start:server
```

The HTTP MCP endpoint is available locally at:

```text
http://localhost:3000/mcp
```

`npm run start:server` runs the HTTP server compiled from `src/server.ts`. `npm start` runs `dist/index.js`, which uses the stdio transport instead.

## HTTPS demo with ngrok

In a second terminal, start an HTTPS tunnel to the local HTTP server:

```sh
ngrok http 3000
```

Use the HTTPS forwarding address printed by ngrok, with `/mcp` appended, for example:

```text
https://<your-ngrok-domain>/mcp
```

The server does not provide TLS itself. Therefore, `https://localhost:3000/mcp` will not work with this setup unless a separate local TLS proxy is configured. For local testing, use `http://localhost:3000/mcp`; for a remote MCP client demo, use the public HTTPS ngrok URL. The ngrok URL is temporary and changes when the tunnel restarts.

This tunnel is intended for demos. The endpoint has no authentication configured, so do not expose sensitive data through it. On a live server, terminate HTTPS at the server or its reverse proxy and use the live HTTPS endpoint.

## MCP client configuration

For clients that support Streamable HTTP MCP servers, add a server entry using the ngrok URL. For example, an MCP configuration file can contain:

```json
{
  "mcpServers": {
    "remote-mcp-demo": {
      "type": "http",
      "url": "https://<your-ngrok-domain>/mcp"
    }
  }
}
```

Replace `<your-ngrok-domain>` with the HTTPS forwarding host shown by ngrok. In Claude or another MCP client, add a remote HTTP MCP server with this URL. Client configuration screens and file locations vary by client and version; use the URL field for Streamable HTTP, not the local `localhost` URL when connecting remotely.

## Available MCP features

- **Prompt: `greeting-example`** - accepts a `name` and asks the assistant to greet that user in a friendly manner, including "hola".
- **Prompt: `student_list`** - accepts a `limit` and asks for that many students from the LMS.
- **Tool: `get_all_students`** - returns student enrollment information, optionally limited by a numeric `limit`.
- **Resource: `refund-policy`** - provides the demo refund policy at `https://example.com/refund-policy`.

Student records are currently static demo data in the source code (the enrollment dates are generated relative to the current date). The student tool can be connected to a database later by replacing its in-memory data source with a database query. The refund policy is also currently supplied directly by the server code.
