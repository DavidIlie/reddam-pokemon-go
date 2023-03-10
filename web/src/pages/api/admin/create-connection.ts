import type { NextApiHandler } from "next";

import { prisma } from "../../../lib/db";
import { checkAuth } from "./check-auth";

const handler: NextApiHandler = async (req, res) => {
  const check = await checkAuth(req.cookies.auth || "");
  if (!check) return res.status(401).json({ message: "bye" });

  let { name, players } = JSON.parse(req.body);

  if (!name && !players) return res.status(400).json({ message: "bye" });

  try {
    players = players.split(", ");
  } catch (error) {
    return res.status(400).json({ message: "bye" });
  }

  const connection = await prisma.connection.create({
    data: { name: name, players: players },
  });

  return res.json({ code: connection.connectionId });
};

export default handler;
