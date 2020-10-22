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

#### Test forms for Proof of Concept
*simple form fill*
* http://address-book-rsupak.herokuapp.com/entries/new

*form with Captcha*
* https://go.korbyt.com/master-employee-engagement-in-the-covid-era

*complex form (Amazon sign-up) !! notice the html wrapped in single-quotes to account for symbols*
* 'https://www.amazon.com/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fcart%2Fview.html%2F%3Fie%3DUTF8%26ref_%3Dnav_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&'


##### Future Implementation
* complex form submission with multiple page interaction