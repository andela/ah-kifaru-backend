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
    const method = req.method.toLowerCase();

    const toValidate = {};

    const schemaToUse = Schemas.find(
      schema => schema.route === route && schema.method === method
    );

    if (!schemaToUse) {
      return next();
    }

    const { schema } = schemaToUse;

    ['params', 'body', 'query', 'headers'].forEach(key => {
      if (schema[key]) {
        toValidate[key] = req[key];
      }
    });
    return Joi.validate(toValidate, schema, validationOptions, (err, data) => {
      if (err) {
        // Custom Error
        const SimplifiedError = {
          message: err.details
            ? err.details[0].message.replace(/['"]/g, '')
            : err.message
        };
        // Send back the JSON error response
        res.status(400).json(SimplifiedError);
      } else {
        // Replace request params, headers, query, body with the data params, headers, query, body after Joi validation
        req.params = data.params;
        req.query = data.query;
        req.body = data.body;
        return next();
      }
    });
  };
};
