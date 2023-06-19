import React, { useEffect,useState }      from 'react';
import        { useSelector,useDispatch } from 'react-redux';
import        { useNavigate }             from 'react-router-dom';
import        { update_data }             from '../auth/authSlice';
import        { upload_Image }            from './profileSlice'
import        { matchPassword }           from '../../util/usefulFunctions';

import './Profile.css';

const  FormData = require('form-data');

export const Profile = () => {
    const [email      , setEmail      ] = useState();   
    const [password   , setPassword   ] = useState();
    const [newPassword, setNewPassword] = useState();
    const [showAlert  , setShowAlert  ] = useState(false);
    const [alertText  , setAlertText  ] = useState('');
    const [credential , setCredential ] = useState(false);
    const [file       , setFile       ] = useState(null);
    const  navigate                     = useNavigate();
    const  dispatch                     = useDispatch();
    const  auth                         = useSelector(state => state.auth);
    const  profile                      = useSelector(state => state.profile);
    console.log(auth);
    useEffect(() => { if(!auth.authenticated) {navigate('/');} },  [navigate,auth.authenticated]);
    useEffect(() => console.log(auth.status), [auth.status]);

    const updateAccount = async (email,password,newPassword) => {
        let E; let NP;
        !email       ? E  = auth.email  : E  = email;
        !newPassword ? NP = password       : NP = newPassword;
        dispatch(update_data({  contactID  : auth.contactID,
                                email      : E, 
                                password   : password, 
                                newPassword: NP, 
        }));
    };

    const uploadImage = async (e) => {
      const formData = new FormData();
      console.log(auth.contactID,file);
      formData.append('content',file);
      formData.append('contactID',auth.contactID);
      console.log(formData);
      dispatch(upload_Image(formData));
    };

    const handleFile = (e) => {
      const file = e.target.files[0];
      console.log(file);
      setFile(file);
    };

    const copyValue = (id) => {
        const copyText = document.getElementById(id);
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices
        navigator.clipboard.writeText(copyText.value);
        setAlertText(`Copied the text: ${copyText.value}`);
        setShowAlert(true);
    
        // Hide the alert after 3 seconds
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      };
    const toggle = () => {
      setCredential(!credential);
      };

    const URL = generateURL(auth.contactID);

    if      (auth.status === 'loading')   { return (<p>...Loading</p>) }
    else if (auth.status === 'succeeded') {
      return (
        <div>
          <div  id="profileCard" 
                className="container" >
            <form id="updateProfile"
                  onSubmit ={(e) => { e.preventDefault();updateAccount(email,password,newPassword); document.getElementById("updateProfile").reset(); }}
            >
              <div className='gridbox'>
                <h2>E-mail:</h2>
                <h3>{auth.email}</h3>
              </div>
              <button onClick={toggle}>Change credentials</button>
              {credential && (
              <div className="toggled">
                <h5>Change Email</h5>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="someEmail@emailprovider.com"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="changePassword">
                  <h5>Change password</h5>
                  <input
                    type="password"
                    id="password"
                    name="new password"
                    placeholder="new password"
                    autoComplete="off"
                    onChange={(e) => {
                      matchPassword(e.target.value);
                      setNewPassword(e.target.value);
                    }}
                  />
                  <input
                  type="password"
                  id="confirm-password"
                  placeholder="confirm new password"
                  autoComplete="off"
                  onChange={(e) => matchPassword(e.target.value)}
                  />
                </div>
                <h5>Confirm changes</h5>
                <input
                  type="password"
                  id="old-password"
                  name="password"
                  placeholder="Current password"
                  minLength="8"
                  maxLength="32"
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input type="submit" id="submit-password" value="Submit" />
              </div>
              )}
              {auth.error && <p>{auth.error}</p>}
            </form>
          </div>
          <div className="container">
            <h3>Referral code</h3>
            <input type="text" value={auth.contactID} id="refCode" readOnly />
            <button className="button" onClick={() => copyValue("refCode")}>Copy text</button>
            <h3>Referral link</h3>
            <input type="text" value={URL} id="refLink" readOnly />
            <button className="button" onClick={() => copyValue("refLink")}>Copy text</button>
            {showAlert && ( <div className="alert">
                              <p>{alertText}</p>
                            </div>
                          )}
          </div>
          <form  className='container'>
            <h3>Upload ID</h3>
            <input  type='file' 
                    name='content'
                    accept=".jpg,.jpeg,.png,.tif,.tiff,.ico,.bmp,.webp" 
                    id='file' 
                    className='button' 
                    onChange={(e)=>handleFile(e)}/>
            <input className='input-button' value='Upload' type="button" onClick={(e) => uploadImage(e)}/>
            {profile.error && <p>{profile.error}</p>}
            {profile.status === "succeeded" && <p>{profile.status}</p>}
          </form>
        </div>    
      )
    }
};


const url = new URL(document.location);
let   domain = url.pathname.split('/');
// console.log(url);
// console.log(domain);
domain.pop();
// console.log(domain);
function generateURL(refCode) {
    // const  baseURL = `http://${domain[0]}`;
    const  newUrl  = new URL(`${refCode}`,url.origin);
    return newUrl;
}