import type { NextApiHandler } from "next";
import { verify } from "jsonwebtoken";

import { JWT_SECRET } from "../../../lib/constants";

const handler: NextApiHandler = async (req, res) => {
  const token = JSON.parse(req.body).token;

  if (!token || typeof token !== "string")
    return res.status(401).json({ message: "bye" });

  let signed;
  try {
    let signed = verify(token, JWT_SECRET);
    signed;
  } catch (error) {
    return res.status(401).json({ message: "bye" });
  }

  return res.json(signed || { message: "ok" });
};

export default handler;
