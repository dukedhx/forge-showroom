import { NowRequest, NowResponse } from '@now/node'
import * as querystring from 'querystring'
import * as cookie from 'cookie'
import fetch from 'node-fetch'
import authenticator from './_authenticator'

export default async (request: NowRequest, response: NowResponse) => {
  try {
    const form = {
      client_id: process.env.FORGE_CLIENT_ID,
      client_secret: process.env.FORGE_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: request.query.code,
      redirect_uri: process.env.FORGE_CALLBACK_URL,
    }
    const tokenResult = await fetch(
      'https://developer.api.autodesk.com/authentication/v1/gettoken',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        body: querystring.stringify(form),
      }
    ).then((res) => res.json())
    if (!tokenResult.access_token)
      throw { code: 403, message: 'Invalid access token' }

    const result = await fetch(
      'https://developer.api.autodesk.com/userprofile/v1/users/@me',
      { headers: { Authorization: 'Bearer ' + tokenResult.access_token } }
    ).then((res) => res.json())
    console.log(result)

    if (result.emailId && result.emailId.endsWith('@autodesk.com')) {
      const cookies = cookie.parse(request.headers.cookie || '')
      const secret = await authenticator.getCookie(result.emailId)

      response.writeHead(307, {
        'Set-Cookie': secret,
        Location: cookies['forge-showroom-redirect'] || '/',
      })
      response.end()
    } else throw { code: 403, message: 'Invalid userid' }
  } catch (err) {
    console.log(err)
    response.status(err.code || 500).send(err.message || err)
  }
}
