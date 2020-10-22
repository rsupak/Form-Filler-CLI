#!/usr/bin/env node

const puppeteer = require('puppeteer');
const configFile = require('../config.json');

/* configuration options for puppeteer */
const chromeOptions = {
  // headless: false,
  defaultViewport: null,
  // slowMo: 10,
};

/* argument validation */
if (!process.argv[2]) {
  console.log("Form Identifier Required");
  console.log("fillform <form identifier>");
  process.exit(-1);
}
const formIdentifier = process.argv[2];

const main = async () => {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  await page.goto(configFile[formIdentifier][0]);

  /* login procedures (uncomment and fill if required) */

  // await page.type('<#username_text_id>', '<username>');
  // await page.type('<#password_text_id>', <process.env.SECRET_PASSWORD>);
  // await Promise.all([
  //   page.waitForNavigation(),
  //   page.click('<#button_id>')
  // ]);

  const formInputs = configFile[formIdentifier][1]
  for (const field in formInputs) {
    await page.type(formInputs[field].selector, formInputs[field].entry);
  }

  await page.$eval('form', el => el.submit())

  await browser.close();
};


main();