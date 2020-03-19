import React from 'react'
import { Layout } from 'components/layout'
import { PostDetail } from 'components/post'
import { Post } from 'services'
import Head from 'next/head'
import * as DataStaticContext from '../../components/contexts/data'
import { GetServerSideProps } from 'next'
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN_PREVIEW,
  host: 'preview.contentful.com'
})

type PostDetailPageProps = {
  post: Post
}

export default ({ post }: PostDetailPageProps) => {
  return (
    <>
      <Head>
        <title>Forge Showroom - {post ? post.title : 'Not Found'}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        {!post && 'Not Found'}
        {post && <PostDetail post={post} />}
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { id } = ctx.query
  const post = await client
    .getEntries({
      content_type: 'post',
      'sys.id[in]': id
    })
    .then(entries =>
      entries.items && entries.items.length
        ? DataStaticContext.convertPost(entries.items[0])
        : null
    )
  return { props: { post } }
}
