import { createContext } from 'react'
import { PostApi, Post } from '../../services'
const api = new PostApi()
const filter = {
  tags: [],
  selectedTags: [],
  ids: [],
  keyword: '',
  addIds: (ids: Array<any>) => {
    let sync = false
    ids.forEach(
      (e) => filter.ids.includes(e) || ((sync = true) && filter.ids.push(e))
    )
    sync && syncEntries()
  },
  removeIds: (ids: Array<any>) => {
    let sync = filter.ids.length
    filter.ids = filter.ids.filter((e) => !ids.includes(e))
    sync != filter.ids.length && syncEntries()
  },
}

const entries = {
  entries: new Array<Post>(),
  setEntries: (entries) => entries,
}

const status = {
  liked: [],
  marked: [],
  loadText: '',
  setLoadText: (loadText) => loadText,
  setAlert: (alert) => alert,
  alert: '',
  loggedIn: false,
  login: async (login: boolean) => {
    if (login) {
      if (!status.loggedIn) {
        status.setLoadText('Loading internal contents ...')
        try {
          const internals = await fetch('/api/fetchPosts?internalOnly=true')
            .then((res) => res.json())
            .then((res) =>
              res.map((e) =>
                Object.assign(api.convertPost(e), { internal: true })
              )
            )
          entries.setEntries([...internals, ...entries.entries])
        } catch (err) {
          status.setAlert(err)
        } finally {
          status.setLoadText('')
        }
      }
    } else {
      entries.setEntries(entries.entries.filter((e) => !e.internal))
      status.loggedIn = false
    }
  },
  setLoggedIn: (login) => login,
}

const getFilteredEntries = () =>
  entries.entries
    .filter(
      (entry) =>
        (!filter.selectedTags.length ||
          filter.selectedTags.find((e) => entry.tags.includes(e)) !=
            undefined) &&
        (!filter.ids.length ||
          filter.ids.find((e) => e.id == entry.id || e == entry.id) !=
            undefined)
    )
    .map((e, i) => {
      e.id = e.id || i
      return e
    })
const loadEntries = async (internal?: boolean) =>
  internal
    ? fetch(
        'api/fetch?select=sys.id,fields.title,fields.imageUrl,fields.description,fields.tags'
      )
        .then((res) => res.json())
        .then((posts) => posts.map((post) => api.convertPost(post)))
    : api.fetchPostEntries()
const loadTags = async () => api.fetchPostTags()
const searchEntryByKeywords = async (keyword) => api.fetchPostByKeyword(keyword)
const loadEntryById = async (slug, internal?, preview?) =>
  internal
    ? fetch('/api/fetch?post=' + slug)
        .then((res) => res.json())
        .then((post) => post && api.convertPost(post))
    : api.fetchPostById(slug, preview)
const loadPageById = async (id, preview?) => api.fetchPageById(id, preview)
const loadPages = async () => api.fetchPageEntries()
const loadMenus = async () => api.fetchMenus()

const syncEntries = () => entries.setEntries(getFilteredEntries())
const convertPost = (post) => api.convertPost(post)
export default createContext({
  status,
  filter,
  entries,
  loadEntries,
  syncEntries,
  addLikes: (id: string | number) => fetch('/api/likes?id=' + id),
  getLiked: (): Array<string | number> =>
    (status.liked = JSON.parse(
      localStorage.getItem('forge-showroom-likes') || '[]'
    )),
  getMarked: (): Array<string | number> =>
    (status.marked = JSON.parse(
      localStorage.getItem('forge-showroom-bookmarks') || '[]'
    )),
  search: async (keyword) => {
    if (keyword) {
      try {
        status.setLoadText('Searching ' + keyword)
        filter.ids = [
          ...filter.ids.filter((e) => !e.search),
          ...(await api.fetchPostByKeyword(keyword)).map((e) => ({
            id: e,
            search: true,
          })),
        ]
      } catch (err) {
        status.setAlert(err)
      } finally {
        status.setLoadText('')
      }
      //status.setAlert(JSON.stringify(filter.ids))
    } else filter.ids = filter.ids.filter((e) => !e.search)
    entries.setEntries(getFilteredEntries())
  },
  setSelectedTags: (tags) => {
    filter.selectedTags = tags
    entries.setEntries(getFilteredEntries())
  },
  getLikes: async () =>
    fetch('/api/likes')
      .then((res) => res.json())
      .then((res) => res.map((e) => ({ id: e.sbid, likes: e.likes || 0 })))
      .catch(console.error),
})

export {
  loadPages,
  loadMenus,
  loadEntries,
  loadTags,
  loadEntryById,
  loadPageById,
  convertPost,
  searchEntryByKeywords,
}
