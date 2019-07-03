import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
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
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: process.env.google_clientID,
      clientSecret: process.env.google_clientSecret
    },
    async (accessToken, refreshToken, payload, done) => {
      const { displayName, emails, photos } = payload;
      const email = emails[0].value;
      try {
        const confirmUser = await db.User.findOrCreate({
          where: { email },
          defaults: {
            username: displayName,
            avatar: photos[0].value,
            role: 'user'
          }
        });
        const [user, created] = confirmUser;
        const theUser = await user.get({ plain: true });
        done(null, theUser);
      } catch (err) {
        throw new Error(err);
      }
    }
  )
);
