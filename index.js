import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routers/userrouter.js'
import transactionRoutes from './routers/transactionrouter.js'

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/transfer', transactionRoutes)

const PORT = process.env.PORT  
app.listen(PORT, () => console.log(`Server running ${PORT}`))