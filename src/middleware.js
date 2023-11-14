import { NextResponse } from 'next/server';

export default async function middleware(req) {
    const url = req.nextUrl
    const auth = req.cookies.get('accessToken')

    const isUserAuthenticated = async () => {
        let isAuthenticated = false
        await fetch(`${process.env.NEXT_PUBLIC_RESTFUL_API}/account/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${auth?.value}`
            }
        }).then(async (res) => {
            const data = await res.json()

            if (data?.id) {
                isAuthenticated = true
            }
        }).catch((err) => {
            isAuthenticated = false
        })

        return isAuthenticated
    }

    const isUserAuthenticatedAsAdmin = async () => {
        let isAuthenticated = false
        await fetch(`${process.env.NEXT_PUBLIC_RESTFUL_API}/account/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${auth?.value}`
            }
        }).then(async (res) => {
            const data = await res.json()

            if (data?.id && (data?.role === 'Admin' || data?.role === 'Panitia')) {
                isAuthenticated = true
            }
        }).catch((err) => {
            isAuthenticated = false
        })

        return isAuthenticated
    }

    const isAuthenticated = await isUserAuthenticated().then((res) => { return res })
    const isAuthenticatedAsAdmin = await isUserAuthenticatedAsAdmin().then((res) => { return res })

    if (url.pathname.includes('/dashboard')) {
        if (!isAuthenticatedAsAdmin) {
            url.pathname = '/'
            return NextResponse.redirect(url)
        } else {
            return NextResponse.next()
        }
    } else if (url.pathname.includes('/login')) {
        if (isAuthenticated) {
            url.pathname = '/'
            return NextResponse.redirect(url)
        } else {
            console.log('Woi')
            return NextResponse.next()
        }
    } else if (url.pathname.includes('/logout')) {
        if (isAuthenticated) {
            req.cookies.delete('accessToken')
        }
    }

    return NextResponse.next()
}