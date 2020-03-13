// @ts-ignore
import { ContentfulClientApi, createClient } from 'contentful'

import { Post, Page, Tag } from './post.types'
import moment from 'moment'

export class PostApi {
  client: ContentfulClientApi

  constructor() {
    this.client = createClient({
      space: process.env.CTF_SPACE_ID,
      accessToken: process.env.CTF_CDA_ACCESS_TOKEN
    })
  }
  convertPage = (page): Page => ({
    title: page.fields.title,
    slug: page.fields.slug,
    description: page.fields.description,
    body: page.fileds.body
  })

  convertTag = (tag): Tag => ({ title: tag.fields.title, id: tag.sys.id })

  convertPost = (rawData): Post => {
    const rawPost = rawData.fields
    return {
      id: rawPost.id,
      body: rawPost.body,
      slug: rawPost.slug,
      description: rawPost.description,
      date: moment(Date.now()).format('DD MMM YYYY'),
      tags: (rawPost.tags || []).map(entry => entry.sys.id),
      title: rawPost.title,
      imageUrl: rawPost.imageUrl
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

  async fetchPageById(slug: string): Promise<Page> {
    return await this.client
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

  async fetchPostById(slug: string): Promise<Post> {
    return await this.client
      .getEntries({
        content_type: 'post',
        'fields.slug[in]': slug
      })
      .then(entries =>
        entries.items && entries.items.length
          ? this.convertPost(entries.items[0])
          : null
      )
  }
}
