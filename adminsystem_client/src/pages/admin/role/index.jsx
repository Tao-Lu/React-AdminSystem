/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
import React, { useState, useEffect } from 'react';
import {
  Card, Button, Table, message,
} from 'antd';

import { PAGE_SIZE } from '../../../utils/constants';
import { reqRoles, reqAddRole, reqUpdateRole } from '../../../api';
import AddRoleForm from './addRoleForm/addRoleForm';
import SetAuthTree from './setAuthTree/setAuthTree';
import memoryUtils from '../../../utils/memoryUtils';
import storageUtils from '../../../utils/storageUtils';
import { formateDate } from '../../../utils/dateUtils';

export default function Role(props) {
  const [roles, setroles] = useState([]); // role list
  const [selectedRole, setselectedRole] = useState({}); // selected role
  const [isShowAdd, setisShowAdd] = useState(false);
  const [isShowAuth, setisShowAuth] = useState(false);

  const getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      const newRoles = result.data;
      setroles(newRoles);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const title = (
    <span>
      <Button style={{ marginRight: 20 }} type="primary" onClick={() => setisShowAdd(true)}>Create Role</Button>
      <Button type="primary" disabled={!selectedRole._id} onClick={() => setisShowAuth(true)}>Set Role Permission</Button>
    </span>
  );

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
    },
    {
      title: 'Created Time',
      dataIndex: 'create_time',
      render: (create_time) => formateDate(create_time),
    },
    {
      title: 'Authorization Time',
      dataIndex: 'auth_time',
      render: (auth_time) => formateDate(auth_time),
    },
    {
      title: 'Authorization name',
      dataIndex: 'auth_name',
    },
  ];

  const onRow = (role) => {
    return {
      onClick: () => {
        setselectedRole(role);
      },
    };
  };

  // add a new role
  const onAdd = async (values) => {
    const { roleName } = values;

    // request to add the category
    const result = await reqAddRole(roleName);
    if (result.status === 0) {
      const role = result.data;
      setroles(() => {
        return [...roles, role];
      });

      message.success('create role successfully');
    } else {
      message.error('create role failed');
    }

    // hide update category form
    setisShowAdd(false);
  };

  // set auth (permission)
  const onSet = async (menus) => {
    selectedRole.menus = menus;
    selectedRole.auth_time = Date.now();
    selectedRole.auth_name = memoryUtils.user.username;

    // console.log('select', selectedRole);
    // console.log('authname', memoryUtils.user.username);
    // console.log('roles', roles);

    const result = await reqUpdateRole(selectedRole);
    if (result.status === 0) {
      // if update the current user's role
      // force to re-login
      if (selectedRole._id === memoryUtils.user.role_id) {
        message.success("update current user's role successfully, please login again");
        memoryUtils.user = {};
        storageUtils.removeUser();
        props.history.replace('/login');
      } else {
        message.success('update role successfully');
      }
    } else {
      message.error('update role failed');
    }

    setisShowAuth(false);
  };

  return (
    <Card title={title}>
      <Table
        bordered
        rowKey="_id"
        dataSource={roles}
        columns={columns}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: [selectedRole._id],
          onSelect: (role) => {
            setselectedRole(role);
          },
        }}
        pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
        onRow={onRow}
      />
      <AddRoleForm
        visible={isShowAdd}
        onAdd={onAdd}
        onCancel={() => { setisShowAdd(false); }}
      />
      <SetAuthTree
        visible={isShowAuth}
        onSet={onSet}
        onCancel={() => { setisShowAuth(false); }}
        selectedRole={selectedRole}
      />
    </Card>
  );
}
