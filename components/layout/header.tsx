import React, { useState, useContext, useEffect } from 'react'
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Filter from '@material-ui/icons/Filter'
import Badge from '@material-ui/core/Badge'
import Button from '@material-ui/core/Button'

import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Select from '@material-ui/core/Select'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'

import DataContext from '../contexts/data'
import NotificationContext from '../contexts/notification'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
const cookieKey = 'forge-showroom-authorization'

// @ts-ignore
const getCookie = (name: string) => {
  const value = '; ' + document.cookie
  const parts = value.split('; ' + name + '=')
  if (parts.length == 2)
    return parts
      .pop()
      .split(';')
      .shift()
}

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1
  },
  menu: {
    margin: '0 0 0 5px',
    color: '#fff'
  },
  menuButton: {},
  toggleInputHidden: {
    '& > div': { 'margin-top': '11px' },
    '& *, & *:before': { border: 'none!important' },
    '& input': {
      width: 0
    },
    '& label': {
      display: 'none'
    }
  },
  filterHidden: {
    display: 'none'
  },
  icons: {
    cursor: 'pointer',
    '& svg': {
      'font-size': '2rem'
    }
  },
  searching: {
    '& label': {
      color: 'rgb(206, 206, 206)'
    },
    transition: 'all 1s ease',
    '& input': {
      color: '#fff'
    },
    '& svg': {
      'font-size': '1.5rem'
    }
  },
  appBar: {
    background: '#333'
  }
}))

export const Header = () => {
  const classes = useStyles()
  const [searching, setSearching] = useState(false)
  const [filtering, setFiltering] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [keyword, setKeyword] = useState('')

  const [selectedTags, setSelectedTags] = useState([])
  const notificationContext = useContext(NotificationContext)

  const dataContext = useContext(DataContext)
  dataContext.status.setAlert = message =>
    notificationContext.alert({ message })
  dataContext.status.setLoggedIn = setLoggedIn
  const handleTagChange = event => {
    if (event.target.value.includes('[Show All]')) {
      dataContext.filter.ids = []
      setSelectedTags([])
      window.location.hash = ''
    } else {
      setSelectedTags(event.target.value)
      setHash({ tags: event.target.value })
    }
  }
  const tags = [
    ...(dataContext.filter.tags || []),
    { id: '[Bookmarked]', title: '[Bookmarked]' },
    { id: '[Show All]', title: '[Show All]' }
  ]
  const theme = createMuiTheme({
    palette: {
      primary: { main: '#fff' },
      secondary: { main: 'rgb(239, 190, 9)' }
    }
  })

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const getStyles = (tag, selectedTags) => ({
    fontWeight:
      selectedTags.indexOf(tag) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  })

  const login = () => {
    if (loggedIn) {
      document.cookie = cookieKey + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      setLoggedIn(false)
      dataContext.status.setLoggedIn(false)
    } else window.location.href = '/api/auth'
  }

  const setHash = ({ tags } = { tags: null }) => {
    const obj: any = {}
    if (keyword) obj.keyword = keyword
    if (selectedTags.length || tags) obj.tags = tags || selectedTags
    if (
      selectedTags.find(e => e == '[Bookmarked]') &&
      dataContext.status.marked.length
    )
      obj.ids = dataContext.status.marked
    window.location.hash = Object.keys(obj).length
      ? encodeURIComponent(JSON.stringify(obj))
      : ''
  }

  useEffect(() => {
    if (selectedTags.find(e => e == '[Bookmarked]')) {
      dataContext.filter.addIds(dataContext.getMarked())
    } else {
      dataContext.setSelectedTags(selectedTags)
      dataContext.filter.removeIds(dataContext.getMarked())
    }
  }, [selectedTags])

  useEffect(() => {
    if (window.location.hash) {
      try {
        const obj = JSON.parse(
          decodeURIComponent(window.location.hash.slice(1))
        )
        if (obj.ids) dataContext.filter.addIds(obj.ids)
        else {
          if (obj.tags && obj.tags.length) setSelectedTags(obj.tags)
          if (obj.keyword) {
            dataContext.search(obj.keyword)
            setKeyword(obj.keyword)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
  }, [])

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <img
          src="/images/logo--forge--white.png"
          style={{ height: '50px', width: 'auto' }}
        ></img>
        <div>
          <Button
            aria-haspopup="true"
            onClick={handleClick}
            className={classes.menu}
          >
            Home <ExpandMoreIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Forge Website</MenuItem>
            <MenuItem onClick={handleClose}>Forge Blog</MenuItem>
            <MenuItem onClick={handleClose}>Forge Documentation</MenuItem>
          </Menu>
        </div>

        <div className={classes.grow} />
        <div>
          <ThemeProvider theme={theme}>
            <Tooltip title="Click to search">
              <TextField
                label="Enter to search"
                className={`${
                  searching ? classes.searching : classes.toggleInputHidden
                }`}
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter' && !dataContext.status.loadText) {
                    setKeyword((e.target as any).value)
                    dataContext.search(keyword)
                    setHash()
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" className={classes.icons}>
                      <SearchIcon
                        onClick={() => setSearching(!searching)}
                        color={keyword ? 'secondary' : 'primary'}
                      />
                    </InputAdornment>
                  )
                }}
              />
            </Tooltip>
            <IconButton
              className={classes.menuButton}
              onClick={() => setFiltering(!filtering)}
              color="inherit"
            >
              {selectedTags.length ? (
                <Badge badgeContent={selectedTags.length} color="secondary">
                  <Filter />
                </Badge>
              ) : (
                <Filter />
              )}
            </IconButton>
            <Select
              multiple
              className={`${filtering ? '' : classes.filterHidden}`}
              value={selectedTags}
              onChange={handleTagChange}
              onBlur={() => setFiltering(false)}
              renderValue={(selected: Array<string>) => (
                <div>
                  {selected.map(value => (
                    <Chip
                      key={value}
                      label={tags.find(e => e.id == value).title}
                    />
                  ))}
                </div>
              )}
            >
              {tags.map(tag => (
                <MenuItem
                  key={tag.id}
                  value={tag.id}
                  style={getStyles(tag.id, selectedTags)}
                >
                  {tag.title}
                </MenuItem>
              ))}
            </Select>
            <IconButton
              className={classes.menuButton}
              onClick={login}
              edge="end"
              aria-label="account of current user"
            >
              <Tooltip title={loggedIn ? 'Log out' : 'Log in'}>
                <AccountCircle color={loggedIn ? 'secondary' : 'primary'} />
              </Tooltip>
            </IconButton>
          </ThemeProvider>
        </div>
      </Toolbar>
    </AppBar>
  )
}
