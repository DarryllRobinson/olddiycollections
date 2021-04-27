import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import { client } from '../../api/client';

const workzoneAdapter = createEntityAdapter();

const initialState = workzoneAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchWorkzone = createAsyncThunk(
  'workzone/fetchWorkzone',
  async () => {
    const response = await client.get('/workzone');
    //console.log('workzone: ', response);
    return response;
  }
);

const workzoneSlice = createSlice({
  name: 'workzone',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchWorkzone.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchWorkzone.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      workzoneAdapter.upsertMany(state, payload);
    },
    [fetchWorkzone.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },
  },
});

export default workzoneSlice.reducer;

export const { selectAll: selectAllWorkzone } = workzoneAdapter.getSelectors(
  (state) => state.workzone
);
