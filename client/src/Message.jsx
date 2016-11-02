import React, {Component} from 'react';

class Message extends Component {
  constructor(props){
    super(props)
  }
  render() {
    console.log("Rendering <Message/>");


    return (
      <div className="message">
        <div style={this.props.body.color}><em>{this.props.body.notification}</em></div>
        <span style={this.props.body.color} className="username">{this.props.body.username}</span>
        <span className="content">{this.props.body.content}</span>
      </div>
    );
  }
}
export default Message;
