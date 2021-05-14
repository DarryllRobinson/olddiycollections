import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'semantic-ui-react';

import { fetchUsers, selectAllUsers } from './usersSlice';

export const UsersList = (props) => {
  const { handleSelect, user } = props;
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
  let options = [];

  if (userStatus === 'loading') {
    content = <div className="loader">Loading...</div>;
  } else if (userStatus === 'succeeded') {
    users.map((user) =>
      options.push({
        key: user.id,
        text: user.firstName + ' ' + user.surname,
        value: user.email,
      })
    );
    content = (
      <Form.Select
        defaultValue={user}
        fluid
        id="form-input-control-userlist"
        label="Assignment"
        name="currentAssignment"
        onChange={handleSelect}
        options={options}
        required
      />
    );
  } else if (userStatus === 'error') {
    content = <div>{error}</div>;
  }

  return <>{content}</>;
};
