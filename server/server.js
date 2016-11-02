// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');
// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', function incoming(data) {
    var incomingData = JSON.parse(data)
    console.log(incomingData.type)

    if(incomingData.type == 'postMessage'){
      console.log('> ' + incomingData.username + ' said ' + incomingData.content);
      var uid = uuid.v4()
      var response = {
        type: 'incomingMessage',
        id: uid,
        username: incomingData.username,
        content: incomingData.content
      }
      var buffer = JSON.stringify(response)
      wss.clients.forEach(function each(client) {
        client.send(buffer);
      });
    }
    if (incomingData.type == 'postNotification') {
      var notification = ('**' + incomingData.oldName + '** changed their name to **' + incomingData.newName + '**')
      console.log(notification);

      var response = {
        type: 'incomingNotification',
        content: notification
      }
    var returnData = JSON.stringify(response)
    wss.clients.forEach(function each(client) {
      client.send(returnData);
    });
  }
});

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});
