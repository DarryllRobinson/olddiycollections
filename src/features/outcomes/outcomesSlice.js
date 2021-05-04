import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { client } from '../../api/client';

const outcomesAdapter = createEntityAdapter();

const initialState = outcomesAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchOutcomes = createAsyncThunk(
  'outcomes/fetchOutcomes',
  async () => {
    const response = await client.get('/outcomes');
    //console.log(response);
    return response;
  }
);

export const fetchOutcome = createAsyncThunk(
  'outcomes/fetchOutcome',
  async (outcome_id) => {
    const response = await client.get(`/outcome/${outcome_id}`);
    console.log(response);
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
    [fetchOutcome.pending]: (state, { payload }) => {
      state.status = 'loading';
    },
    [fetchOutcome.fulfilled]: (state, { payload }) => {
      state.status = 'succeeded';
      outcomesAdapter.upsertMany(state, payload);
    },
    [fetchOutcome.rejected]: (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    },
  },
});

export default outcomesSlice.reducer;

export const {
  selectAll: selectAllOutcomes,
  selectById: selectOutcomeById,
} = outcomesAdapter.getSelectors((state) => state.outcomes);

export const selectOutcomesByCase = createSelector(
  [selectAllOutcomes, (state, caseId) => caseId],
  (outcomes, caseId) =>
    outcomes.filter((outcome) => outcome.f_caseId === caseId)
);
