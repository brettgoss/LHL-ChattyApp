import React, {Component} from 'react';

import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {


  constructor(props) {
    super(props)


    this.socket = new WebSocket("ws://localhost:4000");
    this.postMessage = this.postMessage.bind(this)
    this.state = {
      currentUser: {name: "Anonymous"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };
  }
  postMessage(name, content){
    const newMessage = {id: 3, username: name, content: content};
    const messages = this.state.messages.concat(newMessage)
    this.setState({messages: messages})
  }

  componentDidMount(){
    this.socket.onopen = function (event) {
      console.log("Connected to Server.")

    };

    this.socket.onmessage = (event) => {
      var obj = JSON.parse(event.data)
      var name = obj.username
      var content = obj.content
      this.postMessage(name, content)
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
        <ChatBar user={this.state.currentUser.name} newMessage={this.postMessage} socket={this.socket} />
      </div>
    );
  }

}
export default App;
