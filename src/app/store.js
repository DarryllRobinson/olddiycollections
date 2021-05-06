import { configureStore } from '@reduxjs/toolkit';
import collectionsReducer from '../features/collections/collectionsSlice';
import contactsReducer from '../features/contacts/contactsSlice';
import outcomesReducer from '../features/outcomes/outcomesSlice';
import queuesReducer from '../features/queues/queuesSlice';
import usersReducer from '../features/users/usersSlice';
import workspaceReducer from '../features/workspace/workspaceSlice';
import workzoneReducer from '../features/workzone/workzoneSlice';

export const store = configureStore({
  reducer: {
    collections: collectionsReducer,
    contacts: contactsReducer,
    outcomes: outcomesReducer,
    queues: queuesReducer,
    users: usersReducer,
    workspace: workspaceReducer,
    workzone: workzoneReducer,
  },
});
