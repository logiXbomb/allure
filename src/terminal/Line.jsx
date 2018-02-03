// @flow
import React, { Component } from 'react';
import './line.scss';

const getTextNodesIn = (node) => {
  var textNodes = [];
  if (node.nodeType == 3) {
    textNodes.push(node);
  } else {
    var children = node.childNodes;
    for (var i = 0, len = children.length; i < len; ++i) {
      textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
    }
  }
  return textNodes;
}

class Line extends Component {
  line;
  componentDidMount = () => {
    this.lineNumber(this.props.col);
  }
  componentWillReceiveProps = (nextProps) => {
    // if (nextProps.col !== this.props.col) {
      this.lineNumber(nextProps.col)
    // }
  }
  lineNumber = (int) => {
    const start = int;
    const end = int + 1;
    const el = this.line.firstChild;
    const range = document.createRange();
    range.selectNodeContents(el);
    const textNodes = getTextNodesIn(el);
    var foundStart = false;
    var charCount = 0, endCharCount;

    for (var i = 0, textNode; textNode = textNodes[i++];) {
      endCharCount = end;
      if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i <= textNodes.length))) {
        range.setStart(textNode, start - charCount);
        foundStart = true;
      }
      if (foundStart && end <= endCharCount) {
        range.setEnd(textNode, end - charCount);
        break;
      }
      charCount = endCharCount;
    }

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  render() {
    const { syntax } = this.props;
    return <div ref={el => { this.line = el; }} tabIndex="0" className="line">
      {syntax}
    </div>
  }
}

export default Line;