import { createServer } from '../src/server'

describe('api endpoints', () => {
  let uniqueIdentifier = Date.now()
  const server = createServer({ logger: false })
 
  // beforeAll(async () => {
  //   // Create the server without logging
  // })

  afterAll(async () => {
    await server.close()
  })

  test('status endpoint returns 200', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    })
    expect(response.statusCode).toBe(200)
    expect(response.body).toBeTruthy()
  })
})
