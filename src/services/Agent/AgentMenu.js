import React, { useEffect, useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import history from '../../history';
import Security from '../../services/Security';

const security = new Security();

export const MenuBar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    setIsLoggedIn(security.validateSession('Menu'));
  }, []);

  const handleItemClick = (e, { name }) => {
    //console.log('menu name: ' + name);
    //console.log('menu e: ' + JSON.stringify(e));
    setActiveItem(name);
    history.push(`/${name}`);
  };

  const handleLogout = () => {
    security.terminateSession();
  };

  const logButton = isLoggedIn ? (
    <Menu.Item
      name="logout"
      active={activeItem === 'logout'}
      onClick={handleLogout}
    >
      Logout
    </Menu.Item>
  ) : (
    <Menu.Item
      name="login"
      active={activeItem === 'login'}
      onClick={handleItemClick}
    >
      Login
    </Menu.Item>
  );

  return (
    <Menu stackable fixed="top" inverted>
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
        name="collections"
        active={activeItem === 'collections'}
        onClick={handleItemClick}
      >
        Collections
      </Menu.Item>

      <Menu.Item
        name="reports"
        active={activeItem === 'reports'}
        onClick={handleItemClick}
      >
        Reports
      </Menu.Item>

      <Menu.Item
        name="upload"
        active={activeItem === 'upload'}
        onClick={handleItemClick}
      >
        Upload
      </Menu.Item>

      <Menu.Menu position="right">{logButton}</Menu.Menu>
    </Menu>
  );
};
