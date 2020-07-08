import React from 'react';
import { Icon } from 'antd';

export default class JarvisRefreshBtn extends React.PureComponent {
  render() {
    return (
      <div className="jarvis-refresh-container" onClick={this.props.onClick}>
        <Icon className="jarvis-refresh-btn" type="redo" />
      </div>
    );
  }
}
