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
    const { email, password } = req.body;
    console.log(email, password);
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
    console.log(req.body);
    if (req.body.email && req.body.password && req.body.name) {
      const { name, email, password } = req.body;
      console.log(email, password);
      const userAlreadyExist = await userModel.findOne({ email });

      if (userAlreadyExist) {
        throw createError(400, "User already exist");
      } else {
        const user = {
          ...req.body,
          avatar: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAI4AjgMBIgACEQEDEQH/xAAbAAEAAwADAQAAAAAAAAAAAAAABQYHAQMEAv/EADwQAAIBAwECCQgKAgMAAAAAAAABAgMEBREGIRIWMUFRU4GTsQcTImFxkaHBFCMyM0NicpLC0ULiFSRS/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDcQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADrrVqVCm6lapCnBcspy0SK3tTtZTxUpWlko1bz/Jv7NL29L9Rnd9fXWQr+eva061TmcnyexcwGpVdqsHSlwZZCm3+VSl4I7bXaPD3UlGjkKPCfIpNx19+hkACtzjJSSaeqe9M5Mew+dv8RNO1rN0+ejPfB9nN2GmbP522zds6lH0K0PvaMnvi/mvWESoAAAAAAAAAAAAAQu1eY/4fFyq02vpFR8CivX09hNGbeUW6dXM07bX0KFJbvzS3v4aAVWUpTlKU25Sk9W3ytnAAUAAA9eKyNfF31K7t36UHvjrukudM8gA22yuqV7a0rmg9adWClF+pneVPycXUq2IrW8vwKvo/pktfHUtgQAAAAAAAAAAAynbmLW011rzqDX7UasZ95SbFwu7a/inwakPNS9q3r4P4AUwABQAAAABe/JjF8DIS/x1gvEvJW9gbF2mBjVmtJ3MnV39HIvgte0sgQAAAAAAAAAAA8OZxtHK4+raVtymvRlzxkuRntbSWr3Jc7KhnttqFrKVDFxjcVVy1Zfdr2dIFEv7K4x93UtbqHAqw9zXSvUeY0enXxG2VkqVZeZvYLdHVcOD/L/6iVjKbIZWxlJ0qX0qkuSVHe+2PL7tQK+Dsq0K1J6VaNSEuiUWjst7K7uZKNvbVqsnzQg2FecmdmMHVzV8lKLjaUmnWqfxXrZKYbYe7uJRqZSSt6PK6cXrN/JEpltprHA0YY7B0qVSdN+lpvhHp1a5ZBFxhCMIRhBKMYrRJcyPogdn9qLLMaUvuLrTfSm/tfpfP4k8AAAAAAAAAOJNRi22klvbfMclK8oGcdGCxVtPSdRa12uaPNHt8PaBF7W7Uzv5zsrCbjZxek5p76v+viVQAD6hKUJqcJOMlvUovRrtLFjttMrZxUK0oXcFyKqtJfuXzK2Aq+U/KDRkl57GzT/LVTXxSPiv5QfR0tsbv6alXd7kijAImcrtNlMmpQq3Hm6MvwqS4K7XyshgArmMpQkpQk4yT1TT0aZoux+1Dv8Ag2OQkldJfV1H+Kv78TOT6hOVOpGpTk4zi9YyT0afSBuQIbZXMLM4yNSb/wCxT0hWj6+n2MmQgAAAAA6bu4p2ttVuKz0hSg5y9iMXvbqre3dW6rv6yrJyl/XyNI8oN19H2flTT0dxUjT7PtPwMxAAAKAAAAAAAAAACe2LyTx+cpRk9KNz9VU/i/f4s1YwxNxakno09U0bVjblXmPtrlfi0oz96CPSAAAAAgNscJXzVjShaziqtGbkoz3KW7Tl5im8Sc31NDvkaiAMu4lZvqqHfIcSs31VDvkaiAMu4lZvqqHfIcSs31VDvkaiAMu4lZvqqHfIcSs31VDvkaiAMu4k5vqqPfIcSc31NHvUaiAMu4k5vqaPeocSc31NHvUaiAMvjsTm3JJ06CXS6vIaJh7J47GW1m5+cdGmouWnKz2AAAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k=",
        };
        const newUser = new userModel(user);
        /* redirect to login */
        /*   newUser.save().then( res.status(200).send(newUser)); */
       const savedUser = await newUser.save();
       const token = await generateToken({ email: savedUser.email, id: savedUser._id });
        res.status(200).send({
          status: 200,
          message: "User created with token " + token,
          token,
          user: savedUser,
        });

      }
    } else {
      console.log("no body");
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
    const payload = req.user;
    const {_, token} = payload;
    try {
      console.log(process.env.FRONT_END_URL);
      res.redirect(`${process.env.FRONT_END_URL}/chatpage?token=${token}`);
    } catch (error) {
      console.log(error);
    }
  }
);

export default loginRouter;
