import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchUsers, selectAllUsers } from './usersSlice';

export const UsersList = (props) => {
  //const { handleSelect, user } = props;
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);

  const userStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  React.useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  let options = [];
  if (userStatus === 'succeeded') {
    users.map((user) =>
      options.push({
        key: user.id,
        text: user.firstName,
        value: user.email,
      })
    );
    console.log('options: ', options);
    return options;
  }
};
