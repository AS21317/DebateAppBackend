import { deleteExpert, getExpert, updateExpert } from '../controllers/expertController.js'
import { authenticate, restrict } from '../auth/verifyToken.js'

import express from 'express'
const router = express.Router()

router.get('/get', getExpert)
router.put('/update/:userId', authenticate, restrict(['expert', 'admin', 'coAdmin']), updateExpert)
router.delete('/delete/:userId', authenticate, restrict(['expert', 'admin']), deleteExpert)

export default router;