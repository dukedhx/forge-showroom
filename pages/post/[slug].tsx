import React from "react";
import { Layout } from "components/layout";
import { PostDetail } from "components/post";
import {  Post } from "services";
import { NextSeo } from "next-seo";
import Head from 'next/head'
import * as DataStaticContext from '../../components/contexts/data';
import { GetStaticPaths, GetStaticProps } from 'next';

type PostDetailPageProps = {
  post: Post;
};

const PostDetailPage = ({post}:PostDetailPageProps) =>{


    return (
      <>
      <Head>
           <title>Forge Showroom - {post&&post.title}</title>
           <meta charSet="utf-8" />
           <meta name="viewport" content="initial-scale=1.0, width=device-width" />
         </Head>
      <Layout>
        {post&&<NextSeo
          openGraph={{
            type: "article",
            title: post.title,
            description: post.description,
            images: [
              {
                url: post.imageUrl,
                width: 850,
                height: 650,
              }
            ]
          }}
          title={post.title}
          description={post.description}
        />}

            {!post && <div>Loading...</div>}
            {post && <PostDetail post={post} />}

      </Layout>
      </>
    )
}

export const getStaticProps:GetStaticProps = async (ctx:any) =>{
  const { slug } = ctx.params;
  const post = await DataStaticContext.loadEntryById(slug);
  return { props:{ post} };
}

export const getStaticPaths: GetStaticPaths = async()=>{
  const entries = await DataStaticContext.loadEntries()
  const paths = entries.map(post => `/post/${post.slug}`)
  return { paths, fallback: false  }
}

export default PostDetailPage
