import React, {Component} from 'react'

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      username: 'Anonymous',
      content: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  // Change in text handler
  handleChange(event) {
    let id = event.target.id
    if (id === "new-message"){
      this.setState({content: event.target.value})
    }
  }

  // Form submission handler
  handleSubmit(event) {
    let id = event.target.id
    var val = event.target.value.trim()

    // If the key is "ENTER" and the text field isn't empty or spaces
    if(event.key == 'Enter' && val !== ""){

      // Handle username field
      if(id === "username"){
        if(this.state.username !== event.target.value){
          this.props.sendNoti(this.state.username, event.target.value)
          this.setState({username: event.target.value})
        }
      }
      // Handle new message field
      if (id === "new-message"){
        this.props.sendMessage(this.state)
        this.setState({content: ""})
      }
    }
    // Handles changing fields with "TAB"
    if((event.key == 'Tab') && (id === "username")){
      this.setState({username: event.target.value})

      // Only send notification if there is a change in value
      if(this.state.username !== event.target.value){
        this.props.sendNoti(this.state.username, event.target.value)
      }
    }
  }

  componentWillMount(){
    this.setState({
      style: {
        color: this.props.color
      }
    })
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
          onKeyDown={this.handleSubmit} />
        <input
          id="new-message"
          type="text"
          placeholder="Type a message and hit ENTER"
          value={this.state.content}
          onChange={this.handleChange}
          onKeyUp={this.handleSubmit} />
      </footer>
    )
  }
}
export default ChatBar;
