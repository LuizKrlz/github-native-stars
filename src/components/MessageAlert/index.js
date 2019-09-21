import React, { Component } from 'react';

import { Message } from './styles';

class MessageAlert extends Component {
  componentDidMount() {
    const { onDestroy } = this.props;

    onDestroy && onDestroy();
  }

  render() {
    return <Message>{this.props.children}</Message>;
  }
}

export default MessageAlert;
