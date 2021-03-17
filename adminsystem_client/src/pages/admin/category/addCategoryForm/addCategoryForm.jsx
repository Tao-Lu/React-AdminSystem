/* eslint-disable max-len */
/* eslint-disable comma-dangle */
/* eslint-disable arrow-parens */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React from 'react';
import {
  Modal, Form, Input, Select,
} from 'antd';

export default function addCategoryForm(props) {
  const {
    visible, onAdd, onCancel, allParentCategories, // parentId,
  } = props;

  // console.log('c', allParentCategories);
  // console.log('id', parentId);

  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="add category form"
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
          name="parentCategoryIdName"
          label="parent category name"
          rules={[
            {
              required: true,
              message: 'Please select a parent category name!',
            },
          ]}
        >
          <Select placeholder="select a parent category">
            <Select.Option key="0" value={['Root Level', '0']}>Root Level</Select.Option>
            {
              allParentCategories.map(category => <Select.Option key={category._id} value={[category.name, category._id]}>{category.name}</Select.Option>)
            }
          </Select>
        </Form.Item>
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
          <Input placeholder="input a new category name" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
