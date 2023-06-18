import { createSlice, createAsyncThunk }   from '@reduxjs/toolkit';
import { signUp, signIn, isAuth } from '../../util/fetch/fetchAuth';
import { updateAccount }                   from '../../util/fetch/fetchUsers';

const initialState = {
    authenticated: false, 
    credit       : 0,     //-- from HS
    contactID    : null,  //-- from HS
    email        : null,  //-- from HS
    error        : null,
    status       :'idle', 
    transactions :[],     //-- from HS
};

export const  sign_up  = createAsyncThunk('auth/sign_up',    async (data) => {
    const/*--------------------*/{ password,email,ref } = data;
    const  response = await signUp(password,email,ref);
    if (response.message) { throw response } else { return response; }
});

export const  sign_in  = createAsyncThunk('auth/sign_in',    async (data) => {
    console.log('signing in')
    const/*--------------------*/{ email, password } = data;
    const  response = await signIn(email, password);
    console.log('sign_in response:', response);
    if (response.message) { throw response } else { return response; }
});

export const  sign_out = createAsyncThunk('auth/sign_out',   async () => {
    return true;
});

export const update_data = createAsyncThunk('auth/update_data', async (data) => {
    const  response = await updateAccount(data);
    return response;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    //thunks go here
    extraReducers(builder) {
        builder
        //Sign Up===========================================
        .addCase(sign_up.pending,   (state)          => {
            state.status        = 'loading';
        })
        .addCase(sign_up.fulfilled, (state, action)  => {
            const {referral_credit,contactID,email} = action.payload
            state.authenticated =  true;
            state.credit        =  referral_credit;
            state.contactID     =  contactID
            state.email         =  email;
            state.status        = 'succeeded';
        })
        .addCase(sign_up.rejected,  (state, action)  => {
            state.error         =  action.error.message;
            state.status        = 'failed';
        })
        //Sign In===========================================
        .addCase(sign_in.pending,   (state)          => {
            state.status        = 'loading';
        })
        .addCase(sign_in.fulfilled, (state, action)  => {
            const account       =  action.payload;
            console.log(account);
            state.authenticated =  true;
            state.credit        =  account.referral_credit;
            state.contactID     =  account.id;
            state.email         =  account.email;
            state.status        = 'succeeded';
            state.transactions  =  account.deals; 
        })
        .addCase(sign_in.rejected,  (state, action)  => {
            console.log(action.error);
            state.error         =  action.error.message;
            state.status        = 'failed';
        })
        //Sign Out==========================================
        .addCase(sign_out.pending,   (state)         => {
            state.status        = 'loading';
        })
        .addCase(sign_out.fulfilled, (state)         => {
            state.authenticated =  false;
            state.credit        =  0;
            state.contactID     =  null;
            state.email         =  null;
            state.status        = 'succeeded';
            state.transactions  =  []; 
        })
        .addCase(sign_out.rejected,  (state, action) => {
            state.error         =  action.error.message;
            state.status        = 'failed';
        })
        //Update Data========================================
        .addCase(update_data.fulfilled, (state, action) => {
            const {email} = action.payload;
            console.log('update data slice, action.payload:',action.payload);
            state.email   = email;
        })
        .addCase(update_data.rejected,  (state, action) => {
            state.error         =  action.error.message;
        })
    }
});

export default authSlice.reducer;
