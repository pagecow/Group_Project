import React, { Component } from 'react'
import { connect } from 'react-redux';
import { serverRegister } from '../../ducks/serverReducer';
import Button from "@material-ui/core/Button";
import "./serverRegistration.css";
import SearchServer from "./SearchServer";

class ServerRegistration extends Component {
    constructor(props) {
        super(props)
        this.state = {
            server_name: '',
            server_image: ''
        }
    }
    
    
  
    handleServerChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
      };

  handleCancel = () => {
    this.props.addServer()
  }

  handleServerChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  registerServer = () => {
    let { server_name, server_image } = this.state;
    let { user_id } = this.props.user.user;
    this.props.serverRegister(server_name, server_image, user_id);
    this.props.addServer();
  };

  render() {
    let { server_image, server_name } = this.state;

    const buttonStyle = {
      background: "#7e8699",
      color: "white"
    };
    return (
      <div className="server-registration-container">
        <div className="border-of-component">
          <title>Register server</title>
          <h1>Server Name</h1>
          <input
            onChange={this.handleServerChange}
            value={server_name}
            name="server_name"
          />
          <h1>Server Image</h1>
          <input
            value={server_image}
            onChange={this.handleServerChange}
            name="server_image"
          />
          <Button style={buttonStyle} onClick={this.registerServer}>
            Register
          </Button>
          <Button style={buttonStyle} onClick={this.handleCancel}>
            Cancel
          </Button>
          <div>
            <SearchServer />
          </div>
        </div>
      </div>
    );
  }
}
// onClick={handleDrawerOpen}
function mapStateToProps(state) {
  return { server: state.server, user: state.user };
}

export default connect(
  mapStateToProps,
  { serverRegister }
)(ServerRegistration);
