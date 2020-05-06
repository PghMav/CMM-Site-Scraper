# CMM-Site-Scraper

The app iterates over pages in a sitemap and either
- copies the html from the page and makes a new .html file with the contents
- takes a full screenshot of the page
- or both

The newly created .html files are added to the "files" folder, and images are added to the "imgs" folder.

Run the file apps.js from the command line with two flags:

### url

the url flag takes a simple .xml string. If it is not a string ending in .xml, it will throw an error.

### type

The type flag takes one of three valid values: HTML, SCREENSHOT, BOTH. Types are case sensitive.

## Example

node app.js --url=https://samplewebsite.com/sitemap.xml --type=SCREENSHOT
