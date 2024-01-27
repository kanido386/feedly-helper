require('dotenv').config()
// const puppeteer = require('puppeteer')

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

async function main() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto(process.env.LOGIN_URL, { waitUntil: 'networkidle2' })

  await page.waitForSelector('input[type=email]')
  await page.type('input[type=email]', process.env.EMAIL)
  await page.keyboard.press('Enter')

  // TODO: Can't work:
  // await page.waitForNavigation({ waitUntil: 'networkidle2' })
  // await page.waitForSelector('input[type=password]')
  // await page.type('input[type=password]', process.env.PASSWORD)
  // await page.keyboard.press('Enter')

  // // Set screen size
  // await page.setViewport({ width: 1080, height: 1024 })

  // await page.screenshot({ path: 'test.png' })
  // await browser.close()
}

main().catch(err => console.log(err))