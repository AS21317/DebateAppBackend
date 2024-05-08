import Host from "../models/HostSchema.js";
import Event from "../models/EventSchema.js";
import User from "../models/UserSchema.js";
import Topic from "../models/TopicSchema.js";
import Expert from '../models/ExpertSchema.js';
import { createEventHelper } from "./calendarController.js"
import { sendEmail } from "./nodeMailer.js";
// import Stripe from "stripe";


export const createEvent = async (req, res) => {
  console.log("Create Event Called")
  console.log("Req Body: ", req.body)

  try {
    const hostId = req.body.host;
    req.body.expert = req.body.expert === ""? null: req.body.expert
    req.body.coHost = req.body.coHost === ""? null: req.body.coHost

    const host = await Host.findById(hostId);
    if (!host) {
      return res.status(404).send({ success: false, message: "Host not found" });
    }

    const newEvent = new Event(req.body);
    await newEvent.save();

    const topic = await Topic.findByIdAndUpdate(
      newEvent.topic,
      { $push: { events: newEvent._id } },
      { new: true }
    )

    res.status(201).send({ success: true, message: "Event created successfully", data: newEvent });
    console.log("Event created successfully")
  } catch (err) {
    console.log("Error while creating event: ", err)
    res.status(500).send({ success: false, message: "Error while creating event" });
  }
}


export const approveEvent = async (req, res) => {
  const eventId = req.params.id;
  const meetLink = req.body.meetLink;

  console.log("Approve Event Called")
  console.log("Event ID: ", eventId)
  console.log("Meet Link: ", meetLink)

  try {
    let event = await Event.findById(eventId);
    if(!event){
      return res.status(404).send({ success: false, message: "Event not found" });
    }

    // const title = event.topic.name;
    // const { description, maxAttendees, startDate, startTime, endDate, endTime } = event;
    // let attendees = []
    // for(let attendee in event.attendees){
    //   attendees.push(attendee.user.email);
    // }

    // const eventDetails = { title, description, attendees, maxAttendees, startDate, startTime, endDate, endTime };

    // const updatedEventDetails = await createEventHelper(eventDetails, event.host);

    // if(!updatedEventDetails){
    //   return res.status(500).send({ success: false, message: "Error while adding event to calendar" });
    // }

    const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { status: "upcoming", meetLink },
        { new: true }
      )
      .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
        path: 'expert',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });
    
    const updatedHost = await Host.findByIdAndUpdate(event.host, { $push: { events: eventId } })

    res.status(200).send({ success: true, message: "Event approved successfully", data: updatedEvent });
    console.log("Event approved successfully")
  }catch(err){
    console.log("Error while approving the event: ", err);
    res.status(500).send({ success: false, message: "Error while approving the event" });
  }
}


export const cancelEvent = async (req, res) => {
  const eventId = req.params.id;
  const { reason } = req.body;

  console.log("Cancel Event Called")
  console.log("Event ID: ", eventId)
  console.log("Reason: ", reason)

  try {
    let event = await Event.findById(eventId);
    if(!event){
      return res.status(404).send({ success: false, message: "Event not found" });
    }

    // const isDeleted = await createEventHelper(event.calendarEventId, event.host);

    // if(!isDeleted){
    //   return res.status(500).send({ success: false, message: "Error while deleting event from calendar" });
    // }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
        { status: "cancelled", reasonIfCancelled: reason, meetLink: "" },
        { new: true }
      )
      .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
          path: 'expert',
          select: 'user expertise',
          populate: {
            path: 'user',
            select: 'name email photo'
          }
        })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });

    res.status(200).send({ success: true, message: "Event cancelled successfully", data: updatedEvent });
    console.log("Event cancelled successfully")
  }catch(err){
    console.log("Error while cancelling the event: ", err);
    res.status(500).send({ success: false, message: "Error while cancelling the event" });
  }
}


export const updateEventDetails = async (req, res) => {
  const eventId = req.params.id;

  console.log("Update Event Called")
  console.log("Event ID: ", eventId)
  console.log("Req Body: ", req.body)
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $set: req.body },
        { new: true }
      )
      .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
          path: 'expert',
          select: 'user expertise',
          populate: {
            path: 'user',
            select: 'name email photo'
          }
        })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });

    if (!updatedEvent) {
      return res.status(404).send({ success: false, message: "Event not found" });
    }

    res.status(200).send({ success: true, message: "Event updated successfully", data: updatedEvent });
    console.log("Event updated successfully")
  }catch(err){
    console.log("Error while updating event: ", err);
    res.status(500).send({ success: false, message: "Error while updating event" });
  }
}


