import passport from 'passport';
import dotenv from 'dotenv';
import db from '../../database/models';

const GitHubStrategy = require('passport-github').Strategy;

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.github_clientID,
      clientSecret: process.env.github_clientSecret,
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      try {
        const confirmUser = await db.User.findOrCreate({
          where: { github: profile.id },
          defaults: {
            username: profile.username,
            avatar: profile.photos[0].value,
            role: 'user'
          }
        });
        const [user, created] = confirmUser;
        const theUser = await user.get({ plain: true });
        return done(null, theUser);
      } catch (err) {
        throw new Error(err);
      }
    }
  )
);
