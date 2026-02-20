import axios from 'axios'
import { ACCESS_TOKEN, REFRESH_TOKEN } from './token'

const apiUrl = '/choreo-apis/awbo/backend/rest-api-be2/v1.0'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
})

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN)
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        const googleAccessToken = localStorage.getItem('GOOGLE_ACCESS_TOKEN')
        if (googleAccessToken) {
            config.headers.Authorization = `Bearer ${googleAccessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
)


api.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest.retry) {
            originalRequest.retry = true
            try {
                const response = await axios.post(`${baseURL}api/token/refresh/`, { refresh: refreshToken })
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh)
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                console.log(response.data.access)
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`
                return api(originalRequest)
            } catch (error) {

            }
        }
        return Promise.reject(error);
    }
)


export default api

const refreshToken = localStorage.getItem(REFRESH_TOKEN)
//  catch (error) {
//     localStorage.removeItem(ACCESS_TOKEN)
//     localStorage.removeItem(REFRESH_TOKEN)
//     console.log(error)
// }