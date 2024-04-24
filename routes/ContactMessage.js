import { authenticate, restrict } from '../auth/verifyToken.js';
import { createMessage, getAllMessage } from '../controllers/ContactMessageController.js';
import express from 'express'
const router = express.Router()  //mergeparams will make available doctorid of parent route 

// we need to handle route like : doctor/doctorId/reviews  ===> for this we need to create nested routes 

router.post('/createMessage',createMessage);
router.get('/',authenticate,restrict(['patient']),getAllMessage)

export default router