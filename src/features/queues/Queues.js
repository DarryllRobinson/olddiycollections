import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { Label, List, Segment } from 'semantic-ui-react';

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

  function PrepareQueues(queues) {
    const statusList = GetStatus(queues);
    const listWithCount = StatusCount(queues, statusList);

    // Must remember to convert to Links list/#types-link
    const item = listWithCount.map((item, idx) => (
      <List.Item key={idx}>
        <List.Content floated="left">{item.item}</List.Content>
        <List.Content floated="right">
          <Label circular>{item.count}</Label>
        </List.Content>
      </List.Item>
    ));

    return item;
  }

  function StatusCount(queues, statusList) {
    let items = [];

    statusList.forEach((status) => {
      let count = 0;
      queues.forEach((record) => {
        if (record.currentStatus === status) ++count;
      });

      items.push({ item: status, count: count });
    });
    return items;
  }

  function GetStatus(queues) {
    let allStatusList = [];
    queues.forEach((queue) => {
      allStatusList.push(queue.currentStatus);
    });

    const statusList = allStatusList.filter(OnlyUnique);

    return statusList;
  }

  function OnlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  let content;

  if (queuesStatus === 'loading') {
    content = <div className="loading">Loading...</div>;
  } else if (queuesStatus === 'failed') {
    content = <div>{error}</div>;
  } else if (queuesStatus === 'succeeded') {
    content = PrepareQueues(queues);
  }
  return (
    <Segment inverted color="grey">
      <List selection divided inverted relaxed>
        <Label attached="top" color="grey" size="large">
          Queues
        </Label>
        {content}
      </List>
    </Segment>
  );
};
