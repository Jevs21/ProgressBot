require('dotenv').config();

const api = require('./api/stack_overflow_api');
const slack_helper = require('./slack/slack_helper');
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

app.post('/get-top', async (req, res) => {
    let is_arg = req.body.text == "" ? false : true;

    if(is_arg) {
        const arg = req.body.text;

        try {
            let output_str = "";
            let result_arr = JSON.parse(await api.getTopResult(arg));
            let result = result_arr.items[0];

            let bot_resp = {
                'title': '',
                'content': '',
                'answer': '',
                'is_accepted_ans': false,
                'question_score': 0,
                'answer_score': 0,
                'href': '',
                'error': false,
                'err_msg': ''
            }
            console.log("Result:")
            console.log(result);
            if (result) {
                bot_resp.title = result.title;
                bot_resp.content = result.body_markdown;
                bot_resp.question_score = result.score;
                bot_resp.is_accepted_ans = result.is_answered;
                bot_resp.href = result.link;

                if(bot_resp.is_accepted_ans) {
                    let ans_id = result.accepted_answer_id;
                    
                    let ans_result_arr = JSON.parse(await api.getAnswerById(ans_id));
                    let ans_result = ans_result_arr.items[0];
                    console.log("Ans_result:")
                    console.log(ans_result);
                    if(ans_result) {
                        bot_resp.answer_score = ans_result.score;
                        bot_resp.answer = ans_result.body;
                    } else {
                        bot_resp.error = true;
                        bot_resp.err_msg = `Could not get accepted answer for this question: ${bot_resp.href}`;
                    }
                }
            } else {
                bot_resp.error = true;
                bot_resp.err_msg = 'No result was found.';
            }

            if(!bot_resp.error) {
                console.log("Bot_resp:")
                console.log(bot_resp);
                output_str += `${bot_resp.title} [Score=${bot_resp.question_score}]\n${bot_resp.content}\n`;
                
                if(bot_resp.is_accepted_ans) {
                    output_str += `*Best Answer `;
                } else {
                    output_str += `*Best Non-Accepted Answer `;
                }

                output_str += `[Score=${bot_resp.answer_score}]:*\n${bot_resp.answer}\nRead More Here: ${bot_resp.href}\n`;
            } else {
                output_str += `*Error:* ${bot_resp.err_msg}`
            }
            
            let msg = slack_helper.createMessage(req.body.user_id, bot_resp);

            console.log("USER: " + req.body.user_id);
            
            request.post('https://slack.com/api/chat.postMessage', msg, function (error, response, body) {
                // Sends welcome message
                res.json();
            });
            // res.send(output_str);
        } catch (err) {
            console.warn(err);
            res.status(422).send('Error in /get-top route.');
        }
    } else {
        res.send("You need to specify a search term.");
    }
});
