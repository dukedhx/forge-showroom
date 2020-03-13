import { NowRequest, NowResponse } from '@now/node'

// @ts-ignore
export default async (request: NowRequest, response: NowResponse) => {

  response.status(200).send([])
}
