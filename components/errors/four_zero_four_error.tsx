import React from 'react'
import Link from 'next/link'
import { Layout } from '../layout'

export const FourZeroFour = () => {
  return (
    <Layout>
      <div style={{ width: '400px', textAlign: 'center' }}>
        The page you are looking for might have been removed had its name
        changed or is temporarily unavailable.
        <br />
        <Link href="/" passHref>
          <a className="btn btn-tomato mt-4">Back to homepage</a>
        </Link>
      </div>
    </Layout>
  )
}
