const puppeteer = require('puppeteer')

async function main() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto('https://feedly.com/homepage')

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  await page.screenshot({ path: 'test.png' })
  await browser.close()
}

main().catch(err => console.log(err))