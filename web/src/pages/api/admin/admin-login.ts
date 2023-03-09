import type { NextApiHandler } from "next";
import { sign } from "jsonwebtoken";

import { ADMIN_PASS, JWT_SECRET } from "../../../lib/constants";

const handler: NextApiHandler = async (req, res) => {
  const { password } = req.body as { password?: string };

  if (!password) return res.status(400).json({ message: "bye" });
  if (password !== ADMIN_PASS) return res.status(401).json({ message: "bye" });

  const code = sign({ auth: true }, JWT_SECRET);
  res.json({ code: code });
};

export default handler;
