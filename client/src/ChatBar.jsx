import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state.username = this.props.user
    this.state.content = '';
  }


  handleChange(event) {
    let id = event.target.id
    if(id === "username"){
      this.setState({username: event.target.value});
    } else if (id === "new-message"){
      this.setState({content: event.target.value})
    }
  }
  handleSubmit(event) {
    if(event.key == 'Enter'){
      var buffer = JSON.stringify(this.state)
      this.props.socket.send(buffer);

      this.props.newMessage(this.state.username, this.state.content)
      console.log("this should ", this.state.content)
      this.setState({content: ""})
    }
  }



  render() {
    console.log("Rendering <ChatBar/>");
    return (
      <footer>
        <input
          id="username"
          type="text"
          value={this.state.username}
          onChange={this.handleChange}
          />
        <input
          id="new-message"
          type="text"
          placeholder="Type a message and hit ENTER"
          value={this.state.content}
          onChange={this.handleChange}
          onKeyDown={this.handleSubmit}
          />
      </footer>
    );
  }
}
export default ChatBar;
