import React from 'react';
import { useDispatch } from 'react-redux';

import { refreshToken } from '../features/users/usersSlice';

export const Test = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return <div>Test</div>;
};
