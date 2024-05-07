import { approveExpertApplication, createExpertApplication, deleteExpertApplication, getExpertApplication, updateExpertApplication } from '../controllers/expertApplicationController.js'
import { authenticate, restrict } from '../auth/verifyToken.js'

import express from 'express';
const router = express.Router()

router.get('/get', getExpertApplication)
router.post('/create', authenticate, createExpertApplication)
router.put('/update/:userId', authenticate, restrict(['expert', 'admin', 'coAdmin']), updateExpertApplication)
router.delete('/delete/:userId', authenticate, restrict(['expert', 'admin']), deleteExpertApplication)
router.put('/approve/:id', authenticate, restrict(['admin', 'coAdmin']), approveExpertApplication)

export default router;
