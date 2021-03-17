/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-shadow */
/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-trailing-spaces */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { formateDate } from '../../utils/dateUtils';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import menuList from '../../config/menuConfig';
import './index.less';

function Header(props) {
  // current time
  const [currentTime, setCurrentTime] = useState(formateDate(Date.now()));
  // update current time
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(formateDate(Date.now()));
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  // greeting message
  const { username } = memoryUtils.user;

  // dynamic title
  const path = props.location.pathname;
  let title = '';
  menuList.forEach((item) => {
    if (item.key === path) {
      title = item.title;
    } else if (item.children) {
      const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
      if (cItem) {
        title = cItem.title;
      }
    }
  });

  // logout
  const { confirm } = Modal;

  const logout = () => {
    confirm({
      title: 'Do you Want to logout?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        storageUtils.removeUser();
        memoryUtils.user = {};

        props.history.replace('/login');
      },
    });
  };

  return (
    <div className="header">
      <div className="header-top">
        Welcome,
        <span> {username}</span>
        <Button type="link" onClick={logout}>Logout</Button>
      </div>
      <div className="header-bottom">
        <div className="header-bottom-left">
          {title}
        </div>
        <div className="header-bottom-right">
          <span>{currentTime}</span>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Header);
