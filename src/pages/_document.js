import { Html, Head, Main, NextScript } from 'next/document'

import React, { useEffect } from 'react'
import { useKonfigurasiContext } from '../context/KonfigurasiProvider'

const Document = () => {
    return (
        <Html>
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document