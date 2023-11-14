import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../context/AuthProvider'
import { useKonfigurasiContext } from '../context/KonfigurasiProvider'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Launcher from './Launcher'
import styles from '../../styles/Template.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faBars, faCircle, faCogs, faDashboard, faExclamationTriangle, faLock, faMoneyBill, faMoneyBill1Wave, faSignOutAlt, faUserCog, faUsersCog } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import SimpleBar from 'simplebar-react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import ModalBody from './ModalBody'
import { faImages, faNewspaper } from '@fortawesome/free-regular-svg-icons'

const Template = ({ header = null, breadCrumb = null, breadCrumbRightContent, children }) => {
    const axios = useAxiosPrivate();
    const router = useRouter();
    const currentURL = router.pathname;
    const [isShowedSidebar, setIsShowedSidebar] = useState(false)
    const [isCollapseSidebar, setIsCollapseSidebar] = useState(false)
    const { auth, setAuth, profil, setProfil } = useAuthContext();
    const { namaAplikasi, logoAplikasi } = useKonfigurasiContext();
    const BreadCrumb = () => {
        return (
            <>
                {breadCrumb && breadCrumb.map((val, index) => (
                    <span key={index}>
                        {val.link ? (
                            <Link className='text-decoration-none pe-3 text-dark' style={{ fontWeight: '500' }} href={val.link}>{val.label}</Link>
                        ) : (
                            <span className="text-decoration-none pe-3 text-muted">{val.label}</span>
                        )}
                        <span>{index + 1 !== breadCrumb.length && <FontAwesomeIcon icon={faCircle} size={'xs'} className='pe-3' />}</span>
                    </span>
                ))}
            </>
        )
    }
    const handleCollapse = () => {
        const condition = !isCollapseSidebar;
        setCookie('collapsed_sidebar', condition, {
            maxAge: 86400 * 30
        })
        setIsCollapseSidebar(condition)
    }
    const handleCollapseMobile = () => {
        const condition = !isShowedSidebar
        setCookie('collapsed_sidebar', false, {
            maxAge: 86400 * 30
        })
        setIsCollapseSidebar(false)
        setIsShowedSidebar(condition)
    }
    const handleLogout = () => {
        setAuth('')
        setProfil({})
        deleteCookie('accessToken')
        router.push('/')
    }
    useEffect(() => {
        [].slice.call(document.querySelectorAll('.popover')).map((val, index, arr) => {
            val.remove()
        })
        setTimeout(() => {
            var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
            popoverTriggerList.map(function (popoverTriggerEl) {
                return new bootstrap.Popover(popoverTriggerEl)
            })
        }, 1000)
    }, [router.asPath])
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
            setIsCollapseSidebar(cookie !== undefined ? cookie : false)
        }
    }, [auth])
    return (
        <Launcher>
            <div className='d-md-flex d-block' style={{ minHeight: '100vh' }}>
                {/* Topbar */}
                <div style={{ width: 'calc(100% - ' + (isCollapseSidebar ? '80px' : '280px') + ')' }} className={`${styles.topbar} px-md-5 px-3`}>
                    <div>
                        <a className='d-block d-md-none' onClick={handleCollapseMobile}>
                            <FontAwesomeIcon icon={faBars} fixedWidth />
                        </a>
                    </div>
                    <a id="dropdown_aksi" data-bs-toggle="dropdown" aria-expanded="false" href='#!' className={styles['profile-info-picture-container']}>
                        <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/account/foto-profil/${profil?.gambar}`} alt="" />
                    </a>
                    <div className="shadow-sm dropdown-menu px-2 py-3 ms-sm-n4 ms-n5 rounded-xl" style={{ marginTop: 15, right: 0, minWidth: 200 }} aria-labelledby="dropdown_aksi">
                        <div className='d-flex align-items-center gap-2 px-2'>
                            <div className={`${styles['profile-info-picture-container']}`}>
                                <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/account/foto-profil/${profil?.gambar}`} className="Template_foto_profil_kedua__Nv6h8" />
                            </div>
                            <span>
                                <h6 style={{ lineHeight: 1.5, fontSize: 15 }} className="m-0 fw-bold">{profil?.namaLengkap}</h6>
                                <h6 style={{ lineHeight: 1.5, fontSize: 12 }} className="m-0 text-muted">{profil?.role}</h6>
                            </span>
                        </div>
                        <hr className='my-1' />
                        <li className='rounded-xl overflow-hidden'>
                            <Link className="dropdown-item border-radius-md" href='/dashboard/profil'><FontAwesomeIcon className='text-success' icon={faUserCog} fixedWidth /> Profil</Link>
                        </li>
                        <li className='rounded-xl overflow-hidden'>
                            <Link className="dropdown-item border-radius-md" href='/dashboard/ubah-password'><FontAwesomeIcon className='text-success' icon={faLock} fixedWidth /> Ubah Password</Link>
                        </li>
                        <li className='rounded-xl overflow-hidden'>
                            <a className="dropdown-item border-radius-md" href="#!" data-bs-toggle="modal" data-bs-target="#modalLogout"><FontAwesomeIcon className='text-success' icon={faSignOutAlt} fixedWidth /> Logout</a>
                        </li>
                    </div>
                </div>
                {/* Sidebar */}
                <div style={{ width: isCollapseSidebar ? '80px' : '280px', flexShrink: 0, zIndex: 1002 }} className={`${isShowedSidebar ? 'd-block' : 'd-none'} d-md-flex position-relative`}>
                    <a onClick={handleCollapseMobile} className='d-flex d-md-none border rounded-circle position-absolute align-items-center justify-content-center bg-white' style={{ right: -12.5, top: 30, width: 25, height: 25, zIndex: 9999 }}>
                        <FontAwesomeIcon icon={isCollapseSidebar ? faAngleRight : faAngleLeft} fixedWidth />
                    </a>
                    <a onClick={handleCollapse} className='d-none d-md-flex border rounded-circle position-absolute align-items-center justify-content-center bg-white' style={{ right: -12.5, top: 30, width: 25, height: 25, zIndex: 9999 }}>
                        <FontAwesomeIcon icon={isCollapseSidebar ? faAngleRight : faAngleLeft} fixedWidth />
                    </a>
                    <div className={styles['sidebar']}>
                        <SimpleBar scrollbarMaxSize={125} className='h-100 add-transition bg-white' style={{ position: 'fixed', width: isCollapseSidebar ? '80px' : '280px' }}>
                            <div className={styles['header-info']}>
                                <Link href='/dashboard' className='d-flex align-items-center gap-2 text-decoration-none'>
                                    <div className={styles['profile-info-picture-container']}>
                                        <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/konfigurasi/gambar/${logoAplikasi}`} alt="" />
                                    </div>
                                    {isCollapseSidebar === false && (
                                        <span>
                                            <h6 className='m-0 fw-bolder text-dark'>{namaAplikasi}</h6>
                                        </span>
                                    )}
                                </Link>
                                {isCollapseSidebar === false && (
                                    <div className={styles['profile-info']}>
                                        <div className={styles['profile-info-picture-container']}>
                                            <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/account/foto-profil/${profil?.gambar}`} alt="" />
                                        </div>
                                        <span>
                                            <h6 className='m-0'>{profil.namaLengkap}</h6>
                                            <p className='m-0'>{profil.role}</p>
                                        </span>
                                    </div>
                                )}
                            </div>
                            <ul className={`${styles['sidebar-content']} ${isCollapseSidebar ? 'px-1' : ''}`}>
                                <li className={`${styles['sidebar-header']} ${isCollapseSidebar ? 'd-none' : ''}`}>General</li>
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL === '/dashboard' ? styles['sidebar-list-active'] : ''}`}>
                                    <Link href='/dashboard' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faDashboard} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Dashboard</h6>
                                    </Link>
                                </li>
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/event') ? styles['sidebar-list-active'] : ''}`}>
                                    <Link href='/dashboard/event' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faNewspaper} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Event</h6>
                                    </Link>
                                </li>
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/income') ? styles['sidebar-list-active'] : ''}`}>
                                    <Link href='/dashboard/income' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faMoneyBill} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Income</h6>
                                    </Link>
                                </li>
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/prediksi') ? styles['sidebar-list-active'] : ''}`}>
                                    <Link href='/dashboard/prediksi' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faMoneyBill1Wave} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Prediksi</h6>
                                    </Link>
                                </li>
                                {profil?.role === 'Admin' && (
                                    <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/manajemen-user') ? styles['sidebar-list-active'] : ''}`}>
                                        <Link href='/dashboard/manajemen-user' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                            <div className={styles['sidebar-list-icon']}>
                                                <FontAwesomeIcon icon={faUsersCog} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                            </div>
                                            <h6>Manajemen User</h6>
                                        </Link>
                                    </li>
                                )}
                                <li className={`${styles['sidebar-header']} ${isCollapseSidebar ? 'd-none' : ''}`}>Configuration</li>
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/profil') ? styles['sidebar-list-active'] : ''}`}>
                                    <Link href='/dashboard/profil' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faUserCog} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Profil</h6>
                                    </Link>
                                </li>
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/ubah-password') ? styles['sidebar-list-active'] : ''}`}>
                                    <Link href='/dashboard/ubah-password' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faLock} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Ubah Password</h6>
                                    </Link>
                                </li>
                                {profil?.role === 'Admin' && (
                                    <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/pengaturan-website') ? styles['sidebar-list-active'] : ''}`}>
                                        <Link href='/dashboard/pengaturan-website' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                            <div className={styles['sidebar-list-icon']}>
                                                <FontAwesomeIcon icon={faCogs} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                            </div>
                                            <h6>Pengaturan Website</h6>
                                        </Link>
                                    </li>
                                )}
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''}`}>
                                    <a data-bs-toggle="modal" data-bs-target="#modalLogout" className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faSignOutAlt} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Logout</h6>
                                    </a>
                                </li>
                            </ul>
                        </SimpleBar>
                    </div>
                </div>
                <div className={styles['root-content']}>
                    <div className='d-flex align-items-center justify-content-between mb-4'>
                        <span>
                            {(header && typeof header === 'string') && (
                                <h4 className='fw-bolder'>{header}</h4>
                            )}
                            <BreadCrumb />
                        </span>
                        {breadCrumbRightContent && (
                            breadCrumbRightContent
                        )}
                    </div>
                    {children}
                </div>
            </div>
            <ModalBody
                targetModal="modalLogout"
                title={<h5 className='mb-0'><FontAwesomeIcon className='text-warning' icon={faExclamationTriangle} fixedWidth />&nbsp;Peringatan</h5>}
            >
                <p>Apa Anda yakin ingin logout?</p>
                <div className='d-flex justify-content-end gap-1'>
                    <button className='btn btn-secondary btn-sm' data-bs-dismiss="modal">Tidak</button>
                    <button onClick={handleLogout} className='btn btn-danger btn-sm' data-bs-dismiss="modal">Iya</button>
                </div>
            </ModalBody>
        </Launcher>
    )
}

export default Template