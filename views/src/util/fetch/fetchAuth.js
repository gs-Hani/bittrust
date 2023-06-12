const user1 = {
  "account" : {
    "id": "2601",
    "properties": {
      "commission": "0.2",
      "createdate": "2021-10-04T17:52:16.207Z",
      "email": "hani_alazawi@hotmail.com",
      "hs_object_id": "2601",
      "password": "$2b$17$/j6t2j7BPanmDAEIvadj9udqAvtLDGGNfcE3Dsb1nIL5BRtVv76CO",
      "lastmodifieddate": "2023-01-30T07:11:52.119Z",
      "referral_code": "PmNjzz",
      "referral_credit": "0"
    },
    "createdAt": "2021-10-04T17:52:16.207Z",
    "updatedAt": "2023-01-30T07:11:52.119Z",
    "archived": false,
    "associations": {
      "deals": {
        "results": [
          {
            "id": "6489785185",
            "amount": "1260",
            "date": "2021-10-04"
          },
          {
            "id": "6708187006",
            "amount": "6470",
            "date": "2021-10-20"
          },
          {
            "id": "7909162680",
            "amount": "3000",
            "date": "2022-02-14"
          },
          {
            "id": "7996716959",
            "amount": "3125",
            "date": "2022-02-22"
          },
          {
            "id": "8808142120",
            "amount": "1260",
            "date": "2022-05-04"
          },
          {
            "id": "9399357857",
            "amount": "1000",
            "date": "2022-07-05"
          },
          {
            "id": "6489785185",
            "amount": "1260",
            "date": "2021-10-04"
          },
          {
            "id": "6708187006",
            "amount": "6470",
            "date": "2021-10-20"
          },
          {
            "id": "7909162680",
            "amount": "3000",
            "date": "2022-02-14"
          },
          {
            "id": "7996716959",
            "amount": "3125",
            "date": "2022-02-22"
          },
          {
            "id": "8808142120",
            "amount": "1260",
            "date": "2022-05-04"
          },
          {
            "id": "9399357857",
            "amount": "1000",
            "date": "2022-07-05"
          },
          {
            "id": "6489785185",
            "amount": "1260",
            "date": "2021-10-04"
          },
          {
            "id": "6708187006",
            "amount": "6470",
            "date": "2021-10-20"
          },
          {
            "id": "7909162680",
            "amount": "3000",
            "date": "2022-02-14"
          },
          {
            "id": "7996716959",
            "amount": "3125",
            "date": "2022-02-22"
          },
          {
            "id": "8808142120",
            "amount": "1260",
            "date": "2022-05-04"
          },
          {
            "id": "9399357857",
            "amount": "1000",
            "date": "2022-07-05"
          },
          {
            "id": "6489785185",
            "amount": "1260",
            "date": "2021-10-04"
          },
          {
            "id": "6708187006",
            "amount": "6470",
            "date": "2021-10-20"
          },
          {
            "id": "7909162680",
            "amount": "3000",
            "date": "2022-02-14"
          },
          {
            "id": "7996716959",
            "amount": "3125",
            "date": "2022-02-22"
          },
          {
            "id": "8808142120",
            "amount": "1260",
            "date": "2022-05-04"
          },
          {
            "id": "9399357857",
            "amount": "1000",
            "date": "2022-07-05"
          }
        ]
      }
    }
  }
};
//===================================

const signUp  = async(password,email,ref) => {
    const res = await fetch(`/auth/sign_up`, { 
        method     : 'POST',
        credentials: 'include',
        body       :  JSON.stringify({
                      email:       email,
                      password:    password,
                      referred_by: ref
        }),
        headers    : {
            "Content-Type": "application/json"
        } 
    });
    const  json = await res.json();
    return json;
};

const signIn  = async (email,password) => {
//  console.log('fetching sign in');
//   const res = await fetch(`/auth/signIn`,{
//     method     : 'POST', 
//     credentials: 'include',
//     body       :  JSON.stringify({
//                      username: email,
//                      password: password,    
//                 }),
//     headers    : {
//                   "Content-Type": "application/json"
//     } 
//   });
//   const json = await res.json();
  console.log(user1)
  return user1;
};

module.exports = { signUp, signIn };
