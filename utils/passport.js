import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { LOGIN_TYPES} from "./constants.js";
import { createUser, findUser } from "../models/user.model.js";

try {
  passport.serializeUser((user, next) => {
    next(null, user._id);
  });

  passport.deserializeUser(async (id, next) => {
    try {
      const user = await findUser({ _id: id });
      if (user) next(null, user); // return user of exist
      else console.log("Error"); // throw an error if user does not exist
    } catch (error) {
      console.log("Error while deserializing user", error);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_, __, profile, next) => {
        // Check if the user with email already exist
        const user = await findUser({ email: profile._json.email });
        if (user) {
          // if user exists, check if user has registered with the GOOGLE SSO
          if (user.loginType !== LOGIN_TYPES.GOOGLE) {
            // If user is registered with some other method, we will ask him/her to use the same method as registered.
            // TODO: We can redirect user to appropriate frontend urls which will show users what went wrong instead of sending response from the backend
          console.log("please login with same method you previous login");
          } else {
            // If user is registered with the same login method we will send the saved user
            next(null, user);
          }
        } else {
          // If user with email does not exists, means the user is coming for the first time
          const createdUser = await createUser(profile);
          if (createdUser) {
            next(null, createdUser);
          } else {
           console.log("Error while creating user");
          }
        }
      }
    )
  );
    }catch(error){
        console.log(error);
    }