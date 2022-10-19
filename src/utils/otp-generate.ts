import { generate } from 'otp-generator'

export default function generateOTPNumber() {
   let otp = generate(4, {
      // upperCase: false,
      specialChars: false,
      // alphabets: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      digits: true,
   })
   return otp
}
