import express from 'express'
import { registerUser, loginUser, registerHost, registerAdmin, registerCoAdmin } from '../controllers/authController.js'
import { authenticate, restrict } from '../auth/verifyToken.js';
const router = express.Router()

router.post('/registerUser', registerUser)
router.post('/login', loginUser)
router.post('/registerHost/:id', authenticate, restrict(["admin"]), registerHost)
router.post('/registerAdmin/:id', authenticate, restrict(["admin"]), registerAdmin)
router.post('/registerCoAdmin/:id', authenticate, restrict(["admin"]), registerCoAdmin)

export default router