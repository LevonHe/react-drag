import React from 'react';
import { Spin } from 'antd';
import intl from 'react-intl-universal';

export default class Loading extends React.Component {
  render() {
    return (
      <div className="jarvis-loading">
        <Spin tip={intl.get('common.loading')} size="large"></Spin>
      </div>
    );
  }
}
