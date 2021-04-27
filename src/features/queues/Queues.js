import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

import {
  fetchQueues,
  selectAllQueues,
  selectAllQueuesByUser,
} from './queuesSlice';

export const Queues = () => {
  const dispatch = useDispatch();
  const queues = useSelector(selectAllQueues);
  //let token = sessionStorage.getItem('unikey');
  let decodedToken = jwtDecode(sessionStorage.getItem('unikey'));
  const user = decodedToken.email;
  //console.log(user);
  const queuesStatus = useSelector((state) => state.queues.status);
  const error = useSelector((state) => state.queues.error);

  useEffect(() => {
    if (queuesStatus === 'idle') {
      dispatch(fetchQueues());
    }
  }, [dispatch, queuesStatus]);

  let content;

  if (queuesStatus === 'loading') {
    content = <div className="loading">Loading...</div>;
  } else if (queuesStatus === 'failed') {
    content = <div>{error}</div>;
  } else if (queuesStatus === 'succeeded') {
    content = queues.map((queue) => {
      return (
        <div key={queue.id}>
          {queue.id}: {queue.count}
        </div>
      );
    });
  }
  return (
    <div>
      Queues<div>{content}</div>
    </div>
  );
};
