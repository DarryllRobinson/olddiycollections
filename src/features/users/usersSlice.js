import {
  createSlice,
  createAsyncThunk,
  //createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import history from '../../history';

import Security from '../../services/Security';
import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();

//import { client } from '../../api/client';

const security = new Security();
const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await mysqlLayer.Get('/users');
  return response;
});

export const fetchUser = createAsyncThunk('users/fetchUser', async (userId) => {
  const response = await mysqlLayer.Get(`/users/${userId}`);
  return response;
});

export const addNewUser = createAsyncThunk(
  'users/addNewUser',
  async (initialUser) => {
    const response = await mysqlLayer.Post('/users', {
      user: initialUser,
    });
    return response.user;
  }
);

export const loginUser = createAsyncThunk('users/loginUser', async (user) => {
  const response = await mysqlLayer.PostLogin('/users/login', user);
  //console.log(response);
  security.writeLoginSession(response.user[0].refreshToken);
  history.push('/dashboard');
  //console.log(response);
  return response;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userUpdated(state, { payload }) {
      const { id, firstName, surname, email } = payload;
      const existingUser = state.entities[id];
      if (existingUser) {
        existingUser.firstName = firstName;
        existingUser.surname = surname;
        existingUser.email = email;
      }
    },
    refreshToken(state, { payload }) {
      const { token } = payload;
      security.writeLoginSession(token);
    },
  },
  extraReducers: {
    // Fetch users
    [fetchUsers.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchUsers.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      // Add any fetched users to the array
      usersAdapter.upsertMany(state, payload);
    },
    [fetchUsers.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },

    // Fetch single user
    [fetchUser.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchUser.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      // Return any user found
      usersAdapter.upsertMany(state, payload);
    },
    [fetchUser.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },

    // Login user
    [loginUser.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      if (payload.ok) {
        state.status = 'succeeded';
        state.refreshTime = payload.refreshTime;
        // Return user array
        //console.log('usersSlice payload: ', payload);
        usersAdapter.upsertMany(state, payload.user);
      } else {
        console.log('not logged in');
      }
    },
    [loginUser.rejected]: (state, { payload }) => {
      console.log('problem loginUser.rejected: ', payload);
      state.status = 'failed';
      state.error = payload;
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
