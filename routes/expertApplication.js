import { approveExpertApplication, createExpertApplication, deleteExpertApplication, getExpertApplication, updateExpertApplication } from '../controllers/expertApplicationController.js'
import { authenticate, restrict } from '../auth/verifyToken.js'

import express from 'express';
const router = express.Router()

router.get('/:userId', getExpertApplication)
router.post('/create', authenticate, restrict(['expert', 'admin', 'coAdmin']), createExpertApplication)
router.put('/update/:userId', authenticate, restrict(['expert', 'admin', 'coAdmin']), updateExpertApplication)
router.delete('/delete/:userId', authenticate, restrict(['expert', 'admin']), deleteExpertApplication)
router.put('/approve/:userId', authenticate, restrict(['admin']), approveExpertApplication)

export default router;
