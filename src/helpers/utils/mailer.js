import { config } from 'dotenv';
import sgMail from '@sendgrid/mail';
import emsg from './eMsgs';

config();
const secret = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(secret);

const url = process.env.BASE_URL;
// const { msgOnRegistration } = emsg;

/**
 * Mailer Event Emitter
 * @exports
 */
const Mailer = {
  /**
   * Email Transporter
   * @method sender
   * @memberof Mailer
   * @param {string} email
   * @param {string} subject
   * @param {string} message
   * @returns {nothing} returns nothing
   */
  sender({ to, subject, message }) {
    const msg = {
      to,
      from: 'noreply@kifaru-ah',
      subject,
      html: message
    };
    return sgMail.send(msg);
  },

  /**
   * Email Sender helper function
   * @method emailHelperfunc
   * @memberof Mailer
   * @param {*} args
   * @returns {function} sender
   */
  emailHelperfunc: args => {
    const { email, subject, message } = args;
    return Mailer.sender({
      to: email,
      subject,
      message
    });
  }
};

export default Mailer;
