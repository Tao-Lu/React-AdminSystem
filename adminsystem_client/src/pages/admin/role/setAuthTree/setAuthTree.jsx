/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
/* eslint-disable arrow-parens */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  Modal, Form, Input, Tree,
} from 'antd';
import menuList from '../../../../config/menuConfig';

export default function SetAuthTree(props) {
  const {
    visible, onSet, onCancel, selectedRole,
  } = props;

  const [checkedKeys, setcheckedKeys] = useState();

  useEffect(() => {
    setcheckedKeys(selectedRole.menus);
  }, [selectedRole]);

  const getMenus = () => {
    return checkedKeys;
  };

  // Tree onSelect
  const onCheck = (newCheckedKeys) => {
    setcheckedKeys(newCheckedKeys);
    // console.log('newCheckedKeys', newCheckedKeys);
  };

  // get tree node
  const getTreeNodes = (menus) => {
    return menus.reduce((pre, item) => {
      const { title, key } = item;
      const children = item.children ? getTreeNodes(item.children) : null;
      pre.push(
        {
          title,
          key,
          children,
        }
      );
      return pre;
    }, []);
  };

  // Tree onSelect
  const treeData = [
    {
      title: 'Permission',
      key: '0-0-0',
      disabled: true,
      children: getTreeNodes(menuList),
    }
  ];

  return (
    <Modal
      visible={visible}
      title="set Auth tree"
      okText="Set"
      cancelText="Cancel"
      onCancel={() => {
        setcheckedKeys(selectedRole.menus);
        onCancel();
      }}
      onOk={(values) => {
        onSet(getMenus());
      }}
    >
      <Form.Item
        label="role Auth"
      >
        <Input value={selectedRole.name} disabled />
      </Form.Item>
      <Form.Item>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          treeData={treeData}
        />
      </Form.Item>
    </Modal>
  );
}
