//TO BE MOVED ELSEWHERE LATER========================
function generateCode () {
  const length  = 6;
  const charset = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let refCode = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    refCode += charset.charAt(Math.floor(Math.random() * n));
  }
  return refCode;
};

//TO BE DELETED ===================================

let user1 = 
{
    contactID    :  1,
    email        : "some_email@gmail.com",
    password     :  123,
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
  const deal1 = {
    "id": "6489785185",
    "properties": {
      "amount": "1260",
      "closedate": "2021-10-04T17:57:36Z",
      "createdate": "2021-10-04T17:57:36Z",
      "hs_lastmodifieddate": "2022-05-11T06:55:48.859Z",
      "hs_object_id": "6489785185"
    },
    "createdAt": "2021-10-04T17:57:36Z",
    "updatedAt": "2022-05-11T06:55:48.859Z",
    "archived": false
};

const deal2 = {
    "id": "6708187006",
    "properties": {
      "amount": "6470",
      "closedate": "2021-10-20T17:16:51Z",
      "createdate": "2021-10-20T17:16:51Z",
      "hs_lastmodifieddate": "2022-05-11T07:14:35.713Z",
      "hs_object_id": "6708187006"
    },
    "createdAt": "2021-10-20T17:16:51Z",
    "updatedAt": "2022-05-11T07:14:35.713Z",
    "archived": false
};

const deal3 = {
    "id": "7909162680",
    "properties": {
      "amount": "3000",
      "closedate": "2022-02-14T20:33:59Z",
      "createdate": "2022-02-14T20:33:59Z",
      "hs_lastmodifieddate": "2022-05-11T07:04:58.202Z",
      "hs_object_id": "7909162680"
    },
    "createdAt": "2022-02-14T20:33:59Z",
    "updatedAt": "2022-05-11T07:04:58.202Z",
    "archived": false
};

const deal4 = {
    "id": "7996716959",
    "properties": {
      "amount": "3125",
      "closedate": "2022-02-22T22:19:57Z",
      "createdate": "2022-02-22T22:19:57Z",
      "hs_lastmodifieddate": "2022-05-11T07:14:35.713Z",
      "hs_object_id": "7996716959"
    },
    "createdAt": "2022-02-22T22:19:57Z",
    "updatedAt": "2022-05-11T07:14:35.713Z",
    "archived": false
};

const deal5 = {
    "id": "8808142120",
    "properties": {
      "amount": "1260",
      "closedate": "2022-05-04T16:02:28Z",
      "createdate": "2022-05-04T16:02:28Z",
      "hs_lastmodifieddate": "2022-06-13T13:18:06.781Z",
      "hs_object_id": "8808142120"
    },
    "createdAt": "2022-05-04T16:02:28Z",
    "updatedAt": "2022-06-13T13:18:06.781Z",
    "archived": false
};

const deal6 ={
    "id": "9399357857",
    "properties": {
      "amount": "1000",
      "closedate": "2022-07-05T14:46:43Z",
      "createdate": "2022-07-05T14:46:43Z",
      "hs_lastmodifieddate": "2022-07-05T14:46:57.399Z",
      "hs_object_id": "9399357857"
    },
    "createdAt": "2022-07-05T14:46:43Z",
    "updatedAt": "2022-07-05T14:46:57.399Z",
    "archived": false
};

const deals = [deal1,deal2,deal3,deal4,deal5,deal6];
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
 // console.log('fetching sign in');
   // const res = await fetch(`/auth/signIn`,{
     //   method     : 'POST', 
       // credentials: 'include',
        //body       :  JSON.stringify({
            //          username: email,
              //        password: password,    
        //}),
        //headers    : {
          //  "Content-Type": "application/json"
        //} 
    //});
    //const  json = await res.json();
    //user1.transactions = json;
    //console.log(user1)
    return {user1, deals};
};

const signOut = async (user) => {
   // const res = await fetch(`/auth/sign_out`,{ 
     //   method     : 'POST',
       // credentials: 'include',
        //body       :  JSON.stringify({...user}),
        //headers    : {
          //  "Content-Type": "application/json"
       // } 
    //});
    //const  json = await res.json();
    return true;
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
