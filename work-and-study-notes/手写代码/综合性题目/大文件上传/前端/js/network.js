const axios = window.axios;
const baseURL = "http://localhost:3001";

const uploadFile = (url, formData, onUploadProgress) => {
    return axios({
        baseURL,
        url,
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: formData,
        onUploadProgress
    });
}
const mergeChunks = (url, data)=> {
    return axios({
        baseURL,
        url,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data
    })
}

export {
    uploadFile,
    mergeChunks
}