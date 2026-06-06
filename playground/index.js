require('dotenv').config()
// const puppeteer = require('puppeteer')

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const start = async (options) => {
  const { connect } = await import('puppeteer-real-browser')
  // const { page, browser } = await connect(options)
  // return { page, browser }
  return connect(options)
}

const signInWithGoogle = async (page) => {
  // Click the "Sign in with Google" button
  await page.waitForSelector('a.auth.primary.google')
  await page.click('a.auth.primary.google')

  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  // Input email
  await page.waitForSelector('input[type=email]')
  await page.type('input[type=email]', process.env.EMAIL)
  await page.keyboard.press('Enter')

  // Input password
  await page.waitForSelector('input[type=password]', { visible: true }) // https://stackoverflow.com/a/52501934
  await page.type('input[type=password]', process.env.PASSWORD)
  await page.keyboard.press('Enter')
}

// TODO: very similar to signInWithGoogle
const signInWithEmail = async (page) => {
  // Click the "Sign in with Email" button
  await page.waitForSelector('a.auth.primary.feedly')
  await page.click('a.auth.primary.feedly')

  // await page.waitForNavigation({ waitUntil: 'networkidle2' })

  // Input email
  await page.waitForSelector('input[type=email]')
  await page.type('input[type=email]', process.env.EMAIL)
  await page.keyboard.press('Enter')

  // Input password
  await page.waitForSelector('input[type=password]', { visible: true }) // https://stackoverflow.com/a/52501934
  await page.type('input[type=password]', process.env.PASSWORD)
  await page.keyboard.press('Enter')
}

async function main() {
  // https://www.npmjs.com/package/puppeteer-real-browser
  const { page, browser } = await start({ headless: false, turnstile: true })

  // const browser = await puppeteer.launch({ headless: false })
  // // const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1920, height: 1080 } })
  // const page = await browser.newPage()

  await page.goto(process.env.HOMEPAGE_URL, { waitUntil: 'domcontentloaded' })
  // await page.goto(process.env.HOMEPAGE_URL, { waitUntil: 'networkidle2' })
  // console.log(await page.content()) // This one is helpful for debugging!

  await page.waitForSelector('a[href="https://feedly.com/i/back"]')
  // await page.click('a[href="https://feedly.com/i/back"]') // Error: Node is either not clickable or not an Element
  // https://stackoverflow.com/questions/70892717/error-node-is-either-not-clickable-or-not-an-htmlelement-puppeteer-when-i-tri
  await page.$eval(
    'a[href="https://feedly.com/i/back"]',
    (el) => {
      el.click()
    }
  )

  await page.waitForNavigation({ waitUntil: 'networkidle2' })
  // await signInWithGoogle(page)
  await signInWithEmail(page)

  console.log('============================== 1')
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
  // await page.waitForNavigation({ waitUntil: 'networkidle2' })
  console.log('============================== 2')
  // await page.waitForTimeout(5000)
  await page.waitForSelector('span#header-title')
  console.log('============================== 3')
  const feedlyToken = await page.evaluate(async () => {
    console.dir(localStorage, { depth: null })
    const jsonString = localStorage.getItem('feedly.session')
    const { feedlyToken } = await JSON.parse(jsonString)
    return feedlyToken
  })
  console.log(`feedlyToken: ${feedlyToken}`)

  await browser.close()
}

main().catch(err => console.log(err))