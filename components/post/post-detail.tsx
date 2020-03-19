import React from 'react'
import { Post } from 'services'
import ReactMarkdown from 'react-markdown/with-html'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
const useStyles = makeStyles(theme => ({
  mainFeaturedPost: {
    position: 'relative',
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0
    }
  }
}))

type PostDetailProps = {
  post: Post
}

export const PostDetail = (props: PostDetailProps) => {
  const { post } = props
  const classes = useStyles()
  return (
    <>
      <Paper className={classes.mainFeaturedPost}>
        {<img src={post.imageUrl} />}
        /*
        <div className={classes.overlay} />
        */
      </Paper>
      <Grid container>
        <Grid item md={6}>
          <div className={classes.mainFeaturedPostContent}>
            <Typography
              component="h1"
              variant="h3"
              color="inherit"
              gutterBottom
            >
              {post.title}
            </Typography>
          </div>
        </Grid>
      </Grid>
      <Divider />
      <div>
        <ReactMarkdown escapeHtml={false} source={post.body} />
      </div>
    </>
  )
}
