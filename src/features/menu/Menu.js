import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import history from '../../history';
import Security from '../../services/Security';

export const MenuBar = () => {
  const security = new Security();
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    history.push(`/${name}`);
  };

  const handleLogout = () => {
    security.terminateSession();
    history.push('/');
  };

  return (
    <Menu stackable fixed="top">
      <Link to="/">
        <Menu.Item>
          <img src="https://react.semantic-ui.com/logo.png" alt="menu logo" />
        </Menu.Item>
      </Link>

      <Menu.Item
        name="dashboard"
        active={activeItem === 'dashboard'}
        onClick={handleItemClick}
      >
        Dashboard
      </Menu.Item>

      <Menu.Item
        name="reports"
        active={activeItem === 'reports'}
        onClick={handleItemClick}
      >
        Reports
      </Menu.Item>

      <Menu.Item
        name="admin"
        active={activeItem === 'admin'}
        onClick={handleItemClick}
      >
        Admin
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === 'login'}
          onClick={handleItemClick}
        >
          Login
        </Menu.Item>
        <Menu.Item
          name="logout"
          active={activeItem === 'logout'}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};
