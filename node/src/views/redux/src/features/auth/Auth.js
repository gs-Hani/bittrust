import   React, { useEffect, useState }         from 'react';
import          { useDispatch, useSelector }    from 'react-redux';
import          { useNavigate,useSearchParams } from 'react-router-dom';

import './Auth.css';
import { sign_up, sign_in }             from './authSlice';
import { maxBirthDate , matchPassword } from '../../util/usefulFunctions';

export const Auth = () => {
    const [username, setUsername] = useState();
    const [email   , setEmail]    = useState();   
    const [password, setPassword] = useState();
    const [date    , setDate]     = useState();
    const [ref     , setRef]      = useState();
    // const [searchParams, setSearchParams] = useSearchParams();
    const  navigate               = useNavigate();
    const  dispatch               = useDispatch();
    const { authenticated }       = useSelector(state => state.auth);
    const { error }               = useSelector(state => state.auth);

    useEffect(() => { if(authenticated) {navigate('/transRecords');} },  [authenticated,navigate]);

    // registration response ==========================================================================
    const register = async  (username,email,password,date) => {
           dispatch(sign_up({username,email,password,date}));
    };
    // login response =================================================================================
    const login/*-------*/= (email,password) => {
           dispatch(sign_in({email,password}));
    };
    // slide ==========================================================================================
    const slide = () => {
        document.getElementById("sign-in-form").style.bottom = "0";
    };

    const refCodeInput = () => {
        // const params = new URL(document.location).searchParams;
        const url = new URL(document.location);
        const refCode = url.pathname.split('/')[1];
        if (!refCode) {
            return (
                <input 
                    type        ="text"
                    id          ="refCode"
                    name        ="refCode"
                    placeholder ="Refferal code"
                    onChange={(e) => setRef(e.target.value)}/>
            )
        } else {
            return (
                <input 
                    type  ="text"
                    id    ="refCode"
                    name  ="refCode"
                    value ={refCode}
                    readOnly/> 
            )
        }
    }

    return (
        <div className="auth">
            <form id ="sign-up-form"
                  onSubmit ={(e) => { e.preventDefault(); register(username,email,password,date,ref);}}
            >
                <h2>Sign UP</h2>
                <input  
                    type        ="text"
                    id          ="name"
                    name        ="name"
                    placeholder ="username (2-16) letters" 
                    minLength   ="3" 
                    maxLength   ="16"
                    autoComplete="on" 
                    onChange={(e) => setUsername(e.target.value)}
                    required />

                <input  
                    type        ="email"
                    id          ="email"
                    name        ="email"
                    placeholder ="example@emailprovider.com"
                    onChange    ={(e) => setEmail(e.target.value)}
                    size        ="25"
                    autoComplete="on"
                    required />

                <input  
                    type        ="password"
                    id          ="password"
                    name        ="password"
                    placeholder ="password"
                    onChange    ={(e) => {matchPassword(e.target.value); setPassword(e.target.value);}}
                    minLength   ="8" 
                    maxLength   ="32"
                    autoComplete="off" 
                    required />
                
                <input 
                    type        ="password"
                    id          ="confirm-password"
                    //   name        ="confirm-password" --------------------> this input won't be submitted
                    placeholder ="confirm-password"
                    onChange    ={(e) => matchPassword(e.currentTarget.value)}
                    autoComplete="off"
                    required />

                <input 
                    type    ="date"
                    id      ="date"
                    name    ="date" 
                    max     ={maxBirthDate()}
                    onChange={(e) => setDate(e.target.value)}
                    required />
                
                {refCodeInput()}

                <input 
                    type     ="submit"
                    id       ="submit"
                    value    ="Submit"
                />
            </form>
            {/*========================================================================================*/}
            <form id ="sign-in-form"
                  onSubmit ={(e) => {e.preventDefault(); login(email,password);}}
            >
                <h2>Sign IN</h2>
                <input 
                    type        ="email"
                    id          ="Email"
                    name        ="email"
                    placeholder ="example@emailprovider.com"
                    onChange    ={(e) =>  setEmail(e.target.value)}
                    size        ="25"
                    autoComplete="on"
                    // required 
                    />

                <input 
                    type        ="password"
                    id          ="Password"
                    name        ="password"
                    placeholder ="password"
                    onChange    ={(e) => setPassword(e.target.value)}
                    minLength   ="8" 
                    maxLength   ="32"
                    autoComplete="off" 
                    // required
                    />

                <input 
                    type     ="submit"
                    id       ="Submit"
                    value    ="Log in"
                />

                <button 
                    type    ="button"
                    id      ="slide"
                    onClick ={() => slide()}>
                    no account?
                </button>
            </form>

            {
                error && <span>{error}</span>
            }

        </div>
    )
}