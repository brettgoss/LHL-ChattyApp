import React, {Component} from 'react';

import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {


  constructor(props) {
    super(props)


    this.socket = new WebSocket("ws://localhost:4000");
    this.postMessage = this.postMessage.bind(this)
    this.sendNoti = this.sendNoti.bind(this)
    this.postNoti = this.postNoti.bind(this)


    this.state = {
      currentUser: {name: "Anonymous"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };
  }
  sendNoti(oldName, newName){
    // console.log(oldName)
    var userData = {
      type: 'postNotification',
      oldName: oldName,
      newName: newName
    }
    var buffer = JSON.stringify(userData)
    this.socket.send(buffer);
  }
  postNoti(content){
    const newNoti = this.state.messages.concat({notification: content})
    this.setState({messages: newNoti})
  }
  postMessage(type, id, name, content){
    const newMessage = {id: id, username: name, content: content};
    const messages = this.state.messages.concat(newMessage)
    this.setState({messages: messages})
  }

  componentDidMount(){
    this.socket.onopen = function (event) {
      console.log("Connected to Server.")

    };

    this.socket.onmessage = (event) => {
      var obj     = JSON.parse(event.data)
      var type    = obj.type
      var id      = obj.id
      var name    = obj.username
      var content = obj.content

      switch(type){
        case 'incomingMessage':
          this.postMessage(type, id, name, content)
          break;
        case 'incomingNotification':
          this.postNoti(content)
          break;
        default:
          console.log("Unknown data type: ", type)
        }

      // code to handle incoming message
    }
  }





  render() {
    console.log("Rendering <App/>");
    return (
      <div className="wrapper">
        <nav>
          <h1>Chatty</h1>
        </nav>
        <div id="message-list">
          <MessageList data={this.state.messages} />
        </div>
        <ChatBar
          user={this.state.currentUser.name}
          newMessage={this.sendMessage}
          sendNoti={this.sendNoti}
          socket={this.socket} />
      </div>
    );
  }

}
export default App;
