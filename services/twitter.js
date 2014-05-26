var Twit = require('twit');
var _ = require('lodash');

var VincentTwitter = function(authSettings) {
  this.Twit = new Twit(authSettings);
  this.data = [];
  this.syncCounter = 0;
};

VincentTwitter.prototype.now = function(settings, callback) {
  var self = this;
  this.settingsLen = settings.length;

  _.each(settings, function(config, key) {
    self.data[key] = {
      parentName: config.parentName,
      tweets: [],
      lastId: []
    };
    self.getTweets(config, key, callback);
  })
};

VincentTwitter.prototype.getTweets = function(config, counter, callback) {
  var self = this;
  var minFollowers = config.userHasAtLeastFollowers || 100;
  var rootName = config.parentName;
  var queries = config.queries;
  var excludeTweets = config.excludeTweets || [];
  var excludeUsers = config.excludeUsers || [];
  var ratioNumber = config.ratioBetweenFollowersAndFriends || 1;

  var count = 100;
  var tweetObj = {};
  var lastId = null;
  var end = 0;
  var excluded = false;

  var get = function(obj) {
    var params = {};
    var key = obj.key;
    params.q = obj.query.name;
    params.count = obj.count;
    if (obj.query.lastId) params.since_id = obj.query.lastId;

    self.Twit.get('search/tweets', params, function(err, data, response) {

      if (!data || !('statuses' in data)) {
        console.log('No statuses in data');
        return false;
      }

      if (data.statuses.length) {
        lastId = data.statuses[0].id;
        self.data[counter].lastId.push({ lastId: lastId, name: params.q });

        // Save tweets
        _.each(data.statuses, function(tweet) {
          tweetObj = {};
          var ratio = (tweet.user.followers_count / tweet.user.friends_count) >= ratioNumber;

          _.each(excludeTweets, function(exVal) {
            if (new RegExp(exVal).test(tweet.text)) {
              excluded = true;
              return false;
            }
            _.each(excludeUsers, function(user) {
              if (user.toLowerCase() == tweet.user.screen_name.toLowerCase()) {
                excluded = true;
                return false;
              }
            });
          });

          if (tweet.user.followers_count >= minFollowers && (typeof tweet.retweeted_status == 'undefined') && ratio && !excluded && (tweet.id != params.since_id)) {
            tweetObj = {
              created_at: tweet.created_at,
              text: tweet.text,
              source: tweet.source,
              retweet_count: tweet.retweet_count,
              favorite_count: tweet.favorite_count,
              followers_count: tweet.user.followers_count,
              friends_count: tweet.user.friends_count,
              user_name: tweet.user.name,
              screen_name: tweet.user.screen_name,
              user_desc: tweet.user.description,
              tweet_id: tweet.id_str,
              profile_image: tweet.user.profile_image_url,
            }
            self.data[counter].tweets.push(tweetObj);
          }
          excluded = false;
        });
      }

      end += 1;
      if (key == 0) self.syncCounter += 1;

      if (end == queries.length && self.syncCounter == self.settingsLen) {
        callback(self.data, self.lastId);
      }
    });
  };

  _.each(queries, function(query, key) {
    get({
      query: query,
      count: count,
      key: key
    });
  });

};

module.exports = VincentTwitter;