export const deleteEvent = async (req, res) => {
  console.log("Delete Event Called")
  console.log("Event ID: ", req.params.id)
  console.log("Req Body: ", req.body);
    try{
    const eventId = req.params.id;
    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).send({ success: false, message: "Event not found" });
    }

    res.status(200).send({ success: true, message: "Event deleted successfully" });
    console.log("Event deleted successfully");
    console.log("Deleted Event: ", event);
  } catch(err){
    console.log("Error while deleting event: ", err);
    res.status(500).send({ success: false, message: "Error while deleting event" });
  }
}


export const getEvent = async (req, res) => {
  console.log("Get Event Called")
  console.log("Event ID: ", req.params.id)
  console.log("Req Body: ", req.body);

  const eventId = req.params.id;
  try{
    const event = await Event.findById(eventId)
    .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
        path: 'expert',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });

    if (!event) {
      return res.status(404).send({ success: false, message: "No Event found" });
    }

    res.status(200).send({ success: true, message: "Successsfully Fetched Event.", data: event });
    console.log("Event fetched successfully");
  }catch(err){
    console.log("Error while fetching event: ", err);
    res.status(500).send({ success: false, message: "Error while fetching event" });
  }
}


export const getEventsByHost = async (req, res) => {
  console.log("Get Event Called")
  console.log("Params: ", req.params)
  console.log("Query: ", req.query)

  const {userId} = req.params;
  const {limit} = req.query;
  try{
    const host = Host.findOne({ user: userId })
    if(!hostId){
      return res.status(404).send({ success: false, message: "Host not found" });
    }

    const events = await Event.find({ host: host._id })
    .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
        path: 'expert',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });

    if (!events) {
      return res.status(404).send({ success: false, message: "No Event found" });
    }

    events.sort((a,b) => {
      return new Date(a.startDate) - new Date(b.startDate);
    })

    if(limit) events.slice(0, limit);

    res.status(200).send({ success: true, message: "Successsfully Fetched Events.", data: events });
    console.log("Event fetched successfully");
  } catch(err){
    console.log("Error while fetching event: ", err);
    res.status(500).send({ success: false, message: "Error while fetching event" });
  }
}


export const getAllEvents = async (req, res) => {
  console.log("Get All Events Called")
  console.log("Req Body: ", req.body);

  try{
    const events = await Event.find()
    .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
        path: 'expert',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });

    res.status(200).send({ success: true, message: "Successfully fetched all events.", data: events });
    console.log("All events fetched successfully")
    console.log("Events: ", events);
  } catch(err){
    console.log("Error while fetching all events: ", err);
    res.status(500).send({ success: false, message: "Error while fetching all events" });
  }
}


export const getEventsByType = async(req, res) => {
  console.log("Get Events by Type Called")
  console.log("Req Body: ", req.body);

  const { type } = req.body;
  try{
    const events = await Event.find({ type })
    .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
        path: 'expert',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });

    if (!events) {
      return res.status(404).send({ success: false, message: "No Events found" });
    }
    
    res.status(200).send({ success: true, message: "Successsfully Fetched Events.", data: events });
    console.log("Events fetched successfully")  
    console.log("Events: ", events)
  } catch(err){
    console.log("Error while fetching events by type: ", err);
    res.status(500).send({ success: false, message: "Error while fetching events by type" });
  }
}


export const getEventsByTopic = async(req, res) => {
  console.log("Get Events by Topic Called")
  console.log("Req Body: ", req.body);

  const { topicName } = req.body;
  try{
    const events = await Event.find()
    .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
        path: 'expert',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });

    if (!events) {
      return res.status(404).send({ success: false, message: "No Events found" });
    }

    res.status(200).send({ success: true, message: "Successsfully Fetched Events.", data: events });
    console.log("Events fetched successfully")
    console.log("Events: ", events)
  }catch(err){
    console.log("Error while fetching events by topic.: ", err);
    res.status(500).send({ success: false, message: "Error while fetching events by topic." });
  }
}


