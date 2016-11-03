import React, {Component} from 'react';

import Message from './Message.jsx';

class MessageList extends Component {
  constructor(props){
    super(props)
  }
  render() {
    console.log("Rendering <MessageList/>");

    return (
      <div id="message-list" className="message-system">
        {
          this.props.data.map(function(value, index){
            return <Message key={index} body={value} />
          })
        }
      </div>
    );
  }
}
export default MessageList;
