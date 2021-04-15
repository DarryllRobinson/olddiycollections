import {
  createSlice,
  createAsyncThunk,
  //createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import { client } from '../../api/client';

const usersAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.email.localeCompare(a.email),
});

const initialState = usersAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/users');
  return response;
});

export const fetchUser = createAsyncThunk('users/fetchUser', async (userId) => {
  const response = await client.get(`/users/${userId}`);
  return response;
});

export const addNewUser = createAsyncThunk(
  'users/addNewUser',
  async (initialUser) => {
    const response = await client.post('/users', { user: initialUser });
    return response.user;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userUpdated(state, action) {
      const { id, firstName, surname, email } = action.payload;
      const existingUser = state.entities[id];
      if (existingUser) {
        existingUser.firstName = firstName;
        existingUser.surname = surname;
        existingUser.email = email;
      }
    },
  },
  extraReducers: {
    // Fetch users
    [fetchUsers.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      // Add any fetched users to the array
      usersAdapter.upsertMany(state, action.payload);
    },
    [fetchUsers.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },

    // Fetch single user
    [fetchUser.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      // Return any user found
      usersAdapter.upsertMany(state, action.payload);
    },
    [fetchUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [addNewUser.fulfilled]: usersAdapter.addOne,
  },
});

export const { userAdded, userUpdated } = usersSlice.actions;

export default usersSlice.reducer;

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
} = usersAdapter.getSelectors((state) => state.users);
