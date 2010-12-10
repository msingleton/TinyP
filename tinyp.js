/**
 * A Simple (tiny) JSONP library
 *
 * Usage: TinyP.load(url, callbackFunction);
 *
 * @author Mike Singleton
 *
 * Todos:
 *   - Don't execute until all JS is loaded
 *   - Have url include ? to indicate where to place the callback function (like jQuery)
 */

// Make JSLint happy
/*global window,document */

(function() {
  var TinyP = {
    head: document.getElementsByTagName('head')[0],
    callbacks: {},
    scriptTags: {},
    
    /* Generate a random function name */
    generateRandName: function() {
      var name = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$_';
      
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
    
    /* Add the script to the end of the head */
    addScript: function(script, name) {
      var tag = this.head.appendChild(script);
      this.scriptTags[name] = tag;
    },
    
    /* Generate a random callback function to pass as the JSONP callback */
    generateCallback: function() {
      var script = this.generateScript();
      var random = this.generateRandName();
      
      script.innerHTML = "function " + random + "(data) { TinyP.execute('" + random + "', data); }";
      this.addScript(script, random);
      
      return random;
    },
    
    /* 
     * Execute the callback associated with the random callback function and
     * clean up all of the inserted JS afterwards
     */
    execute: function(callbackName, data) {
      this.callbacks[callbackName](data);
     
      // Cleanup
      delete this.callbacks[callbackName];
      var script = this.scriptTags[callbackName];
      var urlScript = this.scriptTags['_url_' + callbackName];
      script.parentNode.removeChild(script);
      urlScript.parentNode.removeChild(urlScript);
    },
    
    /* 
     * Take a url and callback function and generate a random JSONP callback
     * and inject the script into the head
     */
    load: function(url, callback) {
      var callbackName = this.generateCallback();
      this.callbacks[callbackName] = callback;
      
      var script = this.generateScript();
      script.setAttribute('src', url + '&callback=' + callbackName);
      this.addScript(script, "_url_" + callbackName);
    }
  };

  window.TinyP = TinyP;
})();