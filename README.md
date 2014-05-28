# Vincent [![NPM version][npm-image]][npm-url]

> A tiny bot for spying and saving tweets you wish.

## Installation

Run ```npm install vincent```

## Documentation

Vincent uses Firebase for reading and saving tweets.

**Step 1**: Sign up on [Firebase.com](https://www.firebase.com/)

**Step 2**: Create a new app on Firebase

**Step 3**: Create database schema like this:

    VincentDatabase:
      tweetsAboutNodejs:
        settings:
          queries:
            "query-1":
              lastId: 0
              name: "nodejs.org"
              
**Step 4**: Create new JS file and require Vincent

    var Vincent = require('vincent');
    
    // Create a new instance of Vincent
    var botik = new Vincent.core('YOUR FIREBASE URl');
    
    // Create a new instance of Twitter service
    var twitter = new VincentTwitter({
      consumer_key: '...',
      consumer_secret: '...',
      access_token: '...',
      access_token_secret: '...',
    });
    
    // Then start to spying like this
    botik.start(function(settings) {
      botik.spyOn(function(result) {
        twitter.now(settings, result);
      });
    });
    
    // Get all results like this
    botik.start(function() {
        var data = botik.getData();
        console.log(data);
    });
    
**IMPORTANT**: Go here to create an app and get OAuth credentials (if you haven't already): [https://dev.twitter.com/apps/new](https://dev.twitter.com/apps/new)


**Step 5**: Profit!

## Firebase settings options

– You can exclude tweets (optional):

    settings:
      excludeTweets:
        exclude-1: "Tweet you don't want"
        exclude-2: "Bla Bla Justin Bieber"
        ...
      
– You can exclude users (optional):

    settigns:
      excludeUsers:
        exclude-1: "JustinBieber"
        ...
        
– Queries that Vincent search:

    settings:
      queries:
        query-1:
          name: "nodejs.org"
          lastId: 0
        query-1:
          name: "Node.js"
          lastId: 0
        ...
        
– User has more than `n` followers (optional):

    settings:
      userHasAtLeastFollowers: 120
      
– Ratio between followers and following (optional):

    settings:
      ratioBetweenFollowersAndFriends: 1.2
      
    
  That means user has 20% more followers than friends (following).
  
– You can have as many projects as you want

    tweetsAboutNodejs:
        settings:
          queries:
            "query-1":
              lastId: 0
              name: "nodejs.org"
              
    angularjs:
        settings:
          queries:
            "query-1":
              lastId: 0
              name: "angularjs"
              
              

          


[npm-url]:  https://npmjs.org/package/vincent
[npm-image]: http://img.shields.io/npm/v/vincent.svg?style=flat
