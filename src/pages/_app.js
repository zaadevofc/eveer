import '../../styles/globals.css'
import "bootstrap/dist/css/bootstrap.min.css";
import 'simplebar-react/dist/simplebar.min.css';
import { AuthProvider } from '../context/AuthProvider'
import { useEffect } from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false
import { KonfigurasiProvider } from '../context/KonfigurasiProvider';
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js");
    window.bootstrap = bootstrap;
  }, [])

  return (
    <KonfigurasiProvider>
      <AuthProvider>
        <NextNProgress />
        <Component {...pageProps} />
      </AuthProvider>
    </KonfigurasiProvider>
  )
}

export default MyApp
