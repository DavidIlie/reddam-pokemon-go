import type { NextApiHandler } from "next";

import { prisma } from "../../../lib/db";
import { checkAuth } from "./check-auth";

const handler: NextApiHandler = async (req, res) => {
  const check = await checkAuth(req.cookies.auth || "");
  if (!check) return res.status(401).json({ message: "bye" });

  return res.send({
    connections: await prisma.connection.findMany(),
    gameState: (await prisma.gameState.findMany())[0],
  });
};

export default handler;
