import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import MysqlLayer from '../../services/MysqlLayer';

const reportsAdapter = createEntityAdapter();

const initialState = reportsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchReport = createAsyncThunk(
  'reports/fetchReport',
  async (reportName) => {
    console.log('Fetching report', reportName);
    const response = await this.mysqlLayer.Get(`reports/${reportName}`);
    return response;
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchReport.fulfilled]: (state, { payload }) => {
      state.entities.push(payload);
    },
  },
});

export default reportsSlice.reducer;

export const {
  selectEntities: selectReportEntities,
} = reportsAdapter.getSelectors((state) => state.reports);
