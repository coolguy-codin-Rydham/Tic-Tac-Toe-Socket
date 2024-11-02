import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "*",
});

const allUsers = [];

io.on("connection", (socket) => {
  // console.log("New user Joined Socket "+socket.id)
  allUsers.push({
    socket: socket,
    online: true,
  });
  socket.on("disconnect", (socket) => {
    for (let index = 0; index < allUsers.length; index++) {
      const user = allUsers[index];
      if (user.id === socket.id) {
        user.online = false;
      }
    }
  });
});

httpServer.listen(3000);
