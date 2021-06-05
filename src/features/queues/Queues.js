import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { Label, List, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { fetchQueues, selectAllQueues } from './queuesSlice';

export const Queues = () => {
  const dispatch = useDispatch();
  const queues = useSelector(selectAllQueues);
  let token = sessionStorage.getItem('refreshToken');
  let decodedToken = token ? jwtDecode(token) : null;
  //const user = decodedToken ? decodedToken.email : null;
  const user = decodedToken ? decodedToken.email : null;
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
      <List.Item className="queues" key={idx} as={Link} to="/collections">
        <List.Content floated="left">{item.item}</List.Content>
        <List.Content floated="right">
          <Label circular>{item.count}</Label>
        </List.Content>
      </List.Item>
    ));

    return item;
  }

  function PrepareUserQueues(queues, currentAssignment) {
    //currentAssignment = 'mickeymouse';
    //console.log('currentAssignment: ', currentAssignment);
    const statusList = GetStatus(queues);
    const listWithCount = UserStatusCount(
      queues,
      statusList,
      currentAssignment
    );

    // Must remember to convert to Links list/#types-link
    const item = listWithCount.map((item, idx) => (
      <List.Item className="queues" key={idx} as={Link} to="/collections">
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

  function UserStatusCount(queues, statusList, currentAssignment) {
    let items = [];

    statusList.forEach((status) => {
      let count = 0;
      queues.forEach((record) => {
        if (
          record.currentStatus === status &&
          record.currentAssignment === currentAssignment
        )
          ++count;
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

  let mainQueues;
  let userQueues;

  if (queuesStatus === 'loading') {
    mainQueues = <div className="loading">Loading...</div>;
  } else if (queuesStatus === 'failed') {
    mainQueues = <div>{error}</div>;
  } else if (queuesStatus === 'succeeded') {
    mainQueues = PrepareQueues(queues);
    userQueues = PrepareUserQueues(queues, user);
  }
  return (
    <Segment className="queues">
      <List className="queues" selection divided link>
        <Label className="queues">Queues by status</Label>
        {mainQueues}
        {userQueues}
      </List>
    </Segment>
  );
};
