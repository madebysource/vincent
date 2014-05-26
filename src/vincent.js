var _ = require('lodash');
var Firebase = require('firebase');

function Vincent(url) {
  this.firebase = new Firebase(url);
  this.gotSettings = 0;
}

Vincent.prototype.start = function(callback) {
  // Call getSettings
  if (this.gotSettings == 0) {
    this.getSettings(callback);
  } else {
    callback(this.settingsArr);
  }
}

Vincent.prototype.getSettings = function(callback) {
  var self = this;
  this.firebaseData = null;
  var firebaseFn = function(data) {
    self.prepareSettings(data.val());
    self.firebaseData = data.val();
    self.gotSettings = 1;
    callback(self.settingsArr);
  };
  this.firebase.once('value', firebaseFn);
};

Vincent.prototype.getData = function() {
  return this.firebaseData;
}

Vincent.prototype.prepareSettings = function(dataSettings) {
  var self = this;
  var settingsObj = null;
  this.settingsArr = [];

  var findSettings = function(value, key, callback) {
    if (_.isObject(value.settings)) {
      if (callback) callback(value.settings, key);
    }
  };

  var processSettings = function(data, root) {
    settingsObj = {};

    recursive(data);
    settingsObj.parentName = root;
    self.settingsArr.push(settingsObj);
  };

  var recursive = function(value, parent) {
    _.each(value, function(val, key) {
      if (_.isObject(val) && !/query-\d+/.test(key)) {
        recursive(val, key);
      } else if (parent) {
        if (_.isArray(settingsObj[parent])) {
          settingsObj[parent].push(val);
        } else {
          settingsObj[parent] = [];
          settingsObj[parent].push(val);
        }
      } else {
        settingsObj[key] = val;
      }
    });
  };

  _.each(dataSettings, function(value, key) {
    findSettings(value, key, processSettings);
  });

};

Vincent.prototype.spyOn = function(callback) {
  var self = this;
  var resultData = callback(function(data) {
    self.saveResults(data);
  });
  return this;
};

Vincent.prototype.saveResults = function(data) {
  var self = this;

  // save results to the database
  if (data.length) {
    _.each(data, function(value) {
      if (value.tweets.length) {
        _.each(value.tweets, function(tweet) {
          self.firebase.child(value.parentName).child('tweets').child(tweet.tweet_id).set(tweet);
        });
      }

      _.each(value.lastId, function(lastId, key) {
        var k = key + 1;
        self.firebase.child(value.parentName).child('settings/queries').child('query-' + k).update(lastId);
      });
    });
  }
};

module.exports = Vincent;
