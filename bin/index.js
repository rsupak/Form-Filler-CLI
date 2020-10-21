#!/usr/bin/env node

const { exitCode } = require('process');
const puppeteer = require('puppeteer');
const url = 'https://myaccount.rid.org/Public/Search/Member.aspx';


const chromeOptions = {
  headless: false,
  defaultViewport: null,
  slowMo: 10,
};

const configFile = require('../config.json');
const formIdentifier = process.argv[2];

if (!process.argv[2]) {
  console.log("FormID Required");
  process.exit(-1);
}

const main = async () => {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  await page.goto(configFile[formIdentifier][0]);
  // await page.goto(url);
  console.log(await page.title());

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

  await page.click(configFile[formIdentifier][2].submitId);

  /* proof of concept screenshot */
  // await page.screenshot({path: 'example.png'});

  await browser.close();
};

main();