import   React, { useEffect,useState }      from 'react';
import          { useSelector,useDispatch } from 'react-redux';
import          { useNavigate }             from 'react-router-dom';

import          { update_data }             from '../auth/authSlice';
import          { matchPassword }           from '../../util/usefulFunctions';

import './Profile.css';

export const Profile = () => {
    const [email      , setEmail      ] = useState();   
    const [password   , setPassword   ] = useState();
    const [newPassword, setNewPassword] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [credential, setCredential] = useState(false);
    const  navigate                     = useNavigate();
    const  dispatch                     = useDispatch();
    const  profile                      = useSelector(state => state.auth);
    console.log(profile);
    useEffect(() => { if(!profile.authenticated) {navigate('/');} },  [navigate,profile.authenticated]);
    useEffect(() => console.log(profile.status), [profile.status]);

    const updateAccount = async (email,password,newPassword) => {
        let E; let NP;
        !email       ? E  = profile.email  : E  = email;
        !newPassword ? NP = password       : NP = newPassword;
        dispatch(update_data({  contactID  : profile.contactID,
                                email      : E, 
                                password   : password, 
                                newPassword: NP, 
        }));
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

    const URL = generateURL(profile.contactID);

    if      (profile.status === 'loading')   { return (<p>...Loading</p>) }
    else if (profile.status === 'succeeded') {
        return (
            <div>
                <div id="profileCard">
                    <div>
                        <h2>E-mail</h2>
                            <h3>{profile.email}</h3>
                            <form   id="updateProfile"
                                    onSubmit ={(e) => { e.preventDefault(); 
                                              updateAccount(email,password,newPassword);
                                              document.getElementById("updateProfile").reset(); }}
                            >
                                <h4>Change email</h4>
                                <input  type        ="email"
                                        id          ="email"
                                        name        ="email"
                                        placeholder ="someEmail@emailprovider.com"
                                        // size        ="25"
                                        autoComplete="off"
                                        onChange    ={(e) => setEmail(e.target.value)} 
                                        />
                                <div id='passwords'>
                                    <h4>Change password</h4>
                                    <input  type        ="password"
                                            id          ="password"
                                            name        ="new password"
                                            placeholder ="new password"
                                            autoComplete="off"
                                            onChange    ={(e) => {matchPassword(e.target.value);setNewPassword(e.target.value);}}
                                            />
                                    <input  type        ="password"
                                            id          ="confirm-password"
                                            //   name        ="confirm new password" --------------------> this input won't be submitted
                                            placeholder ="confirm new password"
                                            autoComplete="off"
                                            onChange    ={(e) => {matchPassword(e.target.value);}}
                                            />
                                </div>
                                <h4>Enter current password to confirm</h4>
                                <input  type        ="password"
                                        id          ="old password"
                                        name        ="password"
                                        placeholder ="Current password"
                                        minLength   ="8" 
                                        maxLength   ="32"
                                        autoComplete="off"
                                        onChange    ={(e) => {setPassword(e.target.value);}}
                                        required 
                                        />
                                <input  type     ="submit"
                                        id       ="submit"
                                        value    ="Submit"
                                        />
                            </form>
                    </div>
                    <div>
                        <h2>Referrals</h2>
                            <h3>Referral code</h3>
                            <input type="text" value={profile.contactID} id="refCode" readOnly></input>
                                <button onClick={() => copyValue("refCode")}>Copy text</button>
                            <h3>Referral link</h3>
                            <input type="text" value={URL} id="refLink" readOnly></input>
                                <button onClick={() => copyValue("refLink")}>Copy text</button>
                    </div>

                </div>

             {/*Upload ID --------------------- section  */}






                <form  className='container' method='post' action='/profile/uploadImage' enctype='multipart/form-data'>
                    <h3>Upload ID</h3>
                    <input type='file' name='content' id='file' className='button'/>
                    <input type='hidden' name='contactID' id='ID' readOnly value={profile.contactID}/>
                    <input class='input-button' type='submit' value='Upload'/>
                </form>
            </div>
            
        )
    }
};


const url = new URL(document.location);
let   domain = url.pathname.split('/');
console.log(url);
console.log(domain);
domain.pop();
console.log(domain);
function generateURL(refCode) {
    // const  baseURL = `http://${domain[0]}`;
    const  newUrl  = new URL(`${refCode}`,url.origin);
    return newUrl;
}