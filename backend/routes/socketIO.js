const socket = require("../bin/www").getSocket();

socket.removeAllListeners();

socket.on("connection", (socket) => {
  socket.on("NewMessage", (msg) => {
    socket.broadcast.emit("MessageUpdate", msg);
  });

  // socket.on("AddServer", (task) => {
  //   socket.broadcast.emit("AddClient", task);
  // });

  // socket.on("RemoveServer", (task) => {
  //   socket.broadcast.emit("RemoveClient", task);
  // });

  // socket.on("UpdateServer", (task) => {
  //   socket.broadcast.emit("UpdateClient", task);
  // });
});
