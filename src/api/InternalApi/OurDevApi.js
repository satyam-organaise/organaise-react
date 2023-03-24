import axios from "axios";
const devURL = "https://devorganaise.com/api";
const localUrl = "http://localhost:8000/api";

const UserApiVersion = "/v1/user";
const ChatApiVersion  = "/v1/chat"

// axios.interceptors.request.use(config => {
//     config.headers['Content-Type'] = 'application/json';
//     return config;
// });

const headerData =
{
    headers: {
        'Content-Type': 'application/json'
    }
}

//////-------------------------------///////////
/////user inserting api call in new  version////
//////-------------------------------///////////

export const userCreateAccount = async (getData) => {
    const response = await axios.post(`${localUrl}${UserApiVersion}/`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

////////-----------------------------//////////
//////// user login our new version ///////////
///////-----------------------------///////////

export const userLoginAccount = async (getData) => {
    const response = await axios.post(`${localUrl}${UserApiVersion}/login`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}


///////----------------------------///////////
/////// search user on new version ///////////
///////----------------------------///////////

export const searchUserV1 = async (getData) => {

    const response = await axios.get(`${localUrl}${UserApiVersion}/?search=${getData.search}`, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}


/////////-----------------------------/////////
///////// access the chat /////////////////////
///////////------------------------////////////

export const SingleUserchatAccess = async (getData) => {
    const response = await axios.post(`${localUrl}${ChatApiVersion}`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}


////////// ----------------------------- ////////
////////// fetch chart of group or user//////////
//////////-------------------------------////////

export const fetchAllChatSingleUserOrGroup =  async(getData)=>{
    const response = await axios.get(`${localUrl}${ChatApiVersion}`, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}







////////// Create company api call
export const postCompannyName = async (getData) => {
    const response = await axios.post(`${devURL}/createCompany`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

export const getCompanyName = async (userID) => {
    const response = await axios.get(`${devURL}/createCompany?userId=${userID}`);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

export const removeFileApi = async (getData) => {
    const response = await axios.post(`${devURL}/removeFile`, getData, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

///////delete file
export const deleteFileApi = async (getData) => {
    const response = await axios.delete(`${devURL}/deleteFile`, { data: getData }, headerData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}



