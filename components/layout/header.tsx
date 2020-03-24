import React, { useState, useContext, useEffect } from 'react'
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Filter from '@material-ui/icons/Filter'
import Badge from '@material-ui/core/Badge'
import Drawer from '@material-ui/core/Drawer'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Select from '@material-ui/core/Select'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import MenuItem from '@material-ui/core/MenuItem'
import DataContext from '../contexts/data'
import MenuIcon from '@material-ui/icons/Menu'
import { Menu } from 'services'
import Hidden from '@material-ui/core/Hidden'

import MenuComponent from '../menu'
import NotificationContext from '../contexts/notification'
const cookieKey = 'forge-showroom-authorization'

const getCookie = (name: string) => {
  const value = '; ' + document.cookie
  const parts = value.split('; ' + name + '=')
  if (parts.length == 2) return parts.pop().split(';').shift()
}

const createCookie = (name: string, value: string, hours?: number) => {
  const date = new Date()
  date.setTime(date.getTime() + (hours || 1) * 60 * 60 * 1000)
  document.cookie =
    name + '=' + value + '; expires=' + date.toUTCString() + '; path=/'
}

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  logo: { height: '50px', width: 'auto' },
  small: { height: '30px', display: 'none' },

  menuButton: {},
  toggleInputHidden: {
    '& > div': { 'margin-top': '11px' },
    '& *, & *:before': { border: 'none!important' },
    '& input': {
      width: 0,
    },
    '& label': {
      display: 'none',
    },
  },
  filterHidden: {
    display: 'none',
  },
  icons: {
    cursor: 'pointer',
    '& svg': {
      'font-size': '2rem',
    },
  },
  searching: {
    '& label': {
      color: 'rgb(206, 206, 206)',
    },
    transition: 'all 1s ease',
    '& input': {
      color: '#fff',
    },
    '& svg': {
      'font-size': '1.5rem',
    },
  },
  appBar: {
    background: '#333',
  },
  [theme.breakpoints.down('sm')]: {
    big: { display: 'none' },
    small: { display: 'block' },
  },

}))
export type HeaderProps = {
  menus?: Array<Menu>
  asyncSearch?: boolean
  showFilter?: boolean
}

export const Header = ({ menus, asyncSearch, showFilter }: HeaderProps) => {
  const classes = useStyles()
  const [searching, setSearching] = useState(false)
  const [filtering, setFiltering] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [keyword, setKeyword] = useState('')

  const [selectedTags, setSelectedTags] = useState([])

  const dataContext = useContext(DataContext)
  const notificationContext = useContext(NotificationContext)
  dataContext.status.setAlert = (alert) => notificationContext.alert(alert)
  const handleTagChange = (event) => {
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
    { id: '[Show All]', title: '[Show All]' },
  ]
  const theme = createMuiTheme({
    palette: {
      primary: { main: '#fff' },
      secondary: { main: 'rgb(239, 190, 9)' },
    },
  })

  const getStyles = (tag, selectedTags) => ({
    fontWeight:
      selectedTags.indexOf(tag) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  })

  const login = () => {
    if (loggedIn) {
      if (confirm('Logout?')) {
        document.cookie =
          cookieKey + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
        setLoggedIn(false)
      }
    } else {
      if (
        confirm(
          'Log in to your Autodesk acoount? Only Autodesk employees would be authorized!'
        )
      ) {
        createCookie('forge-showroom-redirect', location.href)
        window.location.href = '/api/login'
      }
    }
  }

  const setHash = ({ tags } = { tags: null }) => {
    const obj: any = {}
    if (keyword) obj.keyword = keyword
    if (selectedTags.length || tags) obj.tags = tags || selectedTags
    if (
      selectedTags.find((e) => e == '[Bookmarked]') &&
      dataContext.status.marked.length
    )
      obj.ids = dataContext.status.marked
    window.location.hash = Object.keys(obj).length
      ? encodeURIComponent(JSON.stringify(obj))
      : ''
  }

  useEffect(() => {
    dataContext.status.setLoggedIn(loggedIn)
  }, [loggedIn])

  useEffect(() => {
    if (selectedTags.find((e) => e == '[Bookmarked]')) {
      dataContext.filter.addIds(dataContext.getMarked())
    } else {
      dataContext.setSelectedTags(selectedTags)
      dataContext.filter.removeIds(dataContext.getMarked())
    }
  }, [selectedTags])

  useEffect(() => {
    setLoggedIn(!!getCookie(cookieKey))
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

  const getMenus = (color?: string) =>
    (menus &&
      menus.map((e, i) => (
        <MenuComponent
          key={i}
          title={e.title}
          url={e.url}
          page={e.page}
          items={e.items}
          color={color}
        />
      ))) ||
    null

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <img
          src="/images/logo--forge--white.png"
          className={`${classes.logo} ${classes.big}`}
        ></img>
        <img
          src="/favicon.ico"
          className={`${classes.logo} ${classes.small}`}
        ></img>
        <div>
          <Hidden smDown>{getMenus('#fff')}</Hidden>
        </div>

        <div className={classes.grow} />
        <div>
          <ThemeProvider theme={theme}>
            <Hidden mdUp>
              <IconButton
                className={classes.menuButton}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon color="primary" />
              </IconButton>
              <Drawer
                anchor="top"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                {getMenus()}
              </Drawer>
            </Hidden>
            <Tooltip title="Click to search">
              <TextField
                label="Enter to search"
                className={`${
                  searching ? classes.searching : classes.toggleInputHidden
                }`}
                style={{ maxWidth: '50%' }}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !dataContext.status.loadText) {
                    if (asyncSearch) {
                      setKeyword((e.target as any).value)
                      dataContext.search(keyword)
                    }
                    setHash()
                    if (!asyncSearch) {
                      window.location.href = '/' + window.location.hash
                    }
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
                  ),
                }}
              />
            </Tooltip>
            {showFilter === false && (
              <>
                <IconButton
                  className={classes.menuButton}
                  onClick={() => {
                    setFiltering(!filtering)
                    if (!filtering) setTagOpen(true)
                  }}
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
                  onOpen={() => setTagOpen(true)}
                  open={tagOpen}
                  onClose={() => setTagOpen(false)}
                  renderValue={(selected: Array<string>) => (
                    <div>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={tags.find((e) => e.id == value).title}
                        />
                      ))}
                    </div>
                  )}
                >
                  {tags.map((tag) => (
                    <MenuItem
                      key={tag.id}
                      value={tag.id}
                      style={getStyles(tag.id, selectedTags)}
                    >
                      {tag.title}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
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
