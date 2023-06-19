import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadImage }                   from '../../util/fetch/fetchUsers';

const initialState = {
    error        : null,
    status       :'idle'
};

export const upload_Image = createAsyncThunk('profile/upload_Image', async (formdata) => {
    console.log('upload_Image formdata:',formdata);
    const response = await uploadImage(formdata);
    if (response.message) { throw response } else { return response; }
});

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    //thunks go here
    extraReducers(builder) {
        builder
        //Upload Image===========================================
        .addCase(upload_Image.pending,   (state)          => {
            state.status        = 'loading';
        })
        .addCase(upload_Image.fulfilled, (state)  => {
            state.status        = 'succeeded';
        })
        .addCase(upload_Image.rejected,  (state, action)  => {
            state.error         =  action.error.message;
            state.status        = 'failed';
        })
    }
});

export default profileSlice.reducer;
