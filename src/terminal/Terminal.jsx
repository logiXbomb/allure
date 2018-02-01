// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import commands from '../commands';
import Line from './Line';
import './terminal.scss';

class Terminal extends Component {
  state = {
    output: [],
    dir: '~/'
  }
  componentDidMount = () => {
    ipcRenderer.on('output', (x ,data) => {
      console.log('data', x ,data)
      this.state.output = this.state.output.concat(data.toString().split(/\r?\n/))
      this.setState(this.state);
    });
  }
  componentDidUpdate = () => {
    window.scrollTo(0, document.body.scrollHeight);
  }
  exec = (str: String) => {
    // this.state.output.push(str);
    const command = str.split(/\xa0/);
    if (commands[command[0]]) {
      console.log('perform known command');
      ipcRenderer.send('cd', command[1]);
    } else {
      ipcRenderer.send('exec', {
        command: str,
        dir: this.state.dir,
      });
    }
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