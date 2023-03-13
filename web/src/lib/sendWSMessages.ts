export const sendWSMessage = async (message: {}, connectionId?: string) =>
  await fetch(
    `http://localhost:3001/message?connectionId=${connectionId}&message=${JSON.stringify(
      message
    )}`
  );
