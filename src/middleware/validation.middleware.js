import Joi from 'joi';
import Schemas from './validation.schema';

export default () => {
  // Joi validation options
  const validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  };

  // return the validation middleware
  return (req, res, next) => {
    const route = req.route.path;

    if (route in Schemas) {
      // get schema for the current route
      const schema = Schemas[route];
      const toValidate = {};

      if (!schema) {
        return next();
      }

      ['params', 'body', 'query'].forEach(key => {
        if (schema[key]) {
          toValidate[key] = req[key];
        }
      });

      return Joi.validate(
        toValidate,
        schema,
        validationOptions,
        (err, data) => {
          if (err) {
            // Custom Error
            const SimplifiedError = {
              status: 400,
              error: err.details
                ? err.details[0].message.replace(/['"]/g, '')
                : err.message
            };
            // Send back the JSON error response
            res.status(400).json(SimplifiedError);
          } else {
            // Replace req.body with the data after Joi validation
            req = data;
            return next();
          }
        }
      );
    }
    return next();
  };
};
