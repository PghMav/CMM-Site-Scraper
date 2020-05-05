const cheerio = require('cheerio');
const chalk = require('chalk');
const rp = require('request-promise');
const fs = require('fs')
const _ = require('lodash')
const Promise = require('bluebird')
const Stopwatch = require('statman-stopwatch')
const url = require('url')

//const screenShotter2 = require('./utils/screenshotter2.js')

const loadUrlData = require('./utils/loadUrlData.js')
const saveUrlData = require('./utils/saveUrlData.js')

// const scrapeUrl = require('./scrapeUrl.js')
// const scrapeHtml = require('./scrapeHtml.js')
const screenShotter = require('./utils/screenshotter.js')



Promise.promisifyAll(screenShotter)

//const xml = process.argv.slice(2)
// const xml = 'https://www.xml-sitemaps.com/download/www.incrediblewindows.com-e3d7dd8b/sitemap.xml?view=1'
const xml = 'https://www.mrksquincy.com/sitemap.xml'
console.log(xml)
//const xlsxName = process.argv.slice(3)

if(!xml){
  console.log(`please supply a valid sitemap for the first argument, and a valid spreadsheet name for the second argument.`)
  process.exit(0)
}

const mXml = 'http://m.ashleyadamssalon.com/sitemap.xml'
//'https://www.windowconceptspb.com/sitemap.xml'
//'https://www.divineinteriorsgroup.com/sitemap.xml'
//var hrstart = process.hrtime()
const writeStream = fs.createWriteStream('./apps/scraper/files/data.txt')

const options = {
  uri: xml,
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
  }
}

const scraper = rp(xml)
                .then(html=>{
                  const $ = cheerio.load(html);
                  const allLocs = $('loc')
                  const locKeys = _.keys(allLocs)

                  const data = loadUrlData()
                  const metaData = []
                  const urlList = []

                  locKeys.forEach(key=>{

                    const locNum = Number(key)
                    const currentLoc = allLocs[locNum]


                    if(currentLoc === undefined){
                      return
                      }
                    const theURL = currentLoc.children[0].data
                    //console.log(chalk.bgBlue(theURL))
                    urlList.push(theURL)
                      })
                  return urlList
                    })
                .then( urlArray=>{

                    //scrapeHtml(urlArray)
                   //scrapeUrl(urlArray)
                   screenShotter(urlArray)

                })
                .then(console.log(chalk.bgGreen(`All Done!!!!!`)))
                .catch(e=>{
                        console.log(chalk.bold.red(`BORKEN BIG TIME:`), e)
                      })
