var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var app = express();

app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {  
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {  
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        }else if (event.postback) {
          receivedPostback(event); 
      } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

     if(messageText.includes("hi") || messageText.includes("hey") || messageText.includes("hello") || messageText.includes("Hi") || messageText.includes("Hello") || messageText.includes("Hey")){
        sendHelloMessage(senderID);
    }/*else if(messageText.includes("launched") || messageText.includes("created") || messageText.includes("launch")){
        sendMessage(senderID, "The Foundation was formally launched on 13th February, 2013.");
    }else if(messageText.includes("history")){
        sendMessage(senderID, "The Late Chief Andrew Akpan Inyang-Etoh Education Foundation was conceived and instituted by Rt. Rev. Msgr. Peter Andrew Inyang-Etoh to immortalize his late father who had a strong passion for Western education and endeavoured to provide same for his children within his limited resources. The Foundation was formally launched on 13th February, 2013, at the combined celebration of the 70th Birthday and 40th Anniversary of the Priestly Ordination of the Founder, Rt. Rev. Msgr. Peter Andrew Inyang-Etoh, held in the Church of Assumption, Ukana, Essien Udim Local Government Area, Akwa Ibom State.");
    }else{
         sendTextMessage(senderID);
    }*/

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    // switch (messageText) {
    //   case messageText.includes("about"):
    //     sendAboutMessage(senderID);
    //     break;
    //   case messageText.includes("award"):
    //     sendAwardMessage(senderID);
    //     break;
    //   case messageText.includes("scholar"):
    //     sendBeneficiaryMessage(senderID);
    //     break;


    //   default:
    //     sendTextMessage(senderID, messageText);
    // }
  } else if (messageAttachments) {
    //sendTextMessage(senderID, "Message with attachment received");
  } 
};


function sendHelloMessage(recipientId) {
    
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Hello friend! My name is Mobot. I am your friendly assistant. You may ask me any question of interest to you. At the moment, you may try the suggestions below",
      quick_replies: [
            {
                "content_type":"text",
                "title":"About Us",
                "payload":"aboutpayload"
            },
            {
                "content_type":"text",
                "title":"News",
                "payload":"newspayload"
            },
            {
                "content_type":"text",
                "title":"Who are the scholars",
                "payload":"scholarspayload"
            },
            {
                "content_type":"text",
                "title":"About the founder",
                "payload":"newspayload"
            },
            {
                "content_type":"text",
                "title":"Tell me about your history",
                "payload":"newspayload"
            }
        ]
      
    }
  };

  callSendAPI(messageData);
};

// generic function sending messages
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
};