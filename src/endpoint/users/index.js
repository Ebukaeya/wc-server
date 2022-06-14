import express from "express";
import basicAuthMiddleware from "../../auth/basicAuthMiddleware.js";
import userModel from "../users/model.js";

const userRouter = express.Router();

userRouter.get("/all", basicAuthMiddleware, async (req, res, next) => {
  try {
    console.log("user router an user is authenticated");
    /*     res.send(req.user) */
    const allUsers = await userModel.find({});
    console.log(allUsers);
    allUsers ? res.send(allUsers) : res.send("no users found");
  } catch (error) {
    console.log(error);
  }
});

export default userRouter;
