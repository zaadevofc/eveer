import { Head, Html, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html>
      <Head>
        <title>{`Eveer - Website Online Event Organizer`}</title>
        <meta name="description" content={'Buat dan Manajemen event terbaik Anda dengan mudah! Atur jadwal dan share dengan berbagai sosial media. Jangan sampai ketinggalan Event menariknya!'} />

        <meta property="og:url" content={"https://eveer.vercel.app"} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Eveer - Website Online Event Organizer`}
        />
        <meta property="og:description" content={'Buat dan Manajemen event terbaik Anda dengan mudah! Atur jadwal dan share dengan berbagai sosial media. Jangan sampai ketinggalan Event menariknya!'} />
        <meta property="og:image" content={"https://eveer.vercel.app/banner-1.jpg"} />
        <meta property="og:image:width" content="960" />
        <meta property="og:image:height" content="1280" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="eveer.vercel.app" />
        <meta property="twitter:url" content={"https://eveer.vercel.app"} />
        <meta
          name="twitter:title"
          content={`Eveer - Website Online Event Organizer`}
        />
        <meta name="twitter:description" content={'Buat dan Manajemen event terbaik Anda dengan mudah! Atur jadwal dan share dengan berbagai sosial media. Jangan sampai ketinggalan Event menariknya!'} />
        <meta name="twitter:image" content={"https://eveer.vercel.app/"} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
