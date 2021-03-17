/* eslint-disable max-len */
/* eslint-disable comma-dangle */
/* eslint-disable arrow-parens */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React from 'react';
import {
  Modal, Form, Input,
} from 'antd';

export default function addCategoryForm(props) {
  const {
    visible, onAdd, onCancel,
  } = props;

  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="add role form"
      okText="Add"
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
          name="roleName"
          label="role name"
          rules={[
            {
              required: true,
              message: 'Please input the new role name!',
            },
          ]}
        >
          <Input placeholder="input a new role name" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
