import React, {Component} from 'react';

import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {


  constructor(props) {

    super(props)
    this.postMessage = this.postMessage.bind(this)


    this.state = {
      currentUser: {name: "Anonymous"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    };
  }

  postMessage(name, content){
    const newMessage = {id: 3, username: name, content: content};
    const messages = this.state.messages.concat(newMessage)
    this.setState({messages: messages})
  }


  render() {
    console.log("Rendering <App/>");
    console.log(this.state.messages)
    return (
      <div className="wrapper">
        <nav>
          <h1>Chatty</h1>
        </nav>
        <div id="message-list">
          <MessageList data={this.state.messages} />
        </div>
        <ChatBar user={this.state.currentUser.name} newMessage={this.postMessage} />
      </div>
    );
  }

}
export default App;
