# CMM-Site-Scraper

run the file apps.js from the command line with two flags:

### url

the url flag takes a simple .xml string. If it is not a string ending in .xml, it will throw an error.

### type

The type flag takes one of three valid values: HTML, SCREENSHOT, BOTH. Types are case sensitive.

## Example

node app.js --url=https://samplewebsite.com/sitemap.xml --type=SCREENSHOT
