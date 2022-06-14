import pkg from "mongoose";
const { Schema, model } = pkg;





const conversationSchema = new Schema({
    chat_id: {type:String,required:true},
    members: {type:Array,required:true},
    conversation: {type:Array,required:true},
})


const Conversation = model("Conversation",conversationSchema);

export default Conversation;