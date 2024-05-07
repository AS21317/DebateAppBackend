import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import  mongoose  from "mongoose"
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';

import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import hostRoute from './routes/host.js'
import eventRoute from './routes/event.js'
import adminRoute from './routes/admin.js'
import contactMessageRoute from './routes/ContactMessage.js'
import hostApplicationRoute from './routes/hostApplication.js'
import topicRoute from './routes/topic.js'
import expertApplicationRoute from './routes/expertApplication.js'
import expertRoute from './routes/expert.js'

// import { createEventHelper, cancelEventHelper } from "./controllers/calendarController.js"

dotenv.config()

const app = express();
const port = process.env.PORT || 8000
const ip = process.env.IP_ADDRESS || ''

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    preflightContinue: false,
    credentials: true
}

// Writing required middlewares  
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

// Define a catch-all route that serves index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/', async (req,res) => {
    res.status(200).send("Api is working ")
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

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/host', hostRoute)
app.use('/api/v1/events', eventRoute)
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/contactMessage', contactMessageRoute)
app.use('/api/v1/hostApplication', hostApplicationRoute)
app.use('/api/v1/topic', topicRoute)
app.use('/api/v1/expertApplication', expertApplicationRoute)
app.use('/api/v1/expert', expertRoute)

// app.use('/api/v1/review',reviewRoute)
// app.use('/api/v1/calendar',calendarRoute)

const test = async () => {
    try{
        // const eventDetails = {
        //     title: "Test Event",
        //     description: "This is a test event",
        //     startDateTimeString: "2025-06-01 00:00:00",
        //     endDateTimeString: "2025-06-01 23:59:59",
        //     attendees: [{ email: "ashish3553singh@gmail.com" }],
        // }

        // const res = await createEventHelper(eventDetails, '662b93948ff87724f3ceadd3');
        
        // const res = await cancelEventHelper('q1lri664etvvt7gckfqeh1tqtg', '662b93948ff87724f3ceadd3')
        // console.log(res)
    }catch(err){
        console.log("Error while testing: ", err);
    }
}

const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
    app.listen(port, ip, () => {
        connectDB();
        test();
        console.log(`Server is running on http://${ip}:${port}/`);
    });
} else {
    await connectDB();
}

export default app;