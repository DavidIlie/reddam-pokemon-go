export const sendWSMessage = async (
  auth: string,
  message: {},
  connectionId?: string
) =>
  await fetch(
    `http://localhost:3001/message?connectionId=${connectionId}&message=${JSON.stringify(
      message
    )}&auth=${auth}`,
    { credentials: "include" }
  );
