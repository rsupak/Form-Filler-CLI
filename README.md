### Form Filler CLI

##### Install Globally
* clone repo
* run install from the parent directory (form-filler-cli)
  ```
  npm install -g
  ```

##### Basic Commands
**Form Scraper**
Builds the configuration file needed to access form controls
*url for form needed as arguments*
```
scrape http://url-goes-here.com
```

**Auto-complete and Submit Form**
use access keys from config.json as argument
```
fillform <access-key>
```

##### Config.json format
```
{
 <access-key>: [
  "http://url-goes-here.com",
  {
   "field-label": {
    "selector": <selector used for puppeteer ex. "[id='entry_firstname']">,
    "entry": <seeded entry based on field-label / type>
   }
  }
 ]   
}
```