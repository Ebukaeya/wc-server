import GoogleStrategy from "passport-google-oauth20";
import userModel from "../users/model.js";
import { generateToken } from "../../auth/index.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },

  async (_, __, profile, done) => {
    try {
      const { id } = profile;
      const { name, picture, email } = profile._json;

      const user = await userModel.findOne({ email });

      if (user) {
        const token = await generateToken({ email: user.email, id: user._id });
        const payload = {
          googleUser: user,
          token,
        };

        done(null, payload);
      } else {
        const token = await generateToken({ email: email, id });
        const newUser = new userModel({
          name,
          email,
          avatar: picture,
          googleId: id,
        });
        const payload = {
          googleUser: newUser,
          token,
        };
        newUser.save().then(done(null, payload));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default googleStrategy;
