import * as crypto from 'crypto'

const algorithm = 'aes-192-cbc'

const key = crypto.scryptSync(
  process.env.encryptionPassword,
  process.env.encryptionSalt,
  24
)

const iv = Buffer.alloc(16, 0)

export default {
  encrypt: async (text: string): Promise<string> =>
    new Promise((resolve) => {
      const cipher = crypto.createCipheriv(algorithm, key, iv)

      let encrypted = ''
      cipher.on('readable', () => {
        let chunk
        while (null !== (chunk = cipher.read()))
          encrypted += chunk.toString('hex')
      })

      cipher.on('end', () => resolve(encrypted))

      cipher.write(text)
      cipher.end()
    }),
  decrypt: async (text: string): Promise<string> =>
    new Promise((resolve) => {
      const decipher = crypto.createDecipheriv(algorithm, key, iv)

      let decrypted = ''
      decipher.on('readable', () => {
        let chunk
        while (null !== (chunk = decipher.read()))
          decrypted += chunk.toString('utf8')
      })
      decipher.on('end', () => resolve(decrypted))

      decipher.write(text, 'hex')
      decipher.end()
    }),
}
