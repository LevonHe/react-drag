import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tabs, Empty } from 'antd';
import Card from '../components/Card';

const { TabPane } = Tabs;

const Square = (props) => {
  const { personalList, publicList, organizationList, dispatch } = props;

  useEffect(() => {
    dispatch({
      type: 'components/getPersonalComponents',
    });
    dispatch({
      type: 'components/getPublicComponents',
    });
    dispatch({
      type: 'components/getOrganizationComponents',
    });
  }, []);

  const renderList = (list) => {
    if (!list || !list.length) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Empty description="暂无组件"></Empty>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {list.map((item) => (
          <Card info={item} key={item.id}></Card>
        ))}
      </div>
    );
  };

  return (
    <div className="component-square">
      <div className="edit-region">
        <div className="drag-region">
          <Tabs>
            <TabPane tab="个人组件" key="1">
              {renderList(personalList)}
            </TabPane>
            <TabPane tab="公共组件" key="2">
              {renderList(publicList)}
            </TabPane>
            <TabPane tab="组织组件" key="3">
              {renderList(organizationList)}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default connect(({ components }) => ({
  personalList: components.personalList,
  publicList: components.publicList,
  organizationList: components.organizationList,
}))(Square);
