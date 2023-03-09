import express from "express";
import next from "next";
import http from "http";
import WebSocket from "ws";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (socket) => {
    console.log("WebSocket connection established");

    socket.on("message", (message) => {
      console.log(`Received message: ${message}`);

      // Broadcast the message to all connected clients
      //   wss.clients.forEach((client) => {
      //     if (client.readyState === WebSocket.OPEN) {
      //       client.send(message);
      //     }
      //   });
    });
  });

  app.all("*", (req, res) => handle(req, res));

  app.listen(3000, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
