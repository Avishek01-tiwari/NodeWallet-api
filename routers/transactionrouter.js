import express from 'express'
import { transferBalance,getTransactionDetails,getUserTransactions } from '../controllers/transcation.js'
import {protect,isAdmin} from '../middlewares/authmiddleware.js'
import generateToken from '../utilities/generateToken.js'

const router = express.Router()


router.post('/transfer',protect,transferBalance)
router.get('/transactions', protect,isAdmin,getTransactionDetails)

router.get('/getUserTranasaction', protect, getUserTransactions)


export default router