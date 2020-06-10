const baseURL='http://localhost:3000/';
const apiHeaders={
    'Content-Type':'application/json',
    Accept:'application/json'
};

const fetchParams = (method, data='') => {
    const body= data ? {body:JSON.stringify(data)}:{};
    return {
        method:method,
        headers:apiHeaders,
        credentials:'same-origin',
        ...body
    }
}

const api= {
    //GET
    getLocations: async () => {
        const dataResponse = await fetch(baseURL+'astronomy_activator',fetchParams('GET'));
        const dataInfo = await dataResponse.json();
        return dataInfo;
    },
    //DELETE
    deleteLocations: async id => {
        const dataResponse = await fetch(baseURL+'astronomy_activator'+id,fetchParams('DELETE'));
        const dataInfo = await dataResponse.json();
        return dataInfo;
    },
    //PUT
    editLocations: async (formData,id) =>{
        const dataResponse=await fetch(baseURL+'astronomy_activator/'+id,fetchParams('PUT',formData));
        const dataInfo=await dataResponse.json();
        return dataInfo;
    },
    //POST
    createLocations: async formData =>{
        const dataResponse=await fetch(baseURL+'astronomy_activator',fetchParams('POST',formData));
        const dataInfo=await dataResponse.json();
        return dataInfo;
    }
}