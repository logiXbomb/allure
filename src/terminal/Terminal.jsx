// @flow
import React, { Component } from 'react';
import Line from './Line';
import './terminal.scss';

class Terminal extends Component {
  render() {
    return <div className="terminal">
      <div>
        OutPut Goes Here
      </div>
      <Line />
    </div>
  }
}

export default Terminal;