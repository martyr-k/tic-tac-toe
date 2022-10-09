const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {},
});

const connections = [];

io.on("connection", (socket) => {
  console.log("A user connected");
  connections.push(socket);
  console.log(connections.length);

  socket.on("disconnect", () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log("A user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001...");
});
