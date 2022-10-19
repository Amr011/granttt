export interface IUserRegisterReqBody {
   name: string
   phone: string
   gender: string
}

export interface IUserUpdateReqBody {
   name: string
   phone: string
   gender: string
}

export interface IUserVerifyOtpReqBody {
   phone: string
   otp: string
   hashedOTP: string
}
