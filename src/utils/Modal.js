import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';

// Modal for saving update
export const PopUp = () => {
  const [open, setOpen] = useState(false);
  console.log('Going to popup now');

  return (
    <Modal
      onClose={() => setOpen(false)}
      opOpen={setOpen(true)}
      open={open}
      size="small"
      trigger={<Button>Happy days</Button>}
    >
      <Modal.Content>The Contacts were successfully updated</Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Awesomeness</Button>
      </Modal.Actions>
    </Modal>
  );
};
