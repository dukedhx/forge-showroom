import React, { useEffect, useState } from 'react'
import { Layout } from 'components/layout'
import { PostDetail } from 'components/post'
import { Post } from 'services'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import * as DataStaticContext from '../../components/contexts/data'
import { GetStaticPaths, GetStaticProps } from 'next'

type PostDetailPageProps = {
  post: Post
}

const PostDetailPage = (props: PostDetailPageProps) => {
  const [post, setPost] = useState(props.post)
  const [statusText, setStatusText] = useState('Not Found')
  useEffect(() => {
    if (!post) {
      const query = new URLSearchParams(window.location.search)
      const secret = query.get('sb')

      const id = location.pathname.split('/').pop()
      if (
        id &&
        (secret == process.env.internalSecret ||
          secret == process.env.previewSecret)
      ) {
        setStatusText('Loading ...')
        DataStaticContext.loadEntryById(
          id,
          secret == process.env.internalSecret,
          secret == process.env.previewSecret
        )
          .then((e) => setPost(e))
          .catch((err) => setStatusText((err && err.message) || err))
      }
    }
  }, [])
  return (
    <>
      <Head>
        <title>Forge Showroom - {post && post.title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        {post && (
          <NextSeo
            openGraph={{
              type: 'article',
              title: post.title,
              description: post.description,
              images: [
                {
                  url: post.imageUrl,
                  width: 850,
                  height: 650,
                },
              ],
            }}
            title={post.title}
            description={post.description}
          />
        )}

        {post ? <PostDetail post={post} /> : <pre>{statusText}</pre>}
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (ctx: any) => {
  const { slug } = ctx.params
  const post = await DataStaticContext.loadEntryById(slug)
  return { props: { post } }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await DataStaticContext.loadEntries()
  const paths = entries.map((post) => `/post/${post.slug}`)
  return { paths, fallback: true }
}

export default PostDetailPage
