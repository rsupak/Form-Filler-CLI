#!/usr/bin/env node

var cheerio = require('cheerio');
var fs = require('fs');
var SaveToExistingDirectoryPlugin = require('website-scraper-existing-directory');
var scrape = require('website-scraper');

/* check for html argument */
if (!process.argv[2]) {
  console.log("HTML Required");
  process.exit(-1);
}
const URL = process.argv[2];

let options = {
  urls: [ URL ],
  directory: '../lib/html',
  plugins: [ new SaveToExistingDirectoryPlugin() ],
  recursive: false,
  defaultFilename: "new.html",
  maxDepth: 1
};

scrape(options).then(result => {
  let query = cheerio.load(result[0].text);
  buildConfig(query);
})

const buildConfig = query => {
  let $ = query;
  let title = $('head title')[0].children[0].data.split(" ").slice(0, 2).join('');
  let configArray = [
    URL,
    {},
    {}
  ]
  $('input').each(
    function(index){  
        let cur = $(this);
        let label;
        if ($("label[for='" + cur.attr('id') + "']")){
          label = $("label[for='" + cur.attr('id') + "']");
        }
        // console.log(cur)
        // console.log('Type: ' + cur.attr('type') + 'Name: ' + cur.attr('name') + 'Value: ' + cur.val());
        let fieldType = ['text', 'email', 'password'];
        if (fieldType.includes(cur.attr('type')) && !(cur.attr('name').includes('extra'))) {
          let accessor = {}
          accessor["selector"] = "[id='" + cur.attr('id') + "']"
          accessor["entry"] = 'test';
          if (label) {
            configArray[1][label.text().split(' ').join('')] = accessor;
          } else {
            configArray[1][cur.attr('name')] = accessor
          }
        }
        if (cur.attr('type') == 'submit') {
          // console.log(cur)
          if (cur.attr('value').toLowerCase().includes('register') || cur.attr('value').toLowerCase().includes('submit')) {
            configArray[2]["submitId"] = cur.attr('class') ? '.' + cur.attr('class').split(' ')[0] : '.submit';
          } else {
            configArray[2]["submitId"] = ".btn";
          }
        }
    }
  );
  
  const configFile = JSON.parse(fs.readFileSync('config.json'));
  configFile[title.toLowerCase()] = configArray;
  fs.writeFileSync('config.json', JSON.stringify(configFile, null, ' '));
}