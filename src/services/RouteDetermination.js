import React from 'react';
import { Container } from 'semantic-ui-react';

import { AdminRoutes } from './Admin/AdminRoutes';
import { AgentRoutes } from './Agent/AgentRoutes';
import history from '../history';
import Security from './Security';

export const RouteDetermination = () => {
  const security = new Security();
  const role = security.getRole();

  // Determing routes based on role
  const determineRoute = () => {
    switch (role) {
      case 'admin':
        return <AdminRoutes history={history} />;
      case 'agent':
        return <AgentRoutes history={history} />;
      default:
    }
  };

  return (
    <Container fluid className="RouteDetermination">
      {determineRoute()}
    </Container>
  );
};
