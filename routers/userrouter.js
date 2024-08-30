import express from 'express'
import { registerUser,loginUser, registerAdmin, getUserBalance } from '../controllers/usercontroller.js'
import {protect,isAdmin} from '../middlewares/authmiddleware.js'
import generateToken from '../utilities/generateToken.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/adminReg',registerAdmin)
router.get('/balance',protect,getUserBalance)


export default router