import { createSlice, createAsyncThunk }   from '@reduxjs/toolkit';

const initialState = {
    records: [
        {
          amount:               5356.2880000000005,
          closedate:           '2022-03-09',
          createdate:          '2022-03-09',
          hs_lastmodifieddate: '2022-03-09',
          hs_object_id:         8178124928
        }
    ],
    error        : null,
    status       :'idle'
};

export const loadRecords = createAsyncThunk('transRecords/loadRecords', async (record_id) => {
    const  ids = await fetchRecordsIDs(record_id);
    const  res = await ids.map(id => fetchRecordDetails(id));
    return res;
})

const transRecordsSlice = createSlice({
    name:'transRecords',
    initialState,
    reducers: {},
    //thunks go here
    extraReducers(builder) {
        builder
        //Load Records=========================
        .addCase(loadRecords.pending,   (state, action) => {
            state.status  = 'loading';
        })
        .addCase(loadRecords.fulfilled, (state, action) => {
            state.records =  action.payload;
            state.status  = 'succeeded';
        })
        .addCase(loadRecords.rejected,  (state, action) => {
            state.error   =  action.error.message;
            state.status  = 'failed';
        })
    }
});

export default transRecordsSlice.reducer;