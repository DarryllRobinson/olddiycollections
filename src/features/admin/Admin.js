import React from 'react';

import { EditUsersForm } from '../users/EditUsersForm';

export const Admin = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      Admin
      <EditUsersForm />
    </div>
  );
};
