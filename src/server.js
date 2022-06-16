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
import { v4 as uuidv4 } from "uuid";
const server = express();

let port = process.env.PORT || 3000;

passport.use(googleStrategy);
/* middlewares */
server.use(express.json());

let allowdOrigins = ["http://localhost:3000", "http://localhost:3001"];

let corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  /* console.log(req.header("Origin")); */
  if (allowdOrigins.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
    console.log("allows");
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

server.use(cors(corsOptionsDelegate));
/* server.use(cors({ origin: "http://localhost:3000" })); */
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

const connectedUser = [];

io.on("connection", async(socket) => {
    let room = socket.user.id //socket.id;
  socket.user.room = room;
  await socket.user.save()
  socket.join(room);
  socket.emit("room", "hello man");


  socket.on("chat", (data) => {
    console.log(data);
    io.emit("chat", data);
  });

socket.on("sendMessage", (message, room, avatar)=>{
  console.log("listed");
  /* console.log(room); */
  socket.join(room);
socket.to(room).emit("receiveMessage",{
  message,
  from:socket.id,
  avatar
})
})

});

mongoose.connect(process.env.Dev_database, () => {
  console.log("connected to mongo");

  httpServer.listen(port, () => {
    console.log("server is running on port", port);
    console.table(listEndpoints(server));
  });
});
