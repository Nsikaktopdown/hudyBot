/*Install Git bash
Get signed up at heroku 
Install heroku Toolkit
Create a Facebook App at developer.facebook.com
Create a facebook page*/



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
    }else if(messageText.includes("Movies") || messageText.includes("movies") || messageText.includes("videos")){
        sendGenericMessage(senderID);
    }

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
      text: "Hello friend! My name is Mobot. I am your friendly assistant. What's your area of interest",
      quick_replies: [
            {
                "content_type":"text",
                "title":"Movies",
                "payload":"moviespayload"
            },
            {
                "content_type":"text",
                "title":"Music",
                "payload":"musicpayload"
            },
            {
                "content_type":"text",
                "title":"programming",
                "payload":"programmingspayload"
            },
            {
                "content_type":"text",
                "title":"cartoons",
                "payload":"newspayload"
            }
        ]
      
    }
  };

  callSendAPI(messageData);
};

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Fifty Shades Darker (2017) ",
            subtitle: "When a wounded Christian Grey tries to entice a cautious Ana Steele back into his life, she demands a new arrangement before she will give him another chance",
            item_url: "https://www.themoviedb.org/movie/341174-fifty-shades-darker",               
            image_url: "https://image.tmdb.org/t/p/w640/7SMCz5724COOYDhY0mj0NfcJqxH.jpg",
            buttons: [
            {
              type: "web_url",
              url: "https://www.youtube.com/watch?v=n6BVyk7hty8",
              title: "Watch trailer"
            },
            {
              type: "web_url",
              url: "https://www.themoviedb.org/movie/341174-fifty-shades-darker",
              title: "Reviews"
            }

            // , {
            //   type: "postback",
            //   title: "Call Postback",
            //   payload: "Payload for first bubble",
            // }

             ],
          },
          {
            title: "Rings (2017)",
            subtitle: "Julia becomes worried about her boyfriend, Holt when he explores the dark urban legend of a mysterious videotape said to kill the watcher seven days after viewing.",
            item_url: "https://www.themoviedb.org/movie/14564-the-ring-three",               
            image_url: "https://image.tmdb.org/t/p/w640/bbxtz5V0vvnTDA2qWbiiRC77Ok9.jpg",
            buttons: [
            {
              type: "web_url",
              url: "https://www.youtube.com/watch?v=NFB4eZSVgBE",
              title: "Watch trailer"
            },
            {
              type: "web_url",
              url: "https://www.themoviedb.org/movie/14564-the-ring-three",
              title: "Reviews"
            }

            // , {
            //   type: "postback",
            //   title: "Call Postback",
            //   payload: "Payload for first bubble",
            // }

             ],
          }
          ]
        }
      },

      quick_replies: [
            {
                "content_type":"text",
                "title":"Lastest",
                "payload":"lastestpayload"
            },
            {
                "content_type":"text",
                "title":"Now Playing",
                "payload":"nowplayingpayload"
            },
            {
                "content_type":"text",
                "title":"Top",
                "payload":"toppayload"
            },
        ]
    }
  };  

  callSendAPI(messageData);
}

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