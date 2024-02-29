import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv"
dotenv.config()


  passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5007/api/auth/google/callback",
     
    },
    function(accessToken,refeshToken, profile,cb) {
      
      // console.log(profile)
     return  cb(null, {...profile,test:"test"});
    }
  ));

  passport.serializeUser(function(user, done) {
   
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    console.log("deserializeUser");
    done(null, obj);
  });