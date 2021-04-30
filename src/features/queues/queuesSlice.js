import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import { client } from '../../api/client';

const queuesAdapter = createEntityAdapter();

const initialState = queuesAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchQueues = createAsyncThunk('queues/fetchQueues', async () => {
  const response = await client.get('/queues');
  //console.log(response);
  return response;
});

const queuesSlice = createSlice({
  name: 'queues',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchQueues.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchQueues.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      queuesAdapter.upsertMany(state, payload);
    },
    [fetchQueues.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },
  },
});

export default queuesSlice.reducer;

export const { selectAll: selectAllQueues } = queuesAdapter.getSelectors(
  (state) => state.queues
);

/*export const selectQueuesByUser = createSelector(
  [selectAllQueues, (state, email) => email],
  (posts, userId) => posts.filter((post) => post.user === userId)
);*/
