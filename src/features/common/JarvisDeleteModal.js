import React from 'react';
import { Button, Icon, Table } from 'antd';
import * as _ from 'lodash';
import intl from 'react-intl-universal';
import withDialog from './WithDialog';

export class JarvisDeleteModal extends React.Component {
  onOk = _.debounce(
    () => {
      this.props.onClose();
      this.props.onOk();
    },
    300,
    {
      leading: true,
      trailing: false,
    }
  );

  render() {
    const { deleteParam } = this.props.winData;
    const columns = [
      {
        title: intl.get('common.name'),
        textWrap: 'word-break',
        ellipsis: true,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: intl.get('common.ID'),
        textWrap: 'word-break',
        ellipsis: true,
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: intl.get('common.createTime'),
        dataIndex: 'createdAt',
        key: 'createdAt',
      },
    ];

    return (
      <div className="jarvis-delete-modal clearfix">
        <div className="jarvis-delete-text">{deleteParam.text}</div>
        <div className="jarvis-delete-tip">
          <Icon
            style={{ color: '#faad14', fontSize: 26, verticalAlign: 'middle' }}
            type="exclamation-circle"
            theme="filled"
          />
          <span>{deleteParam.tip}</span>
        </div>
        <div className="jarvis-delete-table">
          <Table columns={columns} dataSource={deleteParam.dataSource} pagination={false}></Table>
        </div>
        <div className="jarvis-delete-footer clearfix">
          <Button className="jarvis-modleBtn" onClick={this.onOk}>
            {intl.get('common.confirm')}
          </Button>
          <Button className="jarvis-modleBtn" type="primary" onClick={this.props.onClose}>
            {intl.get('common.cancel')}
          </Button>
        </div>
      </div>
    );
  }
}

const withDialogJarvisDeleteModal = withDialog(JarvisDeleteModal);
export default withDialogJarvisDeleteModal;
