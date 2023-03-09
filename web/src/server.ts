import express from "express";
import next from "next";
// import expressWs from "express-ws";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();
  // const expressWsInstance = expressWs(server).app;

  // expressWsInstance.ws("/ws", (ws, req) => {
  //   console.log("CONNECT:", req.headers);

  //   ws.on("message", (msg: String) => {
  //     ws.send(`message: ${msg}`);
  //   });
  // });

  server.all("*", (req, res) => handle(req, res));

  server.listen(3000, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
