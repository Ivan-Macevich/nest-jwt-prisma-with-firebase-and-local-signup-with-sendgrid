import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('email', () => {
  const envVarsSchema = Joi.object({
    EMAIL_SERVICE: Joi.string().required(),
    EMAIL_USER: Joi.string().required(),
    EMAIL_PASSWORD: Joi.string().required(),
    EMAIL_CONFIRMATION_URL: Joi.string().required(),
    EMAIL_EXPIRES_AT: Joi.string().required(),
    EMAIL_SECRET: Joi.string().required(),
  }).unknown();

  const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  console.log({
    username: envVars.EMAIL_USER,
    password: envVars.EMAIL_PASSWORD,
    service: envVars.EMAIL_SERVICE,
    emailLink: envVars.EMAIL_CONFIRMATION_URL,
    expiresAt: envVars.EMAIL_EXPIRES_AT,
    secret: envVars.EMAIL_SECRET,
  });
  return {
    username: envVars.EMAIL_USER,
    password: envVars.EMAIL_PASSWORD,
    service: envVars.EMAIL_SERVICE,
    emailLink: envVars.EMAIL_CONFIRMATION_URL,
    expiresAt: envVars.EMAIL_EXPIRES_AT,
    secret: envVars.EMAIL_SECRET,
  };
});
