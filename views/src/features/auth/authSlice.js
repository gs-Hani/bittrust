import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signUp,signIn,signOut,isAuth }  from '../../util/fetch/fetchAuth';
import { updateAccount }                 from '../../util/fetch/fetchUsers';

const initialState = {
    authenticated: false, 
    credit       : 0,     //-- from HS
    contactID    : null,  //-- from HS
    email        : null,  //-- from HS
    error1       : null,
    error2       : null,
    status1      :'idle', 
    status2      :'idle', 
    transactions :[],     //-- from HS
};

export const  sign_up  = createAsyncThunk('auth/sign_up',    async (data) => {
    const/*--------------------*/{ password,email,ref } = data;
    const  response = await signUp(password,email,ref);
    if    (response.message) { throw response } else { return response; }
});

export const  sign_in  = createAsyncThunk('auth/sign_in',       async (data) => {
    // console.log('signing in')
    const/*--------------------*/{ email, password } = data;
    const  response = await signIn(email, password);
    // console.log('sign_in response:', response);
    if (response.message) { throw response } else { return response; }
});

export const sign_out = createAsyncThunk('auth/sign_out',       async () => {
    const  response = await signOut();
    return response;
});

export const update_data = createAsyncThunk('auth/update_data', async (data) => {
    const  response = await updateAccount(data);
    return response;
});

export const is_Auth = createAsyncThunk('auth/is_Auth',         async ()     => {
    const  response = await isAuth();
    return response
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
            state.status1       = 'loading';
        })
        .addCase(sign_up.fulfilled, (state, action)  => {
            const {referral_credit,contactID,email} = action.payload
            state.authenticated =  true;
            state.credit        =  referral_credit;
            state.contactID     =  contactID
            state.email         =  email;
            state.status1       = 'succeeded';
        })
        .addCase(sign_up.rejected,  (state, action)  => {
            state.error1        =  action.error.message;
            state.status1       = 'failed';
        })
        //Sign In===========================================
        .addCase(sign_in.pending,   (state)          => {
            state.status1       = 'loading';
        })
        .addCase(sign_in.fulfilled, (state, action)  => {
            const account       =  action.payload;
            // console.log('sign in fulfilled:',account);
            state.authenticated =  true;
            state.credit        =  account.credit;
            state.contactID     =  account.contactID;
            state.email         =  account.email;
            state.status1       = 'succeeded';
            state.transactions  =  account.deals; 
        })
        .addCase(sign_in.rejected,  (state, action)  => {
            // console.log(action.error);
            state.error1        =  action.error.message;
            state.status1       = 'failed';
        })
        //Sign Out==========================================
        .addCase(sign_out.pending,   (state)         => {
            state.status1       = 'loading';
        })
        .addCase(sign_out.fulfilled, (state)         => {
            state.authenticated =  false;
            state.credit        =  0;
            state.contactID     =  null;
            state.email         =  null;
            state.error1        =  null;
            state.error2        =  null;
            state.status1       = 'succeeded';
            state.status2       = 'idle';
            state.transactions  =  []; 
        })
        .addCase(sign_out.rejected,  (state, action) => {
            state.error1        =  action.error.message;
            state.status1       = 'failed';
        })
        //Update Data========================================
        .addCase(update_data.pending,   (state)         => {
            state.status2       = 'loading';
        })
        .addCase(update_data.fulfilled, (state, action) => {
            const {email} = action.payload.properties;
            // console.log('update data slice, action.payload:',action.payload);
            state.email   =  email;
            state.status2 = 'succeeded';
        })
        .addCase(update_data.rejected,  (state, action) => {
            state.error2        =  action.error.message;
        })
        //Is Auth============================================
        .addCase(is_Auth.pending,   (state)         => {
            state.status1       = 'loading';
            // console.log('is_Auth.pending...');
        })
        .addCase(is_Auth.fulfilled, (state, action) => {
            const account       =  action.payload; 
            // console.log('auth slice is_auth fulfilled:',account)
            state.authenticated =  true;
            state.credit        =  account.credit;
            state.contactID     =  account.contactID;
            state.email         =  account.email;
            state.status1       = 'succeeded';
            state.transactions  =  account.deals;
            
        })
        .addCase(is_Auth.rejected,  (state, action) => {
            // state.error1        =  action.error.message;
            state.status1       = 'failed';
            // console.log('auth slice is_auth rejected:',action.error.message);
        })
    }
});

export default authSlice.reducer;
