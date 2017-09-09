import React, { PureComponent } from 'react';

import AccountsTable from '../lib/AccountsTable';

export default class Accounts extends PureComponent {
  render() {
    return(
      <div>        
        <AccountsTable />  
      </div>
    )
  }
}