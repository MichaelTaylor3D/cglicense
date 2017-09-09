import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import source from '../source';

const style = {
  margin: 20,
  padding: 20,
  textAlign: 'center',
  display: 'inline-block',
};

export default class CreateAccounts extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  onUserNameChange(event, value) {
    this.setState({username: value}, () => {
      this.props.onChange(this.state);
    });
  }

  onPasswordChange(event, value) {
    this.setState({password: value}, () => {
      this.props.onChange(this.state);
    });
  }

  handleCantCreateRequestClose = () => {
    this.setState({
      showCantCreate: false,
    });
  };

  render() {
    return (
      <div>
          <TextField 
            hintText="Username"
            onChange={(event, value) => this.onUserNameChange(event, value)}
          />
          <br/>
          <TextField
            hintText="Password Field"
            floatingLabelText="Password"
            type="password"
            onChange={(event, value) => this.onPasswordChange(event, value)}
          />        
      </div>
    );
  }
}