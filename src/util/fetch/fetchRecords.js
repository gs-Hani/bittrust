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
    //const  deal = deals.find(deal => deal.properties.hs_object_id === id);
    //return deal.properties;
}; 

export { fetchRecordsIDs, fetchRecordDetails };

