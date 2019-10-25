let request = require('request');

exports.CHANNEL_NAME = "#bot_madness";
exports.AUTH_TOKEN = process.env.SLACK_AUTH_TOKEN;

exports.sendPublicMessage = (res, str) => {
    var data = {
        form: {
            token: process.env.SLACK_AUTH_TOKEN,
            channel: this.CHANNEL_NAME,
            text: str
        }
    };

    request.post('https://slack.com/api/chat.postMessage', data, function (error, response, body) {
        // Sends welcome message
        res.json();
    });
}

exports.createDividerBlock = () => {
    return { 
        "type":"divider"
    }
}

exports.createBaseBlock = (str = "") => {
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": str
        }
    }
}

exports.createMultiLineBlock = (str) => {
    let ret_str = "";
    let str_arr = str.split("\n");
    for(line in str_arr){
        ret_str += `>${str_arr[line]}\n`;
    }
    
    return this.createBaseBlock(ret_str);
}

exports.createMessage = (uid, data) => {
    var ret = {
        form: {
            token: this.AUTH_TOKEN,
            channel: this.CHANNEL_NAME,
            attachments: [],
            //user: uid,
            text: "Jordan is bored.",
            blocks: ""
        }
    }

    // Create title block
    let title_block = this.createBaseBlock(`*QUESTION: "${data.title}" [Score=${data.question_score}]*\n`);

    // Create content block
    let content_block = this.createMultiLineBlock(data.content);

    // Create divider block
    let divider_block = this.createDividerBlock();

    // Create answer title block
    let answer_title_block = this.createBaseBlock();
    if(data.is_accepted_ans) {
        answer_title_block.text.text += `*Best Accepted Answer `;
    } else {
        answer_title_block.text.text += `*Best Non-Accepted Answer `;
    }
    answer_title_block.text.text += `[Score=${data.answer_score}]:*\n`;

    // Create answer block
    let answer_block = this.createMultiLineBlock(data.answer);

    // Create link block
    let link_block = this.createBaseBlock(`Read more here: <${data.href}>`);

    let block_arr = [title_block, content_block, divider_block, answer_title_block, answer_block, link_block];
    ret.form.blocks = JSON.stringify(block_arr);

    console.log(ret.form.blocks);
    return ret;
}

