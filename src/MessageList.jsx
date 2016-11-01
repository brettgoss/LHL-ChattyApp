import React, {Component} from 'react';

import Message from './Message.jsx';

class MessageList extends Component {
  constructor(props){
    super(props)
  }
  render() {
    console.log("Rendering <MessageList/>");
    return (
      <div className="message-system">
        {
          this.props.messages.map(function(value, index){
            return <Message key={index} body={value} />
          })
        }
      </div>
    );
  }
}
export default MessageList;
