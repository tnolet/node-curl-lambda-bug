const CAcert = require('./cacert')
const path = require('path')
const fs = require('fs')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const stat = util.promisify(fs.stat)
const { Curl } = require('node-libcurl')

function handler (message, context, cb) {
  console.log('*** START HANDLER ***')

  const curl = new Curl()
  curl.setOpt(Curl.option.VERBOSE, true)

  if (process.env.HTTPS === 'ON') {
    console.log("Using HTTPS")
    curl.setOpt('URL', 'https://google.com')
  } else {
    console.log("Using HTTP")
    curl.setOpt('URL', 'http://google.com')
  }
  curl.setOpt('FOLLOWLOCATION', true)

  const fullCAPath = path.join('/tmp/', CAcert.filename)

  writeFile(fullCAPath, CAcert.blob)
    .then(() => {
      curl.setOpt(Curl.option.CAINFO, fullCAPath)

      curl.on('end', function (statusCode, data, headers) {
        console.info(statusCode)
        console.info(this.getInfo('TOTAL_TIME'))
        console.log('*** STOP HANDLER: SUCCESS')
        this.close()
        cb()
      })

      curl.on('error', function (err) {
        console.log('*** STOP HANDLER: ERROR')
        this.close()
        cb(err)
      })
      curl.perform()
    })

}

module.exports = {
  handler
}
