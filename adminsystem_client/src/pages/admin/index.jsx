/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import memoryUtils from '../../utils/memoryUtils';
import MyLeftNav from '../../components/leftNav';
import MyHeader from '../../components/header';
import Home from './home';
import Category from './category';
import Product from './product';
import Role from './role';
import User from './user';
import PieChart from './chart/PieChart';
import LineChart from './chart/LineChart';
import BarChart from './chart/BarChart';

const {
  Header, Footer, Sider, Content,
} = Layout;

export default function Admin() {
  const { user } = memoryUtils;

  if (!user || !user._id) {
    return (
      <Redirect to="/login" />
    );
  }

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Sider>
        <MyLeftNav />
      </Sider>

      <Layout>
        <Header style={{ height: '80px', backgroundColor: 'white', padding: '0px' }}>
          <MyHeader />
        </Header>
        <Content style={{ margin: 20, backgroundColor: 'white' }}>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/category" component={Category} />
            <Route path="/product" component={Product} />
            <Route path="/user" component={User} />
            <Route path="/role" component={Role} />
            <Route path="/chart/pie" component={PieChart} />
            <Route path="/chart/line" component={LineChart} />
            <Route path="/chart/bar" component={BarChart} />
            <Redirect to="/home" />
          </Switch>

        </Content>
        <Footer style={{ textAlign: 'center', color: '#cccccc' }}>
          copyright &#169; 2021 StormyWave
        </Footer>
      </Layout>
    </Layout>
  );
}
