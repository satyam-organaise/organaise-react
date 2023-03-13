import axios from "axios";
const devURL = "https://devorganaise.com/api";
const localUrl = "http://localhost:8000/api";

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

