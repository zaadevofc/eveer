import React, { useEffect } from 'react'
import Launcher from './Launcher'
import { useKonfigurasiContext } from '../context/KonfigurasiProvider';
import { useAuthContext } from '../context/AuthProvider';
import Link from 'next/link';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Button } from 'react-bootstrap';

const Template = ({ children }) => {
    const axios = useAxiosPrivate();
    const router = useRouter();
    const { auth, setAuth, profil, setProfil } = useAuthContext();
    const { namaAplikasi, logoAplikasi } = useKonfigurasiContext();
    const handleLogout = () => {
        setAuth('')
        setProfil({})
        deleteCookie('accessToken')
        router.push('/')
    }
    useEffect(() => {
        const getProfilDiri = async () => {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API}/account/me`
            }).then((res) => {
                if (res.data?.id) {
                    setProfil(res.data)
                }
            }).catch((err) => {
                console.error(err)
            })
        }

        if (auth && auth != '') {
            getProfilDiri()
            const cookie = getCookie('collapsed_sidebar')
        }
    }, [auth])
    return (
        <Launcher>
            <nav className="navbar navbar-expand-lg bg-light navbar-light">
                <div className="container">
                    <Link className="navbar-brand" href="/">
                        <img style={{ width: 60, height: 60, objectFit: 'cover' }} src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/konfigurasi/gambar/${logoAplikasi}`} alt="" />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" href="/">Beranda</Link>
                            </li>
                            {(profil?.role === 'Admin' || profil?.role === 'Panitia') && (
                                <li className="nav-item">
                                    <Link className="nav-link" href="/dashboard">Dashboard</Link>
                                </li>
                            )}
                        </ul>
                        <ul className='navbar-nav ms-auto'>
                            {Object.keys(profil).length === 0 ? (
                                <li className="nav-item">
                                    <Button variant="primary" href='/login'>Masuk</Button>
                                </li>
                            ) : (
                                <li className="nav-item">
                                    <Button variant="danger" onClick={handleLogout}>Logout</Button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <div className='px-md-5 px-3 py-4' style={{ minHeight: '84vh', backgroundColor: 'rgba(178, 178, 178, 0.70)' }}>
                {children}
            </div>
            <footer className='p-3 bg-light'>
                <p className='m-0 text-center text-black'>Copyright &copy; ichsan Hanifdeal</p>
            </footer>
        </Launcher>
    )
}

export default Template