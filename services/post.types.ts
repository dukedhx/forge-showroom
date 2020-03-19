export type Post = {
  id: number
  description?: string
  date: string
  slug: string
  tags?: Array<any>
  title: any
  imageUrl: string
  body?: any
  internal?: boolean
}

export type Page = {
  title: string
  description?: string
  slug: string
  body: string
}

export type Tag = {
  title: string
  id: string
}
