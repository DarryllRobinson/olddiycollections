import { configureStore } from '@reduxjs/toolkit';
import queuesReducer from '../features/queues/queuesSlice';
import usersReducer from '../features/users/usersSlice';
import workzoneReducer from '../features/workzone/workzoneSlice';

export const store = configureStore({
  reducer: {
    queues: queuesReducer,
    users: usersReducer,
    workzone: workzoneReducer,
  },
});
