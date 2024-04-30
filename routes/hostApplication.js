import { createHostApplication, deleteHostApplication, getAllApplications, getHostApplication, getHostApplicationsByStatus, updateHostApplication } from '../controllers/hostApplicationController.js'
import { authenticate, restrict } from '../auth/verifyToken.js'

import express from 'express'
const router = express.Router()

router.get('/getAll', authenticate, restrict(["admin", "coAdmin"]), getAllApplications)
router.post('/getByStatus', authenticate, restrict(["admin", "coAdmin"]), getHostApplicationsByStatus)

router.post('/create/:id', authenticate, restrict(["user", "host", "admin", "coAdmin"]), createHostApplication)
router.delete('/delete/:id', authenticate, restrict(["user", "host", "admin", "coAdmin"]), deleteHostApplication)
router.get('/:id', authenticate, restrict(["user", "host", "admin", "coAdmin"]), getHostApplication)
router.put('/update/:id', authenticate, restrict(["user", "host", "admin", "coAdmin"]), updateHostApplication)

export default router