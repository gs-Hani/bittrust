import { createSlice, createAsyncThunk }   from '@reduxjs/toolkit';
import { signUp, signIn, signOut, isAuth } from '../../util/fetch/Auth';
import { updateAccount }                   from '../../util/fetch/Users';

const initialState = {
    authenticated: false, //--
    credit       : 0,     //-- from DB
    email        : null,
    error        : null,  //--
    password     : null,
    refferal_code: null,  //-- from DB
    status       :'idle', //--
    transactions :[],     //-- from HS
    userId       : null,  //-- from DB
};

export const  sign_up  = createAsyncThunk('auth/sign_up',    async (data) => {
    const/*--------------------*/{ username,email,password,date } = data;
    const  response = await signUp(username,email,password,date);
    return response;
});

export const  sign_in  = createAsyncThunk('auth/sign_in',    async (data) => {
    console.log('siging in')
    const/*--------------------*/{ email, password } = data;
    const  response = await signIn(email, password);
    return response;
});

export const  sign_out = createAsyncThunk('auth/sign_out',   async (user) => {
    const  response = await signOut(user);
    return response;
});

export const  is_Auth  = createAsyncThunk('auth/is_Auth',    async ()     => {
    const  response = await isAuth();
    return response
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
            const {user_id,email,password,credit} = action.payload
            state.authenticated =  true;
            state.userId        =  user_id;
            state.email         =  email;
            state.password      =  password;
            state.credit        =  credit;
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
            const {user1, deals}  = action.payload;
            state.authenticated =  true;
            state.credit        =  user1.credit;
            state.email         =  user1.email;
            state.password      =  user1.password;
            state.refferal_code =  user1.refferal_code;
            state.status        = 'succeeded';
            state.transactions  =  deals;
            state.userId        =  user1.user_id;  
        })
        .addCase(sign_in.rejected,  (state, action)  => {
            state.error         =  action.error.message;
            state.status        = 'failed';
        })
        //Sign Out==========================================
        .addCase(sign_out.pending,   (state)         => {
            state.status        = 'loading';
        })
        .addCase(sign_out.fulfilled, (state)         => {
            state.authenticated =  false;
            state.user_id       =  null;
            state.user_name     = "Guest";
            state.email         =  null;
            state.password      =  null;
            state.date_of_birth =  null;
            state.credit        =  0;
            state.status        = 'succeeded';
        })
        .addCase(sign_out.rejected,  (state, action) => {
            state.error         =  action.error.message;
            state.status        = 'failed';
        })
        //Is Auth============================================
        // .addCase(is_Auth.pending,    (state)         => {
        //     state.status        = 'loading';
        // })
        .addCase(is_Auth.fulfilled,  (state, action) => {
            state.authenticated =  true;
            state.status        = 'succeeded';
        })
        .addCase(is_Auth.rejected,   (state, action) => {
            // state.error         =  action.error.message;
            state.status        = 'failed';
        })
        //Update Data========================================
        .addCase(update_data.fulfilled, (state, action) => {
            const {user_name,email,password,date_of_birth} = action.payload;
            state.user_name     = user_name;
            state.email         = email;
            state.password      = password;
            state.date_of_birth = date_of_birth;
        })
        .addCase(update_data.rejected,  (state, action) => {
            state.error         =  action.error.message;
        })
    }
});

export default authSlice.reducer;
