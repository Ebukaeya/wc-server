import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./endpoint/users/index.js";
import loginRouter from "./endpoint/login/login.js";
import listEndpoints from "express-list-endpoints";
import { customError } from "./errorhandlers.js";
import passport from "passport";
import googleStrategy from "./endpoint/login/googleAuth.js";
/* 
GOOGLE_CLIENT_ID= 511937464922-f8dpp0vvoih9fu5egcqhhls1ffqrv8b9.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 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
*/
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
} 

 server.use(cors(corsOptionsDelegate));  
/* server.use(cors({ origin: "http://localhost:3000" })); */
server.use(passport.initialize());

/* routes */
server.use("/users", userRouter);
server.use(loginRouter, customError);

/* error handles */

server.use(customError);

mongoose.connect(process.env.Dev_database, () => {
  console.log("connected to mongo");

  server.listen(port, () => {
    console.log("server is running on port", port);
    console.table(listEndpoints(server));
  });
});
