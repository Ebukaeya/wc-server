import { verifyToken } from "./index.js";
import { authenticateUsers } from "./index.js";
import atob from "atob";
import createError from "http-errors";

const basicAuthMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    
    
    if (authorization) {
      const [, token] = authorization.split(" ");
      /* check token validity */
      const decoded = await verifyToken(token); /* true if valid */
      if (decoded) {
        const { email, id } = decoded;
        const user = await authenticateUsers(email, id);
        req.user = user;
        next();
      }
       else {
        
        throw createError(400, "Invalid token or expired, please login again");
      }
    }
    else {
      next(createError(400, "Unauthorized, you must provide a token"));
    }
  } catch (error) {
    console.log(error);
  }
};

export default basicAuthMiddleware;
