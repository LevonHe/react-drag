import React from 'react';
import { connect } from 'dva';
import { Dropdown, Menu, Icon } from 'antd';

const UserMenu = (props) => {
  const onMenuClick = (evt) => {
    const { key } = evt;
    const { dispatch } = props;

    if (key === 'logout') {
      if (dispatch) {
        dispatch({
          type: 'user/logout',
        });
      }
    }
  };

  const menu = () => (
    <Menu onClick={onMenuClick}>
      <Menu.Item key="logout">退出登录</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div>
        <Icon type="user" style={{ fontSize: '22px', marginRight: '5px' }} />
        <span className="margin-right-5">用户中心</span>
        <Icon type="down" />
      </div>
    </Dropdown>
  );
};

export default connect(() => ({}))(UserMenu);
