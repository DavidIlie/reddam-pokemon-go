import express from "express";
import expressWs from "express-ws";

import { prisma } from "./lib/db";

const server = express();
const expressWsInstance = expressWs(server).app;

export let connections = [] as {
  ws: WebSocket;
  connectionId: string;
}[];

expressWsInstance.ws("/ws", async (ws, req) => {
  const { auth } = req.query as { auth: string };
  if (!auth) return ws.close();

  const connection = await prisma.connection.findFirst({
    where: { connectionId: auth },
  });
  if (!connection) return ws.close();

  console.log(`CONNECTION: ${connection.name}`);
  connections.push({ ws: ws as any, connectionId: connection.connectionId! });

  ws.on("message", (msg: String) => {
    console.log(`message: ${msg}`);
  });

  ws.on("close", () => {
    connections.filter((s) => s.connectionId !== connection.id);
  });
});

server.get("/message", (req, res) => {
  const query = req.query;
  const { message } = JSON.parse(query.message as any);
  const connectionId = query.connectionId;

  if (!connectionId) {
    connections.forEach(async (con) => {
      con.ws.send(JSON.stringify(message));
    });
  }

  try {
    let connection = connections.filter(
      (s) => s.connectionId === connectionId
    )[0];
    console.log(connection);
    connection.ws.send(JSON.stringify(message));
    return res.json({ message: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
});

server.listen(3001, () => {
  console.log("> WS server alive on port 3001");
});
