import { user } from '../entity/user'
import { Request, Response, NextFunction } from 'express'
import {
   IUserRegisterReqBody,
   IUserUpdateReqBody,
   IUserVerifyOtpReqBody,
} from '../types/IUser'
import {
   VUserRegisterReqBody,
   VUserVerifyOtpReqBody,
} from '../validation/VUser'

import { otpConfig } from '../utils/constants'
import generateOTPNumber from '../utils/otp-generate'
import { createNewOTP, verifyOTP } from '../utils/otp-without-db'
import { userSignToken } from '../middleware/auth'
import { sendSMS } from '../utils/sendSMS'

// Controller Layer
export default class userController {
   // get many users data controller function
   public async getManyUser(_req: Request, res: Response, _next: NextFunction) {
      const userData: user[] = await user.find({})
      //   const myUser: any = req.user.id

      if (userData) {
         return res.status(200).json(userData)
      } else {
         return res.status(200).json(false)
      }
   }

   // get one user data controller function
   public async getOneUser(req: Request, res: Response, _next: NextFunction) {
      const ID = req.params.id
      const userData: user | undefined = await user.findOne({
         where: { id: parseInt(ID) },
      })
      if (userData) {
         return res.status(200).json(userData)
      } else {
         return res.status(200).json(null)
      }
   }

   // register new user data controller function
   public async registerUser(req: Request, res: Response, _next: NextFunction) {
      const data: IUserRegisterReqBody = req.body
      if (!data)
         return res.status(200).json({
            sucess: false,
            message: 'Enter User Data!',
         })
      const { error }: any = VUserRegisterReqBody.validate(data)
      if (error)
         return res.status(200).json({
            sucess: false,
            message: error.details[0].message,
         }) // error.details[0].message

      let existedUser = await user.findOne({
         where: { phone: data.phone },
         select: ['phone'],
      })
      if (existedUser)
         return res.status(200).json({
            success: false,
            message: 'User Already Registered!',
         })

      await user.create(data).save()

      return res.status(200).json({
         success: true,
         message: 'User Registered Successfully!',
      })
   }

   // Sign OTP controller function
   public async signOTP(req: Request, res: Response, next: NextFunction) {
      const generatedOTP: string = generateOTPNumber()
      if (!req.body.phone)
         return res.status(200).json({
            sucess: false,
            message: 'Please Enter a Valid Phone Number!',
         })

      // Check If User Phone Number Existed In Database
      let existedUser = await user.findOne({
         where: { phone: req.body.phone },
         select: ['phone'],
      })
      if (!existedUser) {
         return res.status(200).json({
            success: false,
            message: 'Phone Number Is Not Registered!',
         })
      } else {
         // Generate Hashed Otp
         let hashedOTP = createNewOTP(
            req.body.phone,
            generatedOTP,
            otpConfig.otpSecret,
            otpConfig.optExpire,
            otpConfig.optAlgorithem
         )
         // Send Otp SMS Code Goes Here
         await sendSMS(generatedOTP, existedUser.phone)
         console.log(generatedOTP)
         return res.status(200).json({
            success: true,
            message: 'SMS Message Sent Successfully!',
            otp: hashedOTP,
         })
      }
   }

   // Verify OTP controller function
   public async verifyOTP(req: Request, res: Response, next: NextFunction) {
      const data: IUserVerifyOtpReqBody = req.body
      const { error }: any = VUserVerifyOtpReqBody.validate(data)
      if (error)
         return res.status(200).json({
            success: false,
            message: error.details[0].message,
         }) // error.details[0].message

      let existedUser = await user.findOne({
         where: { phone: data.phone },
      })
      if (!existedUser) {
         return res.status(200).json({
            success: false,
            message: 'Phone Number Is Not Registered!',
         })
      } else {
         let verifiedOTP = verifyOTP(
            data.phone,
            data.otp,
            data.hashedOTP,
            otpConfig.otpSecret,
            otpConfig.optAlgorithem
         )
         if (verifiedOTP == true) {
            // Sign JWT token for user
            const accessToken = await userSignToken(
               JSON.stringify(existedUser.id),
               JSON.stringify(existedUser.name),
               JSON.stringify(existedUser.phone)
            )
            res.cookie('access-token', accessToken, {
               httpOnly: true,
            })
            return res.status(200).json({
               success: true,
               message: 'Phone Number Is Verified!',
               token: accessToken,
            })
         } else {
            return res.status(200).json({
               success: false,
               message: 'OTP Is Not Valid!',
            })
         }
      }
   }
}
