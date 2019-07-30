import { config } from 'dotenv';
import sgMail from '@sendgrid/mail';

config();
const secret = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(secret);

const templates = {
  password_reset: 'd-3fa45363fe634b418146f72cbe03942b',
  confirm_account: 'd-84376bbc49e24647ab77848bcb926eb5',
  new_notification: 'd-2a54c072315e4b45a215c74344f0cb4d'
};

const mailer = data => {
  const { name, receiver, subject, templateName, buttonUrl } = data;
  const msg = {
    to: receiver,
    from: 'noreply@kifaru-ah.com',
    subject,
    templateId: templates[templateName],
    dynamic_template_data: {
      name,
      subject,
      button_url: buttonUrl
    }
  };

  sgMail.send(msg);
};

export default mailer;
