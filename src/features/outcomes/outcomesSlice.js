import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

//import { client } from '../../api/client';
import MysqlLayer from '../../services/MysqlLayer';

const outcomesAdapter = createEntityAdapter();

const initialState = outcomesAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchOutcomes = createAsyncThunk(
  'outcomes/fetchOutcomes',
  async () => {
    const response = await this.mysqlLayer.Get('/outcomes');
    //console.log(response);
    return response;
  }
);

export const fetchOutcomesByCase = createAsyncThunk(
  'outcomes/fetchOutcome',
  async (outcome_id) => {
    const response = await this.mysqlLayer.Get(`/outcomes/${outcome_id}`);
    //console.log(response);
    return response;
  }
);

const outcomesSlice = createSlice({
  name: 'outcomes',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchOutcomes.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchOutcomes.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      outcomesAdapter.upsertMany(state, payload);
    },
    [fetchOutcomes.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },
    [fetchOutcomesByCase.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchOutcomesByCase.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      outcomesAdapter.upsertMany(state, payload);
    },
    [fetchOutcomesByCase.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },
  },
});

export default outcomesSlice.reducer;

export const {
  selectAll: selectAllOutcomesByCase,
  selectById: selectOutcomeById,
} = outcomesAdapter.getSelectors((state) => state.outcomes);
