import express from 'express';
import passport from 'passport';
import '../../helpers/passport/google';
import '../../helpers/passport/facebook';

const router = express.Router();

// Navigate to auth/google to get to the google page

router.get('/login', (req, res) => {
  return res.status(200).json({
    message: 'You are now logged in'
  });
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  })
);

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.status(200).json({
    status: 200,
    data: req.user
  });
});

router.get(
  '/github',
  // passport.authenticate('github')
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback', passport.authenticate('github'), (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'User created successfully'
  });
});

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.status(200).json({
      message: 'successful facebook login'
    });
    // res.redirect('/');
  }
);

export default router;
