import React from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import './menu.less';

const ActionMenu = (props) => {
  const { active, dispatch, currentView } = props;

  const menu = [
    {
      title: '页面编辑',
      type: 'url',
      url: '/drag',
      icon: 'highlight',
    },
    {
      title: '组件广场',
      type: 'url',
      url: '/comsquare',
      icon: 'appstore',
    },
    {
      title: '组织广场',
      type: 'url',
      url: '/org',
      icon: 'team',
    },
    {
      title: '保存页面',
      type: 'request',
      icon: 'check-circle',
      render: () => {
        dispatch({
          type: 'drag/putPageCode',
          payload: { code: currentView },
        });
      },
      includes: ['/drag'],
      excludes: ['/codePreview', '/org', 'comsquare'],
    },
    {
      title: '代码预览',
      url: '/codePreview',
      icon: 'sync',
      type: 'url',
      excludes: ['/org', '/comsquare'],
    },
  ];

  const getMenu = () => {
    const filterMenu = menu.filter((item) => {
      let flag = true;
      if (item.includes) {
        flag = item.includes.includes(active);
      }
      if (item.exclude) {
        flag = !item.excludes.includes(active);
      }
      return flag;
    });
    return filterMenu;
  };

  const handleUrl = (url) => {
    dispatch(routerRedux.push(url));
  };

  const handleRequest = (render) => {
    render();
  };

  const handleClick = (item) => {
    switch (item.type) {
      case 'url':
        handleUrl(item.url);
        break;
      case 'request':
        handleRequest(item.render);
        break;
      default:
        handleUrl(item.url);
    }
  };

  return (
    <>
      {getMenu().map((item) => (
        <div
          className="btn"
          style={{ color: item.url === active ? '#1890ff' : '' }}
          onClick={() => handleClick(item)}
          key={item.title}
        >
          <Icon type={item.icon} style={{ fontSize: '22xp' }}></Icon>
          {item.title}
        </div>
      ))}
    </>
  );
};

export default connect(({ drag }) => ({
  currentView: drag.currentView,
}))(ActionMenu);
