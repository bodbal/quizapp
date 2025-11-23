import axios from "axios";

export const BACKEND_URL ="http://localhost:3000"
 
const apiClinet = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type" : "application/json"
    }
})

export default apiClinet