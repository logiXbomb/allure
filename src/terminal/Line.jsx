// @flow
import React, { Component } from 'react';
import './line.scss';

class Line extends Component {
  state = {
    syntax: [
      <div className="active-line"><span>waffles are great</span><div className="cursor"></div></div>
    ],
    raw: 'waffles are great',
  }
  componentDidMount = () => {
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      console.log(key === ' ')
      const newRaw = `${this.state.raw}${this.parseLine(event.key)}`;
      this.state.raw = newRaw;
      this.state.syntax[0] = <div className="active-line"><span>{newRaw}</span><div className="cursor"></div></div>
      this.setState(this.state);

    })
  }
  parseLine = (key: String) => {
    if (key === 'Shift') {
      return '';
    }
    return key === ' ' ? '\xa0' : key;
  }
  render() {
    const { syntax, raw } = this.state;
    return <div className="line">
      {syntax}
    </div>
  }
}

export default Line;