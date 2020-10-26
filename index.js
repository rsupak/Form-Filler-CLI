#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const seed = require('./seed.json')

/* check for command line argument validation */
if (!process.argv[2]) {
  console.log("URL Required");
  console.log("scrape <url>");
  process.exit(-1);
}
const URL = process.argv[2]; // form access URL

/* configuration options for puppeteer */
const chromeOptions = {
  // headless: false,
  defaultViewport: null,
  // slowMo: 10
}

/* test URLs */
// const URL = 'http://umich.edu/~umweb/how-to/cgi-scripts/survey-multi-page.html'
// const URL = 'http://address-book-rsupak.herokuapp.com/entries/new'
// const URL = 'https://www.amazon.com/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3F_encoding%3DUTF8%26ref_%3Dnav_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&'
// const URL = 'https://go.korbyt.com/master-employee-engagement-in-the-covid-era'
/* test URLs */

const main = async () => {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  await page.goto(URL)
  let response = await axios(URL)
  
  let $ = cheerio.load(response.data) // build jquery-like object
  let action;                         // multi-form post action

  while ($('form')) {
    action = $('form') ? $('form').attr('action') : '';

    /* create array of form inputs using the jquery-like object */
    let inputs = []
    $('input').each(
      function(index) {
        cur = $(this);
        let label;
        if ($(`label[for='${cur.attr('id')}']`)) {
          label = $(`label[for='${cur.attr('id')}']`);
          cur['label'] = label
        } else {
          cur['label'] = ''
        }
        inputs.push(cur)
      }
    )

    /* fill each field when scraped from the form */
    for (let i = 0; i < inputs.length; i++) {
      let attribs = inputs[i][0];
      let fieldType = ['text', 'email', 'password'];  // text-like field types
      let labelname = inputs[i].label.text() != '' ? inputs[i].label.text().split(' ').join('').trim() : attribs.attribs.type == 'submit' ? 'submit' : attribs.attribs.name;
      let selector = {}
      let entry;

      for (let attrID in attribs.attribs) {
        selector[attrID] = `[${attrID}='${attribs.attribs[attrID]}']`

        if (fieldType.includes(attribs.attribs['type']) && (attribs.attribs['name'] && !(attribs.attribs['name'].includes('extra')))) {
          entry = seedField(labelname);
        }
      }

      let prop = selector.hasOwnProperty('id') ? 'id' : selector.hasOwnProperty('name') ? 'name' : 'class';

      try {
        if (entry) {
          await page.type(selector[prop], entry)
        }
      } catch (err) {
        console.error(err)
      }
    }

    if (action != '') {
      try {
        await Promise.all([
          page.$eval('form', el => el.submit()),
          page.waitForNavigation(),
        ])
      } catch (err) {
        console.error(err);
        break;
      }

      try {
        response = await axios(action);
        $ = cheerio.load(response.data);
      } catch (err) {
        console.error();
      }
    } else {
      await browser.close();
    }

    if (action == URL) {
      break;
    }

  }

  await browser.close()
}

const seedField = fieldLabel => {
  let firstname = seed.firstname[Math.floor(Math.random() * seed.firstname.length)];
  let lastname = seed.lastname[Math.floor(Math.random() * seed.lastname.length)];
  if (fieldLabel == null) return '';
  if (fieldLabel.toLowerCase().includes('email')) return `${firstname}.${lastname}@test.com`;
  if (fieldLabel.toLowerCase().includes('name')) {
    if (fieldLabel.toLowerCase().includes('first')){
      return firstname;
    }
    else if (fieldLabel.toLowerCase().includes('last')){
      return lastname;
    }
    else if (fieldLabel.toLowerCase().includes('full')){
      return `${firstname} ${lastname}`
    }
    else return 'test';
  }
  if (fieldLabel.toLowerCase().includes('phone')) return seed.phone
  if (fieldLabel.toLowerCase().includes('company')) return seed.company
  if (fieldLabel.toLowerCase().includes('password')) return seed.password
  return 'YES'
} 
main();