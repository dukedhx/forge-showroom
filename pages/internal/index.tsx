import React from 'react'
import { Layout } from 'components/layout'
import { PostDetail } from 'components/post'
import { Post } from 'services'
import Head from 'next/head'
import * as DataStaticContext from '../../components/contexts/data'
import { GetServerSideProps } from 'next'

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
  const { internal } = ctx.query
  const post = await DataStaticContext.loadEntryById(internal, true)
  if (post === undefined)
    ctx.res.writeHead(302, {
      Location: '/api/auth'
    })
  return { props: { post } }
}
