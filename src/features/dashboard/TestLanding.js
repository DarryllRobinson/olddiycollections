import React from 'react';
import { useDispatch } from 'react-redux';

import { refreshToken } from '../users/usersSlice';

export const TestLanding = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return <div>TestLanding</div>;
};
