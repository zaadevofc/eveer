import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import React from 'react'

const EventCard = ({ id, gambar, event, deskripsi, tanggal }) => {
    const shareUrl = `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/event/${id}`;
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const igShareUrl = `https://www.instagram.com/share?url=${encodeURIComponent(shareUrl)}`;

    return (
        <Link href={`/event/${id}`} className='text-decoration-none'>
            <div className="card overflow-hidden">
                <img style={{ aspectRatio: '16/9', objectFit: 'cover' }} src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/event/gambar/${gambar}`} class="card-img-top bg-light" alt="..." />
                <div className="card-body bg-light text-dark">
                    <h5 className='text-center'>{event}</h5>
                    <p dangerouslySetInnerHTML={{ __html: deskripsi }} />
                    <p className='mb-0'>{tanggal}</p>
                    <div className="d-flex justify-content-between mt-2">
                        <a href={igShareUrl} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} size="lg" />
                        </a>
                        <a href={fbShareUrl} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} size="lg" />
                        </a>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default EventCard
