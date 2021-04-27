import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, selectUserById } from '../users/usersSlice';

export const UserPage = ({ match }) => {
  const dispatch = useDispatch();
  const { userId } = match.params;
  const user = useSelector((state) => selectUserById(state, userId));

  const userStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUser(userId));
    }
  }, [userId, userStatus, dispatch]);

  let content;

  if (userStatus === 'loading') {
    content = <div className="loader">Loading...</div>;
  } else if (userStatus === 'succeeded' && user) {
    content = <div>{user.firstName}</div>;
  } else if (userStatus === 'succeeded' && !user) {
    content = <div>User not found</div>;
  } else if (userStatus === 'error') {
    content = <div>{error}</div>;
  }

  return (
    <section>
      <h2>{content}</h2>
    </section>
  );
};
