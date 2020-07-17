import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import OrgAll from './OrgAll';
import Personal from './Personal';
import Application from './Application';
import './OrganizationSquare.less';

const { TabPane } = Tabs;

const Square = (props) => (
  <div className="organization-quare">
    <div className="edit-region">
      <div className="drag-region">
        <Tabs>
          <TabPane tab="所有" key="1">
            <div style={{ padding: '0 20px' }}>
              <OrgAll></OrgAll>
            </div>
          </TabPane>
          <TabPane tab="个人" key="2">
            <div style={{ padding: '0 20px' }}>
              <Personal></Personal>
            </div>
          </TabPane>
          <TabPane tab="申请" key="3">
            <div style={{ padding: '0 20px' }}>
              <Application></Application>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
);

export default connect(() => ({}))(Square);
