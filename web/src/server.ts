import express from "express";
import expressWs from "express-ws";

import { prisma } from "./lib/db";
import { getNonAdjacentRooms, markers, Room } from "./lib/markers";
import { checkAuth } from "./pages/api/admin/check-auth";

const server = express();
const expressWsInstance = expressWs(server).app;

export let connections = [] as {
  ws: WebSocket;
  connectionId: string;
}[];

let prevMarkers = [] as Room[];

expressWsInstance.ws("/ws", async (ws, req) => {
  const { auth } = req.query as { auth: string };
  if (!auth) return ws.close();

  let connection = await prisma.connection.findFirst({
    where: { connectionId: auth },
  });
  if (!connection) return ws.close();

  console.log(`CONNECTION: ${connection.name}`);
  connections.push({ ws: ws as any, connectionId: connection.connectionId! });

  if (connection.firstConnection) {
    const rooms = getNonAdjacentRooms(markers, prevMarkers);
    connection = await prisma.connection.update({
      where: { id: connection!.id },
      data: { rooms: rooms.map((s) => s.roomName) },
    });
  }

  ws.on("message", async (msg: string) => {
    console.log(msg);

    let { action } = JSON.parse(msg);

    const sendWSMessage = (s: {}) =>
      ws.send(JSON.stringify({ action, res: s }));

    switch (action) {
      case "getGameData":
        sendWSMessage(connection!);
        connection = await prisma.connection.update({
          where: { id: connection!.id },
          data: { firstConnection: false },
        });
        break;
      case "getMarkers":
        const connectionRooms = connection!.rooms;
        let markersFiltered = markers.filter((s) =>
          connectionRooms.includes(s.roomName)
        );
        sendWSMessage(markersFiltered);
        break;
      case "reportFound":
        let { room } = JSON.parse(msg);
        if (connection?.foundRooms.includes(room)) {
          ws.send(JSON.stringify({ action: "getGameData", res: connection! }));
          return ws.send(
            JSON.stringify({
              action: "getMarkers",
              res: markers.filter((s) =>
                connection!.rooms.includes(s.roomName)
              ),
            })
          );
        }
        if (connection?.rooms.includes(room)) {
          // TODO: announce other players that someone has found a room
          connection = await prisma.connection.update({
            where: { id: connection.id },
            data: {
              rooms: connection.rooms.filter((s) => s !== room),
              foundRooms: [...connection.foundRooms, room],
            },
          });
          if (connection.rooms.length < 4) {
            const rooms = getNonAdjacentRooms(
              markers,
              markers.filter((s) => connection!.foundRooms.includes(s.roomName))
            );
            connection = await prisma.connection.update({
              where: { id: connection!.id },
              data: { rooms: rooms.map((s) => s.roomName) },
            });
          }
          ws.send(JSON.stringify({ action: "getGameData", res: connection! }));
          return ws.send(
            JSON.stringify({
              action: "getMarkers",
              res: markers.filter((s) =>
                connection!.rooms.includes(s.roomName)
              ),
            })
          );
        }
        break;
      default:
        break;
    }
  });

  ws.on("close", () => {
    connections.filter((s) => s.connectionId !== connection!.id);
  });
});

server.get("/message", async (req, res) => {
  const query = req.query;
  const auth = query.auth;

  const check = await checkAuth((auth as string) || "");
  if (!check) return res.status(401).json({ message: "bye" });

  const { message } = JSON.parse(query.message as any);
  const connectionId = query.connectionId;

  if (connectionId === "undefined") {
    connections.forEach(async (con) => {
      con.ws.send(JSON.stringify(message));
    });
    return res.json({ message: "ok" });
  }

  try {
    let con = connections.filter((s) => s.connectionId === connectionId)[0];
    con.ws.send(JSON.stringify(message));
    return res.json({ message: "ok" });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

server.listen(3001, () => {
  console.log("> WS server alive on port 3001");
});
