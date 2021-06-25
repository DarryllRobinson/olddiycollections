import {
  createSlice,
  createAsyncThunk,
  //createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();

const clientsAdapter = createEntityAdapter();

const initialState = clientsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async () => {
    const response = await mysqlLayer.Get('/clients');
    //console.log('fetchClients response: ', response);
    return response;
  }
);

export const addNewClient = createAsyncThunk(
  'clients/addNewClient',
  async (client) => {
    const response = await mysqlLayer.Post('/clients', { client: client });
    //console.log('addNewClient response: ', response);
    return response.client;
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: {
    // Fetch clients
    [fetchClients.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchClients.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      clientsAdapter.upsertMany(state, payload);
    },
    [fetchClients.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },

    // Add new client
    [addNewClient.fulfilled]: clientsAdapter.addOne,
  },
});

export default clientsSlice.reducer;

export const {
  selectAll: selectAllClients,
  selectById: selectClientByIdClient,
} = clientsAdapter.getSelectors((state) => state.clients);
