import { PrivateRoute } from './PrivateRoute';
//import Security from './Security';
import Security from './Security';

import { MenuBar } from '../features/menu/Menu';

import { Dashboard } from '../features/dashboard/Dashboard';
//import { TestLanding } from '../features/dashboard/TestLanding';
import { Workzone } from '../features/workzone/Workzone';
import Reports from '../features/reports/Reports';
import { Admin } from '../features/admin/Admin';

export const ComponentRoutes = (props) => {
  const security = new Security();
  security.validateSession('ComponentRoutes');

  return (
    <>
      <MenuBar />
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <PrivateRoute exact path="/reports" component={Reports} />
      <PrivateRoute exact path="/admin" component={Admin} />
      <PrivateRoute exact path="/workzone" component={Workzone} />
    </>
  );
};
