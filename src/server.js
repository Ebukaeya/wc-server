import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./endpoint/users/index.js";
import loginRouter from "./endpoint/login/login.js";
import listEndpoints from "express-list-endpoints";
import {customError} from "./errorhandlers.js";

const server = express();

/* middlewares */

server.use(express.json())
server.use(cors())

/* routes */
server.use(userRouter)
server.use(loginRouter, customError)


/* error handles */
let port = process.env.PORT || 3000;

mongoose.connect(process.env.Dev_database, ()=>{

    console.log("connected to mongo")

    server.listen(port, ()=>{
        console.log("server is running on port", port)
        console.table(listEndpoints(server))
    })
})

