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
    var userData = {
      type: 'postNotification',
      oldName: oldName,
      newName: newName
    }
    var buffer = JSON.stringify(userData)
    this.socket.send(buffer);
  }
  postNoti(content, color, total){
    if(total){
      this.setState({total: total});
      console.log("total",this.state.total)
    }
    const newNoti = this.state.messages.concat({notification: content, color: color})
    this.setState({messages: newNoti})
  }
  postMessage(type, id, name, content, color){
    const newMessage = {id: id, username: name, content: content, color: color};
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
      var total   = obj.total
      var color   = obj.style

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
