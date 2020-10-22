var cheerio = require('cheerio');
var fs = require('fs');
var SaveToExistingDirectoryPlugin = require('website-scraper-existing-directory');
var scrape = require('website-scraper');

const AddressBook = 'http://address-book-rsupak.herokuapp.com/entries/new'
let options = {
  urls: [ AddressBook ],
  directory: './html',
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
  let title = $('head title')[0].children[0].data;
  let configArray = [
    'http://address-book-rsupak.herokuapp.com/entries/new',
    {},
    {}
  ]
  $('input').each(
    function(index){  
        var cur = $(this);
        // console.log('Type: ' + cur.attr('type') + 'Name: ' + cur.attr('name') + 'Value: ' + cur.val());
        if (cur.attr('type') == 'text') {
          let accessor = {}
          accessor["selector"] = "[id=" + cur.attr('id') + "]"
          accessor["entry"] = '';
          configArray[1][cur.attr('name')] = accessor
          // console.log(configObj["0"][1][cur.attr('name')])
        }
        if (cur.attr('type') == 'submit') {
          configArray[2]["submitId"] = ".submit"
        }
    }
  );
  
  const configFile = JSON.parse(fs.readFileSync('../config.json'));
  configFile[title.toLowerCase()] = configArray;
  fs.writeFileSync('../config.json', JSON.stringify(configFile, null, ' '));
}