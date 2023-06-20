const user1 = {
  "email": "hani_alazawi@hotmail.com",
  "id": "2601",
  "referral_credit": "0",
  "password": "$2b$17$/j6t2j7BPanmDAEIvadj9udqAvtLDGGNfcE3Dsb1nIL5BRtVv76CO",
  "deals":[
    {
      "id": "6489785185",
      "amount": "1260",
      "date": "2021-10-04",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "6708187006",
      "amount": "6470",
      "date": "2021-10-20",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "7909162680",
      "amount": "3000",
      "date": "2022-02-14",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "7996716959",
      "amount": "3125",
      "date": "2022-02-22",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "8808142120",
      "amount": "1260",
      "date": "2022-05-04",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "9399357857",
      "amount": "1000",
      "date": "2022-07-05",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "6489785185",
      "amount": "1260",
      "date": "2021-10-04",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "6708187006",
      "amount": "6470",
      "date": "2021-10-20",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "7909162680",
      "amount": "3000",
      "date": "2022-02-14",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "7996716959",
      "amount": "3125",
      "date": "2022-02-22",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "8808142120",
      "amount": "1260",
      "date": "2022-05-04",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "9399357857",
      "amount": "1000",
      "date": "2022-07-05",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "6489785185",
      "amount": "1260",
      "date": "2021-10-04",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "6708187006",
      "amount": "6470",
      "date": "2021-10-20",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "7909162680",
      "amount": "3000",
      "date": "2022-02-14",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "7996716959",
      "amount": "3125",
      "date": "2022-02-22",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "8808142120",
      "amount": "1260",
      "date": "2022-05-04",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "9399357857",
      "amount": "1000",
      "date": "2022-07-05",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "6489785185",
      "amount": "1260",
      "date": "2021-10-04",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "6708187006",
      "amount": "6470",
      "date": "2021-10-20",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "7909162680",
      "amount": "3000",
      "date": "2022-02-14",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "7996716959",
      "amount": "3125",
      "date": "2022-02-22",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "8808142120",
      "amount": "1260",
      "date": "2022-05-04",
      "dealName": "Buy 500 bits"
    },
    {
      "id": "9399357857",
      "amount": "1000",
      "date": "2022-07-05",
      "dealName": "Buy 500 bits"
    }
  ],
};
//===================================

const signUp  = async(password,email,ref) => {
    const res = await fetch(`/auth/signUp`, { 
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
 console.log('fetching sign in');
  const res = await fetch(`/auth/signIn`,{
    method     : 'POST', 
    credentials: 'include',
    body       :  JSON.stringify({ email,password }),
    headers    : { "Content-Type": "application/json" } 
  });
  const  json = await res.json();
  console.log('signIn res:',json);
  return json;
};

export { signUp, signIn };
