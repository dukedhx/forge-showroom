import React from "react";
import { Layout } from "components/layout";
import { PostDetail } from "components/post";
import {  Post } from "services";
import { NextSeo } from "next-seo";
import Head from 'next/head'
import * as DataStaticContext from '../../components/contexts/data';

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
        <NextSeo
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
        />

            {!post && <div>Loading...</div>}
            {post && <PostDetail post={post} />}

      </Layout>
      </>
    )
}

PostDetailPage.getInitialProps = async (ctx:any) =>{
  const { slug } = ctx.query;
  const post = await DataStaticContext.loadEntryById(slug);
  return { post };
}

export default PostDetailPage
