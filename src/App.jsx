import React, {Component} from 'react';

import Message from './Message.jsx';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  render() {
    console.log("Rendering <App/>");
    return (
      <div className="wrapper">
        <nav>
          <h1>Chatty</h1>
        </nav>
        <div id="message-list">
          <Message />
          <MessageList />
        </div>
        <ChatBar />
      </div>
    );
  }
}
export default App;
