import React, { useEffect, useState } from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
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
    history.push('/');
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

      <Menu.Item
        name="users"
        active={activeItem === 'users'}
        onClick={handleItemClick}
      >
        User Admin
      </Menu.Item>

      <Dropdown item text="Client Admin">
        <Dropdown.Menu>
          <Dropdown.Item
            name="addclient"
            active={activeItem === 'clients'}
            onClick={handleItemClick}
          >
            Add Client
          </Dropdown.Item>
          <Dropdown.Item
            name="editclient"
            active={activeItem === 'clients'}
            onClick={handleItemClick}
          >
            Edit Client
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Menu.Menu position="right">{logButton}</Menu.Menu>
    </Menu>
  );
};
