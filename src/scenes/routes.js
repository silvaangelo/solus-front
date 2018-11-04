import React from 'react'
import Login from './Login'
import Dashboard from './Dashboard'
import { Route, Redirect, BrowserRouter, Switch } from 'react-router-dom';
import { Auth } from '../lib/auth'
import Arduino from './Arduino';
import User from './User';
import Profile from './Profile'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from='/' to='/login' />
        <Route exact path='/login' component={Login} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute exact path='/stations' component={Arduino} />
        <PrivateRoute exact path='/users' component={User} />
        <PrivateRoute exact path='/profile' component={Profile} />
        <Route exact path='/logout' render={props => {
          Auth.logout();
          
          return (
            <Redirect to={{ pathname: '/login'}} />
          )
        }} />
      </Switch>
    </BrowserRouter>
  )
}

const PrivateRoute = ({ component: Component, path }) => {
  return (
    <Route path={path} render={props => (
      Auth.isAuthenticated() ? <Component {...props} /> : <Redirect to={{ pathname: '/login'}} />
    )} />
  );
};

export default Routes;