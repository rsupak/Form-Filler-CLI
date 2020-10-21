var cheerio = require('cheerio');
var scrape = require('website-scraper');
var fs = require('fs');

const AddressBook = 'http://address-book-rsupak.herokuapp.com/entries/new'
let options = {
  urls: ['http://address-book-rsupak.herokuapp.com/entries/new'],
  directory: '../htmls',
  recursive: false,
  defaultFilename: "new.html",
  maxDepth: 1
};

// scrape(options).then((result) => {
//   console.log("Downloaded");
//   let htmlFile = fs.readFile('../htmls/new.html', function(err, data) {
//     return data;
//   });
//   console.log(htmlFile)
// }).catch((err) => {
//   console.log("Errors occurred ", err);
// })

// let htmlFile = fs.readFile('../htmls/new.html', function(err, data) {
//   return data;
// });

const htmlFile = fs.readFileSync('../htmls/new.html').toString()

// console.log(htmlFile)
const $ = cheerio.load(htmlFile);
// console.log($.html())
// $('#form_container cur[type=text]').each((index) => {
//   var cur = $(this);
  
//   console.log('Value: ' + cur.val())
  
// });
let title = $("head title")[0].children[0].data
// console.log(title)
const configArray = [
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
// console.log(configArray)
const configFile = JSON.parse(fs.readFileSync('../config.json'));
configFile[title.toLowerCase()] = configArray;
fs.writeFileSync('../config.json', JSON.stringify(configFile, null, ' '));
