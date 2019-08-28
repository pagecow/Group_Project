import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import io from "socket.io-client";

import Divider from "@material-ui/core/Divider";

import { getUsers } from "../../ducks/userReducer";
import { getRoomName } from "../../ducks/serverReducer";

import "./messageBoard.css";

class MessageBoard extends Component {
  constructor() {
    super();

    this.state = {
      messages: [],

      messageInput: "",
      room: 0,

      editing: false,
      editingInput: ""
    };
  }

  componentDidMount = () => {
    this.socket = io();
    this.socket.on("room entered", data => {
      this.joinSuccess(data);
    });

    this.socket.on("message sent", data => {
      this.updateMessages(data);
    });

    this.props.getUsers();
  };

  componentWillUnmount = () => {
    this.socket.disconnect();
  };

  componentDidUpdate = prevProps => {
    if (prevProps.selectedRoom != this.props.selectedRoom) {
      this.props
        .getRoomName(this.props.selectedRoom, this.props.selectedServer)
        .then(res => {
          this.setState({ rooms: res.value });
        })
        .then(
          this.setState(
            {
              room: this.props.selectedRoom
            },
            () => {
              if (this.state.room !== 0) {
                this.socket.emit("enter room", {
                  selectedRoom: this.state.room,
                  selectedServer: this.props.selectedServer,
                  roomName: this.state.room
                });
              }
            }
          )
        );
    }
  };

  joinSuccess = messages => {
    this.setState({
      messages
    });
  };

  sendMessage = (e) => {
    e.preventDefault();
    this.socket.emit("send message", {
      message: this.state.messageInput,
      selectedRoom: this.state.room,
      selectedServer: this.props.selectedServer,
      sender: this.props.user.user.user_id
    });
    this.setState({
      messageInput: ""
    });
  };

  edit = () => {
    if (this.state.editing) {
      this.setState({
        editing: false
      });
    } else if (!this.state.editing) {
      this.setState({
        editing: true
      });
    }
  };

  saveChanges = () => {};

  deleteMessage = socket_message_id => {
    console.log("hit");
    this.socket.emit("delete message", {
      socket_message_id,
      selectedRoom: this.state.room,
      selectedServer: this.props.selectedServer
    });
  };

  updateMessages = messages => {
    this.setState({
      messages
    });
  };

  handleInput = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className="text-channel-containerz">
        <section className="mapped-message-holder">
          {this.state.messages.map(messageObj => {
            // eslint-disable-next-line no-lone-blocks
            {
              if (messageObj.user_id == this.props.user.user.user_id) {
                return (
                  <section className="messages">
                    <section className="message-layer2">
                      <Divider />
                      <img
                        className="messaging-picture"
                        src={this.props.user.user.user_image}
                      />

                      <section className="messaging-sender">
                        {" "}
                        {this.props.user.user.user_name} {""}{" "}
                      </section>

                      {this.state.editing ? (
                        <div>
                          <input
                            type="text"
                            name="messageInput"
                            value={this.state.editingInput}
                            onChange={this.handleInput}
                            className="edit-input"
                          />
                          <button onClick={this.saveChanges}>Save</button>
                        </div>
                      ) : (
                        <section className="message-color">
                          {" "}
                          {messageObj.message}
                        </section>
                      )}

                      <button
                        className="put-socket"
                        onClick={() =>
                          this.deleteMessage(messageObj.socket_message_id)
                        }
                      >
                        Delete
                      </button>
                      <button className="put-socket" onClick={this.edit}>
                        Edit Message
                      </button>
                      
                    </section>
                  </section>
                );
              } else {
                let correctPerson = this.props.user.users.find(function(
                  element
                ) {
                  return element.user_id == messageObj.user_id;
                });
                return (
                  <section className="messages">
                    <section className="message-layer2">
                      <Divider />
                      <img
                        className="messaging-picture"
                        src={correctPerson.user_image}
                      />
                      <section className="messaging-sender-not-user">
                        {" "}
                        {correctPerson.user_name} {""}{" "}
                      </section>

                      <section className="message-color">
                        {" "}
                        {messageObj.message}{" "}
                      </section>
                    </section>
                  </section>
                );
              }
            }
          })}
        </section>

        <form className="message-footer">
          <input
            type="text"
            name="messageInput"
            value={this.state.messageInput}
            onChange={this.handleInput}
            className="message-input"
          />
          <button onClick={this.sendMessage}>Send</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(
  mapStateToProps,
  { getRoomName, getUsers }
)(MessageBoard);
