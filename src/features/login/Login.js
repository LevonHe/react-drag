import React from 'react';
import { NavLink } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';
import './Login.less';

const Login = (props) => {
  const { form, dispatch } = props;
  const { getFieldDecorator } = form;

  const submitForm = (e) => {
    props.form.validateFields((err, formValue) => {
      if (err) return;
      const payload = {
        username: formValue.username,
        password: formValue.password,
      };
      dispatch({
        type: 'user/login',
        payload,
      });
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="title">
          <h2>Web组件化平台</h2>
        </div>
        <div className="loginForm">
          <h2>登录</h2>
          <div className="form">
            <Form>
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入用户名' }],
                })(<Input placeholder="请输入用户名" />)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }],
                })(<Input.Password placeholder="请输入密码" />)}
              </Form.Item>
              <Button type="primary" htmlType="submit" onClick={submitForm} className="btn">
                登录
              </Button>
              <NavLink to="/register" class="link">
                注册
              </NavLink>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ drag }) => ({
  currentView: drag.currentView,
}))(Form.create()(Login));
