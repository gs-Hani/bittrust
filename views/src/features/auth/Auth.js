import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector }   from 'react-redux';
import { useNavigate }                from 'react-router-dom';

import './Auth.css';
import { sign_up, sign_in }           from './authSlice';
import { matchPassword }              from '../../util/usefulFunctions';
import { Loading }                    from '../../components/loading/Loading';

export const Auth = () => {
  const [email, setEmail]           = useState();
  const [password, setPassword]     = useState();
  const [ref, setRef]               = useState();
  const [showSignUp, setShowSignUp] = useState(true);
  const  navigate                   = useNavigate();
  const  dispatch                   = useDispatch();
  const { authenticated }           = useSelector((state) => state.auth);
  const { error1 }                  = useSelector((state) => state.auth);
  const { status1 }                 = useSelector((state) => state.auth)
  
  useEffect(() => {
    // console.log('auth page useEffect:',authenticated);
    if (authenticated) { navigate('/transRecords'); } 
  }, [authenticated, navigate]);

  const register = async (email, password, ref) => {
    dispatch(sign_up({ email, password, ref }));
  };

  const login = (email, password) => {
    // console.log('dispatch sign_in')
    dispatch(sign_in({ email, password }));
  };

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  const refCodeInput = () => {
    const url = new URL(document.location);
    const refCode = url.pathname.split('/')[1];
    if (!refCode) {
      return (
        <input
          type="text"
          id="refCode"
          name="refCode"
          placeholder="Refferal code"
          onChange={(e) => setRef(e.target.value)}
        />
      );
    } else {
      return (
        <input
          type="text"
          id="refCode"
          name="refCode"
          value={refCode}
          readOnly
        />
      );
    }
  };

  const auth = () => {
    return (
      <div className="auth">
        {showSignUp ? (
          <form
            id="sign-in-form"
            onSubmit={(e) => { e.preventDefault(); login(email, password) }}
          >
            <h2>Sign IN</h2>
            <input
              type        ="email"
              id          ="Email"
              name        ="email"
              placeholder ="example@emailprovider.com"
              onChange    ={(e) => setEmail(e.target.value)}
              size        ="25"
              autoComplete="on"
              required
            />
  
            <input
              type        ="password"
              id          ="Password"
              name        ="password"
              placeholder ="password"
              onChange    ={(e) => setPassword(e.target.value)}
              // minLength   ="8"
              maxLength   ="32"
              autoComplete="off"
              required
            />
  
            <input  type ="submit" 
                    id   ="Submit" 
                    value="Log in"
            />
  
            <button type="button" id="slide" onClick={toggleSignUp}>
              no account?
            </button>
          </form>
        ) : null}
  
        {/*========================================================================================*/}
        {showSignUp ? null : (
          <form
            id="sign-up-form"
            onSubmit={(e) => { e.preventDefault(); register(email, password, ref); }}
          >
            <h2>Sign UP</h2>
  
            <input
              type        ="email"
              id          ="email"
              name        ="email"
              placeholder ="example@emailprovider.com"
              onChange    ={(e) => setEmail(e.target.value)}
              size        ="25"
              autoComplete="on"
              required
            />
  
            <input
              type        ="password"
              id          ="password"
              name        ="password"
              placeholder ="password"
              onChange    ={(e) => { matchPassword(e.target.value); setPassword(e.target.value); }}
              minLength   ="8"
              maxLength   ="32"
              autoComplete="off"
              required
            />
    
            <input
              type        ="password"
              id          ="confirm-password"
              placeholder ="confirm-password"
              onChange    ={(e) => matchPassword(e.currentTarget.value)}
              autoComplete="off"
              required
            />
    
            {refCodeInput()}
    
            <input type="submit" id="submit" value="Register" />
            <button type="button" id="slide" onClick={toggleSignUp}>
              Sign In
            </button>
          </form>
          )}
    
          {error1 && <p>{error1}</p>}
        </div>
      );
  }

  return (
    <div>
      {status1 === 'loading' ? Loading() : auth() }
    </div>
  )
};
  