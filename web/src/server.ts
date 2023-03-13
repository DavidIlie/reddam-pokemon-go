import express from "express";
import next from "next";
import expressWs from "express-ws";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

import { prisma } from "./lib/db";

app.prepare().then(async () => {
  const server = express();
  const wsServer = express();
  const expressWsInstance = expressWs(wsServer).app;

  expressWsInstance.ws("/ws", async (ws, req) => {
    const { auth } = req.query as { auth: string };
    if (!auth) ws.close();

    const connection = await prisma.connection.findFirst({
      where: { connectionId: auth },
    });
    if (!connection) ws.close();

    ws.on("message", (msg: String) => {
      ws.send(`message: ${msg}`);
    });
  });

  wsServer.listen(3001, () => {
    console.log("> Socket Server Alive on port 3001");
  });

  server.all("*", (req, res) => handle(req, res));

  server.listen(3000, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
