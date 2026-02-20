import { jwtDecode } from 'jwt-decode'
import api from './api'
import { ACCESS_TOKEN, REFRESH_TOKEN, GOOGLE_ACCESS_TOKEN } from './token'
import { useEffect, useState } from 'react'

export const useAuthentication = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // useEffect(() => {
    //     console.log(isAuthenticated)
    // }, [isAuthenticated])

    useEffect(() => {

        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN)
            const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN)

            if (token) {
                const decoded = jwtDecode(token);
                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;

                if (tokenExpiration < now) {
                    await refreshToken();
                } else {
                    setIsAuthenticated(true);
                }
            } else if (googleAccessToken) {
                const isGoogleTokenValid = await validateGoogleToken(googleAccessToken)
                if (isGoogleTokenValid) {
                    setIsAuthenticated(true)
                } else {
                    setIsAuthenticated(false)
                }
            }

        }
        auth().catch(() => setIsAuthenticated(false));
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post('api/token/refresh/', {
                refresh: refreshToken,
            })
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false)
            }
        } catch (error) {
            console.error("Error refreshing token", error);
            setIsAuthenticated(false)
        }
    };

    const validateGoogleToken = async (googleAccessToken) => {
        try {
            const res = await api.post('/api/google/validate_token/', {
                access_token: googleAccessToken,
            });
            return res.data.valid;
        } catch (error) {
            console.error('Google token validation failed', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(GOOGLE_ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        setIsAuthenticated(false);
        window.location.reload();
    }

    return { isAuthenticated, logout };
}


