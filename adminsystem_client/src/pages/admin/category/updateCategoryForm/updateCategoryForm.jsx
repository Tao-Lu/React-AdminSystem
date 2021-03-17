/* eslint-disable no-console */
import React from 'react';
import {
  Modal, Form, Input,
} from 'antd';

export default function updateCategoryForm(props) {
  const {
    visible, onUpdate, onCancel, oldCategoryName,
  } = props;

  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="update category form"
      okText="Update"
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
            onUpdate(values);
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
          name="categoryName"
          label="category name"
          rules={[
            {
              required: true,
              message: 'Please input the new category name!',
            },
          ]}
        >
          <Input placeholder={oldCategoryName} />
        </Form.Item>
        <p>{oldCategoryName}</p>
      </Form>
    </Modal>
  );
}