export const getEventsByLanguage = async(req, res) => {
  console.log("Get Events by Language Called")
  console.log("Req Body: ", req.body);
  const { language } = req.body;
  try{
    const events = await Event.find({ language })
    .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
        path: 'expert',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });
    
    if(!events){
      return res.status(404).send({ success: false, message: "No Events found" });
    }

    res.status(200).send({ success: true, message: "Successsfully Fetched Events.", data: events });
    console.log("Events fetched successfully")
    console.log("Events: ", events)
  } catch(err){
    console.log("Error while fetching events by language: ", err);
    res.status(500).send({ success: false, message: "Error while fetching events by language." });
  }
}


export const getEventsByStatus = async(req, res) => {
  console.log("Get Events by Status Called")
  console.log("Query Params: ", req.query);

  const { status, limit, ...rest } = req.query;
  let events;

  try{
    if(status === 'today'){
      // const today = new Date();
      // const startOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
      // let endOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()+1, 0, 0, 0)); // Create a new date object as a copy of startOfDay
      // // endOfDay.setDate(endOfDay.getDate() + 1); // Add 1 day to endOfDay
      // console.log(today.())

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-based, so we add 1
      const day = today.getDate();

      // Create a string representation of the date in YYYY-MM-DD format
      const dateString = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

      events = await Event.find({
        status: "upcoming",
        startDate: dateString,
        ...rest
      })
      .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
        path: 'expert',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });
    }else{
      events = await Event.find({ status, ...rest })
        .populate({
          path: 'host',
          select: 'user expertise',
          populate: {
            path: 'user',
            select: 'name email photo'
          }
        })
        .populate({
          path: 'expert',
          select: 'user expertise',
          populate: {
            path: 'user',
            select: 'name email photo'
          }
        })
        .populate({
          path: 'topic',
          select: 'name'
        })
        .populate({
          path: 'attendees.user',
          select: 'name email photo age'
        })
    }

    if (!events) {
      return res.status(404).send({ success: false, message: "No Events found." });
    }

    events.sort((a,b) => {
      return new Date(a.startDate) - new Date(b.startDate);
    })

    if(limit) events.slice(0, limit);

    res.status(200).send({ success: true, message: "Successsfully Fetched Events.", data: events });
    console.log("Events fetched successfully")
  } catch(err){
    console.log("Error while fetching events by status: ", err);
    res.status(500).send({ success: false, message: "Error while fetching events by status." });
  }
}


export const getEventsByHostAndStatus = async(req, res) => {
  console.log("Get Events by Host and Status Called")
  console.log("Query: ", req.query);
  console.log("Params: ", req.params)

  const { userId, status } = req.params;
  const { limit } = req.query;
  let events;
  try{
    const host = await Host.findOne({ user: userId });
    if(!host){
      return res.status(404).send({ success: false, message: "Host not found." });
    }

    if(status === 'today'){
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);

      events = await Event.find({
        host: host._id,
        status,
        $or: [
          { startDate: { $gte: startOfDay, $lt: endOfDay } },
          { endDate: { $gte: startOfDay, $lt: endOfDay } }
        ]
      })
      .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
          path: 'expert',
          select: 'user expertise',
          populate: {
            path: 'user',
            select: 'name email photo'
          }
        })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });
    }
    else{
      events = await Event.find({ host: host._id, status })
      .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
          path: 'expert',
          select: 'user expertise',
          populate: {
            path: 'user',
            select: 'name email photo'
          }
        })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });
    }

    if (!events) {
      return res.status(404).send({ success: false, message: "No Events found" });
    }

    events.sort((a,b) => {
      return new Date(a.startDate) - new Date(b.startDate);
    })

    if(limit) events.slice(0, limit);

    res.status(200).send({ success: true, message: "Successsfully Fetched Events.", data: events });
    console.log("Events fetched successfully")
  }catch(err){
    console.log("Error while fetching events by host and status: ", err);
    res.status(500).send({ success: false, message: "Error while fetching events by host and status." });
  }
}


