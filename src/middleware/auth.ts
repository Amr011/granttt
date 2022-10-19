import { NextFunction, Request, Response } from 'express'
import { sign, verify } from 'jsonwebtoken'

import dotenv from 'dotenv'
import { jwtAccessToken } from '../utils/constants'
dotenv.config()

export const userSignToken = async (
   id: string,
   name: string,
   phone: string
) => {
   const accessToken = sign({ user: { id, name, phone } }, jwtAccessToken)
   console.log(accessToken)

   return accessToken
}

export const validateToken = (
   req: Request | any,
   res: Response,
   next: NextFunction
) => {
   const accessToken = req.cookies['access-token']

   if (!accessToken) {
      return res.status(400).json({
         success: false,
         message: 'User Is Not Logged In!',
      })
   }

   try {
      const validToken = verify(accessToken, jwtAccessToken)
      req.user = validToken

      if (validToken) {
         req.authenticated = true
         return next()
      }
   } catch (err) {
      return res.status(400).json({ error: err })
   }
}
