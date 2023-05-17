const signUp  = async(username,email,password,date) => {
    const res = await fetch(`/auth/sign_up`, { 
        method     : 'POST',
        credentials: 'include',
        body       :  JSON.stringify({
                      user_name:     username,
                      email:         email,
                      password:      password,
                      date_of_birth: date
        }),
        headers    : {
            "Content-Type": "application/json"
        } 
    });
    const  json = await res.json();
    return json;
};

const signIn  = async (email,password) => {
    const res = await fetch(`/auth/sign_in`,{
        method     : 'POST', 
        credentials: 'include',
        body       :  JSON.stringify({
                      username: email,
                      password: password,    
        }),
        headers    : {
            "Content-Type": "application/json"
        } 
    });
    const  json = await res.json();
    return json;
};

const signOut = async (user) => {
    const res = await fetch(`/auth/sign_out`,{ 
        method     : 'POST',
        credentials: 'include',
        body       :  JSON.stringify({...user}),
        headers    : {
            "Content-Type": "application/json"
        } 
    });
    const  json = await res.json();
    return json;
};

const isAuth  = async () => {
    const res = await fetch(`/auth/checkauth`,{ 
        method     : 'GET',
        credentials: 'include',
        body       :  null,
        headers    : {
            "Content-Type": "application/json"
        } 
    });
    const  json = await res.json();
    return json;
};

module.exports = { signUp, signIn, signOut, isAuth };