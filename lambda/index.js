const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const serverless = require('serverless-http')
const { createCipheriv, createDecipheriv } = require('crypto')
const _ = require('lodash')
const { getAllUnreadContents } = require('./feedly')

const algorithm = process.env.CRYPTO_ALGORITHM
const key = Buffer.from(process.env.CRYPTO_KEY, 'hex')
const iv = Buffer.from(process.env.CRYPTO_IV, 'hex')

const signInWithEmail = async (page) => {
  // Click the "Sign in with Email" button
  await page.waitForSelector('a.auth.primary.feedly')
  await page.click('a.auth.primary.feedly')

  // Input email
  await page.waitForSelector('input[type=email]')
  await page.type('input[type=email]', process.env.EMAIL)
  await page.keyboard.press('Enter')

  // Input password
  await page.waitForSelector('input[type=password]', { visible: true }) // https://stackoverflow.com/a/52501934
  await page.type('input[type=password]', process.env.PASSWORD)
  await page.keyboard.press('Enter')
}

// let browser
// (async () => {
//   if (process.env.NODE_ENV === 'local') {
//     const puppeteer = require('puppeteer-extra')
//     const StealthPlugin = require('puppeteer-extra-plugin-stealth')
//     puppeteer.use(StealthPlugin())
//     browser = await puppeteer.launch({
//       headless: true,
//       defaultViewport: { width: 1920, height: 1080 }
//     })
//   } else {
//     const chromium = require('@sparticuz/chromium')
//     const puppeteer = require('puppeteer-core')
//     chromium.setHeadlessMode = true
//     chromium.setGraphicsMode = false
//     browser = await puppeteer.launch({
//       args: chromium.args,
//       defaultViewport: chromium.defaultViewport,
//       executablePath: await chromium.executablePath(),
//       headless: chromium.headless,
//     })
//   }
// })()

const launchBrowser = async () => {
  if (process.env.NODE_ENV === 'local') {
    const puppeteer = require('puppeteer-extra')
    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    puppeteer.use(StealthPlugin())
    return puppeteer.launch({ headless: true, defaultViewport: { width: 1920, height: 1080 } })
  } else {
    const chromium = require('@sparticuz/chromium')
    const puppeteer = require('puppeteer-core')
    chromium.setHeadlessMode = true
    chromium.setGraphicsMode = false
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })
  }
}

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
  console.log('request body: %j', req.body)
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

app.get('/pageTitle', async (req, res) => {
  const browser = await launchBrowser()
  const page = await browser.newPage()
  await page.goto('https://www.youtube.com/@kanido386')
  const pageTitle = await page.title()
  await browser.close()
  res.json({ message: pageTitle })
})

app.get('/token', async (req, res) => {
  const browser = await launchBrowser()
  const page = await browser.newPage()

  await page.goto(process.env.HOMEPAGE_URL, { waitUntil: 'networkidle2' })

  await page.waitForSelector('a[href="https://feedly.com/i/back"]')
  await page.click('a[href="https://feedly.com/i/back"]')

  await page.waitForNavigation({ waitUntil: 'networkidle2' })
  await signInWithEmail(page)

  await page.waitForNavigation({ waitUntil: 'networkidle2' })
  await page.waitForSelector('span#header-title')
  const feedlyToken = await page.evaluate(async () => {
    console.dir(localStorage, { depth: null })
    const jsonString = localStorage.getItem('feedly.session')
    const { feedlyToken } = await JSON.parse(jsonString)
    return feedlyToken
  })
  console.log(`feedlyToken: ${feedlyToken}`)

  await browser.close()
  res.json({ message: 'ok' })
})

app.get('/feedly', async (req, res) => {
  // All articles from all the feeds the user subscribes to
  const streamId = encodeURIComponent(`user/${process.env.FEEDLY_USER_ID}/category/global.all`)
  // const projections = ['title', 'canonicalUrl', 'origin.title']
  const projections = ['alternate[0].href']
  const allContents = await getAllUnreadContents(streamId, projections)
  const urls = _.map(allContents, content => _.get(content, 'alternate[0].href'))
  const result = _.map(urls, url => `- [${url}](${url})`).join('\n')
  res.json({ result })
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
