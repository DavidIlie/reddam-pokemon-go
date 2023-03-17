import { NextApiHandler } from "next";

import { checkAuth } from "./check-auth";
import { GameState } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { sendWSMessage } from "../../../lib/sendWSMessages";
import { getNonAdjacentRooms, markers, Room } from "../../../lib/markers";

let prevMarkers = [] as Room[];

const handler: NextApiHandler = async (req, res) => {
  const check = await checkAuth(req.cookies.auth || "");
  if (!check) return res.status(401).json({ message: "bye" });

  const gameState = JSON.parse(req.body) as GameState;

  const db = (await prisma.gameState.findMany())[0];

  await prisma.gameState.update({ where: { id: db.id }, data: gameState });

  if (gameState.status === "NOT_STARTED") {
    const connections = await prisma.connection.findMany();
    await Promise.all(
      connections.map(async (connection) => {
        const rooms = getNonAdjacentRooms(markers, prevMarkers);
        await prisma.connection.update({
          where: { id: connection.id },
          data: {
            firstConnection: true,
            rooms: rooms.map((s) => s.roomName),
            foundRooms: [],
          },
        });
      })
    );
  }

  await sendWSMessage(req.cookies.auth!, {
    action: "askForGameData",
  });

  return res.json({ message: "ok" });
};

export default handler;
