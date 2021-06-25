import React from 'react';

import { Container, Icon, Message } from 'semantic-ui-react';

export const Unauthorised = (props) => {
  //console.log('Unauthorised props: ', props);
  return (
    <Container>
      <Message error icon size="massive">
        <Icon name="warning sign" />
        <Message.Content>
          <Message.Header>UNAUTHORISED</Message.Header>
          You are not allowed to be here
        </Message.Content>
      </Message>
    </Container>
  );
};
