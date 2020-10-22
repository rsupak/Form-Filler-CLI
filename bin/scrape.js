#!/usr/bin/env node
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

/* check for command line argument validation */
if (!process.argv[2]) {
  console.log("URL Required");
  console.log("scrape <url>");
  process.exit(-1);
}
const URL = process.argv[2];

const buildConfigFile = query => {
  let $ = query;

  /* Create CLI argument */
  let title = $('head title')[0].children[0].data.split(" ").slice(0, 2).join('');

  /* Create Form Field attributes shell */
  let configArray = [
    URL, 
    {}
  ]

  /* Iterate over each input field and create designated input for Form*/
  $('input').each(
    function(index){  
      let cur = $(this);
      let label;
      if ($("label[for='" + cur.attr('id') + "']")){
        label = $("label[for='" + cur.attr('id') + "']");
      }

      /* Create understandable config attributes */
      let name = label.text() != '' ? label.text().split(' ').join('').trim() : cur.attr('name');
      let fieldType = ['text', 'email', 'password'];  // text-like field types
      if (fieldType.includes(cur.attr('type'))) {
        let accessor = {}
        accessor["selector"] = "[id='" + cur.attr('id') + "']"
        accessor["entry"] = seedField(name.toLowerCase());
        configArray[1][name] = accessor;
        // configArray.push({ [name] : accessor })
      }
    }
  );

  /* write config.json file to use with fillform */
  const configFile = JSON.parse(fs.readFileSync('config.json'));
  configFile[title.toLowerCase()] = configArray;
  fs.writeFileSync('config.json', JSON.stringify(configFile, null, ' '));
}

/* Main */
const main = async () => {
  axios(URL)
  .then(response => {
    const html = response.data;
    const query = cheerio.load(html)
    buildConfigFile(query)
  });
}

/* basic seed values for fields based on field label */
const seedField = fieldLabel => {
  if (fieldLabel.includes('email')) return 'test@tester.com';
  if (fieldLabel.includes('name')) return 'Smitty';
  if (fieldLabel.includes('phone')) return '5555555555';
  if (fieldLabel.includes('company')) return 'Test Company';
  if (fieldLabel.includes('password')) return 'pwd'
} 

main();