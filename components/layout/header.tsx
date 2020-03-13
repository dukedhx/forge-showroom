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

import DataContext from '../contexts/data'
import NotificationContext from '../contexts/notification'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

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
    color: '#fff',
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
    background: '#333',
    '& svg': {
      color: '#fff'
    }
  }
}))

export const Header = () => {
  const classes = useStyles()
  const [searching, setSearching] = useState(false)
  const [filtering, setFiltering] = useState(false)
  const dataContext = useContext(DataContext)
  const [keyword, setKeyword] = useState('')

  const [selectedTags, setSelectedTags] = useState([])
  const handleTagChange = event => setSelectedTags(event.target.value)
  const notificationContext = useContext(NotificationContext)
  const tags = dataContext.filter.tags
  const theme = createMuiTheme({
    palette: {
      primary: { main: '#fff' },
      secondary: { main: 'rgb(206, 206, 206)' }
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
  useEffect(() => {
    dataContext.setSelectedTags(selectedTags)
    if (selectedTags.length)
      window.location.hash = JSON.stringify({ tags: selectedTags })
  }, [selectedTags])

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
            <TextField
              label="Enter to search"
              className={`${
                searching ? classes.searching : classes.toggleInputHidden
              }`}
              onChange={e => setKeyword(e.target.value)}
              onBlur={() => setSearching(false)}
              onKeyPress={e => {
                if (e.key === 'Enter' && !dataContext.loading)
                  dataContext.search(keyword)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" className={classes.icons}>
                    <SearchIcon onClick={() => setSearching(true)} />
                  </InputAdornment>
                )
              }}
            />
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
              onClick={() => notificationContext.alert({ message: '2333' })}
              edge="end"
              aria-label="account of current user"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </ThemeProvider>
        </div>
      </Toolbar>
    </AppBar>
  )
}
