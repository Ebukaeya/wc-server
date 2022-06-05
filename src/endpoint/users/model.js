import pkg from "mongoose";
const { Schema, model } = pkg;
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String },
  avatar: { type: String },
  token: { type: String },
});

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
  delete document.password 
  delete document.__v;
  return document;
};

const userModel = model("User", userSchema);
export default userModel;
