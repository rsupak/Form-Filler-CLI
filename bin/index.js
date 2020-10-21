#!/usr/bin/env node

const puppeteer = require('puppeteer');
const configFile = require('../config.json');
const formIdentifier = process.argv[2];

(async () => {
  const browser = await puppeteer.launch();
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
  for (const field in formInputs)
    
  if (field == "submitId") {
    await page.click(formInputs[field]);
  } else {
    await page.type(formInputs[field].type, formInputs[field].entry);  }

  /* proof of concept screenshot */
  // await page.screenshot({path: 'example.png'});

  await browser.close();
})();