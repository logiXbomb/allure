// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import Line from './Line';
import './terminal.scss';

class Terminal extends Component {
  state = {
    output: []
  }
  componentDidUpdate = () => {
    window.scrollTo(0, document.body.scrollHeight);
  }
  exec = (str: String) => {
    // this.state.output.push(str);
    const response = ipcRenderer.sendSync('exec', str);
    console.log('resp', response);
    this.state.output = this.state.output.concat(response.split(/\r?\n/))
    this.setState(this.state);
  }
  render() {
    return <div className="terminal">
      <div className="output">
        {this.state.output.map(o => <div>{o.replace(/ /gmi, '\xa0')}</div>)}
      </div>
      <Line exec={this.exec} />
    </div>
  }
}

export default Terminal;