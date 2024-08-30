import User from '../models/user.js'
import generateToken from '../utilities/generateToken.js'
import nodemailer from 'nodemailer'
import sendEmail from '../utilities/sendemail.js'
import Transaction from '../models/transactionmodel.js'

const registerUser = async (req, res) => {
  const { name, email, password, balance } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' })
  }
  console.log(req.body)
  try {
    const userExists = await User.findOne({ email })
    if (userExists)
      return res.status(400).json({ message: 'User already exists' })

    const user = await User.create({ name, email, password, balance })

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Email Verification',
      text: `Welcome you have successfully created an account`,
    }

    await transporter.sendMail(mailOptions)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: error.message })
  }
}

const registerAdmin = async (req, res) => {
  const { name, email, password, balance, isAdmin } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    balance,
    isAdmin: isAdmin || false,
  })

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Email Verification',
    text: `Welcome you have successfully created an account `,
  }

  await transporter.sendMail(mailOptions)

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide all the required field' })
  }
  try {
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        balance: user.balance,
        token: generateToken(user._id),
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

const getUserBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ balance: user.balance })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export {
  registerUser,
  loginUser,
  registerAdmin,
  getUserBalance,
}