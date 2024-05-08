import Topic from "../models/TopicSchema.js";


export const createTopic = async (req, res) => {
    console.log("Create Topic Called: ", req.body)

    const { name, photo } = req.body;
    try {
        const topic = Topic.findOne({ name });
        if(!topic) {
            return res.status(400).send({ status: false, message: "Topic already exists." });
        }

        const newTopic = new Topic({ name, photo });
        const savedTopic = await newTopic.save();

        res.status(200).send({ status: true, message: "Topic created successfully", data: savedTopic });
        console.log("Topic Created Successfully !!")
    } catch (err) {
        console.log("Error while creating topic: ", err);
        res.status(500).send({ status: false, message: "Error while creating topic." });
    }
}


export const updateTopic = async (req, res) => {
    console.log("Update Topic Called: ", req.body)

    const topicId = req.params.id;
    console.log("topicId: ", topicId)
    0.2
    try {
        const updatedTopic = await Topic.findByIdAndUpdate(
            topicId,
            { $set: req.body },
            { new: true }
        );

        if (!updatedTopic) {
            return res.status(404).send({ success: false, message: "Topic Not Found." });
        }

        res.status(200).send({ success: true, message: "Successfully Updated Topic Details.", data: updatedTopic });
    }catch(err){
        console.log("Error while updating topic: ", err);
        res.status(500).send({ success: false, message: "Error while updating topic." });
    }
}


export const deleteTopic = async (req, res) => {
    const topicId = req.params.id;
    console.log("Delete Topic Called")
    console.log("Req: ", req.body)
    console.log("Params: ", req.params)
    try {
        const topic = await Topic.findByIdAndDelete(topicId);

        if (!topic) {
            return res.status(404).send({ success: false, message: "Topic Not Found." });
        }

        res.status(200).send({ success: true, message: "Successfully deleted topic." });
        console.log("Topic Deleted Successfully!")

    } catch (err) {
        console.log("Error while deleting topic: ", err);
        res.status(500).send({ success: false, message: "Error while deleting topic." });
    }
}


export const getTopic = async (req, res) => {
    const topicId = req.params.id;

    console.log("Get Topic Called")
    console.log("topicId: ", topicId)
    console.log("Req: ", req.body)
    console.log("Params: ", req.params)


    try {
        const topic = await Topic.findById(topicId);

        if(!topic){
            return res.status(404).send({ success: false, message: "Topic Not Found." });
        }

        res.status(200).send({ success: true, message: "Topic fetched successfully.", data: topic });
        console.log("Topic Fetched Successfully !!")

    }catch(err){
        console.log("Error while getting topic: ", err);
        res.status(500).send({ success: false, message: "Error while getting topic." });
    }
}


export const getAllTopics = async (req, res) => {
    const { limit } = req.query;
    console.log("Get All Topics Called")
    console.log("Req: ", req.body)
    console.log("Query: ", req.query)
    
    try {
        let topics = await Topic.find();

        if(!topics){
            return res.status(404).send({ success: false, message: "No Topics Found." });
        }

        topics.sort((a, b) => {
            const eventsLengthComparison = b.events.length - a.events.length;
            if (eventsLengthComparison === 0) {
              return b.totalParticipants - a.totalParticipants;
            }
            return eventsLengthComparison;
        });

        if(limit) topics = topics.slice(0, limit);

        res.status(200).send({ success: true, message: "All Topics fetched successfully.", data: topics });
    } catch (err) {
        console.log("Error while fetching all topics: ", err);
        res.status(500).send({ success: false, message: "Error while fetching all topics." });
    }
}
