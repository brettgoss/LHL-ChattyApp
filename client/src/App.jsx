import React, {Component} from 'react';

import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {


  constructor(props) {
    super(props)

    this.socket = new WebSocket("ws://localhost:4000");
    this.sendMessage = this.sendMessage.bind(this)
    this.postMessage = this.postMessage.bind(this)
    this.sendNoti = this.sendNoti.bind(this)
    this.postNoti = this.postNoti.bind(this)
    this.state = {
      currentUser: {name: "Anonymous"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };
  }
  // Sends notification to the server.
  sendNoti(oldName, newName){
    var userData = {
      type: 'postNotification',
      oldName: oldName,
      newName: newName
    }
    var buffer = JSON.stringify(userData)
    this.socket.send(buffer);
  }

  // Recieves notification from the server
  postNoti(content, color, total){
    // If the notification is the number of clients connected
    if(total){
      this.setState({total: total});
      console.log("total",this.state.total)
    }
    // Otherwise, it's a name change notification. Send it to the message handler
    const newNoti = this.state.messages.concat({notification: content, color: color})
    this.setState({messages: newNoti})
  }

  // Sends message to the server (or will...)
  sendMessage(){
    // todo: Move sending message duties out of chat bar...
  }

  // Recieves message from the server
  postMessage(type, id, name, content, color){
    const newMessage = {id: id, username: name, content: content, color: color};
    const messages = this.state.messages.concat(newMessage)
    this.setState({messages: messages})
  }

  componentDidMount(){
    this.socket.onopen = function (event) {
      console.log("Connected to Server.")
    };
    // On incoming message from the server, delegate tasks
    this.socket.onmessage = (event) => {

      // Parse the data back into an object,
      // and then save the values into variables.
      var obj     = JSON.parse(event.data)
      var type    = obj.type
      var id      = obj.id
      var name    = obj.username
      var content = obj.content
      var total   = obj.total
      var color   = obj.style


      // Decide if incoming data is a message or notification.
      switch(type){
        case 'incomingMessage':
          this.postMessage(type, id, name, content, color)
          break;
        case 'incomingNotification':
          this.postNoti(content, color, total)
          break;
        default:
          console.log("Unknown data type: ", type)
        }
    }
  }

  render() {
    console.log("Rendering <App/>");
    return (
      <div className="wrapper">
        <nav>
          <h1>Chatty</h1>
          <div id="userCount">{this.state.total} users online.</div>
        </nav>
        <div id="message-list">
          <MessageList
            data={this.state.messages} />
        </div>
        <ChatBar
          color={this.randColor}
          user={this.state.currentUser.name}
          newMessage={this.sendMessage}
          sendNoti={this.sendNoti}
          socket={this.socket} />
      </div>
    );
  }

}
export default App;
