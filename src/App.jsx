// @flow
import React, { Component } from 'react';
import short from 'short-uuid';
import Terminal from './terminal';
import './app.scss';

class App extends Component {
  state = {
    terminals: [],
  }
  componentDidMount = () => {
    this.addTerminal();
  }
  addTerminal = (obj) => {
    if (obj) {
      console.log('---->', obj.offsetWidth);
      window.resizeBy(obj.offsetWidth, 0);
    }
    this.state.terminals.push({
      id: short.uuid(),
      dir: '',
    });
    this.setState(this.state);
  }
  removeTerminal = id => {
    this.state.terminals = this.state.terminals.filter(t => t.id !== id);
    this.setState(this.state);
  }
  render() {
    return <div className="app">
      {this.state.terminals.map(t => 
        <Terminal
          key={t.id}
          addTerminal={this.addTerminal}
          removeTerminal={this.removeTerminal}
          id={t.id}
          dir={t.dir}
        />
      )}
    </div>
  }
}

export default App;