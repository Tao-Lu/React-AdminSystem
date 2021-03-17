import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from './home';
import Detail from './detail';
import AddUpdate from './addUpdate';

import './index.less';

export default function Product() {
  return (
    <div>
      <Switch>
        <Route path="/product" exact component={Home} />
        <Route path="/product/addupdate" component={AddUpdate} />
        <Route path="/product/detail" component={Detail} />
        <Redirect to="/product" />
      </Switch>
    </div>
  );
}
