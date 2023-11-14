import axios from "axios"
export const BASE_URL = process.env.NEXT_PUBLIC_RESTFUL_API

export default axios.create({
    baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})