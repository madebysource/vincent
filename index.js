var Vincent = require('./src/vincent');
var VincentTwitter = require('./services/twitter');
var exportObj = {
  core: Vincent,
  twitter: VincentTwitter
}
module.exports = exportObj
