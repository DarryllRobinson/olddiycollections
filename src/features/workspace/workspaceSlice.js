import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

//import { client } from '../../api/client';
import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();

const workspaceAdapter = createEntityAdapter();

const initialState = workspaceAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchWorkspace = createAsyncThunk(
  'workspace/fetchWorkspace',
  async () => {
    const response = await mysqlLayer.Get('/workspace');
    //console.log(response);
    return response;
  }
);

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchWorkspace.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchWorkspace.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      workspaceAdapter.upsertMany(state, payload);
    },
    [fetchWorkspace.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },
  },
});

export default workspaceSlice.reducer;

export const { selectAll: selectAllWorkspace } = workspaceAdapter.getSelectors(
  (state) => state.workspace
);
