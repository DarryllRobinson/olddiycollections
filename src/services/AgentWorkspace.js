import React from 'react';
import { ComponentRoutes } from './ComponentRoutes';
import history from '../history';

export const AgentWorkspace = () => {
  return (
    <div style={{ marginTop: '75px' }}>
      <ComponentRoutes history={history} />
    </div>
  );
};
