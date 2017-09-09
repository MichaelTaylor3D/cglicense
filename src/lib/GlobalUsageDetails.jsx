import React, { PureComponent } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import moment from 'moment';

import source from '../source';

export default class GlobalUsageDetails extends PureComponent {
  constructor() {
    super();
    this.state = {
      usage: []
    }
  }

  componentDidMount() {
    source.getTotalTime((error, res) => {
      if (res) {
        this.setState({usage: res});
      }
    });    
  }

  generateUsageRows() {
    const rows = [];
    if (this.state.usage.length === 0) {
      rows.push(
        <TableRow key="1">
          <TableRowColumn>No Usage Data Found</TableRowColumn>  
        </TableRow>
      )
    } else {
      this.state.usage.forEach((row, index) => {
        rows.push(
          <TableRow key={index}>
            <TableRowColumn>{row.username}</TableRowColumn>
            <TableRowColumn>{moment(row.parameters.from).format('MM/DD/YYYY')}</TableRowColumn>
            <TableRowColumn>{moment(row.parameters.to).format('MM/DD/YYYY')}</TableRowColumn>
            <TableRowColumn>{row.renderTime}</TableRowColumn>
            <TableRowColumn>{row.product}</TableRowColumn>
          </TableRow>
        );
      });
    }

    return (
      <TableBody>
        {rows}
      </TableBody>
    )
  }

  render() {
    return (
      <div>
        <h3 style={{margin: 20}}>Primary SSO Account</h3>
        <Table selectable={false}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Username</TableHeaderColumn>
              <TableHeaderColumn>From</TableHeaderColumn>
              <TableHeaderColumn>To</TableHeaderColumn>
              <TableHeaderColumn>Render Time</TableHeaderColumn>
              <TableHeaderColumn>Product</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          {this.generateUsageRows()}
        </Table>
      </div>
    )
  }
}