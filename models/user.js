import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
//import generateToken from '../utilities/generateToken.js'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      default: 10000
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
  //   Token:{
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:'generateToken',
  //     default: generateToken(_id),
  // },
    transactions:[
      {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Transaction',
    },
  ],
  },
  
  {
    timestamps: true
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User