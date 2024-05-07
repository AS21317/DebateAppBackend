import express from 'express'
import { registerExpert, registerUser, loginUser, registerHost, registerAdmin, registerCoAdmin } from '../controllers/authController.js'
import { authenticate, restrict } from '../auth/verifyToken.js';
const router = express.Router()

router.post('/registerUser', registerUser)
router.post('/login', loginUser)
router.post('/registerHost/:id', authenticate, restrict(["admin", 'coAdmin']), registerHost)
router.post('/registerAdmin/:id', authenticate, restrict(["admin", 'coAdmin']), registerAdmin)
router.post('/registerCoAdmin/:id', authenticate, restrict(["admin", 'coAdmin']), registerCoAdmin)
router.post('/registerExpert/:id', authenticate, restrict(['admin', 'coAdmin']), registerExpert)

export default router