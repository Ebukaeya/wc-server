import { verifyToken } from "./index.js";
import { authenticateUsers } from "./index.js";
import createError from "http-errors";

const verifySocket = async (socket, next) => {
  try {
    if (socket.handshake.auth) {
      const { token } = socket.handshake.auth;

      const decoded = await verifyToken(token);

      if (decoded) {
        const { email, id } = decoded;

        const user = await authenticateUsers(email, id);

        socket.user = user;
        next();
      }
    } else {
      next(createError(400, "Unauthorized, you must provide a token"));
    }
  } catch (error) {
    console.log(error);
  }
};

export default verifySocket;
