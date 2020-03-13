import { createContext } from 'react'
import { PostApi, Post } from '../../services'
const api = new PostApi()
const filter = {
  tags: [],
  selectedTags: [],
  ids: []
}

const entries = {
  entries: new Array<Post>(),
  setEntries: entries => entries
}
const status = {
  loading: false
}

const getFilteredEntries = () =>
  entries.entries.filter(
    entry =>
      (!filter.selectedTags.length ||
        filter.selectedTags.find(e => entry.tags.includes(e)) != undefined) &&
      (!filter.ids.length || filter.ids.includes(entry.id))
  )
const loadEntries = async () => api.fetchPostEntries()
const loadTags = async () => api.fetchPostTags()
const loadEntryById = async id => api.fetchPostById(id)
const loadPageById = async id => api.fetchPageById(id)
export default createContext({
  filter,
  entries,
  loadEntries,
  loading: status.loading,
  search: async keyword => {
    filter.ids = await api.fetchPostByKeyword(keyword)
    entries.setEntries(getFilteredEntries())
  },
  loadProtected: token => {
    token && entries
  },
  setSelectedTags: tags => {
    filter.selectedTags = tags
    entries.setEntries(getFilteredEntries())
  }
})

export { loadEntries, loadTags, loadEntryById, loadPageById }
