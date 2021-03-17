/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-parens */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-else-return */
import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import menuList from '../../config/menuConfig';
import memoryUtils from '../../utils/memoryUtils';

import './index.less';

import logo from '../../assets/images/logo.png';

const { SubMenu } = Menu;

function LeftNav(props) {
  // get pathname from url
  // used for highlighting leftNav selection
  let path = props.location.pathname;
  if (path.indexOf('/product') === 0) {
    path = '/product';
  }
  let openKey = '';

  // is login user has permission to access menus
  const hasAuth = (item) => {
    const { key, isPublic } = item;

    const menus = memoryUtils.user.role.menus;
    const username = memoryUtils.user.username;

    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      return !!item.children.find(child => menus.indexOf(child.key) !== -1);
    }

    return false;
  };

  const getMenuNodes = (items) => {
    return items.reduce((pre, item) => {
      if (hasAuth(item)) {
        if (!item.children) {
          pre.push((
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.title}</Link>
            </Menu.Item>
          ));
        } else {
          const isSelected = item.children.find((cItem) => path.indexOf(cItem.key) === 0);
          if (isSelected) {
            openKey = item.key;
          }

          pre.push((
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              { getMenuNodes(item.children) }
            </SubMenu>
          ));
        }
      }

      return pre;
    }, []);
  };

  const menusNode = getMenuNodes(menuList);

  return (
    <div className="leftNav">
      <Link to="/" className="leftNavHeader">
        <img src={logo} alt="logo" />
        <h1>Admin System</h1>
      </Link>

      <Menu
        selectedKeys={[path]}
        defaultOpenKeys={[openKey]}
        mode="inline"
        theme="dark"
      >

        { menusNode }

      </Menu>
    </div>
  );
}

export default withRouter(LeftNav);
