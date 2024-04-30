import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";
import { approveEvent, createEvent, deleteEvent, getAllEvents, getEvent, getEventsByLanguage, getEventsByStatus, getEventsByTopic, getEventsByType, updateEventDetails, cancelEvent, registerUserForEvent, removeUserForEvent, unregisterUserForEvent, updateUserInfoForEvent, getEventsByHost, getEventsByHostAndStatus } from "../controllers/eventController.js";

const router = express.Router();

router.post("/create/:hostId", authenticate, restrict(["admin", "coAdmin"]), createEvent);
router.delete("/delete/:id", authenticate, restrict(["admin", "coAdmin"]), deleteEvent);
router.put("/update/:id", authenticate, restrict(["admin", "coAdmin", "host"]), updateEventDetails);

router.get("/getAll", getAllEvents);
router.get("/get/:id", getEvent);
router.get("/getByHost", getEventsByHost);
router.post("/getByTopic", getEventsByTopic);
router.post("/getByStatus", getEventsByStatus);
router.post("/getByType", getEventsByType);
router.post("/getByLanguage", getEventsByLanguage);
router.post("/getByHostAndStatus", getEventsByHostAndStatus);

router.put("/approve/:id", authenticate, restrict(["host"]), approveEvent);
router.put("/cancel/:id", authenticate, restrict(["host", "admin", "coAdmin"]), cancelEvent);

router.put("/registerUser/:id", authenticate, registerUserForEvent);
router.put("/unregisterUser/:id", authenticate, unregisterUserForEvent);
router.put("/removeUser/:id", authenticate, restrict(["host", "admin", "coAdmin"]), removeUserForEvent);
router.put("/updateUserInfo/:id", authenticate, restrict(["host"]), updateUserInfoForEvent);

// router.post('/checkout-session/:hostId', authenticate, getCheckoutSession)

export default router