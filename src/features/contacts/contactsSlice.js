import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import { client } from '../../api/client';

const contactsAdapter = createEntityAdapter();

const initialState = contactsAdapter.getInitialState({
  status: 'idle',
  error: '',
});

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (id) => {
    const response = await client.get(`/contacts/${id}`);
    console.log(response);
    return response;
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchContacts.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchContacts.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      contactsAdapter.upsertMany(state, payload);
    },
    [fetchContacts.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },
  },
});

export default contactsSlice.reducer;

export const { selectAll: selectAllContacts } = contactsAdapter.getSelectors(
  (state) => state.contacts
);
