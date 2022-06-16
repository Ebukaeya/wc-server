import express from "express";
import basicAuthMiddleware from "../../auth/basicAuthMiddleware.js";
import Conversation from "./model.js";
import userModel from "../users/model.js";

const conversationRouter = express.Router();

conversationRouter.get("/:userid/chats", async (req, res, next) => {
  try {
    const { userid } = req.params;
    const user = await userModel.findById(userid);
    if (user) {
      const conversation = user.conversations;
      res.send(conversation);
      /*     !conversation === -1
        ? res.send(conversation)
        : res.status(404).send("no conversation found"); */
    } else {
      res.send("no user found");
    }
  } catch (error) {
    console.log(error);
  }
});

conversationRouter.post("/:profileOwnerId/chats/", async (req, res, next) => {
  try {
    const conversation = req.body;
    const {profileOwnerId} = req.params;
    const user = await userModel.findById(profileOwnerId);
    if (user && conversation) {
      
      user.conversations.push(conversation);
      await user.save();
      res.send(user);
    } else {
      res.status(404).send("no user or receiver not found to add conversation");
    }
  } catch (error) {
    console.log(error);
  }
});

conversationRouter.put("/:userid/chats/:chatid", async(req, res, next) => {
  try {
      console.log("entered");
      const { userid, chatid } = req.params;    
      const conversationArray = req.body;
      const user = await userModel.findById(userid);
        if (user) {
            /* const currentConversations = user.conversations.filter((conversation,i) => conversation.chat_id === chatid).push(); */
       //     user.conversations.forEach((conversation,i) => {
           //     if (conversation.chat_id === chatid) {
           //         user.conversations[i]=req.body;
           //     }
          //  });
          user.conversations=conversationArray;
         
            await user.save();
         res.status(200).send("conversation updated");
        }else{
            res.status(404).send("no user found to add conversation");
        }
  } catch (error) {
      console.log(error);
  }
});













/* not usefull routes to be deleted while refactoring */
conversationRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const conversation = await Conversation.findById(id);
    conversation ? res.send(conversation) : res.send("no conversation found");
  } catch (error) {
    console.log(error);
  }
});

conversationRouter
  .route("/")

  .get(async (req, res, next) => {
    try {
      const conversations = await Conversation.find();
      res.send(conversations);

      if (!conversations.length === -1) {
        res.send(conversations);
      } else {
        res.status(404).send("no conversations found");
      }
    } catch (error) {
      console.log(error);
    }
  })

  .post(async (req, res, next) => {
    try {
      console.log(req.body);
      const { chat_id, members, conversations } = req.body;
      if (chat_id && members && conversations) {
        const newConversation = new Conversation(req.body);

        await newConversation.save();
        res.send(newConversation);
      } else {
        res.send("missing fields");
      }
    } catch (error) {
      console.log(error);
    }
  });

/* conversationRouter.get("/", /* basicAuthMiddleware, */

export default conversationRouter;
