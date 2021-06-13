import { PrivateRoute } from './PrivateRoute';
//import Security from './Security';
import Security from './Security';

import { MenuBar } from '../features/menu/Menu';

import { Dashboard } from '../features/dashboard/Dashboard';
//import { TestLanding } from '../features/dashboard/TestLanding';
import { Workzone } from '../features/workzone/Workzone';
import Reports from '../features/reports/Reports';
import { Clients } from '../features/clients/Clients';
import { Users } from '../features/users/Users';
import { Workspace } from '../features/workspace/Workspace';
import { Collections } from '../features/collections/Collections';
import { Collection } from '../features/collections/Collection';
import { Contacts } from '../features/contacts/Contacts';

import Upload from '../features/upload/Upload';

export const ComponentRoutes = (props) => {
  const security = new Security();
  security.validateSession('ComponentRoutes');

  return (
    <>
      <MenuBar />
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <PrivateRoute exact path="/reports" component={Reports} />
      <PrivateRoute exact path="/workzone" component={Workzone} />
      <PrivateRoute exact path="/workspace" component={Workspace} />
      <PrivateRoute exact path="/collections" component={Collections} />
      <PrivateRoute exact path="/collection/:id" component={Collection} />
      <PrivateRoute exact path="/contacts/:id" component={Contacts} />
      <PrivateRoute exact path="/upload" component={Upload} />
      <PrivateRoute exact path="/clients" component={Clients} />
      <PrivateRoute exact path="/users" component={Users} />
    </>
  );
};
