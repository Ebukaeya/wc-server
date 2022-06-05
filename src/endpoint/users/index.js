import express from "express";
import basicAuthMiddleware from "../../auth/basicAuthMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", basicAuthMiddleware,(req,res,next)=>{
try {
    console.log("user router");
    res.send(req.user)
} catch (error) {
    console.log(error);
}
  
})



export default userRouter;