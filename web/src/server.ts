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

const app = async () => {
  let prevMarkers = [] as Room[];

  console.log("checking for game sate");
  let gameState = (await prisma.gameState.findMany())[0];
  console.log(gameState);
  if (!gameState) {
    console.log("creating game state");
    gameState = await prisma.gameState.create({ data: {} });
    console.log(gameState);
  }

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

      const sendWSMessage = (s: {}) =>
        ws.send(JSON.stringify({ action, res: s }));

      const gameData = (markersFiltered: any) => ({
        ...connection!,
        status: gameState.status,
        endTime: gameState.endTime,
        markers: markersFiltered,
      });

      if (
        gameState.status === "STARTED" &&
        new Date().getTime() > gameState.endTime!.getTime()
      ) {
        connection = await prisma.connection.update({
          where: { id: connection!.id },
          data: { rooms: [] },
        });
        gameState = await prisma.gameState.update({
          where: { id: gameState.id },
          data: { status: "FINISHED" },
        });
        return ws.send(
          JSON.stringify({ action: "getGameData", res: gameData([]) })
        );
      }

      let { action } = JSON.parse(msg);

      switch (action) {
        case "getGameData":
          connection = await prisma.connection.findFirst({
            where: { id: connection!.id },
          });
          gameState = (await prisma.gameState.findMany())[0];
          const connectionRooms = connection!.rooms;
          let markersFiltered = markers.filter((s) =>
            connectionRooms.includes(s.roomName)
          );
          sendWSMessage(gameData(markersFiltered));
          connection = await prisma.connection.update({
            where: { id: connection!.id },
            data: { firstConnection: false },
          });
          break;
        case "reportFound":
          let { room } = JSON.parse(msg);
          if (connection?.foundRooms.includes(room)) {
            ws.send(
              JSON.stringify({
                action: "getGameData",
                res: gameData(
                  markers.filter((s) => connection!.rooms.includes(s.roomName))
                ),
              })
            );
            break;
          }
          if (connection?.rooms.includes(room)) {
            await Promise.all(
              connections.map(async (c) => {
                if (c.connectionId !== connection?.connectionId) {
                  const bigC = await prisma.connection.findFirst({
                    where: { connectionId: c.connectionId },
                  });
                  c.ws.send(
                    JSON.stringify({
                      action: "someoneGotPoint",
                      res: `Team ${bigC!.name} has scored a point!`,
                    })
                  );
                }
              })
            );
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
                markers.filter((s) =>
                  connection!.foundRooms.includes(s.roomName)
                )
              );
              connection = await prisma.connection.update({
                where: { id: connection!.id },
                data: { rooms: rooms.map((s) => s.roomName) },
              });
            }
            ws.send(
              JSON.stringify({
                action: "getGameData",
                res: gameData(
                  markers.filter((s) => connection!.rooms.includes(s.roomName))
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

    const message = JSON.parse(query.message as any);
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

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log("> WS server alive on port 3001 i hope");
  });
};

app();
