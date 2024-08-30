import mongoose from "mongoose"
import dotenv from "dotenv"
// for testing purpose, required detail => mongoURL = mongodb://127.0.0.1:27017/walletapidb
// using mongo campass
dotenv.config()
const connectDB = async()=>{
    try {
        const connect = await mongoose.connect(process.env.mongoURL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log(`mongoDB connected :${connect.connection.host}`)
    } catch (error) {
        console.error(`Error:${error.message}`)
        process.exit(1)
    }
}

export default connectDB