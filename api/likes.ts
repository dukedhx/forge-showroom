import { NowRequest, NowResponse } from '@now/node'
import fetch from 'node-fetch'

export default async (request: NowRequest, response: NowResponse) => {
  const headers = {
    'X-Parse-Application-Id': process.env.back4appId,
    'X-Parse-Master-Key': process.env.back4appKey
  }
  const id = request.query.id
  let r = await fetch(
    process.env.back4appUrl + (id ? `?where={"sbid":"${id}"}` : ''),
    { headers }
  ).then(res => res.json())

  if (id) {
    const obj = r.results[0] || {}
    const body = { sbid: id, likes: (obj.likes || 0) + 1 }
    r = await fetch(process.env.back4appUrl + (obj.objectId || ''), {
      headers,
      method: obj.objectId ? 'PUT' : 'POST',
      body: JSON.stringify(body)
    }).then(res => res.json())
  }
  response.status(200).send(r.results)
}
