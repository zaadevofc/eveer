import { createContext, useContext, useState } from 'react'
import { getCookie } from 'cookies-next';

const KonfigurasiContext = createContext({})

export const KonfigurasiProvider = ({ children }) => {
    const [namaAplikasi, setNamaAplikasi] = useState('')
    const [logoAplikasi, setLogoAplikasi] = useState('')
    const [gambarAplikasi, setGambarAplikasi] = useState('')
    const [deskripsiAplikasi, setDeskripsiAplikasi] = useState('')

    return (
        <KonfigurasiContext.Provider value={{ namaAplikasi, setNamaAplikasi, logoAplikasi, setLogoAplikasi, gambarAplikasi, setGambarAplikasi, deskripsiAplikasi, setDeskripsiAplikasi }}>
            {children}
        </KonfigurasiContext.Provider>
    )
}

export function useKonfigurasiContext() {
    return useContext(KonfigurasiContext);
}
