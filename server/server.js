// server.js
// Require dependencies
const express      = require('express')
const SocketServer = require('ws').Server
const uuid         = require('node-uuid')

// Set the port to 4000
const PORT = 4000

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`))

// Create the WebSockets server
const wss = new SocketServer({ server })

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

function getClientData (bool){
  let clientInfo = {
    type: 'incomingNotification',
    total: wss.clients.length,
    content: 'User has joined the channel.'
  }
  if(!bool){
    clientInfo.content = 'User has left the channel'
  }
  clientInfo = JSON.stringify(clientInfo)
  wss.clients.forEach(function each(client) {
    client.send(clientInfo);
  })
}


wss.on('connection', (ws) => {
  // console.log('Client connected');
  console.log(wss.clients.length + ' users online')

  function randColor() {
    let colorArray = [
      '#e07f19','#bc2333','#43b427',
      '#324cbf','#985389','#8e1370',
      '#5d2922','#1cb1a7','#29116f'
    ]
    let num = Math.floor(Math.random() * colorArray.length)
    return colorArray[num]
  }
  let userColor = randColor()
  getClientData(true)

  ws.on('message', function incoming(data) {
    let incomingData = JSON.parse(data)
    let response = {}

    if(incomingData.type == 'postMessage'){
      console.log('> ' + incomingData.username + ' said ' + incomingData.content);

      let uid = uuid.v4()
      response = {
        type: 'incomingMessage',
        id: uid,
        username: incomingData.username,
        content: incomingData.content,
        style: {
          color: userColor
        }
      }
    }
    if (incomingData.type == 'postNotification') {
      let notification = (`${incomingData.oldName} changed their name to ${incomingData.newName}`)
      console.log(notification)

      response = {
        type: 'incomingNotification',
        content: notification,
        style: {
          color: userColor
        }
      }
    }
    let returnData = JSON.stringify(response)
    wss.clients.forEach(function each(client) {
      client.send(returnData);
    })
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    // console.log('Client disconnected')
    console.log(wss.clients.length + ' users online')
    getClientData()
  })
  ws.onerror = function(err) {
    console.log(err)
  }
})
