/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, message, Modal,
} from 'antd';
import {
  PlusOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

import { reqCategoryList, reqAddCategory, reqUpdateCategory } from '../../../api';
import AddCategoryForm from './addCategoryForm/addCategoryForm';
import UpdateCategoryForm from './updateCategoryForm/updateCategoryForm';
import { PAGE_SIZE } from '../../../utils/constants';

import './index.less';

export default function Category() {
  const [categories, setcategories] = useState([]);
  const [loading, setloading] = useState(false);
  const [parentId, setparentId] = useState('0');
  const [parentName, setparentName] = useState('');
  const [subCategories, setsubCategories] = useState('');
  const [showModal, setshowModal] = useState(0); // 0: none, 1: add, 2: update

  const getCategories = async () => {
    setloading(true);
    const result = await reqCategoryList(parentId);
    setloading(false);
    if (result.status === 0) {
      if (parentId === '0') {
        setcategories(result.data);
      } else {
        setsubCategories(result.data);
      }
    } else {
      message.error('get category list failed');
    }
  };

  useEffect(async () => {
    getCategories();
  }, [parentId]);

  // show category
  const showCategories = () => {
    setparentId('0');
    setparentName('');
    setsubCategories([]);
  };

  // Card's title
  const title = parentId === '0' ? 'Root Level' : (
    <span>
      <Button type="link" onClick={() => { showCategories(); }}>Root Level</Button>
      <ArrowRightOutlined style={{ marginRight: 10 }} />
      <span>{parentName}</span>
    </span>
  );

  // Card's extra
  const extra = (<Button type="primary" icon={<PlusOutlined />} onClick={() => { setshowModal(1); }}>Add</Button>);

  const [clickedUpdateCategory, setclickedUpdateCategory] = useState('');

  // show update category form
  const showUpdateCategoryForm = (category) => {
    setshowModal(2);
    setclickedUpdateCategory(category);
  };

  // show sub category
  const showSubCategory = (category) => {
    setparentId(category._id);
    setparentName(category.name);
  };

  // Table's columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (category) => (
        <Space size="middle">
          <Button type="link" onClick={() => { showUpdateCategoryForm(category); }}>Modify</Button>
          { parentId === '0' ? (<Button type="link" onClick={() => { showSubCategory(category); }}>sub Category</Button>) : null }
        </Space>
      ),
      width: 300,
    },
  ];

  // add a new category
  const onAdd = async (values) => {
    const { categoryName, parentCategoryIdName } = values;
    const id = parentCategoryIdName[1];
    const name = parentCategoryIdName[0];

    // request to add the category
    const result = await reqAddCategory(categoryName, id);
    if (result.status === 0) {
      if (parentId === id) {
        getCategories();
      } else {
        setparentId(id);
        setparentName(name);
      }
    }
    // hide update category form
    setshowModal(0);
  };

  // update a category
  const onUpdate = async (values) => {
    // console.log('Received values of form: ', values);
    const categoryId = clickedUpdateCategory._id;
    const { categoryName } = values;

    // request to update the category
    const result = await reqUpdateCategory(categoryId, categoryName);
    if (result.status === 0) {
      getCategories();
    }
    // hide update category form
    setshowModal(0);
  };

  return (
    <Card title={title} extra={extra}>
      <Table
        bordered
        rowKey="_id"
        loading={loading}
        pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
        dataSource={parentId === '0' ? categories : subCategories}
        columns={columns}
      />

      {/* add */}
      <AddCategoryForm
        visible={showModal === 1}
        onAdd={onAdd}
        onCancel={() => { setshowModal(0); }}
        allParentCategories={categories}
        parentId={parentId}
      />

      {/* update */}
      <UpdateCategoryForm
        visible={showModal === 2}
        onUpdate={onUpdate}
        onCancel={() => { setshowModal(0); }}
        oldCategoryName={clickedUpdateCategory.name}
      />

    </Card>
  );
}
