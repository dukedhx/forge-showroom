import React, { useState, useContext } from 'react'
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

import Divider from '@material-ui/core/Divider'
import Popover from '@material-ui/core/Popover'

import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import DataContext from '../contexts/data'
const useStyles = makeStyles(theme => ({
  item: {
    position: 'absolute',
    width: '24%',
    padding: '10px'
  },
  grow: {
    flexGrow: 1
  },

  tag: {
    width: '100%',
    'text-overflow': 'ellipsis'
  },
  card: {
    background: 'none',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    position: 'relative',
    paddingTop: '56.25%', // 16:9
    transition: 'all 1s ease',

    '&:hover': {
      transform: 'scale(1.1)',
      overflow: 'hidden',
      transition: '1s ease-in-out'
    },
    '&:hover .MuiGrid-container': {
      transform: 'scale(0.9)',
      transition: '1s ease-in-out'
    }
  },
  cardContent: {
    flexGrow: 1
  },
  [theme.breakpoints.down('lg')]: {
    item: {
      width: '30%'
    }
  },
  [theme.breakpoints.down('md')]: {
    item: {
      width: '45%'
    }
  },
  tagContainer: {
    position: 'relative',
    bottom: '0'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  'item-content': {
    background: 'rgba(255,255,255,0.9)'
  }
}))

const defaultProps = {}

type PostBoxProps = {
  id: number
  slug: string
  imageUrl: string
  title: string
  description?: string
  tags?: Array<string>
} & typeof defaultProps

export const PostBox = (props: PostBoxProps) => {
  const dataContext = useContext(DataContext)
  const classes = useStyles()
  const [collapsed, setCollapsed] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const tags = props.tags.map(
    tag =>
      (
        dataContext.filter.tags.find(e => e.id == tag) ||
        dataContext.filter.tags[0]
      ).title
  )
  return (
    <div className={classes.item}>
      <Paper className={classes['item-content']} elevation={3}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cardMedia}
            image={props.imageUrl}
            title="Image title"
          >
            <Grid container className={classes.tagContainer} spacing={1}>
              <div className={classes.grow} />
              {tags.splice(0, 2).map((tag, i) => (
                <Grid item xs={3} key={i}>
                  <Tooltip title={tag}>
                    <Chip label={tag} className={classes.tag} color="primary" />
                  </Tooltip>
                </Grid>
              ))}
              {tags.length ? (
                <IconButton
                  className={`${
                    collapsed ? classes.expandOpen : classes.expand
                  }`}
                  onClick={event => {
                    setAnchorEl(collapsed ? null : event.currentTarget)
                    setCollapsed(!collapsed)
                  }}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              ) : null}
              }
              <Popover
                open={collapsed}
                onClose={() => {
                  setCollapsed(false)
                  setAnchorEl(null)
                }}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
                }}
              >
                {tags.map((tag, i) => (
                  <Chip label={tag} key={i} style={{ margin: '5px' }} />
                ))}
              </Popover>
            </Grid>
          </CardMedia>
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5" component="h2">
              {props.title}
            </Typography>
            <Divider />

            <Typography>
              <ReactMarkdown escapeHtml={false} source={props.description} />
            </Typography>
          </CardContent>

          <CardActions>
            <Button size="small" color="primary">
              <Link href="/post/[slug]" as={`/post/${props.slug}`} passHref>
                <a>View</a>
              </Link>
            </Button>
            <div className={classes.grow} />
            <IconButton aria-label="add to favorites">
              <Badge
                badgeContent={Math.floor(Math.random() * 100)}
                color="primary"
              >
                <FavoriteIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="add to favorites">
              <TwitterIcon />
            </IconButton>
            <IconButton aria-label="add to favorites">
              <FacebookIcon />
            </IconButton>
            <IconButton aria-label="add to favorites">
              <BookmarkIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Paper>
    </div>
  )
}

PostBox.defaultProps = defaultProps
