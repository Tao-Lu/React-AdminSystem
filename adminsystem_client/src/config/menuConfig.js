/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
// dynamic create menus
import {
  AppstoreOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';

const menuList = [
  // menu item
  {
    title: 'Home',
    key: '/home',
    icon: <DesktopOutlined />,
    isPublic: true,
  },
  {
    title: 'Product',
    key: '/products',
    icon: <AppstoreOutlined />,
    // sub menu
    children: [
      {
        title: 'Category Management',
        key: '/category',
        icon: <ContainerOutlined />,
      },
      {
        title: 'Product Management',
        key: '/product',
        icon: <ContainerOutlined />,
      },
    ],
  },
  {
    title: 'User Management',
    key: '/user',
    icon: <MailOutlined />,
  },
  {
    title: 'Role Management',
    key: '/role',
    icon: <PieChartOutlined />,
  },
  {
    title: 'Chart',
    key: '/chart',
    icon: <ContainerOutlined />,
    children: [
      {
        title: 'Bar Chart',
        key: '/chart/bar',
        icon: <ContainerOutlined />,
      },
      {
        title: 'Line Chart',
        key: '/chart/line',
        icon: <ContainerOutlined />,
      },
      {
        title: 'Pie Chart',
        key: '/chart/pie',
        icon: <ContainerOutlined />,
      },
    ],
  },
];

export default menuList;
