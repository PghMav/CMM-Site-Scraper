const Nightmare = require('nightmare')
const vo = require('vo');
const URL = require('url')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const _ = require('lodash')
const Promise = require('promise');
const Stopwatch = require('statman-stopwatch');
const stopwatch = new Stopwatch();

const screenShotter = (urlArray) => {
    stopwatch.start();
    let resourceCount = 0;
    console.log(`screen shotter is working...`);

    const writeFile = (path, data, opts = 'utf8') =>
    new Promise((resolve, reject) => {
        fs.writeFile(path, data, opts, (err) => {
            if (err) reject(err);
            else resolve();
        })
    });

    function run(url) {
        return new Promise((resolveURL, rejectURL) => {
            const {
                protocol,
                slashes,
                host,
                query,
                href,
                pathname
            } = URL.parse(url);

            //const urlPosition = urlArray.indexOf(url);
            const pathnameLength = pathname.length < 2;

            const imageBox = path.join(__dirname, `../imgs/${!pathnameLength ? pathname : host}.png`);

            //console.log(imageBox);
            console.log(`Processing ${url}`);

            var nightmare = new Nightmare({
                show: false,
                width: 1024,
                height: 768,
                enableLargerThanScreen: true
            });

            nightmare.goto(url)
                .wait('body')
                .evaluate(() => {
                    var body = document.querySelector('body');
                    return { 
                        height: body.scrollHeight,
                        width:body.scrollWidth
                    }
                })
                .then(dimensions => {
                    nightmare.viewport(dimensions.width, dimensions.height)
                        .screenshot()
                        .then( buffer => {
                            writeFile(imageBox, buffer).finally(data => {
                                //console.log(chalk.bgCyan.red(`New .png file saved!`));
                                //console.log(chalk.bgCyan.red(`Did that thing`))
                                
                                resourceCount++;
                                nightmare.end().then(() => {
                                    resolveURL(chalk.bold.magenta(imageBox));
                                });
                            });
                        })
                        .catch( e => {
                            rejectURL(chalk.underline.red(`Something smells borken: ${e}`));
                        });
                });

            

            //console.dir(dimensions);
        });
    }

    let promiseArray = [];
    urlArray.forEach( url => promiseArray.push(run(url)) );
    Promise.all(promiseArray).then(values => {
        values.forEach( msg => console.log(msg) );
    });

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    /*asyncForEach(urlArray, async (url, urlIndex, arrayFull) => {


        await vo(run)(url)
            .then(
                resourceCount = resourceCount + 1
            ).catch(e => {
                return e;
            });

    });*/

    process.on('exit', () => {
        console.log(chalk.bgBlue.bold.white('All Done!!'));
        const stopIt = stopwatch.stop() / 1000;
        console.log(chalk.bold.yellow(
            `
          **************************


          Total: ${resourceCount} pages in ${stopIt} seconds


          **************************`));
    });

}

// basicUrls = [
//   'https://www.mrksquincy.com',
//   'https://www.mrksquincy.com/about',
//   'https://www.mrksquincy.com/blog']
// screenShotter(basicUrls)

module.exports = screenShotter
