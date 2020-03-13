import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  floatRight: { float: 'right' },
  textWhite: { color: '#fff' },
  footer: {
    color: '#fff',
    padding: '10px',
    margin: '20px 0 0 0',
    width: '100%',
    height: '60px',
    'line-height': '60px',
    'background-color': '#495057'
  }
}))

export const Footer = () => {
  const classes = useStyles()

  return (
    <div className={classes.footer}>
      <span className={classes.textWhite}></span>
      <div className={classes.floatRight}>
        &#169;
        {`${new Date().getFullYear()} Autodesk Inc. All Rights Reserved`}
      </div>
    </div>
  )
}

Footer.displayName = 'Footer'
