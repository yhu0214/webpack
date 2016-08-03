// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')
var fs = require('fs')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/', assetsPath)

var resourcesPath = path.join(config.build.assetsRoot, 'resources');
rm('-rf', resourcesPath)
mkdir('-p', resourcesPath)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err

  // search through the app files and copy over any "/resources" we may have used
  var resourceRegex = /\/resources((\/[A-z0-9\-\%]+)*\.[A-z0-9]+)/igm;
  var copiedFiles = {};
  var files = stats.toJson().assetsByChunkName.app;
  
  for (var i = 0; i < files.length; i++) {
    if (path.extname(files[i]) !== '.map') {
      // read the file and copy over resources
      var file = path.join(config.build.assetsRoot, files[i]);
      fs.readFile(file, function(error, data) {
        if(error) {
          console.log(error);
          return;
        }

        var matches = data.toString().match(resourceRegex);
        if (matches !== null) {
          for (var i = 0; i < matches.length; i++) {
            if (copiedFiles[matches[i]] === undefined) {
              copiedFiles[matches[i]] = true;
              var resourceFile = matches[i].replace('/resources', '');
              resourceFile = path.join(process.env.RESOURCES_DIR, resourceFile);
              var destFile = path.join(config.build.assetsRoot, matches[i]);
              mkdir('-p', path.dirname(destFile));
              cp(resourceFile, destFile);
            }
          }
        }
      });
    }
  }

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
