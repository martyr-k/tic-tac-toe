const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {},
});

const players = [];
let activePlayer;

io.on("connection", (socket) => {
  // player join
  socket.on("player join", (data) => {
    // prevent more than two players from joining
    if (players.length < 2) {
      socket.player = data;
      players.push(socket.player);
      console.log(`A player, ${data} joined.`);

      const playerPos = getPlayerPos(players, socket.player);

      socket.emit("set player", playerPos);

      if (players.length === 1) {
        activePlayer = playerPos;
      }

      io.sockets.emit("set active player", activePlayer);
    }
  });

  // player move
  socket.on("play", ({ index, activePlayer }) => {
    // send play to all connected clients
    io.sockets.emit("add play", { index, activePlayer });

    // send next player to all clients
    const nextPlayer = activePlayer === 1 ? 2 : 1;
    io.sockets.emit("set active player", nextPlayer);
  });

  // start new game
  socket.on("new game", () => {
    io.sockets.emit("start new game");
    io.sockets.emit("set active player", 1);
  });

  socket.on("disconnect", () => {
    players.splice(players.indexOf(socket), 1);
    console.log("A player left.");
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001...");
});

function getPlayerPos(players, player) {
  return players.findIndex((p) => p === player) + 1;
}
