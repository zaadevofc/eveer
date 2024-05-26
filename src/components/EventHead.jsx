import Head from 'next/head'
import { usePathname } from 'next/navigation'
import React from 'react'

const EventHead = ({ event_name, event_kecamatan, event_thumbnail, desc }) => {
  const path = usePathname()

  return (
    <>
      <Head>
        <title>{`${event_name} - ${event_kecamatan}`}</title>
        <meta name="description" content={desc} />

        <meta property="og:url" content={"https://eveer.vercel.app" + path} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${event_name} - ${event_kecamatan}`} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={event_thumbnail} />
        <meta property="og:image:width" content="960" />
        <meta property="og:image:height" content="1280" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="eveer.vercel.app" />
        <meta property="twitter:url" content={"https://eveer.vercel.app" + path} />
        <meta name="twitter:title" content={`${event_name} - ${event_kecamatan}`} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={event_thumbnail} />

      </Head>
    </>
  )
}

export default EventHead