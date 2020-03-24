import React, { useState, useContext, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import Typography from '@material-ui/core/Typography'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ReactMarkdown from 'react-markdown/with-html'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import Divider from '@material-ui/core/Divider'
import Popover from '@material-ui/core/Popover'

import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import DataContext from '../contexts/data'
import Box from '@material-ui/core/Box'

const iconActiveColor = '#3F50B5'
const useStyles = makeStyles((theme) => ({
  item: {
    position: 'absolute',
    width: '24%',
    padding: '10px',
  },
  grow: {
    flexGrow: 1,
  },
  internalTag: {
    position: 'absolute',
    top: '5px',
    left: '5px',
  },
  tag: {
    'margin-left': '2px',
    'text-overflow': 'ellipsis',
  },
  card: {
    background: 'none',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    position: 'relative',
    paddingTop: '56.25%', // 16:9
    transition: 'all 1s ease',

    '&:hover': {
      transform: 'scale(1.1)',
      overflow: 'hidden',
      transition: '1s ease-in-out',
    },
  },
  cardContent: {
    flexGrow: 1,
  },
  [theme.breakpoints.down('lg')]: {
    item: {
      width: '33%',
    },
  },
  [theme.breakpoints.down('md')]: {
    item: {
      width: '50%',
    },
  },
  [theme.breakpoints.down('sm')]: {
    item: {
      width: '100%',
    },
    cardContent: {
      '& h2': {
        fontSize: '1.2rem',
      },
    },
  },
  tagContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  'item-content': {
    background: 'rgba(255,255,255,0.9)',
  },
}))

type PostBoxProps = {
  id: number | string
  slug: string
  imageUrl: string
  title: string
  description?: string
  tags?: Array<string>
  likes?: number
  marked?: boolean
  liked?: boolean
  internal?: boolean
}

const repost = (url: string) =>
  window.open(url.replace('*', encodeURIComponent(window.location.href)))

export const PostBox = (props: PostBoxProps) => {
  const dataContext = useContext(DataContext)
  const classes = useStyles()
  const [collapsed, setCollapsed] = useState(false)
  const [marked, setMarked] = useState(props.marked)
  const [likes, setLikes] = useState(props.likes)
  const [liked, setLiked] = useState(props.liked)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const tags = props.tags.map(
    (tag) =>
      (
        dataContext.filter.tags.find((e) => e.id == tag) ||
        dataContext.filter.tags[0]
      ).title
  )

  useEffect(() => setMarked(props.marked), [props.marked])
  useEffect(() => setLiked(props.liked), [props.liked])
  useEffect(() => setLikes(props.likes), [props.likes])
  const persistIds = (id: string | number, key: string) => {
    let array = JSON.parse(localStorage.getItem(key) || '[]')
    array.includes(id) ? (array = array.filter((e) => e != id)) : array.push(id)
    localStorage.setItem(key, JSON.stringify(array))
  }
  return (
    <div className={classes.item}>
      <Paper className={classes['item-content']} elevation={3}>
        <Card className={classes.card}>
          <CardMedia className={classes.cardMedia} image={props.imageUrl}>
            <Paper
              className={classes.tagContainer}
              style={
                tags.length > 2
                  ? { background: 'rgba(255,255,255,0.8)' }
                  : { boxShadow: 'none', background: 'none' }
              }
            >
              {tags.splice(0, 2).map((tag, i) => (
                <Tooltip title={tag} key={i}>
                  <Chip size="small" label={tag} className={classes.tag} />
                </Tooltip>
              ))}
              {tags.length ? (
                <IconButton
                  className={`${
                    collapsed ? classes.expandOpen : classes.expand
                  }`}
                  onClick={(event) => {
                    setAnchorEl(collapsed ? null : event.currentTarget)
                    setCollapsed(!collapsed)
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              ) : null}
              <Popover
                open={collapsed}
                onClose={() => {
                  setCollapsed(false)
                  setAnchorEl(null)
                }}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                {tags.map((tag, i) => (
                  <Chip label={tag} key={i} style={{ margin: '5px' }} />
                ))}
              </Popover>
            </Paper>
            {props.internal && (
              <Chip
                size="small"
                label="Internal"
                className={classes.internalTag}
              />
            )}
          </CardMedia>
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5" component="h2">
              {props.title}
            </Typography>
            <Divider />
            <Box m={0}>
              <ReactMarkdown escapeHtml={false} source={props.description} />
            </Box>
          </CardContent>

          <CardActions>
            <Button size="small" color="primary">
              {props.internal ? (
                <a href={`/post/${props.id}?sb=${process.env.internalSecret}`}>
                  View
                </a>
              ) : (
                <Link href="/post/[slug]" as={`/post/${props.slug}`}>
                  <a>View</a>
                </Link>
              )}
            </Button>
            <div className={classes.grow} />
            <IconButton
              style={{ color: liked ? iconActiveColor : '' }}
              onClick={() => {
                persistIds(props.id, 'forge-showroom-likes')
                setLiked(!liked)
                setLikes(liked ? likes - 1 : (likes || 0) + 1)
                dataContext.addLikes(props.id)
              }}
            >
              <Tooltip title={'I like this!'}>
                {likes == undefined ? (
                  <div style={{ position: 'relative' }}>
                    <FavoriteIcon />
                    <CircularProgress
                      style={{
                        position: 'absolute',
                        left: '-7px',
                        top: '-7px',
                      }}
                    />
                  </div>
                ) : (
                  <Badge badgeContent={likes} color="primary">
                    <FavoriteIcon />
                  </Badge>
                )}
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => repost('https://twitter.com/intent/tweet?text=*')}
            >
              <Tooltip title="Repost to Twitter">
                <TwitterIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() =>
                repost('https://www.facebook.com/sharer/sharer.php?u=*')
              }
            >
              <Tooltip title="Repost to Facebook">
                <FacebookIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              style={{ color: marked ? iconActiveColor : '' }}
              onClick={() => {
                persistIds(props.id, 'forge-showroom-bookmarks')
                setMarked(!marked)
              }}
            >
              <Tooltip title={marked ? 'Un-bookmark' : 'Bookmark'}>
                <BookmarkIcon />
              </Tooltip>
            </IconButton>
          </CardActions>
        </Card>
      </Paper>
    </div>
  )
}
