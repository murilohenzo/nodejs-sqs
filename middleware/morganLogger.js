const morgan = require('morgan')
const Logger = require('../logger')

const stream = {
  write: (message) => Logger.http(message)
}

const morganLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
)

module.exports = morganLogger
