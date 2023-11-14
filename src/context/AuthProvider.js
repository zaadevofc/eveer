import { createContext, useContext, useState } from 'react'
import { getCookie } from 'cookies-next';

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const cookieToken = getCookie('accessToken')
    const [auth, setAuth] = useState(cookieToken == null ? '' : cookieToken)
    const [profil, setProfil] = useState({})

    return (
        <AuthContext.Provider value={{ auth, setAuth, profil, setProfil }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(AuthContext);
}
