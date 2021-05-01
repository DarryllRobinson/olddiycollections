import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

import Reports from '../reports/Reports';
import { Workzone } from '../workzone/Workzone';
import { Queues } from '../queues/Queues';
//import moment from 'moment';

export const Dashboard = (props) => {
  const { timer } = props;
  let timerMsg;
  if (timer < 100) {
    timerMsg = `Time to logout: ${timer}`;
  }

  return (
    <Container fluid>
      <div style={{ color: 'red' }}>{timerMsg}</div>
      <Grid celled="internally" stackable textAlign="center" columns={2}>
        <Grid.Row>
          <Grid.Column width={4} style={{ padding: 0 }}>
            <Queues />
          </Grid.Column>
          <Grid.Column width={12} style={{ padding: 0 }}>
            <Workzone />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4} style={{ padding: 0 }}>
            TopTips
          </Grid.Column>
          <Grid.Column width={12} style={{ padding: 0 }}>
            <Reports styleType="dash" />
          </Grid.Column>
        </Grid.Row>
      </Grid>{' '}
    </Container>
  );
};
