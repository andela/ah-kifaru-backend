/* eslint-disable require-jsdoc */
import { config } from 'dotenv';
import models from '../database/models';
import generateToken from '../helpers/generateToken';
import mailer from '../helpers/utils/mailer';
import helpers from '../helpers/helpers';
import msg from '../helpers/utils/eMsgs';

config();
const url = process.env.BASE_URL;

const { msgForPasswordReset } = msg;

const { Users } = models;

class UserController {
  /**
   * @description This is the method that generates the password reset email
   * @param  {object} req The request object
   * @param  {object} res The response object
   * @returns {object} json response
   */
  static resetPassword(req, res) {
    const callbackUrl = req.body.callbackUrl || req.query.callbackUrl || url;
    Users.findOne({
      where: { email: req.body.email }
    })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: 'Invalid credentials supplied'
          });
        }
        // generate token
        const token = generateToken(600, {
          id: user.id,
          updatedAt: user.updatedAt
        });

        mailer
          .sender({
            to: user.email,
            subject: 'Password reset',
            message: msgForPasswordReset(user.username, callbackUrl, token)
          })
          .then(() => {
            return res.status(200).json({
              message: 'Password reset link has been sent to your email'
            });
          })
          .catch(err => {
            return res.status(400).json({
              error: err,
              message: 'Could not reach email service provider'
            });
          });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Request could not be processed. Please try again'
        });
      });
  }

  /**
   * @description This is method that resets the users password
   * @param  {object} req The request object
   * @param  {object} res The response object
   * @returns {object} json response
   */
  static reset(req, res) {
    Users.findOne({
      where: { id: req.currentUser.id }
    })
      .then(user => {
        if (!helpers.compareDate(req.currentUser.updatedAt, user.updatedAt)) {
          return res
            .status(401)
            .json({ message: 'Verification link not valid' });
        }
        Users.update(
          {
            password: req.body.password
          },
          {
            where: { id: req.currentUser.id }
          }
        )
          .then(() =>
            res.status(200).json({
              message: 'Password reset successful'
            })
          )
          .catch(() => {
            res.status(500).json({
              message: 'Request could not be completed. Please try again'
            });
          });
      })
      .catch(() => {
        res.status(500).json({
          message: 'Request could not be completed. Please try again'
        });
      });
  }
}

export default UserController;
