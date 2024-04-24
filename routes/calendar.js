import express from 'express'
const router = express.Router()
import { createEvent, listEvents } from '../controllers/calendarController.js'

router.post('/createEvent/:id', createEvent)
router.get('/listEvents/:id', listEvents)

export default router;

