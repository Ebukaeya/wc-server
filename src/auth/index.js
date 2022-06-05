import jwt from "jsonwebtoken";
import userModel from "../endpoint/users/model.js";

export const generateToken = (user) =>
  /* mongoose obj to normal object */

  new Promise((resolve, reject) => {
    jwt.sign(user, process.env.SECRET, { expiresIn: "40min" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });

export const verifyToken = (token) => 
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        console.log(decoded);
        resolve(decoded);
      }
    });
  });


export const authenticateUsers = async (email, id) => {
  try {
    const user = await userModel.findById(id);
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
      console.log(error);
  }
};
