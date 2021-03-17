/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-self-compare */
/* eslint-disable camelcase */
import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Button, Table, Modal, message,
} from 'antd';
import { PAGE_SIZE } from '../../../utils/constants';
import { formateDate } from '../../../utils/dateUtils';
import UserForm from './userForm/userForm';
import { reqUsers, reqDeleteUser, reqAddorUpdateUser } from '../../../api';

export default function User() {
  const [loading, setloading] = useState(false);
  const [users, setusers] = useState([]);
  const [roles, setroles] = useState([]);
  const [isShow, setisShow] = useState(false);
  const [selectedUser, setselectedUser] = useState();
  const roleNames = useRef();

  const title = <Button type="primary" onClick={() => { setisShow(true); setselectedUser(); }}>Create User</Button>;

  // [role._id: role.name]
  const initRoleNames = (initRoles) => {
    const roleNamesObj = initRoles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});

    roleNames.current = roleNamesObj;
  };

  const getUsers = async () => {
    setloading(true);
    const result = await reqUsers();
    setloading(false);

    if (result.status === 0) {
      const newUsers = result.data.users;
      const newRoles = result.data.roles;
      initRoleNames(newRoles);
      // users and roles
      setusers(newUsers);
      setroles(newRoles);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = (user) => {
    Modal.confirm({
      title: `Confirm to delete ${user.username} ?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success('delete user successfully');
          getUsers();
        }
      },
    });
  };

  const modifyUser = (user) => {
    setselectedUser(user);
    setisShow(true);
  };

  const columns = [
    {
      title: 'user name',
      dataIndex: 'username',
    },
    {
      title: 'user email',
      dataIndex: 'email',
    },
    {
      title: 'user phone',
      dataIndex: 'phone',
    },
    {
      title: 'create time',
      dataIndex: 'create_time',
      render: (create_time) => formateDate(create_time),
    },
    {
      title: 'user role',
      dataIndex: 'role_id',
      render: (role_id) => roleNames.current[role_id],
    },
    {
      title: 'Actions',
      render: (user) => (
        <span>
          <Button type="link" onClick={() => modifyUser(user)}>modify</Button>
          <Button type="link" onClick={() => deleteUser(user)}>delete</Button>
        </span>
      ),
    },
  ];

  // add or update a user
  const onAddOrUpdateUser = async (values) => {
    // console.log('values', values);
    // const {
    //   email, password, phone, role_id, username,
    // } = values;
    if (selectedUser) {
      values._id = selectedUser._id;
    }

    const result = await reqAddorUpdateUser(values);
    if (result.status === 0) {
      message.success(`${selectedUser ? 'update user successfully' : 'add user successfully'}`);
      getUsers();
    } else {
      message.error('add user failed');
    }

    // hide update category form
    setisShow(false);
  };

  return (
    <Card title={title}>
      <Table
        bordered
        rowKey="_id"
        loading={loading}
        pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
        dataSource={users}
        columns={columns}
      />

      {/* add */}
      <UserForm
        visible={isShow}
        onAdd={onAddOrUpdateUser}
        onCancel={() => { setisShow(false); }}
        roles={roles}
        selectedUser={selectedUser}
      />

    </Card>
  );
}
