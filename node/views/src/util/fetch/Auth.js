//TO BE MOVED ELSEWHERE LATER========================
function generateCode () {
  const length  = 6;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let refCode = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    refCode += charset.charAt(Math.floor(Math.random() * n));
  }
  return refCode;
};

//TO BE DELETED ===================================

const user1 = 
{
    user_id      :  1,
    record_id    :  3201,
    user_name    : "Guest",
    email        : "anyfieldmusic@gmail.com",
    password     :  123,
    date_of_birth:  null,
    credit       :  0,
    refferal_code:  generateCode()
};

const data = {
    "id": "30251",
    "properties": {
      "createdate": "2021-10-04T17:52:16.207Z",
      "email": "anyfieldmusic@gmail.com",
      "hs_object_id": "30251",
      "lastmodifieddate": "2023-01-30T07:11:52.119Z"
    },
    "createdAt": "2021-10-04T17:52:16.207Z",
    "updatedAt": "2023-01-30T07:11:52.119Z",
    "archived": false,
    "associations": {
      "deals": {
        "results": [
          {
            "id": "6489785185",
            "type": "contact_to_deal"
          },
          {
            "id": "6708187006",
            "type": "contact_to_deal"
          },
          {
            "id": "7909162680",
            "type": "contact_to_deal"
          },
          {
            "id": "7996716959",
            "type": "contact_to_deal"
          },
          {
            "id": "8808142120",
            "type": "contact_to_deal"
          },
          {
            "id": "9399357857",
            "type": "contact_to_deal"
          }
        ]
      }
    }
  }
//===================================

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
    // const res = await fetch(`/auth/signIn`,{
    //     method     : 'POST', 
    //     credentials: 'include',
    //     body       :  JSON.stringify({
    //                   username: email,
    //                   password: password,    
    //     }),
    //     headers    : {
    //         "Content-Type": "application/json"
    //     } 
    // });
    // const  json = await res.json();
    return {user1,json:data.associations.deals.results};
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
