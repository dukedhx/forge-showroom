import React, { useEffect, useRef, useContext, useState } from 'react'
import { Layout } from 'components/layout'
import { Post,Page, } from 'services'
import { PostBox } from 'components/post'
import Head from 'next/head'
import { GetStaticProps } from 'next'

import DataContext, * as DataStaticContext from '../components/contexts/data'
import LinearProgress from '@material-ui/core/LinearProgress'
import Pagination from '@material-ui/lab/Pagination'
import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import NotificationContext from '../components/contexts/notification'
import Hidden from '@material-ui/core/Hidden';

declare global {
  interface Window { muuri: any; }
}

type PostPageProps = {
  entries: Array<Post>
  pages: Array<Page>
  tags: Array<any>
  menusProp: Array<any>
}

const useStyles = makeStyles(() => ({
  root: {
    '*, & *': {
      color: '#fff'
    }
  },
  invisible:{ visibility: 'hidden',
    opacity: 0,
    transition: 'opacity 1s, visibility 1s'},
    visible:{visibility: 'visible',
      opacity: 1,
      transition: 'opacity 1s, visibility 1s'}
}))


const PostPage = ({ entries, tags,menusProp,pages }: PostPageProps) => {
  const classes = useStyles()
  const notificationContext = useContext(NotificationContext)

  const convertMenu = e => Object.assign({},e,{page:e.page&&(pages.find(p=>p.id==e.page)||{}).slug})
  const menus=(menusProp||[]).map(e=> Object.assign({},convertMenu(e),{items:(e.items||[]).map(e=>convertMenu(e))}))
  const container = useRef<HTMLDivElement>(null)
  const [currentEntries, setEntries] = useState(entries)
  const dataContext = useContext(DataContext)
  const [likes, setLikes] = useState({})
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(30)
  const [loadText, setLoadText] = useState('Preparing contents ...')
  const [marked, setMarked] = useState([])
  const [liked, setLiked] = useState([])
  const [showContents, setShowContents] = useState(false)
  dataContext.status.setLoadText = setLoadText
  dataContext.entries.entries = entries
  dataContext.entries.setEntries = setEntries
  dataContext.filter.tags = tags
dataContext.status.setLoggedIn=async loggedIn=>{
  if(loggedIn){
    try{
    setLoadText('Loading internal entries ...')
    const internals = await dataContext.loadEntries(true)
    dataContext.entries.setEntries([...internals.map(e=>{e.internal=true;return e}),...entries])
  }catch(err){notificationContext.alert(err)}finally{setLoadText('')}
  }else{
    dataContext.entries.setEntries(entries.filter(e=>!e.internal))
  }
}
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
    window.muuri = window.muuri || import('muuri')
    window.muuri.then(mod => {
      new mod.default(container.current)
      setShowContents(true)
      if(loadText=='Preparing contents ...') setLoadText('')
    })
  }, [currentEntries, page, perPage])

  const renderPostList = () => {
    const start = (page - 1) * perPage - 1
    return currentEntries
      .slice(start > 0 ? start : 0, start + perPage).sort((a,b)=>Number(b.internal)-Number(a.internal))
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
          <Hidden smDown>
          <div style={{ maxWidth: '45%', overflow: 'auto' }}>

            #
            {`${(page - 1) * perPage + 1} - ${(page - 1) * perPage +
              perPage} of ${currentEntries.length}`}{' '}

            {loadText ? `| ${loadText}` : ''}
          </div>
          </Hidden>

          <div style={{ flexGrow: 1 }}></div>
          <Hidden smDown>

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
          </Hidden>
          <Pagination
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
      <Layout maxWidth='xl' background='none' headerSettings={{menus,asyncSearch:true,showFilter:false}}>
       <div className={showContents?classes.visible:classes.invisible}>
        {pagination}
        <div
          ref={container}
          style={{
            position: 'relative',
          }}
        >
          {currentEntries.length > 0 && renderPostList()}
        </div>
        {pagination}
        </div>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [entries, tags, menusProp, pages] = await Promise.all([
    DataStaticContext.loadEntries(),
    DataStaticContext.loadTags(),
    DataStaticContext.loadMenus(),
    DataStaticContext.loadPages(),

  ])

  return { props: { entries, tags,menusProp,pages } }
}

PostPage.defaultProps = { entries: [], tags: [], menusProp:[], pages:[] }

export default PostPage
