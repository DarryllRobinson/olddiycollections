import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import { client } from '../../api/client';

const collectionsAdapter = createEntityAdapter();

const initialState = collectionsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async () => {
    const response = await client.get('/collections');
    //console.log(response);
    return response;
  }
);

export const fetchCollection = createAsyncThunk(
  'collections/fetchCollection',
  async (collection_id) => {
    const response = await client.get(`/collection/${collection_id}`);
    console.log(response);
    return response;
  }
);

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCollections.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchCollections.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      collectionsAdapter.upsertMany(state, payload);
    },
    [fetchCollections.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },
    [fetchCollection.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchCollection.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      collectionsAdapter.upsertMany(state, payload);
    },
    [fetchCollection.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },
  },
});

export default collectionsSlice.reducer;

export const {
  selectAll: selectAllCollections,
  selectById: selectCollectionById,
} = collectionsAdapter.getSelectors((state) => state.collections);
