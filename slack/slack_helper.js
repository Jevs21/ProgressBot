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

exports.createIndentedBlock = (str) => {
    return this.createBaseBlock(`>${str}`);
}

exports.createMessage = (uid, data) => {
    var ret = {
        form: {
            token: this.AUTH_TOKEN,
            channel: this.CHANNEL_NAME,
            attachments: [],
            user: uid,
            text: "Jordan is bored.",
            blocks: ""
        }
    }

    let block_arr = [this.createIndentedBlock(data)];
    ret.form.blocks = JSON.stringify(block_arr);

    console.log(ret.form.blocks);
    return ret;
}

