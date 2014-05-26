var _ = require('lodash');
var Vincent = require('./src/vincent');
var VincentTwitter = require('./services/twitter');

// Twitter auth config
var twitter = new VincentTwitter({
  consumer_key: '...',
  consumer_secret: '...',
  access_token: '...',
  access_token_secret: '...',
});

// new Vincent instance
var botik = new Vincent('YOUR FIREBASE URL');

// Get Firebase settings and start spying on twitter
botik.start(function(settings) {
  botik.spyOn(function(result) {
    twitter.now(settings, result);
  });
});
