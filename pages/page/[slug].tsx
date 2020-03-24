import React from 'react'
import { Layout } from 'components/layout'
import * as DataStaticContext from '../../components/contexts/data'
import { Page } from 'services'
import ReactMarkdownHtml from 'react-markdown/with-html'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'

type PageProps = {
  page: Page
}

export default ({ page }: PageProps) => {
  return (
    <>
      <Head>
        <title>Forge Showroom - {page.title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        <NextSeo
          openGraph={{
            type: 'article',
            title: page.title,
            description: page.description,
          }}
          title={page.title}
          description={page.description}
        />

        <ReactMarkdownHtml escapeHtml={false} source={page.body} />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (ctx: any) => {
  const { slug } = ctx.params
  const page = await DataStaticContext.loadPageById(slug)
  return { props: { page } }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await DataStaticContext.loadPages()
  const paths = (entries || []).map((page) => `/page/${page.slug}`)
  return { paths, fallback: false }
}
