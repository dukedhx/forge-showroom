import React, { useEffect, useRef, useContext, useState } from 'react'
import { Layout } from 'components/layout'
import { Post } from 'services'
import { PostBox } from 'components/post'
import Head from 'next/head'
import LayoutContext from '../components/contexts/layout'
import DataContext, * as DataStaticContext from '../components/contexts/data'

type PostPageProps = {
  entries: Array<Post>
  tags: Array<any>
}

const PostPage = ({ entries, tags }: PostPageProps) => {
  const container = useRef<HTMLDivElement>(null)
  let muuri
  const [currentEntries, setEntries] = useState(entries)
  const layoutContext = useContext(LayoutContext)
  const dataContext = useContext(DataContext)

  dataContext.entries.entries = entries
  dataContext.entries.setEntries = setEntries
  dataContext.filter.tags = tags
  layoutContext.layout.maxWidth = 'xl'
  layoutContext.layout.background = 'none'

  useEffect(() => {
    muuri = muuri || import('muuri')
    muuri.then(mod => new mod.default(container.current))
  }, [currentEntries])

  const renderPostList = () => {
    return currentEntries.map((entry, i) => (
      <PostBox
        key={i}
        id={entry.id}
        slug={entry.slug}
        title={entry.title}
        imageUrl={entry.imageUrl}
        description={entry.description}
        tags={entry.tags}
      />
    ))
  }

  return (
    <>
      <Head>
        <title>Forge Showroom</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        <div ref={container} style={{ position: 'relative' }}>
          {currentEntries.length > 0 && renderPostList()}
        </div>
      </Layout>
    </>
  )
}

PostPage.getInitialProps = async () => {
  const [entries, tags] = await Promise.all([
    DataStaticContext.loadEntries(),
    DataStaticContext.loadTags()
  ])
  return { entries, tags }
}

export default PostPage
