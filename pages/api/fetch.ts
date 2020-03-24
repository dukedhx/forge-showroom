import { NowRequest, NowResponse } from '@now/node'
import authenticator from './_authenticator'
import { createClient } from 'contentful'
const client = createClient({
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN_INTERNAL,
  environment: 'internal',
})
export default async (request: NowRequest, response: NowResponse) => {
  try {
    const authenticated = await authenticator.authenticate(request)
    if (authenticated) {
      const {
        query: { post, query, select },
      } = request
      const posts = await client.getEntries(
        Object.assign(
          {
            content_type: 'post',
          },
          post ? { 'sys.id[in]': post } : {},
          query ? { query } : {},
          select ? { select } : {}
        )
      )

      if (post) {
        if (posts.items && posts.items.length)
          response.status(200).send(posts.items[0])
        else throw { code: 404, message: 'Not found' }
      } else response.status(200).send(posts.items)
    } else throw { code: 403, message: 'Forbidden' }
  } catch (err) {
    console.log(err)
    response.status(err.code || 403).send(err.message || err)
  }
}
