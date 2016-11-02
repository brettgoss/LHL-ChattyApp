import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state.username = this.props.user;
    this.state.content = '';
  }

  handleChange(event) {
    let id = event.target.id;
    if(id === "username"){
      // this.setState({username: event.target.value});
    }
    if (id === "new-message"){
      this.setState({content: event.target.value})
    }
  }
  handleSubmit(event) {
    let id = event.target.id
    var val = event.target.value.trim()
    if(event.key == 'Enter'){
      if(id === "username" && val !== ""){
        if(this.state.username !== event.target.value){
          this.props.sendNoti(this.state.username, event.target.value)
          this.setState({username: event.target.value});
        }
      }
      else if (id === "new-message"){
        var msg = event.target.value.trim()
        if(msg !== ""){
          this.state.type = 'postMessage'
          var buffer = JSON.stringify(this.state)
          this.props.socket.send(buffer);
          this.setState({content: ""})
        }
      }
    }
    if((event.key == 'Tab') && (id === "username")){
      this.setState({username: event.target.value})
      if(this.state.username !== event.target.value){
        this.props.sendNoti(this.state.username, event.target.value)
      }
    }
  }

  componentWillMount(){
    this.state.style = {
        color: this.props.color
    };
    var color = this.props.color
    console.log("Rendering <ChatBar/>");
  }

  render() {
    return (
      <footer>
        <input
          style={this.state.style}
          id="username"
          type="text"
          defaultValue={this.state.username}
          onChange={this.handleChange}
          onKeyDown={this.handleSubmit}
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
