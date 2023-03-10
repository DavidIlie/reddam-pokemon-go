import type { NextApiHandler } from "next";
import { verify } from "jsonwebtoken";

import { JWT_SECRET } from "../../../lib/constants";

export const checkAuth = async (token: string): Promise<boolean> => {
  if (!token || typeof token !== "string") return false;

  try {
    verify(token, JWT_SECRET);
  } catch (error) {
    return false;
  }

  return true;
};

const handler: NextApiHandler = async (req, res) => {
  const token = JSON.parse(req.body).token;

  const check = await checkAuth(token);
  if (!check) return res.status(401).json({ message: "bye" });

  return res.json({ message: "ok" });
};

export default handler;
