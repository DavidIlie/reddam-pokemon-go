import { NextApiHandler } from "next";
import { sendWSMessage } from "../../lib/sendWSMessages";

const handler: NextApiHandler = async (_req, res) => {
  await sendWSMessage(
    { message: "hi" },
    "914094e8-06b6-45ca-9aa3-55d4ef93d081"
  );
  return res.json({ message: "ok" });
};

export default handler;
