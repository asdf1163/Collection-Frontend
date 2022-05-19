import axios from "axios";

// export const url = 'https://project-collection001.herokuapp.com/api'
export const url = 'http://localhost:5000/api'

axios.defaults.withCredentials = true;
export const instance = axios.create({
    baseURL: url,
    withCredentials: true,
});
