import { configureStore } from '@reduxjs/toolkit';
import queuesReducer from '../features/queues/queuesSlice';
import usersReducer from '../features/users/usersSlice';
import workspaceReducer from '../features/workspace/workspaceSlice';
import workzoneReducer from '../features/workzone/workzoneSlice';

export const store = configureStore({
  reducer: {
    queues: queuesReducer,
    users: usersReducer,
    workspace: workspaceReducer,
    workzone: workzoneReducer,
  },
});
