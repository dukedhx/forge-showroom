import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MenuItem from '@material-ui/core/MenuItem'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
type Item = {
  title: string
  url?: string
  page?: string
}

type MenuProps = {
  title: string
  url?: string
  page?: string
  items?: Array<Item>
  color?: string
}

export default ({ page, url, items, title, color }: MenuProps) => {
  const classes = makeStyles(() => ({
    menu: {
      margin: '0 0 0 5px',
      color: color || 'initial',
      '& a': { color: color || 'initial', textDecoration: 'none' },
    },
  }))()

  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <Button
        aria-haspopup="true"
        onClick={items && handleClick}
        className={classes.menu}
      >
        {items && items.length ? (
          <>
            {title} <ExpandMoreIcon />
          </>
        ) : (
          <Link href={page ? '/page/[slug]' : url} as={ (page && `/page/${page}`)||url }>
            <a>{title}</a>
          </Link>
        )}
      </Button>
      {items && items.length ? (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {items.map((entry, i) => (
            <MenuItem key={i}>
              <Link
                href={entry.page ? '/page/[slug]' : entry.url}
                as={(entry.page && `/page/${entry.page}`)||entry.url}
              >
                <a>{entry.title}</a>
              </Link>
            </MenuItem>
          ))}
        </Menu>
      ) : (
        ''
      )}
    </>
  )
}
