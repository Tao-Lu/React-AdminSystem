import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/login';
import Admin from './pages/admin';

export default function App() {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={Admin} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
