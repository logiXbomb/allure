// @flow
import React, { Component } from 'react';
import './line.scss';

const highlight = str => ({
  __html: `${str.replace(/\b(function|git)/gmi, '<span style="color: #00ffec;">$1</span>')}<div class="cursor"></div>`
});

class Line extends Component {
  state = {
    syntax: [
      <div className="active-line"><div className="cursor"></div></div>
    ],
    raw: '',
  }
  componentDidMount = () => {
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      const newRaw = this.parseLine(this.state.raw, event.key);
      this.state.raw = newRaw;
      this.state.syntax[0] = <div className="active-line" dangerouslySetInnerHTML={highlight(newRaw)}></div>
      this.setState(this.state);

    })
  }
  execLine = (str: String) => {
    this.props.exec(str);
  }
  parseLine = (str: String, key: String) => {
    if (key === 'Enter') {
      this.execLine(str);
      return '';
    }
    if (key === 'Shift') {
      return str;
    }
    if (key === 'Backspace') {
      return str.substring(0, str.length - 1);
    }
    return `${str}${key === ' ' ? '\xa0' : key}`;
  }
  render() {
    const { syntax, raw } = this.state;
    return <div className="line">
      {syntax}
    </div>
  }
}

export default Line;