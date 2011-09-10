TinyP
=============
A Simple (tiny) JSONP library

Usage
-------------
Usage: new TinyP(url, callbackFunction);

Example:
-------------
new TinyP('https://api.foursquare.com/v2/users/self?oauth_token=XXXXX', function(data) {
  alert("Whoaa you've got " + data.response.user.badges.count + " badges!");
});