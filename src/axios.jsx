import axios from "axios"
const  API = axios.create({
    baseURL : "http://localhost:8080/api"
});
export  default API;
   // avoid using the same api repeatedly
   //to configure the shared settings ( timeout,headers) in one place