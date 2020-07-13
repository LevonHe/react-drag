import React, { useState } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import './Card.less';

const Card = (props) => {
  const { info, dispatch } = props;
  const { com_name, com_description, file_path, id } = info;

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = (e) => {
    setVisible(false);
  };

  const PageJumpToDetail = () => {
    this.props.history.push(`/${id}/componentDrag`);
  };

  return (
    <div className="card-container">
      <div className="path-container">
        <img src={file_path} />
      </div>
      <div className="name-container">
        <h4>{com_name}</h4>
        <div className="description">{com_description}</div>
      </div>
      <div>
        <div className="operation-container">
          <span onClick={PageJumpToDetail}>更新</span>
          <span onClick={showModal}>预览</span>
          <span>设置</span>
        </div>
        <Modal visible={visible} onOk={handleOk} onCancel={handleCancel} footer={null}>
          <div>
            <img style={{ width: '400px' }} src={file_path} />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default connect(() => ({}))(withRouter(Card));
