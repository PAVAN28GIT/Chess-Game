import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
import BackendURL from './config.js'

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BackendURL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
 
          const password = profile.id;  
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture: profile.photos ? profile.photos[0].value : '', // Handle optional profile photo
            emailVerified: true,
            password,  // This could be changed to a more secure way of handling passwords
          });

          await user.save();
        }

        const jwtToken = user.generateAccessToken(); 

        return done(null, jwtToken , user); 
      } catch (error) {
        console.error('Error in Google OAuth authentication:', error);
        return done(error, false);
      }
    }
  )
);

// Optional: Serialize user to store in session or JWT token (if you are using sessions)
passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize by user ID or JWT token
});

// Deserialize user when needed for session-based systems
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
