const Joi = require("joi");

module.exports = {
  singupValidation: schema => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      } else {
        if (!req.value) {
          req.value = {};
        }
        if (!req.value["body"]) {
          req.value["body"] = {};
        }
        req.value["body"] = result.value;
        next();
      }
    };
  },
  singInValidation: schema => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      } else {
        if (!req.value) {
          req.value = {};
        }
        if (!req.value["body"]) {
          req.value["body"] = {};
        }
        req.value["body"] = result.value;
        next();
      }
    };
  },
  schemas: {
    userSignUpSchema: Joi.object().keys({
      firstName: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    }),
    userSignInSchema: Joi.object().keys({    
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    })
  }
};
