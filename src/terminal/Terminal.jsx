// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import commands from '../commands';
import Line from './Line';
import './terminal.scss';

const highlight = str => ({
  __html: `${str}\xa0`
});

class Terminal extends Component {
  terminal: Object;
  listener;
  state = {
    output: [],
    dir: '~/',
    command: {
      syntax: [
        <div className="active-line">{'\xa0'}</div>
      ],
      raw: '',
    },
    cursor: {
      line: 0,
      col: 0,
    }
  }
  componentDidMount = () => {
    console.log('---->', this)
    ipcRenderer.on(`output-${this.props.id}`, (x ,data) => {
      this.state.output = this.state.output.concat(data.toString().split(/\r?\n/));
      this.state.cursor.col = 0;
      this.setState(this.state, () => {
        this.terminal.scrollTop = this.terminal.scrollHeight;
      });
    });
    this.listener = this.terminal.addEventListener('keydown', (event: Object) => {
      const key = event.key;
      const newRaw = this.parseLine(this.state.command.raw, event);
      if (event.key === 'ArrowLeft') return;
      this.state.command.raw = newRaw;
      this.state.command.syntax[0] = <div className="active-line" dangerouslySetInnerHTML={highlight(newRaw)}></div>
      this.setState(this.state, () => {
        // if (this.state.cursor.col + 1 >= this.state.command.raw.length - 1) return;
        if (event.key !== 'ArrowRight' && event.key !== 'Backspace' && event.key !== 'Enter') {
          this.state.cursor.col = this.state.cursor.col + 1;
          this.setState(this.state);
        }
        if (event.key === 'Backspace') {
          this.state.cursor.col = this.state.cursor.col - 1;
          this.setState(this.state);
        }
      });
    });
    this.terminal.focus();
  }
  componentDidUpdate = () => {
    window.scrollTo(0, document.body.scrollHeight);
  }
  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.listener);
  }
  parseLine = (str: String, event: Object) => {
    if (event.key === 'ArrowRight' && event.metaKey) {
      this.props.addTerminal(this.terminal);
      return str;
    }
    if (event.key === 'ArrowRight') {
      console.log('lengths', this.state.cursor.col, this.state.command.raw.length)
      if (this.state.cursor.col <= this.state.command.raw.length - 1) {
        this.state.cursor.col = this.state.cursor.col + 1;
      }
      this.setState(this.state);
      return str;
    }
    if (event.key === 'ArrowLeft') {
      if (this.state.cursor.col === 0) return;
      this.state.cursor.col = this.state.cursor.col - 1;
      this.setState(this.state);
      return str;
    }
    switch (event.key) {
      case 'Meta':
        return str;
      case 'Enter':
        this.exec(str);
        return '';
      case 'Shift':
        return str;
      case 'Backspace':
        return str.substring(0, str.length - 1);
      default:
        return `${str}${event.key === ' ' ? '\xa0' : event.key}`;
    }
  }
  exec = (str: String) => {
    // this.state.output.push(str);
    if (str === 'exit') {
      this.props.removeTerminal(this.props.id);
      return;
    }
    const command = str.split(/\xa0/);
    if (commands[command[0]]) {
      ipcRenderer.send('cd', command[1]);
    } else {
      ipcRenderer.send('exec', {
        command: str,
        dir: this.props.dir,
        terminalID: this.props.id,
      });
    }
  }
  render() {
    return <div className="terminal" tabIndex="0" ref={el => { this.terminal = el; }}>
      <div className="output">
        {this.state.output.map(o => <div>{o.replace(/ /gmi, '\xa0')}</div>)}
      </div>
      <Line
        ref={el => { this.line = el; }}
        col={this.state.cursor.col}
        syntax={this.state.command.syntax}
        exec={this.exec}
      />
    </div>
  }
}

export default Terminal;