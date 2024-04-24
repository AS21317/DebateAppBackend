import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import  mongoose  from "mongoose"
import dotenv from 'dotenv'

import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import doctorRouter from './routes/doctor.js'
import reviewRoute from './routes/review.js'
import contactRoute from './routes/ContactMessage.js'

import bookingRoute from './routes/Booking.js'

dotenv.config()

const corsOptions ={
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    preflightContinue: false,
}
const app = express();
const port = process.env.PORT||8000

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());



app.get('/',(req,res)=>{
    res.send("Api is working ")
})


// database connection
// mongoose.set('strictQuery', false)
const connectDB = async()=>{
try {
await mongoose.connect(process.env.MONGODB_URL, {


})
console.log( 'MongoDB database is connected') 

} catch (err) {
console. log('MongoDB database is connection failed')

}

 }




// Writing required middlewares  


app.use('/api/v1/auth',authRoute)
app.use('/api/v1/user',userRoute)
app.use('/api/v1/doctor',doctorRouter)
app.use('/api/v1/review',reviewRoute)
app.use('/api/v1/bookings',bookingRoute)
app.use('/api/v1/contact',contactRoute)




app.listen(port,()=>{
    connectDB()
    console.log(`Server is running  on port ${port}`); 
})