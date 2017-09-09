import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import CreateAccounts from './CreateAccount';
import EditUsage from './EditUsage';
import UsageDetails from './UsageDetails';
import source from '../source';

import {DataUsage} from 'material-ui-icons';
import {Edit} from 'material-ui-icons';
import {VisibilityOff} from 'material-ui-icons';
import {Visibility} from 'material-ui-icons';
import {Security} from 'material-ui-icons';

export default class AccountsList extends React.Component {
   constructor() {
     super();
     this.state = {
       accounts: [],
       createAccount: {},
       showPasswordChangeSuccess: false,
       showChangePassword: false,
       showDisabledUsers: false,
       showPasswordChangeFail: false,
       showPasswordRequired: false,
       showEditUsage: false,
       showUsageSettingsSuccess: false,
       showUsageDetails: false,
       showCreateNewAccount: false,
       showMissingUsername: false,
       showMissingPassword: false,
       showCreateFail: false,
       showCreateSuccess: false
     }
   }

  componentDidMount() {
    this.loadAccounts();
  }

  loadAccounts() {
    source.list((err, res) => {
      if (err) {
        alert('Cant Detect License Server');
      } else {
        this.setState({accounts: res});        
      }
    });
  }

  generateEnabledDisableButton(enabled, username) {
    if (enabled) {
      return (
        <FlatButton 
          title="Click to disable"
          icon={<VisibilityOff />}
          onClick={
            () => source.disable(username, () => this.loadAccounts())
          } 
        />
      );
    } else {
      return (
        <FlatButton 
          title="Click to enable"
          icon={<Visibility />}
          onClick={
            () => source.enable(username, () => this.loadAccounts())
          } 
        />
      );
    }
  }

  generateAccountRow(account) {
    return (
      <TableRow key={account.username}>
        <TableRowColumn>{account.username}</TableRowColumn>
        <TableRowColumn>
          <FlatButton 
            title="Usage Details"
            icon={<DataUsage />}
            onClick={() => this.setState({
              showUsageDetails: true,
              activeAccount: account.username
            })}
          />
        </TableRowColumn>
        <TableRowColumn>
          <FlatButton 
            title="Edit Usage"
            icon={<Edit />}
            onClick={() => this.setState({
              showEditUsage: true,
              activeAccount: account.username
            })}
          />
        </TableRowColumn>
        <TableRowColumn>
          {this.generateEnabledDisableButton(account.enabled, account.username)}
        </TableRowColumn>
        <TableRowColumn>
          <FlatButton 
            title="Change Password"
            icon={<Security />}
            onClick={() => this.setState({
              showChangePassword: true,
              activeAccount: account.username
            })}
          />
        </TableRowColumn>
      </TableRow>
    )
  }

  generateAccountRows() {
   const row = [];

    if (this.state.accounts.length > 0) {
      this.state.accounts.forEach((account) => {
        if(this.state.showDisabledUsers) {
          row.push(this.generateAccountRow(account));
        } else if (!this.showDisabledUsers) {
          if (account.enabled) {
            row.push(this.generateAccountRow(account));
          }
        }
      });
    }
    return (
      <TableBody>
        {row}
      </TableBody>
    )
  }

  onPasswordChange(event, value) {
    this.setState({password: value});
  }

  onPasswordSubmit() {
    if (!this.state.password || this.state.password === '') {
      this.setState({showPasswordRequired: true});
    }
    
    source.changePassword(this.state.activeAccount, this.state.password, (error, res) => {
      if (error) {
        console.log(error)
        this.setState({showChangePassword: false, showPasswordChangeFail: true});
      } else {
        this.setState({
          showChangePassword: false,
          showPasswordChangeSuccess: true, 
          activeAccount: null, 
          password: null
        });
      }      
    });
  }

  onCheck(event, value) {
    this.setState({showDisabledUsers: value});
  }

  onEditUsageSubmit() {
    this.setState({showEditUsage: false})
    source.reduceUsage(this.state.activeAccount, Number(this.state.usage.reduce), (error, body) => {
      if (error) {

      }

      source.setLimit(this.state.activeAccount, Number(this.state.usage.limit), (error, body) => {
        if (error) {

        }
        source.setUsage(this.state.activeAccount, Number(this.state.usage.usage), (error, body) => {
          if (error) {

          }
          this.setState({showUsageSettingsSuccess: true});
        });
      });
    });  
  }

  onEditUsageChange(usage) {
    this.setState({usage});
  }

  onCreateAccountChange(createAccount) {
    this.setState({createAccount});
  }


