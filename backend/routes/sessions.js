const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const logger = require('../utils/logger');
const User = require('../models/User');


router.get("/:sessionId", async (req, res) => {
    try {

        const { sessionId } = req.params;
        const session = await Session.findById(sessionId);
        res.status(200).json({
            message: "",
            sessionData: session
        })
    } catch (e) {
        res.status(400).json({
            message: "something wrong",
            error: e
        })

    }
})


router.post("/", async (req, res) => {
    try {

        const { username } = req.body;

        const user = await User.find({
            username: username
        });
        if (!user) throw Error("user doesnt exist");

        const newSession = new Session();
        newSession.username = username;
        newSession.save();


        res.status(201).json({
            message: " successfull",
            session: newSession
        })
    } catch (e) {
        res.status(400).json({
            message: "something wrong",
            error: e.message
        })


    }
})

module.exports = router;