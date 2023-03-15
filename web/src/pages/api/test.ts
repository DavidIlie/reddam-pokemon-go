import { NextApiHandler } from "next";
import { sendWSMessage } from "../../lib/sendWSMessages";

const handler: NextApiHandler = async (req, res) => {
  const auth = req.cookies.auth;

  // await sendWSMessage(
  //   { message: "hi" },
  //   "914094e8-06b6-45ca-9aa3-55d4ef93d081"
  // );
  try {
    const r = await sendWSMessage(auth!, { message: "hi" });
    console.log(r.status);
    const response = await r.json();
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  return res.json({ message: "ok" });
};

export default handler;
