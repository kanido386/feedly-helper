const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const serverless = require('serverless-http')
const { createCipheriv, createDecipheriv } = require('crypto')

const algorithm = process.env.CRYPTO_ALGORITHM
const key = Buffer.from(process.env.CRYPTO_KEY, 'hex')
const iv = Buffer.from(process.env.CRYPTO_IV, 'hex')

const encrypt = (plainText) => {
  const cipher = createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(plainText, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

const decrypt = (encrypted) => {
  const decipher = createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')
  return decrypted
}

const app = express()
app.use(cors())
// TODO:
// // Enable CORS only for requests from 'http://localhost:3000'
// app.use(cors({
//   origin: 'http://localhost:3000',
// }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  console.log('Hi from console!')
  console.log(`This is ${process.env.SOMETHING}!!!`)
  res.json({ message: 'Hello, Serverless World!' })
})

app.post('/encrypt', (req, res) => {
  const { plainText } = req.body
  const encrypted = encrypt(plainText)
  console.log(`encrypt ${plainText} to ${encrypted}`)
  res.json({ encrypted })
})

app.post('/decrypt', (req, res) => {
  const { encrypted } = req.body
  const decrypted = decrypt(encrypted)
  console.log(`decrypt ${encrypted} to ${decrypted}`)
  res.json({ message: 'ok' })
})

// For local testing
if (process.env.NODE_ENV === 'local') {
  const port = 3000
  app.listen(port, () => {
    console.log(`Local server running on http://localhost:${port}`)
  })
} else {
  // For AWS Lambda deployment
  module.exports.handler = serverless(app)
}
