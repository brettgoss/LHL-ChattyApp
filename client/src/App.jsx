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
    this.state = { messages: [] }
  }
  // Sends notification to the server.
  sendNoti(oldName, newName){
    let userData = {
      type: 'postNotification',
      oldName: oldName,
      newName: newName
    }
    let buffer = JSON.stringify(userData)
    this.socket.send(buffer);
  }

  // Recieves notification from the server
  postNoti(content, color, total){
    // If the notification is the number of clients connected
    if(total){
      this.setState({total: total})
      console.log("total",this.state.total)
    }
    // Otherwise, it's a name change notification. Send it to the message handler
    let newNoti = this.state.messages.concat({notification: content, color: color})
    this.setState({messages: newNoti})
  }

  // Sends message to the server
  sendMessage(message){
    message.type = 'postMessage'
    let buffer = JSON.stringify(message)
    this.socket.send(buffer);
  }

  // Recieves message from the server
  postMessage(type, id, name, content, color){
    let newMessage = {id: id, username: name, content: content, color: color};
    let messages = this.state.messages.concat(newMessage)
    this.setState({messages: messages})
  }

  componentDidMount(){
    this.socket.onopen = function (event) {
      console.log("Connected to Server.")
    }
    // On incoming message from the server, delegate tasks
    this.socket.onmessage = (event) => {

      // Parse the data back into an object,
      let obj = JSON.parse(event.data)

      // Decide if incoming data is a message or notification.
      switch(obj.type){
        case 'incomingMessage':
          this.postMessage(obj.type, obj.id, obj.username, obj.content, obj.style)
          break;
        case 'incomingNotification':
          this.postNoti(obj.content, obj.style, obj.total)
          break;
        default:
          console.log("Unknown data type: ", obj.type)
      }
    }
  }

  render() {
    console.log("Rendering <App/>");
    return (
      <div className="wrapper">
        <nav>
          <div id="brand">ChattyApp</div>
          <div id="userCount">Users Online: {this.state.total}</div>
        </nav>
        <MessageList
          data={this.state.messages} />
        <ChatBar
          color={this.randColor}
          sendMessage={this.sendMessage}
          sendNoti={this.sendNoti} />
      </div>
    );
  }

}
export default App;
