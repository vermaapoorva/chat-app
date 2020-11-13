const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

// Setting up the express app and creating the server for socket.io
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection.");
  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "A new user has joined!");

  // Recieving an event with the client's message
  // Sending the message to all other clients
  socket.on("sendMessage", (message, callback) => {
    io.emit("message", message);
    callback();
  });

  // Recieving an event with the client's location
  // Sending the location to all other clients
  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "locationMessage",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    callback();
  });

  // Revieving an event when a client disconnects
  // Sending the message to all other clients
  socket.on("disconnect", () => {
    io.emit("message", "A user has left.");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
