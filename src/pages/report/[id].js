import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from '../../api/axios'

const PDF = dynamic(() => import('../pdf'), {
    ssr: false
})

const Report = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({})
    const getData = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/event/${id ? id : ''}`,
        }).then((res) => {
            if (res.data?.id) {
                setData(res.data)
                setIsLoading(false)
            }
        })
    }
    useEffect(() => {
        if (id !== null) {
            getData();
        }
    }, [id])

    return (
        <>
            {isLoading === false && (
                <PDF data={data} />
            )}
        </>
    )
}

export default Report