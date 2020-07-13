import React from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import MsgService from '@/util/MsgService';
import './ActionMenu.less';

class ActionMenu extends React.Component {
  getMenu = () => {
    const { active, dispatch, currentView, componentView, match, history } = this.props;
    console.log(this.props);
    const { params } = match;
    const {
      location: { pathname },
    } = history;

    const viewMenu = [
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

    const componentMenu = [
      {
        title: '组件编辑',
        type: 'url',
        icon: 'highlight',
        url: '/componentDrag',
      },
      {
        title: '组件广场',
        type: 'url',
        url: '/comsquare',
        icon: 'appstore',
      },
      {
        title: '保存到服务器',
        type: 'request',
        icon: 'check-circle',
        render() {
          if (this.componentValidator(componentView)) {
            dispatch({
              type: 'drag/putComponentCode',
              payload: {
                id: params.id,
                code: componentView,
              },
            });
          }
        },
      },
    ];

    const menu = pathname.includes('component') ? componentMenu : viewMenu;

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

  // 组件判断方法，组件不能为空
  componentValidator = (componentView) => {
    if (componentView.length === 0) {
      MsgService.error('组件不能为空');
      return false;
    }
    if (componentView.length === 1) {
      return true;
    }
    confirm({
      title: '组件必须被包裹在一个根组件下，是否自动生成外层根组件？',
      content: '当你点击ok，自动生成根组件',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const basicObj = {
          type: 'div',
          nested: true,
          props: {
            style: {
              height: '',
              width: '',
              marginTop: '',
            },
          },
          needDiv: false,
          children: [],
        };
        return new Promise((resolve, reject) => {
          const basic = basicObj;
          basic.children = componentView;
          this.props.dispatch({
            type: 'drag/setCurrentView',
            payload: [basic],
            isPage: false,
          });
          setTimeout(resolve, 100);
        }).catch(() => console.log('set current error!'));
      },
      onClick() {},
    });
    return false;
  };

  handleUrl = (url) => {
    this.props.history.push(url);
  };

  handleRequest = (render) => {
    render();
  };

  handleClick = (item) => {
    switch (item.type) {
      case 'url':
        this.handleUrl(item.url);
        break;
      case 'request':
        this.handleRequest(item.render);
        break;
      default:
        this.handleUrl(item.url);
    }
  };

  render() {
    const { active } = this.props;
    return (
      <>
        {this.getMenu().map((item) => (
          <div
            className="btn"
            style={{ color: active.includes(item.url) ? '#1890ff' : '' }}
            onClick={() => this.handleClick(item)}
            key={item.title}
          >
            <Icon type={item.icon} style={{ fontSize: '22xp' }}></Icon>
            {item.title}
          </div>
        ))}
      </>
    );
  }
}

export default connect(({ drag }) => ({
  currentView: drag.currentView,
  componentView: drag.componentView,
}))(withRouter(ActionMenu));
