import React from 'react';
import { Menu, Icon } from 'antd';
import './main.css';
import { Link } from 'react-router-dom';

class TopMenu extends React.Component {
  componentWillMount () {
    this.setState({
      active: window.location.pathname.replace('/', '')
    });
  }

  render () {
    const activeClassName = 'selected ant-menu-item-selected';

    return (
      <header id="main-menu">
        <Menu mode='horizontal' className="menu">
          <Menu.Item className={this.state.active === 'dashboard' ? activeClassName : ''}>
            <Link to="/dashboard" onClick={this.handleClick}><Icon type='dashboard'/>Dashboard</Link>
          </Menu.Item>

          <Menu.Item className={this.state.active === 'arduino' ? activeClassName : ''}>
            <Link to="/arduino" onClick={this.handleClick}><Icon type='cluster'/>Arduinos</Link>
          </Menu.Item>

          <Menu.Item className={this.state.active === 'user' ? activeClassName : ''}>
            <Link to="/user" onClick={this.handleClick}><Icon type='user'/>Usuarios</Link>
          </Menu.Item>

          <Menu.Item className="link dashboard">
          <Link to="/logout" onClick={this.handleClick}><Icon type='logout'/>Logout</Link>
          </Menu.Item>
        </Menu>
      </header>
    )
  }
}

export default TopMenu