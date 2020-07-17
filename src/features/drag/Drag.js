import React, { useState, useEffect } from 'react';
import { Tabs, Icon } from 'antd';
import { connect } from 'dva';
import ComponentList from '../components/ComponentList';
import TemplateList from '../components/TemplateList';
import DragCanvas from '../components/DragCanvas';
import ComponentConfig from '../components/ComponentConfig';
import './Drag.less';

const { TabPane } = Tabs;

const Drag = (props) => {
  const { dispatch } = props;
  const [comListHidden, setComListHidden] = useState(true);

  const handleMouseEnter = () => {
    setComListHidden(false);
  };

  const handleMouseLeave = () => {
    setComListHidden(true);
  };

  useEffect(() => {
    // 查询当前的 currentView
    dispatch({
      type: 'drag/getPageCode',
    });
    // 查询当前的 组织列表
    dispatch({
      type: 'organization/getOrgArr',
    });
    // 查询当前用户的可用组件列表
    dispatch({
      type: 'drag/getOwnTemplate',
    });
  }, []);

  return (
    <div className="drag-content">
      <div className="settings">
        <span onMouseEnter={handleMouseEnter}>
          <Icon type="plus-circle" style={{ fontSize: '24px' }} />
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
  );
};

export default connect(({ drag }) => ({
  currentView: drag.currentView,
}))(Drag);
