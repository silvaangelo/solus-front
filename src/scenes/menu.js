import React from 'react';
import { Menu, Icon, Layout } from 'antd';
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
      <Layout.Header id="main-menu">
        <Menu mode='horizontal' className="menu">
          <Menu.Item className={this.state.active === 'dashboard' ? activeClassName : ''}>
            <Link to="/dashboard" onClick={this.handleClick}><Icon type='dashboard'/>Dashboard</Link>
          </Menu.Item>

          <Menu.Item className={this.state.active === 'stations' ? activeClassName : ''}>
            <Link to="/stations" onClick={this.handleClick}><Icon type='cluster'/>Estações</Link>
          </Menu.Item>

          <Menu.Item className={this.state.active === 'users' ? activeClassName : ''}>
            <Link to="/users" onClick={this.handleClick}><Icon type='contacts'/>Usuários</Link>
          </Menu.Item>

          <Menu.Item className={this.state.active === 'profile' ? activeClassName : ''}>
            <Link to="/profile" onClick={this.handleClick}><Icon type='user'/>Meu perfil</Link>
          </Menu.Item>

          <Menu.Item className="link dashboard">
          <Link to="/logout" onClick={this.handleClick}><Icon type='logout'/>Logout</Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
    )
  }
}

export default TopMenu