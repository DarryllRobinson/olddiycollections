import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

//import { client } from '../../api/client';
import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();

const collectionsAdapter = createEntityAdapter();

const initialState = collectionsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async () => {
    const response = await mysqlLayer.Get('/collections');
    //console.log('fetchCollections response: ', response);
    return response;
  }
);

export const fetchCollection = createAsyncThunk(
  'collections/fetchCollection',
  async (collection_id) => {
    //console.log('collection_id: ', collection_id);
    const response = await mysqlLayer.Get(`/collection/${collection_id}`);
    //console.log('fetchCollection response: ', response);
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

export const fetchCollectionsByStatus = createSelector(
  [selectAllCollections, (state, currentStatus) => currentStatus],
  (collections, currentStatus) =>
    collections.filter(
      (collection) => collection.currentStatus === currentStatus
    )
);
