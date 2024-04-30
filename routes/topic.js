import express from 'express'
const router = express.Router()

import { createTopic, deleteTopic, getAllTopics, getTopic, updateTopic } from '../controllers/topicController.js'
import { authenticate, restrict } from '../auth/verifyToken.js'

router.post('/create', authenticate, restrict(['admin', 'coAdmin']), createTopic)
router.delete('/delete/:id', authenticate, restrict(['admin', 'coAdmin']), deleteTopic)
router.put('/update/:id', authenticate, restrict(['admin', 'coAdmin']), updateTopic)
router.get('/get/:id', getTopic)
router.get('/getAll', getAllTopics)

export default router