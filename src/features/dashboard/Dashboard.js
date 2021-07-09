import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

import DashboardReports from '../reports/DashboardReports';
import mieLogo from '../../assets/img/mie_logo.png';
//import { Workzone } from '../workzone/Workzone';
import { Queues } from '../queues/Queues';
import { TopChart } from '../reports/TopChart';
//import moment from 'moment';

export const Dashboard = (props) => {
  const { timer } = props;
  let timerMsg;
  if (timer < 100) {
    timerMsg = `Time to logout: ${timer}`;
  }

  // Scroll to top
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container fluid>
      <div style={{ color: 'red' }}>{timerMsg}</div>
      <Grid celled="internally" stackable textAlign="center" columns={2}>
        <Grid.Row>
          <Grid.Column className="logo" width={4}>
            <img src={mieLogo} alt="logo" />
          </Grid.Column>
          <Grid.Column className="topChart" width={12}>
            <TopChart />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column className="queues" width={4}>
            <Queues />
          </Grid.Column>
          <Grid.Column className="workzone" width={12}>
            <DashboardReports styleType="dash" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
