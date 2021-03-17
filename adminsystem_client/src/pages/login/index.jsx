/* eslint-disable no-underscore-dangle */
// library
import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  Form, Input, Button, Checkbox, message,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api/index';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
// css
import './index.less';
// image
import logo from '../../assets/images/logo.png';

export default function Login(props) {
  const memoryUser = memoryUtils.user;
  if (memoryUser && memoryUser._id) {
    return (
      <Redirect to="/" />
    );
  }

  const onFinish = async (values) => {
    const { username, password } = values;
    const result = await reqLogin(username, password);
    if (result.status === 0) {
      message.success('login success');
      const user = result.data;
      memoryUtils.user = user; // save the user to memory
      storageUtils.saveUser(user); // save the user to local storage
      // eslint-disable-next-line react/prop-types
      props.history.replace('/');
    } else {
      message.error(result.msg);
    }
  };

  return (
    <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo" />
        <h1>React Project: Admin System</h1>
      </header>
      <section className="login-content">
        <h2>User Login</h2>
        <Form
          name="login-form"
          className="login-form"
          initialValues={{ remember: false }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
              {
                min: 3,
                max: 12,
                message: 'Username must be between 3 and 12 characters',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
              {
                min: 3,
                max: 12,
                message: 'Password must be between 3 and 12 characters',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="/forgetpassword">
              Forgot password
            </a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or
            <a href="/register"> register now!</a>
          </Form.Item>
        </Form>
      </section>
    </div>
  );
}
