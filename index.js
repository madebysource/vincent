var Vincent = require('./src/vincent');
var VincentTwitter = require('./services/twitter');
var exportObj = {
  vincent: Vincent,
  twitter: VincentTwitter
}
module.exports = exportObj
