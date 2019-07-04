import helpers from '../helpers/helpers';

const { checkProps, validPassword } = helpers;

const usersValidations = {
  // Validate password on reset
  validateNewPassword: (req, res, next) => {
    let status = 'success';
    let messages = [];

    const { valid, invalidMessages } = checkProps(req.body, 'password');

    if (!valid) {
      return res.status(400).json({
        messages: invalidMessages
      });
    }

    if (!validPassword(req.body.password).valid) {
      status = 'fail';
      messages = messages.concat(
        validPassword(req.body.password).invalidMessages
      );
    }

    if (status === 'fail') {
      return res.status(400).json({
        messages
      });
    }
    return next();
  }
};

export default usersValidations;
