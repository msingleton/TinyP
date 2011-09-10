/**
 * A Simple (tiny) JSONP library
 *
 * Usage: new TinyP(url, callbackFunction);
 *
 * @author Mike Singleton
 *
 * Todos:
 *   - Have url include ? to indicate where to place the callback function (like jQuery)
 */

/**
 * TinyP constructor
 * @constructor
 * @param {string} url to call
 * @param {function()} callback function to be executed after the data is fetched 
 */
function TinyP(url, callback) {
  this.url = url;
  this.callback = callback;
  this.internalCallback =  this.generateCallback();
  
  // Drop the script on the page
  var script = this.generateScript();
  script.setAttribute('src', url + '&callback=TinyP.' + this.internalCallback);
  this.script = document.getElementsByTagName('head')[0].appendChild(script);
}

TinyP.prototype = {
  /* Generate a random function name */
  generateRandName: function() {
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$_';
    var name = '';

    for(var i = 0; i < 15; i++) {
      name += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return name;
  },

  /* Generate a script tag */
  generateScript: function() {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    return script;
  },
  
  /* Generate a random callback function to pass as the JSONP callback */
  generateCallback: function() {
    var random = this.generateRandName();
    var self = this;
    
    TinyP[random] = function(data) {
      self.callback(data);

      // Cleanup
      delete TinyP[random];
      self.script.parentNode.removeChild(self.script);
    }

    return random;
  }
}