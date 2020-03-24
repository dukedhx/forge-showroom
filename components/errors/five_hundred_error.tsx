import React from 'react'
import { Layout } from '../layout'

import Link from 'next/link'

export const FiveHundredError = () => {
  return (
    <Layout>
      <div>
        Error occurred ... Please contact the administrator ...
        <Link href="/" passHref>
          <a className="btn btn-tomato">Go back to Home</a>
        </Link>
      </div>
    </Layout>
  )
}
