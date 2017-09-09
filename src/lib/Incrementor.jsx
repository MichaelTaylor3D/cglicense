import React, { PureComponent } from 'react';
import NumberInput from 'material-ui-number-input';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  height: 75,
  display: 'flex',
  alignItems: 'center'
}

export default class Incrementor extends PureComponent {
  constructor() {
    super();

    this.state = {
      value: '0',
      errorText: 'This is an error text'
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValue) {
      this.setState({value: nextProps.initialValue.toString()});
    }    
  }
  
  onChange(event, value) {
    this.setState({value: value.toString()});
    this.props.onChange(value.toString());
  };

  onIncrement() {
    const newValue = Number(this.state.value) + 1;
    this.setState({value: newValue.toString()});
    this.props.onChange(newValue.toString());
  }

  onDecrement() {
    const newValue = Number(this.state.value) - 1;
    this.setState({value: newValue.toString()});
    this.props.onChange(newValue.toString());
  }
  
  onError(error) {
    let errorText;
    switch (error) {
      case 'required':
        errorText = 'This field is required';
        break;
      case 'invalidSymbol':
        errorText = 'You are tring to enter none number symbol';
        break;
      case 'incompleteNumber':
        errorText = 'Number is incomplete';
        break;
      case 'singleMinus':
        errorText = 'Minus can be use only for negativity';
        break;
      case 'singleFloatingPoint':
        errorText = 'There is already a floating point';
        break;
      case 'singleZero':
        errorText = 'Floating point is expected';
        break;
      case 'min':
        errorText = 'You are tring to enter number less than -10';
        break;
      case 'max':
          errorText = 'You are tring to enter number greater than 12';
          break;
    }
    this.setState({ errorText: errorText });
  };

  render() {
    return (
      <div style={style}>
        <span style={{width: 100}}>{this.props.label}</span>
        <RaisedButton 
          style={{minWidth: 33, margin: 2}} 
          label="-" 
          primary={true} 
          onClick={this.onDecrement.bind(this)}
        />
        <NumberInput
          inputStyle={{textAlign: 'center'}}
          id="num"
          value={this.state.value}
          required
          min={0}
          max={99999}
          strategy="warn"
          errorText={this.state.errorText}
          onChange={this.onChange.bind(this)}
          onError={this.onError.bind(this)}
        />
        <RaisedButton 
          style={{minWidth: 33, margin: 2}} 
          label="+" 
          primary={true}
          onClick={this.onIncrement.bind(this)}
        />
      </div>

    )
  }
}