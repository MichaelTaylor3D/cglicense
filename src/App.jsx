import React, { PureComponent } from 'react';

import AppBar from 'material-ui/AppBar';
import AppDrawer from './lib/AppDrawer';

import Accounts from './pages/Accounts';
import GlobalUsage from './pages/GlobalUsage';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import {Redirect} from 'react-router';

import './app.css';

const corsLink = 'https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?utm_source=gmail';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});

  render() {
    return (
      <Router>
        <div className="App">
          <AppBar
            title="VRay License Manager"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            onLeftIconButtonTouchTap={this.handleToggle}
          />

          <AppDrawer open={this.state.open} handleClose={this.handleClose} />
          
          <Route exact path='/' component={Accounts}/>
          <Route path='/usage' component={GlobalUsage}/>     
        </div>
      </Router>
    );
  }
}