export const getEventsByExpertAndStatus = async (req, res) => {
  console.log("Get Events by Expert and Status Called")
  console.log("Query: ", req.query);
  console.log("Params: ", req.params)

  const { userId, status } = req.params;
  const { limit } = req.query;
  let events;
  try{
    const expert = await Expert.findOne({ user: userId });
    if(!expert){
      console.log("Expert not found")
      return res.status(404).send({ success: false, message: "Expert not found." });
    }

    if(status === 'today'){
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);

      events = await Event.find({
        expert: expert._id,
        status,
        $or: [
          { startDate: { $gte: startOfDay, $lt: endOfDay } },
          { endDate: { $gte: startOfDay, $lt: endOfDay } }
        ]
      })
      .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
        path: 'expert',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });
    }
    else{
      events = await Event.find({ expert: expert._id, status })
      .populate({
        path: 'host',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo age'
        }      
      })
      .populate({
        path: 'expert',
        select: 'user expertise',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .populate({
        path: 'topic',
        select: 'name photo'
      })
      .populate({
        path: 'attendees.user',
        select: 'name email photo age'
      });
    }

    if (!events) {
      return res.status(404).send({ success: false, message: "No Events found" });
    }

    events.sort((a,b) => {
      return new Date(a.startDate) - new Date(b.startDate);
    })

    if(limit) events.slice(0, limit);

    res.status(200).send({ success: true, message: "Successsfully Fetched Events.", data: events });
    console.log("Events fetched successfully")
  }catch(err){
    console.log("Error while fetching events by expert and status: ", err);
    res.status(500).send({ success: false, message: "Error while fetching events by expert and status." });
  }
}




export const registerUserForEvent = async (req, res) => {
  console.log("Register User for Event Called")
  console.log("Event ID: ", req.params.id)
  console.log("Req Body: ", req.body);

  const eventId = req.params.id;
  const { userId } = req.body;
  try {
    let event = await Event.findById(eventId);
    if(!event){
      return res.status(404).send({ success: false, message: "Event not found." });
    }

    let user = await User.findById(userId).populate({
      path: 'events',
      select: 'attendees',
    })
    if(!user) {
      return res.status(404).send({ success: false, message: "User not found." });
    }

    let isAlreadyRegistered = false;
    let approvedAttendeeCt = 0;
    for (const attendee of event.attendees) {
      if(attendee.status === "approved") approvedAttendeeCt++;
      
      if(user._id.toString() === attendee.user.toString()) {
        isAlreadyRegistered = true;
        break;
      }
    }

    if(isAlreadyRegistered){
      return res.status(400).send({ success: false, message: "User is already registered for the event." });
    }

    if(event.maxAttendees <= approvedAttendeeCt){
      return res.status(400).send({ success: false, message: "Seats Fully Booked" })
    }

    user = await User.findByIdAndUpdate(userId,
      { $push: { events: eventId } },
      { new: true }
    );

    event = await Event.findByIdAndUpdate(eventId,
      { $push: { attendees: { user: userId } } },
      { new: true }
    ).populate({
      path: 'topic',
      select: 'name photo'
    })

    await sendEmail(user.email, "SpeakIndia's Event Registration Confirmation", `
      You have successfully registered for the event: ${event.topic.name}. <br><br>
      Here are the event details:
      <p> Topic: <span style="font-weight: bold">${event.topic.name}<span> </p>
      <p> Date: <span style="font-weight: bold">${event.startDate}<span> </p>
      <p> Time: <span style="font-weight: bold">${event.startTime}<span> </p>
      <p> Meet Link: <a href="${event.meetLink}">${event.meetLink}<a> </p>
      <p> Description: <span style="font-weight: bold">${event.description}<span> </p>
      <p> 
        Please make sure to join the event on time. <br> 
        We hope you have a great experience. <br> 
        Thank you for registering with SpeakIndia. <br> <br> 

        Regards, <br> 
        SpeakIndia Team
      </p>
    `)


    res.status(200).send({ success: true, message: "User registered for event successfully.", data: { user, event } });
    console.log("User registered for event successfully.")
    }catch(err){
    console.log("Error while registering user for event: ", err);
    res.status(500).send({ success: false, message: "Error while registering user for event." });
  }
}


