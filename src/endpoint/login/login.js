import express from "express";
import userModel from "../users/model.js";
import { generateToken } from "../../auth/index.js";
import createError from "http-errors";
import bcrypt from "bcrypt";

const loginRouter = express.Router();

loginRouter.post("/login", async (req, res, next) => {
  try {
    const { email, _, password } = req.body;
    console.log(password);
    const user = await userModel.findOne({ email });
    if (user) {
      /* check password */
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (isPasswordCorrect) {
        /* generate token */
        console.log("am here");
        const token = await generateToken(user);
        console.log(token);
        user.token = token;
        await user.save();
        res.status(200).send({
          status: 200,
          message: "Login successful",
          user,
        });
      }
    } else {
      next(createError(404, "user not found"));
    }

    const token = await generateToken(user);

    user.token = token;
    const newUser = new userModel(user);

    await newUser.save();
    res.send(newUser);
  } catch (error) {
    console.log(error);
  }
});

loginRouter.post("/signup", async (req, res, next) => {
  try {
    /* check if body exists */
    if (req.body) {
      const { name, email, password } = req.body;
      console.log(email, password);
      const userAlreadyExist = await userModel.findOne({ email });

      if (userAlreadyExist) {
        throw createError(400, "User already exist");
      } else {
        const user = {
          ...req.body,
          avatar: "https://avatars2.githubusercontent.com/u/52709818?s=460&v=4",
          createdAt: new Date().getDate().toLocaleString(),
        };
        const newUser = new userModel(user);
        newUser.save().then(res.send(newUser));
      }
    } else {
      next(createError(400, "please provide a valid body"));
    }
  } catch (error) {
    next(error);
  }
});

export default loginRouter;
