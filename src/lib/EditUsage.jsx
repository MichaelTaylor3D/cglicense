import React, { PureComponent } from 'react';
import Incrementor from './Incrementor';

import source from '../source';

const style = {
  margin: 20,
  padding: 20,
  textAlign: 'center',
  display: 'inline-block',
};

export default class EditUsage extends PureComponent {
  constructor() {
    super();
    this.state = {
      reduce: '0',
      limit: '0',
      usage: '0'
    }
  }

  componentDidMount() {
    source.getAccount(this.props.username, (error, res) => {
      this.setState({
        limit: res.renderTimeLimit,
        usage: res.currentRenderTime
      }, () => {
        this.props.onChange(this.state);
      });
    });    
  }

  onReduceChange(value) {
    this.setState({reduce: value}, () => {
      this.props.onChange(this.state);
    });    
  }

  onLimitChange(value) {
    this.setState({limit: value}, () => {
      this.props.onChange(this.state);
    });    
  }

  onUsageChange(value) {
    this.setState({usage: value}, () => {
      this.props.onChange(this.state);
    });    
  }

  render() {
    return (
      <div>
        <h5>(thread hours)</h5>
        <Incrementor label="Reduce" onChange={this.onReduceChange.bind(this)} />
        <Incrementor label="Limit" initialValue={this.state.limit} onChange={this.onLimitChange.bind(this)} />
        <span>0 (default) means no limit</span>
        <Incrementor label="Usage" initialValue={this.state.usage} onChange={this.onUsageChange.bind(this)} />
      </div>
    )
  }
}