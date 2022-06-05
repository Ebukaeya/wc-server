import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./endpoint/users/index.js";
import loginRouter from "./endpoint/login/login.js";
import listEndpoints from "express-list-endpoints";
import {customError} from "./errorhandlers.js";
import passport from "passport";
import googleStrategy from "./endpoint/login/googleAuth.js";

const server = express();
let port = process.env.PORT || 3000;

passport.use(googleStrategy);
/* middlewares */
server.use(express.json())
server.use(cors())
server.use(passport.initialize());

/* routes */
server.use("/users",userRouter)
server.use(loginRouter, customError)


/* error handles */

server.use(customError)


mongoose.connect(process.env.Dev_database, ()=>{

    console.log("connected to mongo")

    server.listen(port, ()=>{
        console.log("server is running on port", port)
        console.table(listEndpoints(server))
    })
})

