const Nightmare = require('nightmare')
const vo = require('vo');
const URL = require('url')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const _ = require('lodash')
const Stopwatch = require('statman-stopwatch');
const stopwatch = new Stopwatch();

// basicUrls = [
//   'https://www.mrksquincy.com',
//   'https://www.mrksquincy.com/about',
//   'https://www.mrksquincy.com/blog']

// basicUrls = ['https://www.mrksquincy.com/about', 'https://www.mrksquincy.com/blog']

const screenShotter = (urlArray) =>{
  stopwatch.start()
  let resourceCount = 0
  console.log(`screen shotter is working...`)

  // const asyncForEach = async (array, callback)=> {
  // for (let index = 0; index < array.length; index++) {
  //   await callback(array[index], index, array);
  // }
  // }

  function * run(url) {

    const {
      protocol,
      slashes,
      host,
      query,
      href,
      pathname
    } = URL.parse(url);

    const urlPosition = urlArray.indexOf(url)
    const pathnameLength = pathname.length<2

    const imageBox =  path.join(__dirname, `../imgs/${ !pathnameLength ? pathname : href}.png`)

    console.log(imageBox)

      var nightmare = new Nightmare({
          show: false,
          width: 1024,
          height: 768
      });
      var dimensions = yield nightmare.goto(url)
          .wait('body')
          .evaluate(function() {
              var body = document.querySelector('body');
              return {
                  height: body.scrollHeight,
                  width:body.scrollWidth
              }
          });

      console.dir(dimensions);
      yield nightmare.viewport(dimensions.width, dimensions.height)
          // .wait(1000)
          .screenshot()
          .then(buffer=>{

            fs.writeFile(imageBox, buffer, (e)=>{
              if(e) throw new Error;
              console.log(chalk.bgCyan.red(`New .png file saved!`))
            //  console.log(chalk.bgCyan.red(`Did that thing`))
            })

          })
          .then(()=>{
            stopwatch.split()
            const theSplitTime = stopwatch.splitTime()/1000
            stopwatch.unsplit()
            console.log(chalk.bold.magenta(imageBox))
            console.log(chalk.bgCyan(`Split time: ${theSplitTime} seconds`))}
          )
          .catch(e=>{
            console.log(chalk.underline.red(`Something smells borken: ${e}`))
          });

      yield nightmare.end();
  }

  // urlArray.forEach(url=>{
  //
  //
  // })

  async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
      }
    }
  //
  asyncForEach(urlArray, async (url, urlIndex, arrayFull)=>{


      await vo(run)(url)
        .then(
         resourceCount = resourceCount + 1
       ).catch(e=>{
         return e
       })

 });


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

// screenShotter(basicUrls)

module.exports = screenShotter
