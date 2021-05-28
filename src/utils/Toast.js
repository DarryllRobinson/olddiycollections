import React from 'react';
import { Message, Transition } from 'semantic-ui-react';

const Toast = () => (
  <Transition visible={true} animation="scale" duration={500}>
    <Message positive>
      <Message.Header>Success!</Message.Header>
      <p>The outcome was successfully saved</p>
    </Message>
  </Transition>
);

export default Toast;
