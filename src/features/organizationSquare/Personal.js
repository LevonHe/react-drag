import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { List, Button, Modal, Form, Input } from 'antd';

const { TextArea } = Input;

const Personal = (props) => {
  const { dispatch, orgList, form } = props;
  const { getFieldDecorator } = form;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'organization/getPersonalOrganizationList',
    });
  }, []);

  const RenderIcon = ({ item }) => {
    const status = item.user_status;
    if (status === 'true') {
      return <span>已在组织</span>;
    }
    return null;
  };

  const createOrginzation = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const submitForm = (e) => {
    props.form.validateFields((err, value) => {
      if (err) return;
      const payload = {
        orgName: value.orgName,
        orgDescription: value.orgDescription,
      };
      dispatch({
        type: 'organization/createOrganization',
        payload,
      }).then(() => {
        hideModal();
        dispatch({
          type: 'organization/getPersonalOrganizationList',
        });
      });
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={createOrginzation}>
          创建组织
        </Button>
      </div>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{ pageSize: 2 }}
        dataSource={orgList}
        renderItem={(item) => (
          <List.Item
            key={item.org_name}
            actions={[<RenderIcon item={item} />]}
            extra={
              <img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />
            }
          >
            <List.Item.Meta title={<a>{item.org_name}</a>} description={item.org_description} />
          </List.Item>
        )}
      ></List>
      <Modal
        width="50%"
        title="创建组织"
        visible={visible}
        onOk={submitForm}
        onCancel={hideModal}
        okText="确认"
        cancelText="取消"
        destroyOnClose={true}
      >
        <div>
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
            <Form.Item label="组织名称">
              {getFieldDecorator('orgName', {
                rules: [{ required: true, message: '请输入组件名称' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="组织描述">
              {getFieldDecorator('orgDescription', {
                rules: [{ required: true, message: '请输入组织描述' }],
              })(<TextArea />)}
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ organization }) => ({
  orgList: organization.mylist,
}))(Form.create()(Personal));
