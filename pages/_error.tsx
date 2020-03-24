import React from 'react'
import { FiveHundredError, FourZeroFour } from 'components/errors'
import Head from 'next/head'

function Error({ statusCode }) {
  return (

    <>
      <Head>
        <title>Forge Showroom - Error {statusCode}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {statusCode === 404?<FourZeroFour />:<FiveHundredError />}

      </>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null
  return { statusCode }
}

export default Error
