const port = require("../app").port;
const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const config = require("config");
const activeUsers = new Map();

function setupSocket(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    let username = "";
    socket.emit("chat-msg", {
      msg: "Connected to the chat room.",
      username: "Server",
    });
    socket.on("send-chat-msg", (msg) => {
      socket.emit("chat-msg", {
        msg: msg,
        username: `${username} (me)`,
        self: true,
      });
      socket.broadcast.emit("chat-msg", { msg: msg, username: username });
    });
    socket.on("disconnect", () => {
      if (username) {
        activeUsers.delete(username);
        const userList = [];
        activeUsers.forEach((key, val) => userList.push(val));
        io.emit("chat-msg", {
          msg: "left the chat room.",
          username: username,
          newUsersList: userList,
        });
      }
    });

    socket.on("new-user", () => {
      const cookies = cookie.parse(socket.request.headers.cookie || "");
      if (cookies.token) {
        const token = cookies.token;
        try {
          const decoded = jwt.verify(token, config.get("jwtSecretKey"));
          username = decoded.user.username;
          if (activeUsers.has(username)) {
            const previousSocket = activeUsers.get(username);
            if (previousSocket !== socket) {
              previousSocket.disconnect(true);
            }
          }
          activeUsers.set(username, socket);
          console.log(`${username} joined the chat room.`);
          const userList = [];
          activeUsers.forEach((key, val) => userList.push(val));
          io.emit("chat-msg", {
            msg: "joined the chat room.",
            username: username,
            newUsersList: userList,
          });
        } catch (err) {
          console.log(err);
          socket.disconnect(true);
        }
      }
    });
  });
}

module.exports = setupSocket;
