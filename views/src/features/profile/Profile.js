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

    const URL = generateURL(profile.refferal_code);

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
                            <input type="text" value={profile.refferal_code} id="refCode" readOnly></input>
                                <button onclick={() => copyValue("refCode")}>Copy text</button>
                            <h3>Referral link</h3>
                            <input type="text" value={URL} id="refLink" readOnly></input>
                                <button onclick={() => copyValue("refLink")}>Copy text</button>
                    </div>
                </div>
                <form method='post' action='/profile/uploadImage' enctype='multipart/form-data'>
                    <h2>Upload ID</h2>
                    <input type='file' name='content' id='file'/>
                    <input type='hidden' name='contactID' id='ID' readOnly value={profile.contactID}/>
                    <input class='input-button' type='submit' value='Upload'/>
                </form>
            </div>
            
        )
    }
};

function copyValue(id) {
    // Get the text field
    var copyText = document.getElementById(id);
    
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    console.log(copyText.value);
    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
  
    // Alert the copied text
    alert("Copied the text: " + copyText.value);
};

function generateURL(refCode) {
    const  baseURL = 'http://localhost:3000';
    const  newUrl  = new URL(`${refCode}`,baseURL);
    return newUrl;
}