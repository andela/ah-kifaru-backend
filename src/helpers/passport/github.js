import passport from 'passport';
import dotenv from 'dotenv';
import GitHubStrategy from 'passport-github2';
import { callback, respondCallback } from './callback';
import hostUrl from './hostUrl';

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.github_clientID,
      clientSecret: process.env.github_clientSecret,
      callbackURL: `${hostUrl}auth/github/callback`,
      scope: 'user:email'
    },
    callback,
    respondCallback
  )
);
