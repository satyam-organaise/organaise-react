import axios from "axios";
const devURL = "https://devorganaise.com/api";
const localUrl = "http://localhost:8000/api";

// axios.interceptors.request.use(config => {
//     config.headers['Content-Type'] = 'application/json';
//     return config;
// });

const headerData = {headers: {
    'Content-Type': 'application/json'
}
}
// export const getFiles = async () => {
//     const response = await axios.post(`${devURL}/getfiles`, userID);
// }

export const removeFileApi = async (getData) => {
    const response = await axios.post(`${devURL}/removeFile`, headerData,getData);
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}

///////delete file
export const deleteFileApi = async (getData) => {
    const response = await axios.delete(`${devURL}/deleteFile`, headerData,{data:getData});
    if (!response.statusText === "OK") {
        throw new Error("Something is wrong.");
    }
    return response.data
}