import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./endpoint/users/index.js";
import loginRouter from "./endpoint/login/login.js";
import listEndpoints from "express-list-endpoints";
import { customError } from "./errorhandlers.js";
import passport from "passport";
import googleStrategy from "./endpoint/login/googleAuth.js";
import conversationRouter from "./endpoint/chat/index.js";
import { createServer } from "http";
import { Server } from "socket.io";
import verifySocket from "./auth/sockeMiddleware.js";
import { onlineUserModel } from "./endpoint/users/model.js";
const server = express();

let port = process.env.PORT || 3000;

passport.use(googleStrategy);
/* middlewares */
server.use(express.json());

let allowdOrigins = ["http://localhost:3000", "http://localhost:3001"];

let corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  if (allowdOrigins.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
    console.log("allows");
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

server.use(cors(corsOptionsDelegate));

server.use(passport.initialize());

/* routes */
server.use("/users", userRouter);
server.use(loginRouter, customError);
server.use("/chat", conversationRouter);

/* error handles */

server.use(customError);

const httpServer = createServer(server);
const io = new Server(httpServer);
io.use(verifySocket);

server.get("/onlineUsers", async (req, res, next) => {
  try {
    let onlineUsers = await onlineUserModel.find({});
    res.send(onlineUsers);
  } catch (error) {}
});

io.on("connection", async (socket) => {
  let room = socket.user.id; //socket.id;
  console.log(socket.user);
  delete socket.user.__v;
  socket.user.room = room;
  let user1 = await socket.user.save();

  socket.join(room);

  const doc = user1.toObject();
  delete doc.__v;
  delete doc.password;
  try {
    let user = await new onlineUserModel(doc);
    console.log(user);
    await user.save();
    socket.emit("newConnection");
    socket.broadcast.emit("newConnection");
  } catch (error) {
    console.log(error);
  }

  socket.on("disconnect", async () => {
    await onlineUserModel.findByIdAndDelete(socket.user.id);
    socket.broadcast.emit("newConnection");
  });

  socket.on("sendMessage", (message, room, chat_id) => {
    console.log(message);
    socket.join(room);
    message.chat_id = chat_id;
    socket.to(room).emit("receiveMessage", message);
  });
});

mongoose.connect(process.env.Dev_database, () => {
  console.log("connected to mongo");

  httpServer.listen(port, () => {
    console.log("server is running on port", port);
    console.table(listEndpoints(server));
  });
});
