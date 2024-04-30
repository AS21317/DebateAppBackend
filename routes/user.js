import express from 'express'
const router = express.Router()

import { deleteUser, getAllUsers, getEventsByUser, getUser, updateUser, getCancelledEventsByUser, getCompletedEventsByUser, getMissedEventsByUser,getUpcomingEventsByUser } from '../controllers/userController.js'
import { authenticate, restrict } from '../auth/verifyToken.js'

router.get('/getAll', authenticate, restrict(['admin', 'coAdmin']), getAllUsers)

router.delete('/delete/:id', authenticate, deleteUser)
router.put('/update/:id', authenticate, updateUser)
router.get('/getEvents/:id', authenticate, getEventsByUser)
router.get('/:id', getUser)

router.get('/getCancelledEvents/:id', authenticate, getCancelledEventsByUser)
router.get('/getCompletedEvents/:id', authenticate, getCompletedEventsByUser)
router.get('/getMissedEvents/:id', authenticate, getMissedEventsByUser)
router.get('/getUpcomingEvents/:id', authenticate, getUpcomingEventsByUser)



export default router; 