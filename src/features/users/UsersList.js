import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'semantic-ui-react';

import { fetchUsers, selectAllUsers } from './usersSlice';

export const UsersList = (props) => {
  const { handleSelect } = props;
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);

  const userStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  let content;

  if (userStatus === 'loading') {
    content = <div className="loader">Loading...</div>;
  } else if (userStatus === 'succeeded') {
    let options = [];
    users.map((user) =>
      options.push({
        key: user.id,
        text: user.firstName,
        value: user.firstName,
      })
    );

    /*serviceList[0].map((service, i) =>
                        options_customers.push({
                            key: service.Id,
                            text: service.Name,
                            value: service.Name
                         }))

    content = users.map((user) => [
      {
        key: `${user.id}`,
        text: `${user.firstName}`,
        value: `${user.firstName}`,
      },
    ]);*/
    content = options;
    console.log('options: ', options);
  } else if (userStatus === 'error') {
    content = <div>{error}</div>;
  }

  return (
    <Form.Select
      fluid
      label="Assignment"
      name="currentAssignment"
      id="form-input-control-userlist"
      onChange={handleSelect}
      required
    />
  );
};
