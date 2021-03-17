/* eslint-disable react/destructuring-assignment */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
/* eslint-disable arrow-parens */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React from 'react';
import {
  Modal, Form, Input, Select,
} from 'antd';

export default function UserForm(props) {
  const {
    visible, onAdd, onCancel, roles,
  } = props;

  const selectedUser = props.selectedUser || {};

  console.log('sU', selectedUser);

  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title={selectedUser._id ? 'update user Form' : 'add user Form'}
      okText={selectedUser._id ? 'update' : 'add'}
      cancelText="Cancel"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onAdd(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item
          name="username"
          label="user name"
          rules={[
            {
              required: true,
              message: 'Please input the new user name!',
            },
          ]}
        >
          <Input placeholder={selectedUser.username} />
        </Form.Item>
        {selectedUser._id ? null : (
          <Form.Item
            name="password"
            label="password"
            rules={[
              {
                required: true,
                message: 'Please input the password!',
              },
            ]}
          >
            <Input type="password" placeholder="input a password" />
          </Form.Item>
        )}
        <Form.Item
          name="phone"
          label="phone number"
          rules={[
            {
              required: true,
              message: 'Please input the phone number!',
            },
          ]}
        >
          <Input type="number" placeholder="input phone number" />
        </Form.Item>
        <Form.Item
          name="email"
          label="email"
          rules={[
            {
              required: true,
              message: 'Please input the email',
            },
            {
              type: 'email',
              message: 'please input a correct email'
            },
          ]}
        >
          <Input type="email" placeholder="input an email" />
        </Form.Item>
        <Form.Item
          name="role_id"
          label="user role"
          rules={[
            {
              required: true,
              message: 'Please select a role',
            },
          ]}
        >
          <Select placeholder="please select a role">
            {
              roles.map((role) => {
                return (
                  <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
                );
              })
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
