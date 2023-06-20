const updateAccount = async (data) => {
    const res = await fetch(`/profile/updateProfile`,{ 
        method     : 'PUT',
        credentials: 'include',
        body       :  JSON.stringify({...data}),
        headers    : {
            "Content-Type": "application/json"
        } 
    });
    const  json = await res.json();
    return json;
};

const uploadImage = async (formData) => {
    const res = await fetch(`/profile/uploaDImage`,{ 
        method     : 'POST',
        credentials: 'include',
        body       :  formData,
        // headers    : {
        //     "Content-Type": "application/json"
        // } 
    });
    const  json = await res.json();
    return json;
}

export { updateAccount,uploadImage };