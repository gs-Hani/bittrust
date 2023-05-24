const fetchRecordsIDs = async (record_id) => {
    const res = await fetch(`/transactions/records/${record_id}`,{
        method     :  'GET',
        body       :   null,
        credentials:  'include',
        headers    : {
            "Content-Type": "application/json"
        }
    });
    const  json = await res.json();
    return json;
}; 

const fetchRecordDetails = (id) => {
    // const res = await fetch(`/transactions/record/${id}`,{
    //     method     :  'GET',
    //     body       :   null,
    //     credentials:  'include',
    //     headers    : {
    //         "Content-Type": "application/json"
    //     }
    // });
    // const  json = await res.json();
    const  deal = deals.find(deal => deal.properties.hs_object_id === id);
    return deal.properties;
}; 

module.exports = { fetchRecordsIDs, fetchRecordDetails }; //================

//TO BE DELETED ===================================

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