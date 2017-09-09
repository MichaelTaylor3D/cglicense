import React from 'react';
import { Link, Router } from 'react-router-dom'
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import {AccountCircle} from 'material-ui-icons';
import {Timeline} from 'material-ui-icons';

export default class AppDrawer extends React.Component {
    render() {
        return (
            <div>
                <Drawer open={this.props.open} docked={false} >
                    <AppBar
                        title="Menu"
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        onLeftIconButtonTouchTap={this.props.handleClose}
                    />
                    <MenuItem onTouchTap={this.props.handleClose}>
                        <Link to='/'>
                            <FlatButton label="User Accounts" icon={<AccountCircle />} />
                        </Link>
                    </MenuItem>
                    <MenuItem onTouchTap={this.props.handleClose}>
                        <Link to='/usage'>
                            <FlatButton label="Global Usage" icon={<Timeline />} />
                        </Link>
                    </MenuItem>
                </Drawer>
            </div>
        );
    }
}