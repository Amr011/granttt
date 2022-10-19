import express, { Router } from 'express'
const router: Router = express.Router()

import userRouter from './user'

router.use('/user', userRouter)

export default router
