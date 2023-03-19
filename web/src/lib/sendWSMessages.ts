export const sendWSMessage = async (
  auth: string,
  message: {},
  connectionId?: string
) => {
  const url = "http://localhost:3001";
  // const url = "https://reddam-pokemon-go-production.up.railway.app";
  await fetch(
    `${url}/message?connectionId=${connectionId}&message=${JSON.stringify(
      message
    )}&auth=${auth}`,
    { credentials: "include" }
  );
};
