import * as cookie from 'cookie'
import { NowRequest } from '@now/node'
import encryption from './_encryption'
const cookieKey = 'forge-showroom-authorization'
const maxAge = 86400
export default {
  authenticate: async (request: NowRequest): Promise<boolean> => {
    try {
      const credentails = (
        await encryption.decrypt(
          cookie.parse(request.headers.cookie)[cookieKey]
        )
      ).split(':')
      return (
        credentails.length == 2 &&
        credentails[0].endsWith('@autodesk.com') &&
        Date.now() < Number(credentails[1])
      )
    } catch (err) {
      console.log(err)
      return false
    }
  },
  getCookie: async (id: string): Promise<string> =>
    cookie.serialize(
      cookieKey,
      await encryption.encrypt(
        id + ':' + new Date().setDate(new Date().getDate() + 1)
      ),
      { maxAge, path: '/' }
    ),
}
