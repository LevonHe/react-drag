import React, { useState } from 'react';
import { Tabs, Icon } from 'antd';
import { connect } from 'dva';
import ComponentList from '../components/ComponentList';
import TemplateList from '../components/TemplateList';
import DragCanvas from '../components/DragCanvas';
import ComponentConfig from '../components/ComponentConfig';
import ActionMenu from '../components/ActionMemu';

const { TabPane } = Tabs;

const IndexView = (props) => {
  const { dispatch } = props;
  const [comListHidden, setComListHidden] = useState(true);

  const handleMouseEnter = () => {
    setComListHidden(false);
  };

  const handleMouseLeave = () => {
    setComListHidden(true);
  };

  return (
    <div className="container">
      <div className="main-container">
        <div className="header">
          <div className="btn-list">
            <div className="logo">
              <img
                src="/statics/favicon.ico"
                style={{ height: '40px', verticalAlign: 'middle', marginRight: '10px' }}
              />
              Drag
            </div>
            <div className="operation">
              <ActionMenu active="/drag" />
            </div>
            <div className="user-center"></div>
          </div>
        </div>

        <div className="content">
          <div className="settings">
            <span onMouseEnter={handleMouseEnter}>
              <Icon type="plus-circle" style={{ fontSize: '16px', color: '#fff', curosr: 'pointer' }} />
              添加内容
            </span>
          </div>
          <div className="editRegion">
            <div className={comListHidden ? 'component-list hidden' : 'component-list'} onMouseLeave={handleMouseLeave}>
              <Tabs tabBarStyle={{ textAlign: 'center' }}>
                <TabPane tab="基础组件" key="1">
                  <div style={{ textAlign: 'center', height: 'calc(100vh - 124px)', overflowY: 'scroll' }}>
                    <ComponentList></ComponentList>
                  </div>
                </TabPane>
                <TabPane tab="组件模板" key="2">
                  <div style={{ textAlign: 'center', height: 'calc(100vh - 124px)', overflowY: 'scroll' }}>
                    <TemplateList></TemplateList>
                  </div>
                </TabPane>
              </Tabs>
            </div>
            <div className="dragRegion">
              <DragCanvas isPage={true}></DragCanvas>
            </div>
          </div>
          <div className="right-container">
            <div className="title">属性编辑区</div>
            <ComponentConfig isPage={true}></ComponentConfig>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ drag }) => ({
  currentView: drag.currentView,
}))(IndexView);
