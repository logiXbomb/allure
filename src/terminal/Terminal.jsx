// @flow
import React, { Component } from 'react';
import Line from './Line';
import './terminal.scss';

class Terminal extends Component {
  state = {
    output: []
  }
  exec = (str: String) => {
    this.state.output.push(str);
    this.setState(this.state);
  }
  render() {
    return <div className="terminal">
      <div className="output">
        {this.state.output.map(o => <span>{o}</span>)}
      </div>
      <Line exec={this.exec} />
    </div>
  }
}

export default Terminal;