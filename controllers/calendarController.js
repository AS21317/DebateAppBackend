import { google } from 'googleapis';
import authorize from '../auth/meet.js';


export const createEvent = async (req, res) => {
    try{
        const id = req.params.id;
        const { title, description, attendees, startDateTimeString, endDateTimeString } = req.body;
        const eventDetails = { title, description, attendees, startDateTimeString, endDateTimeString };

        const eventLink = await createEventHelper(eventDetails, id);
        res.status(200).send({ message: "Event created successfully.", eventLink });
    }catch(err){
        console.log("Error creating event: ", err);
        res.status(500).send({ message: "Error creating event." });
    }
}


export const listEvents = async (req, res) => {
    try{
        const id = req.params.id;
        const events = await listEventsHelper(id);
        res.status(200).send({ message: "Events fetched successfully.", events });
    }catch(err){
        console.log("Error fetching events: ", err);
        res.status(500).send({ message: "Error fetching events." });
    }
}


/**
    Helper function to list the next 10 events on the primary calendar of the authenticated user.

    @param {string} id

    @return {Array<Object>}
*/

const listEventsHelper = async (id) => {
    const auth = await authorize(id);
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
    });

    const events = res.data.items;
    if (!events || events.length === 0) {
        console.log("No upcoming events found.");
        return;
    }

    console.log("Upcoming 10 events:");
    events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
    });

    return events;
}


/**
    Helper function to create a new event on the primary calendar of the authenticated user.

    @param {Object} eventDetails: {
        title: string,
        description: string,
        attendees: [
            { email: string },
            { email: string },
        ],
        startDateTimeString: string,
        endDateTimeString: string
    }
    @param {string} id

    @return {string}
    
    Example: 
    startDateTimeString = '2024-04-23 08:00:00 -04:00' // America/New_York timeZone
    endDateTimeString = '2024-04-23 09:00:00 -04:00' // America/New_York timeZone

    both time will be adjusted with the Asia/Kolkata timezone
*/

export const createEventHelper = async (eventDetails, id) => {
    const { title, description, attendees, startDateTimeString, endDateTimeString } = eventDetails;

    let event = {
        summary: title,
        location: "Google Meet",
        description,
        start: {
            dateTime: new Date(startDateTimeString).toISOString(),
            timeZone: "Asia/Kolkata",
        },
        end: {
            dateTime: new Date(endDateTimeString).toISOString(),
            timeZone: "Asia/Kolkata",
        },
        attendees,
        reminders: {
            useDefault: false,
            overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
            ],
        },
        conferenceData: {
            createRequest: {
                requestId: "7qxalsvy0e",
            },
        },
    };

    try {
        const auth = await authorize(id);
        const calendar = google.calendar({ version: "v3", auth });
        const res = await calendar.events.insert({
            auth: auth,
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: "all",
        });

        console.log("Event created: %s", res.data.htmlLink);

        return res.data.htmlLink;
    } catch (err) {
        console.log("Error creating event:", err);
    }
}
