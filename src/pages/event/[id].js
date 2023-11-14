import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Template from '../../components/TemplateLanding';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import axios from '../../api/axios';

const InfoEvent = () => {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const getEvent = async () => {
            try {
                const response = await axios.get(`/event/${id}`);
                if (response.data?.id) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };
        getEvent();
        const checkIfLoggedIn = () => {
            const isLoggedIn = 'Pengunjung, Admin, Panitia';
            setIsLoggedIn(isLoggedIn);
        };
        checkIfLoggedIn();
    }, [id]);

    const handleShareFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_DOMAIN}/event/${id}&t=${data.nama ?? ''}`, '_blank');
    };

    const handleShareTwitter = () => {
        window.open(`https://twitter.com/share?url=${process.env.NEXT_PUBLIC_DOMAIN}/event/${id}&text=${data.nama ?? ''}`, '_blank');
    };

    const handleShareInstagram = () => {
        window.open(`https://www.instagram.com/share?url=${process.env.NEXT_PUBLIC_DOMAIN}/event/${id}&t=${data.nama ?? ''}`, '_blank');
    };

    return (
        <Template>
            <div className="row">
                <div className="col-md-5">
                    <img style={{ aspectRatio: '16/9', objectFit: 'cover' }} src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/event/gambar/${data.gambar ?? 'error.png'}`} className="bg-dark w-100" alt="Event" />
                </div>
                <div className="col-md-7">
                    {isLoggedIn && (
                        <div className='d-flex align-items-center gap-3'>
                            <button onClick={handleShareFacebook} className='btn btn-primary'>
                                <FontAwesomeIcon icon={faFacebook} /> Share on Facebook
                            </button>
                            <button onClick={handleShareTwitter} className='btn btn-info'>
                                <FontAwesomeIcon icon={faTwitter} /> Share on Twitter
                            </button>
                            <button onClick={handleShareInstagram} className='btn btn-danger'>
                                <FontAwesomeIcon icon={faInstagram} /> Share on Instagram
                            </button>
                        </div>
                    )}
                    <h2 className='mt-3 text-black'>{data.nama ?? ''}</h2>
                    <p className='text-black' dangerouslySetInnerHTML={{ __html: data.deskripsi ?? '' }}></p>
                    <p className='text-black'>{`${data.tanggalMulai} s/d ${data.tanggalSelesai}`}</p>
                </div>
            </div>
        </Template>
    );
};

export default InfoEvent;