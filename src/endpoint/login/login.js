import express from "express";
import userModel from "../users/model.js";
import { generateToken } from "../../auth/index.js";
import createError from "http-errors";
import bcrypt from "bcrypt";
import passport from "passport";

const loginRouter = express.Router();
/* http://localhost:3001/login/googlredirect */

loginRouter.post("/login", async (req, res, next) => {
  try {
    const { email, _, password } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      /* check password */
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
      ); /* true or false */

      if (isPasswordCorrect) {
        /* generate token */
        const token = await generateToken({ email: user.email, id: user._id });
console.log(token);
        /* will be redirected to dashboard */
        res.status(200).send({
          status: 200,
          message: "Login successful with token " + token,
          user,
        });
      } else {
        next(createError(400, "Password incorrect"));
      }
    } else {
      next(createError(404, "user not found"));
    }
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
        };
        const newUser = new userModel(user);
        /* redirect to login */
        newUser.save().then(res.send(newUser));
      }
    } else {
      next(createError(400, "please provide a valid body"));
    }
  } catch (error) {
    next(error);
  }
});

loginRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

loginRouter.get(
  "/login/googlredirect",
  passport.authenticate("google", { session: false }),
  async (req, res, next) => {
    const token = req.user;
    try {
        console.log(process.env.FRONT_END_URL);
      res.redirect(`${process.env.FRONT_END_URL}/dashboard?token=${token}`);
    } catch (error) {
      console.log(error);
    }
  }
);

export default loginRouter;
