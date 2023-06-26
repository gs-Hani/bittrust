import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchRecordDetails } from '../../util/fetch/fetchRecords';

const initialState = {
    records      :[],
    error        : null,
    status       :'idle'
};

export const loadRecords = createAsyncThunk('transRecords/loadRecords', async (trans_ids) => {
    // console.log(trans_ids);
    const  res = await trans_ids.map(id => fetchRecordDetails(id));
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