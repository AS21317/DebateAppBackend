import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import  mongoose  from "mongoose"
import dotenv from 'dotenv'

import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import doctorRouter from './routes/doctor.js'
import reviewRoute from './routes/review.js'
import bookingRoute from './routes/Booking.js'
import calendarRoute from './routes/calendar.js';

import { createEventHelper } from "./controllers/calendarController.js"

dotenv.config()

const app = express();
const port = process.env.PORT||8000

const corsOptions ={
    origin: '*',
    credentials: true,
}

app.get('/',(req,res)=>{
    res.send("Api is working ")
})


// database connection
// mongoose.set('strictQuery', false)
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log( 'MongoDB database is connected') 
    } catch (err) {
        console. log('MongoDB database is connection failed', err)
    }
}


// Writing required middlewares  

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/user',userRoute)
app.use('/api/v1/doctor',doctorRouter)
app.use('/api/v1/review',reviewRoute)
app.use('/api/v1/bookings',bookingRoute)
app.use('/api/v1/calendar',calendarRoute)

// const test = async () => {
//     try{
//         const eventDetails = {
//             title: "Test Event",
//             description: "This is a test event",
//             startDateTimeString: "2024-04-24 08:00:00",
//             endDateTimeString: "2024-04-24 09:00:00",
//             attendees: [{ email: "kavyagupta2719@gmail.com" }],
//         }

//         const eventLink = await createEventHelper(eventDetails, '662661e7d59e298def5a345c');
//     }catch(err){
//         console.log("Error creating event: ", err);
//     }
// }

app.listen(port,()=>{
    connectDB();
    // test();
    console.log(`Server is running  on port ${port}`); 
})