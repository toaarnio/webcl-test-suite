/*
 * This file is part of WebCL – Web Computing Language.
 *
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL
 * was not distributed with this file, You can obtain
 * one at http://mozilla.org/MPL/2.0/.
 *
 * The Original Contributor of this Source Code Form is
 * Nokia Research Tampere (http://webcl.nokiaresearch.com).
 *
 * Author: Tomi Aarnio, 2014
 */

//////////////////////////////////////////////////////////////////////////////
//
// Test suite setup & utility functions:
//
//  * INFO(msg)
//  * ERROR(msg)
//  * DEBUG(msg)
//  * TRACE(msg)
//  * createContext()
//  * loadSource(uri)
//  * testSuiteAsString(suite)
//
(function setup() {

  (function getURLParameters() {
    READY = (getURLParameter('run') === 'true');
    STRICT = (getURLParameter('strict') === 'true');
    INFO = (getURLParameter('info') === 'true') ? console.info : new Function();
    ERROR = (getURLParameter('debug') === 'true') ? console.error : new Function();
    DEBUG = (getURLParameter('debug') === 'true') ? console.log : new Function();
    TRACE = (getURLParameter('trace') === 'true') ? console.log : new Function();
    DEVICE = getURLParameter('device');
    DEVICE_INDEX = isNaN(+DEVICE) ? null : +DEVICE;
  })();

  testSuiteAsString = function(suite) {
    if (suite.parentSuite === null) {
      return suite.description;
    } else {
      return testSuiteAsString(suite.parentSuite) + " -> " + suite.description;
    }
  };

  createContext = function() {
    try {
      if (DEVICE_INDEX === null) {
        DEBUG("Selected device: DEFAULT");
        return webcl.createContext();
      } else {
        var selected = getDeviceAtIndex(DEVICE_INDEX);
        var properties = selected ? { devices: [selected] } : null;
        var ctx = webcl.createContext(properties);
        var device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
        var vendorId = device.getInfo(WebCL.DEVICE_VENDOR_ID);
        DEBUG("Selected device: " + deviceVendors[vendorId] + " (VENDOR_ID="+vendorId+")");
        ctx.vendor = deviceVendors[vendorId];
        return ctx;
      }
    } catch (e) {
      ERROR("webcl-harness.js: createContext() failed");
      throw e;
    }
  };

  createContextSimplified = function() {
    if (arguments.length === 0) {
      return webcl.createContext();
    }
    if (typeof(arguments[0]) === 'number') {
      return webcl.createContext({ deviceType: arguments[0] });
    }
    if (arguments[0] instanceof WebCLPlatform) {
      return webcl.createContext({ platform: arguments[0], deviceType: arguments[1] });
    }
    if (arguments[0] instanceof WebCLDevice) {
      return webcl.createContext({ devices: [arguments[0]] });
    }
    if (Array.isArray(arguments[0]) && arguments[0].length > 0) {
      return webcl.createContext({ devices: arguments[0] });
    }
    throw "createContextSimplified: Invalid arguments " + arguments;
  };

  // ### loadSource() ###
  // 
  // Loads a kernel source code file from the given `uri` via http GET, with a random query string
  // appended to the uri to avoid obsolete copies getting served from some proxy or cache.  The
  // given `uri` must have the suffix `.cl`.  Uses async XHR if a `callback` function is given.  If
  // loading succeeds, returns the source code as the function return value (in synchronous mode),
  // or passes it to the callback function (in async mode).  If anything goes wrong, throws an
  // exception or passes `null` to the given `callback`.
  //
  loadSource = function(uri, callback) {
    var validURI = (typeof(uri) === 'string') && uri.endsWith('.cl');
    if (validURI) {
      return xhrLoad(uri, callback);
    } else {
      throw "loadSource: invalid URI.";
    }
  };

  function getDeviceAtIndex(index) {
    var devices = [];
    webcl.getPlatforms().forEach(function(plat) {
      Array.prototype.push.apply(devices, plat.getDevices());
    });
    return devices[index];
  }

  var deviceVendors = {
    4098 : "AMD",
    4318 : "NVIDIA",
    32902 : "Intel",
  };

  // [PRIVATE] Loads the given `uri` via http GET. Uses async XHR if a `callback` function is given.
  // In synchronous mode, returns the http response text, or throws an exception in case of failure.
  // In async mode, returns `true` after dispatching the http request, and passes the http response,
  // or `null` in case of failure, as an argument to `callback`.
  //
  function xhrLoad(uri, callback) {
    var useAsync = callback && callback instanceof Function;
    var xhr = new XMLHttpRequest();
    if (useAsync) {
      xhr.timeout = 1000;
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            callback(xhr.responseText);
          } else {
            callback(null);
          }
        }
      };
    }
    xhr.open("GET", uri + "?id="+ Math.random(), useAsync);
    xhr.send();
    if (!useAsync && xhr.status !== 200) {
      throw "loadSource: failed to load " + uri;
    }
    return useAsync || xhr.responseText;
  };

  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
  };

})();

// Augment Jasmine with a "fail fast" mode to stop running a test
// suite immediately after the first failure.

jasmine.Env.prototype.failFast = function() {
  var env = this;
  env.afterEach(function() {
    if (!this.results().passed()) {
      env.specFilter = function(spec) {
        return false;
      };
    }
  });
};

// Uncomment the following line to enable the "fail fast" mode.
//jasmine.getEnv().failFast();

