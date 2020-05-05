const cheerio = require('cheerio');
const chalk = require('chalk');
const rp = require('request-promise');
const fs = require('fs')
const _ = require('lodash')
const url = require('url')

const scrapeHtml = require('./utils/scrapeHtml.js')
// const screenShotter = require('./utils/screenshotter.js')

const xml = 'https://www.mrksquincy.com/sitemap.xml'
console.log(xml)


if(!xml){
  console.log(`please supply a valid sitemap for the first argument, and a valid spreadsheet name for the second argument.`)
  process.exit(0)
}

// const writeStream = fs.createWriteStream('./apps/scraper/files/data.txt')

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

                  const metaData = []
                  const urlList = []

                  locKeys.forEach(key=>{

                    const locNum = Number(key)
                    const currentLoc = allLocs[locNum]


                    if(currentLoc === undefined){
                      return
                      }
                    const theURL = currentLoc.children[0].data

                    urlList.push(theURL)
                      })
                  return urlList
                    })
                .then( urlArray=>{

                    scrapeHtml(urlArray)
                   //screenShotter(urlArray)

                })
                .catch(e=>{
                        console.log(chalk.bold.red(`BORKEN BIG TIME:`), e)
                      })
