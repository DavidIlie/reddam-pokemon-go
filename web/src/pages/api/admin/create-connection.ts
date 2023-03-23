import type { NextApiHandler } from "next";

import { prisma } from "../../../lib/db";
import { checkAuth } from "./check-auth";

const handler: NextApiHandler = async (req, res) => {
  const check = await checkAuth(req.cookies.auth || "");
  if (!check) return res.status(401).json({ message: "bye" });

  let { name } = JSON.parse(req.body);

  if (!name) return res.status(400).json({ message: "bye" });

  const connection = await prisma.connection.create({
    data: { name: name },
  });

  return res.json({ code: connection.connectionId });
};

export default handler;
