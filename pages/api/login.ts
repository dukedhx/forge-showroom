import { NowRequest, NowResponse } from '@now/node'
// @ts-ignore
export default async (request: NowRequest, response: NowResponse) => {
  response.writeHead(302, {
    Location: `https://developer.api.autodesk.com/authentication/v1/authorize?response_type=code&client_id=${
      process.env.FORGE_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      process.env.FORGE_CALLBACK_URL
    )}&scope=data:read`,
  })
  response.end()
}
