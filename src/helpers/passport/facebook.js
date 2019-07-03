import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import dotenv from 'dotenv';
import db from '../../database/models';

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findById(id).then(user => done(null, user));
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.fbk_id,
      clientSecret: process.env.fbk_secret,
      callbackURL: 'https://localhost:3000/auth/facebook/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const user = 'yes';
      done(null, user);
    }
  )
);
