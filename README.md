# hudyBot
Recently Facebook launched Messenger Platform with support for developing our very own Bots. 
Rich API allows to efficiently process messages and respond with images, links, call-to-action buttons, even direct payments.


## Getting Started
This will require a basic knowledge of javascript and Node.js framework Express. This project will have to be hosted on a cloud server, so in this 
use case we will be using Heroku server to deploy our code. While we get our Api keys deploy to our server for Facebook to do the  handshake.

### Prerequisites
What you will have to install
 1. git bash
 2. Node.js
 3. Heroku Toolkit
 5. Express
 4. A Text editor
 
### Intialise Node.js
``` npm init```

###Installing  Express body parser
```
$ npm install express body-parser request --save
```

The GET handler is only there to make sure the server is up and running when you visit app's web address.
```
// Server frontpage
app.get('/', function (req, res) {  
    res.send('This is TestBot Server');
});

```

GET handler is used by Facebook to verify our server app as designated to handle Messenger Bot integration. Please note that example code uses ```testbot_verify_token``` as a verify token
```
// Facebook Webhook
app.get('/webhook', function (req, res) {  
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

```

we need to register ```POST``` handler that Recieve messages.

```
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
```

## Deployment

To deploy to a life server, in this case we are using Heroku. 

###Login in to Heroku from cmd with this command
```$ heroku login```
###Create a new server or App on Heroku
```$ heroku create```
###When the prompt returns this
Creating app... done, stack is cedar-14  
https://calm-plains-XXXXX.herokuapp.com/ | https://git.heroku.com/calm-plains-XXXXX.git 
###Deploy and push
```$ git push heroku master```


## Author

* **Nsikak Thompson** 

## Acknowledgments

* David Bot


