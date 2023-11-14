
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Template from '../../../../components/Template'

const Ubah = () => {
    const router = useRouter()
    const { id } = router.query
    const axios = useAxiosPrivate()
    const [namaLengkap, setNamaLengkap] = useState('')
    const [namaLengkapError, setNamaLengkapError] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [role, setRole] = useState('')
    const [roleError, setRoleError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/account/${id ? id : ''}`,
            data: {
                namaLengkap,
                email,
                password,
                role
            }
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Berhasil', 'User berhasil diubah!', 'success').then((res) => {
                    router.push('/dashboard/manajemen-user')
                })
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.namaLengkap) {
                    setNamaLengkapError(error.namaLengkap)
                } else {
                    setNamaLengkapError('')
                }

                if (err?.email) {
                    setEmailError(error.email)
                } else {
                    setEmailError('')
                }

                if (err?.password) {
                    setPasswordError(error.password)
                } else {
                    setPasswordError('')
                }

                if (err?.role) {
                    setRoleError(error.role)
                } else {
                    setRoleError('')
                }
            }
        })
    }
    useEffect(() => {
        const getData = async () => {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/account/${id ? id : ''}`
            }).then((res) => {
                if (res?.data?.id) {
                    setNamaLengkap(res.data.namaLengkap)
                    setEmail(res.data.email)
                    setRole(res.data.role)
                }
            }).catch((err) => {
                console.error(err)
            })
        }
        getData()
    }, [id])
    return (
      <>
        <Head>
          <title>Ubah User</title>
        </Head>
        <Template
          header="Ubah User"
          breadCrumb={[
            { label: "Dashboard", link: "/dashboard" },
            { label: "User", link: "/dashboard/manajemen-user" },
            {
              label: "Ubah User",
              link: `/dashboard/manajemen-user/ubah/${id}`,
            },
          ]}
          breadCrumbRightContent={
            <Link
              href="/dashboard/manajemen-user"
              className="btn btn-secondary rounded-xl"
            >
              <FontAwesomeIcon icon={faAngleLeft} />
              &nbsp; Kembali
            </Link>
          }
        >
          <form action="" onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="namaLengkap" className="mb-1">
                      Nama Lengkap <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        namaLengkapError !== "" ? "is-invalid" : ""
                      }`}
                      id="namaLengkap"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      required
                    />
                    {namaLengkapError !== "" && (
                      <div className="invalid-feedback">{namaLengkapError}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="mb-1">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        emailError !== "" ? "is-invalid" : ""
                      }`}
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {emailError !== "" && (
                      <div className="invalid-feedback">{emailError}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="mb-1">
                      Kata Sandi <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        passwordError !== "" ? "is-invalid" : ""
                      }`}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError !== "" && (
                      <div className="invalid-feedback">{passwordError}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="role" className="mb-1">
                      Role <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        roleError !== "" ? "is-invalid" : ""
                      }`}
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="" selected hidden disabled>
                        -- Pilih Role --
                      </option>
                      <option value="Admin">Admin</option>
                      <option value="Panitia">Panitia</option>
                      <option value="Pengunjung">Pengunjung</option>
                    </select>
                    {roleError !== "" && (
                      <div className="invalid-feedback">{roleError}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="clearfix">
                  <button type="submit" className="btn btn-primary float-end">
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Template>
      </>
    );
}

export default Ubah