import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { List } from 'antd';
import { connect } from 'dva';
import { APPLICATION_TYPE } from '@/util/businessTypes';

const OrgAll = (props) => {
  const { dispatch, orgList } = props;

  useEffect(() => {
    dispatch({
      type: 'organization/getOrganizationList',
    });
  }, []);

  const apply = (item) => {
    dispatch({
      type: 'organization/postApplication',
      payload: {
        org_id: item.id,
        to_id: item.user_id,
        apply_status: 'PENDING',
      },
    }).then((res) => {
      dispatch({
        type: 'organization/getOrganizationList',
      });
    });
  };

  const RenderIcon = ({ item }) => {
    const status = item.user_status;
    if (status === 'true') {
      return <span style={{ cursor: 'text' }}>已在组织</span>;
    }
    if (item.apply_status === null) {
      return <a onClick={() => apply(item)}>申请加入</a>;
    }
    const st = APPLICATION_TYPE.find((i) => i.key === item.apply_status);
    const value = st ? intl.get(st.value) : item.apply_status;
    return <span style={{ cursor: 'text' }}>{value}</span>;
  };

  return (
    <div>
      <div>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{ pageSize: 5 }}
          dataSource={orgList}
          renderItem={(item) => (
            <List.Item
              key={item.org_name}
              actions={[<RenderIcon item={item} />]}
              extra={
                <img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />
              }
            >
              <List.Item.Meta title={<a>{item.org_name}</a>} description={item.org_description}></List.Item.Meta>
            </List.Item>
          )}
        ></List>
      </div>
    </div>
  );
};

export default connect(({ organization }) => ({
  orgList: organization.list,
}))(OrgAll);
