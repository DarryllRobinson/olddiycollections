import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

import Reports from '../reports/Reports';
//import moment from 'moment';

export const Dashboard = () => {
  /*const d = new Date();
  console.log(
    'current date: ',
    moment(d.getTime()).format('YYYY-MM-DD HH:mm:ss')
  );

  const calculatedExpiresIn = d.getTime() + 60 * 60 * 1000;
  console.log(
    'calculatedExpiresIn: ',
    moment(calculatedExpiresIn).format('YYYY-MM-DD HH:mm:ss')
  );
*/
  return (
    <Container fluid>
      <Grid celled="internally" stackable textAlign="center" columns={2}>
        <Grid.Row>
          <Grid.Column width={4} style={{ padding: 0 }}>
            Queues
          </Grid.Column>
          <Grid.Column width={12} style={{ padding: 0 }}>
            Workzone
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
