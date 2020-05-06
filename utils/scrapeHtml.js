const cheerio = require('cheerio');
const chalk = require('chalk');
const rp = require('request-promise');
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const theUrl = require('url')

const Stopwatch = require('statman-stopwatch');
const stopwatch = new Stopwatch();

const scrapeHtml =  (urlArray) =>{

    stopwatch.start()
    let resourceCount = 0

     urlArray.forEach( url=>{

      const {
       protocol,
       slashes,
       host,
       query,
       href,
       pathname
     } = theUrl.parse(url);

     const pathnameLength = pathname.length<2

     const htmlPath = path.join(__dirname, `../files/${!pathnameLength ?  pathname : host}.html`)

    rp({
    uri: url
    })
    .then(html => {

            fs.writeFileSync(htmlPath, html)

            stopwatch.split()
            const theSplitTime = stopwatch.splitTime()/1000
            stopwatch.unsplit()
            console.log(chalk.bold.magenta(htmlPath))
            console.log(chalk.bgCyan(`Split time: ${theSplitTime} seconds`))
            resourceCount = resourceCount + 1


    })
    .catch(e=>{

     console.log(chalk.bold.underline.red(`Problem: ${chalk.yellow(e)}`))
   })


})



process.on('exit', ()=>{
  console.log(chalk.bgBlue.bold.white('All Done!!'))
  const stopIt = stopwatch.stop()/1000
  console.log(chalk.bold.yellow(
    `
    **************************


    Total: ${resourceCount} pages in ${stopIt} seconds


    **************************`))

  });
}

// basicUrls = [
//   'https://www.mrksquincy.com',
//   'https://www.mrksquincy.com/about',
//   'https://www.mrksquincy.com/blog']
// scrapeHtml(basicUrls)

module.exports = scrapeHtml
