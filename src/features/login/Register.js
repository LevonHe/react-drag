import React from 'react';
import { NavLink } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';

const Register = (props) => {
  const { form, dispatch } = props;
  const { getFieldDecorator } = form;

  const submitRegister = (e) => {
    props.form.validateFields((err, formValue) => {
      if (err) return;
      const payload = {
        username: formValue.username,
        password: formValue.password,
      };
      dispatch({
        type: 'user/register',
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
          <h2>注册</h2>
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
              <Form.Item>
                {getFieldDecorator('repassword', {
                  rules: [{ required: true, message: '请输入二次确认密码' }],
                })(<Input.Password placeholder="请再次输入密码" />)}
              </Form.Item>
              <Button type="primary" htmlType="submit" onClick={submitRegister} className="btn">
                注册
              </Button>
              <NavLink to="/login" class="link">
                登录
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
}))(Form.create()(Register));
