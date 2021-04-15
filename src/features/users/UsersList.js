import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUsers, selectAllUsers } from './usersSlice';

export const UsersList = () => {
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
    content = users.map((user) => (
      <li key={user.id}>
        <Link to={`/users/${user.id}`}>{user.firstName}</Link>
      </li>
    ));
  } else if (userStatus === 'error') {
    content = <div>{error}</div>;
  }

  return (
    <section>
      <h2>Users</h2>

      <ul>{content}</ul>
    </section>
  );
};
