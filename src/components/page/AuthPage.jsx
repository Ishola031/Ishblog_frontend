import React, { useEffect, useState } from 'react'
import AuthForm from './AuthForm'
const AuthPage = ({ initialMethod }) => {
    const [method, setMethod] = useState(initialMethod);

    useEffect(() => {
        setMethod(initialMethod);
    }, [initialMethod]);

    const route = method === 'login' ? '/api/token/' : '/api/user/register/'
    return (
        <>
            <AuthForm route={route} method={method} />
        </>
    )
}

export default AuthPage
