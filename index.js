require('dotenv').config();

const slack_helper = require('./slack/slack_helper');
const db = require('./db');
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

// Creates express app
const app = express();
// The port used for Express server
const PORT = 3000;
// Starts server
app.listen(process.env.PORT || PORT, function() {
    console.log('Bot is listening on port ' + PORT);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post('/', (req, res) => {
    console.log("/");
});

app.post('/log-work', async (req, res) => {
    let is_arg = req.body.text == "" ? false : true;

    if(is_arg) {
        const arg = req.body.text;

        try {
            // Check if user is in db, if not add them to user table
            let user_exists = await db.checkUserExists(req.body.user_id);
            
            if(!user_exists) {
                await db.addNewUser(req.body.user_id, req.body.user_name);
            }

            let ret = await db.logWork(req.body.user_id, arg);
            console.log(ret);
            
            let msg = slack_helper.createMessage(req.body.user_id, "TESTING");
            
            request.post('https://slack.com/api/chat.postEphemeral', msg, function (error, response, body) {
                res.json();
            });
        } catch (err) {
            console.warn(err);
            res.status(422).send('Error in /log-work route.');
        }
    } else {
        res.send("You need to specify what work you did!");
    }
});

app.post('/daily-standup', async (req, res) => {

    try {
        // get all users
        let user_rows = await db.getAllUsers();

        for (user of user_rows) {
            // console.log(`ID: ${user.user_id}, NAME: ${user.username}`);
            let user_work_rows = await db.getUserWorkYesterday(user.user_id)
            console.log(user_work_rows)
        }
        
        let msg = slack_helper.createMessage(req.body.user_id, "TESTING");
        
        request.post('https://slack.com/api/chat.postEphemeral', msg, function (error, response, body) {
            res.json();
        });
    } catch (err) {
        console.warn(err);
        res.status(422).send('Error in /daily-standup route.');
    }
});