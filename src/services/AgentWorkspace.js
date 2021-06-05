import React from 'react';
import { Container } from 'semantic-ui-react';

import { ComponentRoutes } from './ComponentRoutes';
import history from '../history';

export const AgentWorkspace = () => {
  return (
    <Container fluid className="AgentWorkspace">
      <ComponentRoutes history={history} />
    </Container>
  );
};
