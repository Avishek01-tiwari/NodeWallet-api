import User from '../models/user.js'
import generateToken from '../utilities/generateToken.js'
import nodemailer from 'nodemailer'
import sendEmail from '../utilities/sendemail.js'
import Transaction from '../models/transactionmodel.js'

const transferBalance = async (req, res) => {
    const { recipientEmail, amount } = req.body
  
    try {
      const sender = await User.findById(req.user._id)
      const recipient = await User.findOne({ email: recipientEmail })
  
      if (!recipient) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (sender.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' })
      }
  
      sender.balance -= amount
      recipient.balance += Number(amount)
  
      await sender.save()
      await recipient.save()
  
      await sendEmail({
        to: sender.email,
        subject: 'Transfer Successful',
        text: `You have successfully transferred ${amount} to ${recipientEmail}.`,
      })
  
      await sendEmail({
        to: recipient.email,
        subject: 'Funds Received',
        text: `You have received ${amount} from ${sender.email}.`,
      })
  
      const transaction = await Transaction.create({
        sender: sender._id,
        recipient: recipient._id,
        amount,
        status: 'success',
      })
      sender.transactions.push(transaction._id)
      recipient.transactions.push(transaction._id)
      await sender.save()
      await recipient.save()
  
      res.status(200).json({ message: 'Transfer successful'  })
    } catch (error) {
      await sendEmail({
        to: sender.email,
        subject: 'Transfer Failed',
        text: `Transfer of ${amount} to ${recipientEmail} failed. Error: ${error.message}`,
      })
      const transaction = await Transaction.create({
        sender: req.user._id,
        recipient: null,
        amount,
        status: 'failure',
      })
      sender.transactions.push(transaction._id)
      await sender.save()
      res.status(500).json({ message: error.message })
    }
  }
  
  const getTransactionDetails = async (req, res) => {
    try {
      let transactions
  
      if (req.user.isAdmin) {
        transactions = await Transaction.find().populate(
          'sender recipient',
          'name email',
        )
      } else {
        transactions = await Transaction.find({
          $or: [{ sender: req.user._id }, { recipient: req.user._id }],
        }).populate('sender recipient', 'name email')
      }
  
      res.status(200).json(transactions)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  
  const getUserTransactions = async (req, res) => {
    try {
      let transactions
  
      if (req.user.isAdmin) {
        transactions = await Transaction.find({}).populate('sender recipient', 'name email')
      } else {
        const user = await User.findById(req.user._id).populate({
          path: 'transactions',
          populate: {
            path: 'sender recipient',
            select: 'name email',
          }
        })
  
        if (!user) {
          return res.status(404).json({ message: 'User not found' })
        }
  
        transactions = user.transactions
      }
  
      if (transactions) {
        res.json(transactions)
      } else {
        res.status(404).json({ message: 'Transactions not found' })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  export {
    transferBalance,
    getTransactionDetails,
    getUserTransactions,
  }