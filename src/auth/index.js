import jwt from "jsonwebtoken";

export const generateToken = (user) =>
/* mongoose obj to normal object */

  new Promise((resolve, reject) => {
    const convertedUser = user.toObject();
    jwt.sign(convertedUser, process.env.SECRET, { expiresIn: "1min" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        console.log(token);
        resolve(token);
      }
    });
  });
