import { IUserRegisterReqBody, IUserVerifyOtpReqBody } from '../types/IUser'

import * as Joi from 'joi'

export const VUserRegisterReqBody: Joi.ObjectSchema<IUserRegisterReqBody> =
   Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      gender: Joi.string().required().valid('male', 'female'),
   })

export const VUserVerifyOtpReqBody: Joi.ObjectSchema<IUserVerifyOtpReqBody> =
   Joi.object({
      phone: Joi.string().required(),
      otp: Joi.string().required(),
      hashedOTP: Joi.string().required(),
   })
