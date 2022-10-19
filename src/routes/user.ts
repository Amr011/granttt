import express, { Router } from 'express'
const router: Router = express.Router()

import userController from '../controller/user'
import { validateToken } from '../middleware/auth'

const user: userController = new userController()

// Get Current User GET Method
// router.route('/me').get()
// Get Many User GET Method
router.route('/').get(validateToken, user.getManyUser)
// Get One User GET Method
router.route('/:id').get(validateToken, user.getOneUser)
// Update Current User PUT Method
// router.route('/:id').put(user.updateOneUser)
// DELETE Current User DELETE Method
// router.route('/').delete(user.deleteOneUser)
// Change User Password POST Method
// router.route('/password')
// Forget User Password POST Method
// router.route('/password')

// Register User POST Method
router.route('/register').post(user.registerUser)
// Login User POST Method
router.route('/sign-otp').post(user.signOTP)
// logout User POST Method
router.route('/verify-otp').post(user.verifyOTP)
// Verify User GET Method
// router.route('/verify/:token').post()
// Refresh User Token GET Method
// router.route('/refresh').get()

export default router
