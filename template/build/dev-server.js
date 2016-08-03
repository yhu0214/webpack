var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('../config')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'production'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))
if (process.env.RESOURCES_DIR !== undefined) {
  app.use('/resources', express.static(process.env.RESOURCES_DIR))
}
else {
  console.warn(`Your RESOURCES_DIR environment var isn't setup. Type "vi ~/.bash_profile" and add a new line for it!`);
}

// handle missing things
app.use('*', (req, res) => {
  const extension = path.extname(req.baseUrl);
  switch(extension) {
    case '.mp4':
    case '.mov':
      res.sendFile(path.resolve('./static/assets/videos/missing.mp4'));
      break;
    default:
      res.send();
      break;
  }  
});

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})

// setup the socket
var io = require('socket.io')()
io.on('connection', socket => {
  socket.on('message', function (message) {
    // this is the catch all, just proxity it to the other connections
    socket.broadcast.send(message)
  })
})
io.listen(module.exports)
