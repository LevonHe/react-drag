import React from 'react';
import { Tabs } from 'antd';
import ComponentList from '../components/ComponentList';
import TemplateList from '../components/TemplateList';
import DragCanvas from '../components/DragCanvas';
import ComponentConfig from '../components/ComponentConfig';

const { TabPane } = Tabs;

class DragView extends React.Component {
  state = {
    comListHidden: false,
  };

  componentDidMount() {}

  componentWillUnmount() {
    this.setState = () => false;
  }

  toggleComponentList = () => {
    this.setState({
      comListHidden: !this.state.comListHidden,
    });
  };

  render() {
    return (
      <div className="content">
        <div className="editRegion">
          <div className="cls">
            <Tabs>
              <TabPane tab="基础组件" key="1">
                <div style={{ height: '80vh', overflowY: 'scroll' }}>
                  <ComponentList></ComponentList>
                </div>
              </TabPane>
              <TabPane tab="组件模板" key="2">
                <div style={{ height: '80vh', overflowY: 'scroll' }}>
                  <TemplateList></TemplateList>
                </div>
              </TabPane>
            </Tabs>
          </div>
          <div className="dragRegion">
            <DragCanvas isPage={true}></DragCanvas>
          </div>
        </div>
        <div className="rightContainer">
          <div className="title">属性编辑区</div>
          <ComponentConfig isPage={true}></ComponentConfig>
        </div>
      </div>
    );
  }
}

export default DragView;
