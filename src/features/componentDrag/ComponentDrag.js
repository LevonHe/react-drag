import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Icon, Tabs } from 'antd';
import ComponentList from '../components/ComponentList';
import DragCanvas from '../components/DragCanvas';
import ComponentConfig from '../components/ComponentConfig';
import '../drag/Drag.less';

const { TabPane } = Tabs;

const View = (props) => {
  const { dispatch, componentView, match } = props;
  const { params } = match;

  const [comListHidden, setComListHidden] = useState(false);

  const handleMouseEnter = () => {
    setComListHidden(false);
  };

  const handleMouseLeave = () => {
    setComListHidden(true);
  };

  useEffect(() => {
    dispatch({
      type: 'drag/getComponentCode',
      payload: {
        id: params.id,
      },
    });
  }, []);

  return (
    <div className="drag-content">
      <div className="settings">
        <span onMouseEnter={handleMouseEnter}>
          <Icon type="smile" style={{ fontSize: '24px' }}></Icon>
          添加内容
        </span>
      </div>
      <div className="editRegion">
        <div className={comListHidden ? 'component-list hidden' : 'component-list'} onMouseLeave={handleMouseLeave}>
          <Tabs tabBarStyle={{ textAlign: 'center' }}>
            <TabPane tab="公共组件" key="1">
              <div style={{ textAlign: 'center', height: 'calc(100vh - 124px)', overflowY: 'scroll' }}>
                <ComponentList></ComponentList>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div className="dragRegion">
          <DragCanvas isPage={false}></DragCanvas>
        </div>
      </div>
      <div className="right-container">
        <div className="title">属性编辑区</div>
        <ComponentConfig isPage={false}></ComponentConfig>
      </div>
    </div>
  );
};

export default connect(({ drag }) => ({
  componentView: drag.componentView,
}))(View);
