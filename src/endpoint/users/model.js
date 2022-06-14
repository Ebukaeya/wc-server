import pkg from "mongoose";
const { Schema, model } = pkg;
import bcrypt from "bcrypt";

const conversationSchema = new Schema({
  conversation: [
    {
      sender: { type: String },
      content: {
        text: { type: String },
        media: { type: String },
      },
      timestamp: {type:String}
    },
  ],
  chat_id: { type: String },
  chatedWith: {
    id: { type: String },
    name: { type: String },
    avatar: { type: String },
    lastMessage: { type: String },
    lastMessageTime: { type: String },
  },
});

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    room: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    conversations: [conversationSchema],
    avatar: { type: String },
    googleId: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const currentUser = this;
    const plainPassword = currentUser.password;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    currentUser.password = hashedPassword;
    console.log(currentUser);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const document = this.toObject();
  delete document.password;
  delete document.__v;
  return document;
};

const userModel = model("User", userSchema);
export default userModel;
