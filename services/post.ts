// @ts-ignore
import { ContentfulClientApi, createClient } from 'contentful'

import { Post, Page, Tag,Menu, } from './post.types'

export class PostApi {
  client: ContentfulClientApi
  clientPreview: ContentfulClientApi
  constructor() {
    // @ts-ignore
    this.client = createClient({
      space: process.env.CTF_SPACE_ID,
      accessToken: process.env.CTF_CDA_ACCESS_TOKEN
    })
    // @ts-ignore
    this.clientPreview = createClient({
      space: process.env.CTF_SPACE_ID,
      accessToken: process.env.CTF_CDA_ACCESS_TOKEN_PREVIEW,
      host: "preview.contentful.com"
    })
  }
  convertPage = (page): Page => ({
    id:page.sys.id,
    title: page.fields.title,
    slug: page.fields.slug,
    description: page.fields.description||null,
    body: page.fields.body,
  })

  convertTag = (tag): Tag => ({
    title: tag.fields.title['en-US'] || tag.fields.title,
    id: tag.sys.id
  })
  convertMenu = (menu):Menu=>({
    title: menu.fields.title,
    items: (menu.fields.items||[]).map(e=>({title:e.fields.title,page:(e.fields.page&&e.fields.page.sys.id)||null,url:e.fields.link||null})),
    page:(menu.fields.page&&menu.fields.page.sys.id)||null,
    url:menu.fields.link||null
  })
  convertPost = (rawData, i = ''): Post => {
    const rawPost = rawData.fields
    return {
      id: (rawData.sys && rawData.sys.id) || i,
      body: (rawPost.body || {})['en-US'] || rawPost.body || '',
      slug: (rawPost.slug||{})['en-US'] || rawPost.slug,
      description:
        (rawPost.description || {})['en-US'] || rawPost.description || '',
      tags: ((rawPost.tags || {})['en-US'] || rawPost.tags || []).map(
        entry => entry.sys.id
      ),
      title: (rawPost.title || {})['en-US'] || rawPost.title || '',
      imageUrl: (rawPost.imageUrl || {})['en-US'] || rawPost.imageUrl || '',
      order:rawPost.order||0
    }
  }

  async fetchPostTags(): Promise<Array<Tag>> {
    return await this.client
      .getEntries({
        content_type: 'tag'
      })
      .then(entries =>
        entries.items ? entries.items.map(entry => this.convertTag(entry)) : []
      )
  }

  async fetchPostEntriesSelect(select: Array<string>): Promise<Array<any>> {
    return await this.client
      .getEntries({
        content_type: 'post',
        select: select.join(',')
      })
      .then(entries => entries.items)
  }

  async fetchPostEntries(): Promise<Array<Post>> {
    return await this.client
      .getEntries({
        content_type: 'post'
      })
      .then(entries =>
        entries.items ? entries.items.map(entry => this.convertPost(entry)) : []
      )
  }

  async fetchPostByKeyword(keyword: string): Promise<Array<string>> {
    return await this.client
      .getEntries({
        content_type: 'post',
        query: keyword,
        select: 'sys.id'
      })
      .then(entries =>
        entries.items ? entries.items.map(entry => entry.sys.id) : []
      )
  }

  async fetchPageById(slug: string,preview?:boolean): Promise<Page> {
    return await (preview?this.clientPreview:this.client)
      .getEntries({
        content_type: 'page',
        'fields.slug[in]': slug
      })
      .then(entries =>
        entries.items && entries.items.length
          ? this.convertPage(entries.items[0])
          : null
      )
  }

  async fetchPageEntries(): Promise<Array<Page>> {
    return await this.client
      .getEntries({
        content_type: 'page',
      })
      .then(entries =>
        entries.items && entries.items.length
          ? entries.items.map(entry=>this.convertPage(entry))
          : null
      )
  }

  async fetchMenus(): Promise<Array<Menu>> {
    return await this.client
      .getEntries({
        content_type: 'menu',
      })
      .then(entries =>
        entries.items && entries.items.length
          ? entries.items.map(e=>this.convertMenu(e))
          : null
      )
  }



  async fetchPostById(slug: string, preview?: boolean): Promise<Post> {
    return (preview?this.clientPreview:this.client)
      .getEntries({
        content_type: 'post',
        [preview?'sys.id[in]':'fields.slug[in]']: slug
      })
      .then(entries =>
        entries.items && entries.items.length
          ? this.convertPost(entries.items[0])
          : null
      )
  }
}
