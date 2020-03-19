import React, { useEffect, useRef, useContext, useState } from 'react'
import { Layout } from 'components/layout'
import { Post } from 'services'
import { PostBox } from 'components/post'
import Head from 'next/head'
import { GetStaticProps } from 'next'

import LayoutContext from '../components/contexts/layout'
import DataContext, * as DataStaticContext from '../components/contexts/data'
import LinearProgress from '@material-ui/core/LinearProgress'
import Pagination from '@material-ui/lab/Pagination'
import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

type PostPageProps = {
  entries: Array<Post>
  tags: Array<any>
}

const useStyles = makeStyles(() => ({
  root: {
    '*, & *': {
      color: '#fff'
    }
  }
}))

const PostPage = ({ entries, tags }: PostPageProps) => {
  const classes = useStyles()

  const container = useRef<HTMLDivElement>(null)
  let muuri
  const [currentEntries, setEntries] = useState(entries)
  const layoutContext = useContext(LayoutContext)
  const dataContext = useContext(DataContext)
  const [likes, setLikes] = useState({})
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(30)
  const [loadText, setLoadText] = useState('')
  const [marked, setMarked] = useState([])
  const [liked, setLiked] = useState([])
  const [showContents, setShowContents] = useState(false)
  dataContext.status.setLoadText = setLoadText
  dataContext.entries.entries = entries
  dataContext.entries.setEntries = setEntries
  dataContext.filter.tags = tags
  layoutContext.layout.maxWidth = 'xl'
  layoutContext.layout.background = 'none'

  useEffect(() => {
    setMarked(dataContext.getMarked())
    setLiked(dataContext.getLiked())
    dataContext
      .getLikes()
      .then(likes =>
        setLikes(
          likes
            ? currentEntries.reduce(
                (o, entry) =>
                  Object.assign(o, {
                    [entry.id]:
                      (likes.find(e => e.id == entry.id) || {}).likes || 0
                  }),
                {}
              )
            : {}
        )
      )
  }, [])

  useEffect(() => {
    muuri = muuri || import('muuri')
    muuri.then(mod => {
      new mod.default(container.current)
      setShowContents(true)
    })
  }, [currentEntries, page, perPage])

  const renderPostList = () => {
    const start = (page - 1) * perPage - 1
    return currentEntries
      .slice(start > 0 ? start : 0, start + perPage)
      .map((entry, i) => (
        <PostBox
          key={i}
          id={entry.id}
          slug={entry.slug}
          title={entry.title}
          imageUrl={entry.imageUrl}
          description={entry.description}
          tags={entry.tags}
          likes={likes[entry.id]}
          marked={marked.includes(entry.id)}
          liked={liked.includes(entry.id)}
          internal={entry.internal}
        />
      ))
  }

  const pagination = (
    <>
      {!!currentEntries.length && (
        <div style={{ color: '#fff', display: 'flex' }}>
          <div style={{ maxWidth: '45%', overflow: 'auto' }}>
            #
            {`${(page - 1) * perPage + 1} - ${(page - 1) * perPage +
              perPage} of ${currentEntries.length}`}{' '}
            {loadText ? `| ${loadText}` : ''}
          </div>
          <div style={{ flexGrow: 1 }}></div>
          <Select
            className={classes.root}
            value={perPage}
            onChange={event => setPerPage(Number(event.target.value))}
          >
            <MenuItem value="30">
              <em>30</em>
            </MenuItem>
            <MenuItem value="50">
              <em>50</em>
            </MenuItem>
            <MenuItem value={currentEntries.length}>
              <em>All</em>
            </MenuItem>
          </Select>
          <Pagination
            style={{ maxWidth: '45%', overflow: 'auto' }}
            className={classes.root}
            color="primary"
            count={
              currentEntries.length > perPage
                ? Math.floor(currentEntries.length / perPage) +
                  (currentEntries.length % perPage ? 1 : 0)
                : -1
            }
            page={page}
            onChange={(e, val) => e && setPage(val)}
          />
        </div>
      )}
      {!!loadText && <LinearProgress color="primary" />}
    </>
  )

  return (
    <>
      <Head>
        <title>Forge Showroom</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        {pagination}
        <div
          ref={container}
          style={{
            position: 'relative',
            visibility: showContents ? 'unset' : 'hidden'
          }}
        >
          {currentEntries.length > 0 && renderPostList()}
        </div>
        {pagination}
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [entries, tags] = await Promise.all([
    DataStaticContext.loadEntries(),
    DataStaticContext.loadTags()
  ])
  return { props: { entries, tags } }
}

PostPage.defaultProps = { entries: [], tags: [] }

export default PostPage
