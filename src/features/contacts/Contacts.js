import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion } from 'semantic-ui-react';

import { fetchContacts, selectAllContacts } from './contactsSlice';

export const Contacts = (props) => {
  //console.log('Contacts', props);
  const { id } = props;
  const [activeIndex, setActiveIndex] = React.useState(null);

  const dispatch = useDispatch();
  const contacts = useSelector(selectAllContacts);

  const contactsStatus = useSelector((state) => state.contacts.status);
  const error = useSelector((state) => state.contacts.error);

  React.useEffect(() => {
    if (contactsStatus === 'idle') {
      dispatch(fetchContacts(id));
    }
  }, [contactsStatus, dispatch, id]);

  // Handlers
  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const handleActiveIndex = activeIndex;
    const newIndex = handleActiveIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  };

  let content;

  if (contactsStatus === 'loading') {
    content = <div className="loading">Loading...</div>;
  } else if (contactsStatus === 'error') {
    content = <div>{error}</div>;
  } else if (contactsStatus === 'succeeded') {
    content = (
      <Accordion>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleClick}
        >
          Contacts succeeded
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          Stuff goes here
        </Accordion.Content>
      </Accordion>
    );
  }

  return <div>{content}</div>;
};
