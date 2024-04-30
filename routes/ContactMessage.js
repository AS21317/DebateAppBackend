import { authenticate, restrict } from '../auth/verifyToken.js';
import { createMessage, getAllMessage } from '../controllers/contactMessageController.js';
import express from 'express'
const router = express.Router()  //mergeparams will make available hostId of parent route 

// we need to handle route like : host/hostId/reviews  ===> for this we need to create nested routes 

router.post('/createMessage', createMessage);
router.get('/', authenticate, restrict(['user', 'admin']), getAllMessage)

export default router