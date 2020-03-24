export type Post = {
  id: number
  description?: string
  date?: string
  slug: string
  tags?: Array<any>
  title: any
  imageUrl: string
  body?: any
  internal?: boolean
}

export type Page = {
  id:string
  title: string
  description?: string
  slug: string
  body: string
}

export type Tag = {
  title: string
  id: string
}

export type MenuItem = {
  title: string,
  pageId?: string
  url?:string
}

export type Menu = {
  page?: string
  url?:string
  title: string
  items: Array<MenuItem>
}