export const unregisterUserForEvent = async (req, res) => {
  console.log("Unregister User for Event Called")
  console.log("Event ID: ", req.params.id)
  console.log("Req Body: ", req.body);

  const eventId = req.params.id;
  const { userId } = req.body;
  try {
    let event = await Event.findById(eventId);
    if(!event){
      return res.status(404).send({ success: false, message: "Event not found." });
    }

    const user = await User.findByIdAndUpdate(userId,
      { $pull: { events: eventId } },
      { new: true }
    );
    if(!user) {
      return res.status(404).send({ success: false, message: "User not found." });
    }

    event = await Event.findByIdAndUpdate(eventId,
      { $pull: { attendees: { user: userId } } },
      { new: true }
    )

    res.status(200).send({ success: true, message: "User unregistered for event successfully.", data: { user, event } });
    console.log("User unregistered for event successfully.")
  }catch(err){
    console.log("Error while unregistering user for event: ", err);
    res.status(500).send({ success: false, message: "Error while unregistering user for event." });
  }
}


export const removeUserForEvent = async (req, res) => {
  console.log("Remove User for Event Called")
  console.log("Event ID: ", req.params.id)
  console.log("Req Body: ", req.body);

  const eventId = req.params.id;
  const { userId } = req.body;
  try {
    let event = await Event.findById(eventId);
    if(!event){
      return res.status(404).send({ success: false, message: "Event not found." });
    }

    const user = await User.findById(userId);
    if(!user) {
      return res.status(404).send({ success: false, message: "User not found." });
    }

    event = await Event.findByIdAndUpdate(eventId,
      {
        $set: {
          "attendees.$[elem].status": "removed",
          "attendees.$[elem].reasonIfRemoved": req.body.reason
        }
      },
      {
        new: true,
        arrayFilters: [{ "elem.user": userId }]
      }
    );


    res.status(200).send({ success: true, message: "User removed from event successfully.", data: event });
    console.log("User removed from event successfully.")
  }catch(err){
    console.log("Error while removing user for event: ", err);
    res.status(500).send({ success: false, message: "Error while removing user for event." });
  }
}


export const updateUserInfoForEvent = async (req, res) => {
  console.log("Update User Info for Event Called")
  console.log("Event ID: ", req.params.id)
  console.log("Req Body: ", req.body);
  const eventId = req.params.id;
  const { userId } = req.body;
  try {
    let event = await Event.findById(eventId);
    if(!event){
      return res.status(404).send({ success: false, message: "Event not found." });
    }

    const user = await User.findById(userId);
    if(!user) {
      return res.status(404).send({ success: false, message: "User not found." });
    }

    event = await Event.findByIdAndUpdate(eventId,
      {
        $set: {
          "attendees.$[elem].wasPresent": req.body.wasPresent,
          "attendees.$[elem].review": req.body.review,
          "attendees.$[elem].rating": req.body.rating
        }
      },
      {
        new: true,
        arrayFilters: [{ "elem.user": userId }]
      }
    );

    res.status(200).send({ success: true, message: "User info updated for event successfully.", data: event });
    console.log("User info updated for event successfully.")
  }catch(err){
    console.log("Error while updating user info for event: ", err);
    res.status(500).send({ success: false, message: "Error while updating user info for event." });
  }
}



// const getCheckoutSession = async (req, res) => {
//   try {
//     // get currently booked doctor

//     const doctor = await Doctor.findById(req.params.doctorId);
//     const user = await User.findById(req.userId);

//     // create a stripe instance
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//     // console.log("Pying parties are : ",doctor,user);

//     // create stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`, //after successfull payment, redirect to this URL
//       cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor.id}`,
//       customer_email: user.email,
//       client_reference_id: req.params.id,
//       line_items: [
//         {
//           price_data: {
//             currency: "INR",
//             unit_amount: doctor.ticketPrice,
//             product_data: {
//               name: doctor.name,
//               description: doctor.bio,
//               images: [doctor.photo],
//             },
//           },
//           quantity: 1,
//         },
//       ],
//     });

//     // console.log("alright 1");

//     // create new booking
//     const booking = new Booking({
//       doctor: doctor._id,
//       user: user._id,
//       ticketPrice: doctor.ticketPrice,
//       session: session.id,
//     });

//     // console.log("boking si",booking);

//     await booking.save();

//     // console.log("Sending response");

//     res.status(200).send({
//       success: true,
//       message: "successfully paid",
//       session,
//     });
//   } catch (err) {
//     res.status(500).send({
//       success: true,
//       message: { error: err.message, message: "Error while payment !!" },
//     });
//   }
// };


