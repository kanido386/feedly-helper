const express = require('express')
const serverless = require('serverless-http')

const app = express()

app.get('/', (req, res) => {
  console.log('Hi from console!')
  res.json({ message: 'Hello, Serverless World!' })
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
