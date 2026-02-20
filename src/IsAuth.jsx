import React, { createContext } from 'react'

const AuthContext = createContext()
const IsAuth = ({ children }) => {
    return (
        <AuthContext>
            {children}
        </AuthContext>
    )
}

export default IsAuth
export { AuthContext }
