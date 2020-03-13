import React from "react";
import { Layout } from "components/layout";
import * as DataStaticContext from '../../components/contexts/data';
import { Page } from "./post.types";
import ReactMarkdownHtml from "react-markdown/with-html";
import { NextSeo } from "next-seo";
import Head from 'next/head'

type PageProps={
  page:Page
}

const PageDetail = (page:PageProps)=>{

  return (
    <>
    <Head>
         <title>Forge Showroom - {page&&page.title}</title>
         <meta charSet="utf-8" />
         <meta name="viewport" content="initial-scale=1.0, width=device-width" />
       </Head>
    <Layout>
      <NextSeo
        openGraph={{
          type: "article",
          title: page.title,
          description: page.description,
        }}
        title={post.title}
        description={page.description}
      />

          {!page && <div>Loading...</div>}
          {page && <ReactMarkdown escapeHtml={false} source={page.body} />}

    </Layout>
    </>
  )
}

PageDetail.getInitialProps = async (ctx:any) =>{
  const { slug } = ctx.query;
  const page = await DataStaticContext.loadPageById(slug);
  return { page };
}

export default PageDetail