  onCreateAccountSubmit() {
    if (!this.state.createAccount.username) {
      this.setState({showMissingUsername: true});
      return;
    }

    if (!this.state.createAccount.password) {
      this.setState({showMissingPassword: true});
      return;
    }

    source.create(this.state.createAccount.username, this.state.createAccount.password, (error, body) => {
      if (error) {
        this.setState({showCreateFail: true});
        return;
      }

      this.setState({
        showCreateSuccess: true, 
        createAccounts: {},
        showCreateNewAccount: false
      });
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.setState({showChangePassword: false})}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => this.onPasswordSubmit()}
      />,
    ];

    const usageActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.setState({showEditUsage: false})}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => this.onEditUsageSubmit()}
      />,
    ];

    const newAccountActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.setState({showCreateNewAccount: false})}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => this.onCreateAccountSubmit()}
      />
    ];

    const usageDetailsActions = [
      <FlatButton
        label="ok"
        primary={true}
        onClick={() => this.setState({showUsageDetails: false})}
      />
    ];

    return (
      <div>
        <div style={{margin: 20}}>
          <RaisedButton 
            label="Create New Account"
            onClick={() => this.setState({
              showCreateNewAccount: true
            })}
          />
        </div>
        <Checkbox
          label="Show Disabled Users"
          checked={this.state.showDisabledUsers}
          onCheck={this.onCheck.bind(this)}
          style={{margin: 25}}
        />
        <Table selectable={false}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Username</TableHeaderColumn>
              <TableHeaderColumn>Usage Details</TableHeaderColumn>
              <TableHeaderColumn>Edit Usage</TableHeaderColumn>
              <TableHeaderColumn>Enable/Disable</TableHeaderColumn>
              <TableHeaderColumn>Password</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          {this.generateAccountRows()}
        </Table>
        <Dialog
          title="Create New Account"          
          actions={newAccountActions}
          modal={false}
          open={this.state.showCreateNewAccount}
          onRequestClose={() => this.setState({showCreateNewAccount: false})}
        >
          <CreateAccounts onChange={this.onCreateAccountChange.bind(this)} />
        </Dialog>
        <Dialog
          title="Change Password"
          actions={actions}
          modal={false}
          open={this.state.showChangePassword}
          onRequestClose={() => this.setState({showChangePassword: false})}
        >
          <div>Please Type the new password</div>
          <TextField
            hintText="Password Field"
            floatingLabelText="Password"
            type="password"
            onChange={(event, value) => this.onPasswordChange(event, value)}
          />
        </Dialog>
        <Dialog
          title="Edit Usage"          
          actions={usageActions}
          modal={false}
          open={this.state.showEditUsage}
          onRequestClose={() => this.setState({showEditUsage: false})}
        >
          <EditUsage
            username={this.state.activeAccount}
            onChange={this.onEditUsageChange.bind(this)} 
          />
        </Dialog>
        <Dialog
          title="Usage Details - past 90 days"          
          actions={usageDetailsActions}
          modal={false}
          open={this.state.showUsageDetails}
          onRequestClose={() => this.setState({showEditUsage: false})}
        >
          <UsageDetails
            username={this.state.activeAccount}
          />
        </Dialog>
        <Snackbar
          open={this.state.showPasswordChangeSuccess}
          message="Password has been changed"
          autoHideDuration={4000}
          onRequestClose={() => this.setState({showPasswordChangeSuccess: false })}
        />
        <Snackbar
          open={this.state.showPasswordChangeFail}
          message="Password could not be changed for some reason"
          autoHideDuration={4000}
          onRequestClose={() => this.setState({showPasswordChangeFail: false })}
        />
        <Snackbar
          open={this.state.showUsageSettingsSuccess}
          message="Usage settings were updated"
          autoHideDuration={4000}
          onRequestClose={() => this.setState({showUsageSettingsSuccess: false })}
        />
        <Snackbar
          open={this.state.showPasswordRequired}
          message="Please type in a valid password before submiting"
          autoHideDuration={4000}
          onRequestClose={() => this.setState({showPasswordRequired: false })}
        />
        <Snackbar
            open={this.state.showCreateFail}
            message="Username already exists"
            autoHideDuration={4000}
            onRequestClose={() => this.setState({showCreateFail: false })}
          />
          <Snackbar
            open={this.state.showCreateSuccess}
            message="New User Created Successfully, Refresh this page to view"
            autoHideDuration={4000}
            onRequestClose={() => this.setState({showCreateSuccess: false })}
          />
          <Snackbar
            open={this.state.showMissingUsername}
            message="Please create a valid username"
            autoHideDuration={4000}
            onRequestClose={() => this.setState({showMissingUsername: false })}
          />
          <Snackbar
            open={this.state.showMissingPassword}
            message="Please create a valid password"
            autoHideDuration={4000}
            onRequestClose={() => this.setState({showMissingPassword: false })}
          />
      </div>
    );
  }
}