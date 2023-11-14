import { axiosPrivate } from "../api/axios";
import { useEffect } from 'react'
import { useAuthContext } from "../context/AuthProvider";
import { getCookie } from 'cookies-next';

const useAxiosPrivate = () => {
    const { auth } = useAuthContext()

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${getCookie('accessToken')}`
                }
                return config
            }, (err) => Promise.reject(err)
        )

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (err) => {
                const prevRequest = err?.config

                if (err?.response?.status === 401 && !prevRequest?.sent) {
                    return Promise.reject(err)
                }

                return Promise.reject(err)
            }
        )

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept)
            axiosPrivate.interceptors.response.eject(responseIntercept)
        }
    }, [auth])

    return axiosPrivate
}

export default useAxiosPrivate