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
    ERROR = (getURLParameter('debug') === 'false') ? new Function() : console.error;
    DEBUG = (getURLParameter('debug') === 'false') ? new Function() : console.log;
    TRACE = (getURLParameter('trace') === 'true') ? console.log : new Function();
    var DEVICE = getURLParameter('device');
    DEVICE_INDEX = isNaN(+DEVICE) ? null : +DEVICE;
  })();

  testSuiteTrace = function(testcase) {
    var resultStr = testcase.results().passed() ? "pass" : "FAIL";
    TRACE(resultStr + ": " + testSuiteAsString(testcase.suite) + " -> " + testcase.description);
  };

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
        DEBUG("Creating a Context for Device DEFAULT");
        return webcl.createContext();
      } else {
        var selected = getDeviceAtIndex(DEVICE_INDEX);
        var properties = selected ? { devices: [selected] } : null;
        var ctx = webcl.createContext(properties);
        var device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
        var vendorId = device.getInfo(WebCL.DEVICE_VENDOR_ID);
        DEBUG("Creating a Context for Device " + deviceVendors[vendorId] + " (VENDOR_ID="+vendorId+")");
        ctx.vendor = deviceVendors[vendorId];
        return ctx;
      }
    } catch (e) {
      ERROR("webcl-harness.js: Unrecoverable error: createContext() failed, terminating test suite.");
      alert("webcl-harness.js: Unrecoverable error: createContext() failed, terminating test suite.");
      jasmine.getEnv().specFilter = function(spec) {
        return false;
      };
      throw e;
    }
  };

  releaseAll = function() {
    try { 
      webcl.releaseAll();
    } catch(e) { 
      ERROR("webcl-harness.js: Unrecoverable error: webcl.releaseAll() failed, terminating test suite.");
      alert("webcl-harness.js: Unrecoverable error: webcl.releaseAll() failed, terminating test suite.");
      jasmine.getEnv().specFilter = function(spec) {
        return false;
      };
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

  jasmine.getEnv().specFilter = function(spec) {
    var queryString = getURLParameter('spec');
    var specName = queryString && queryString.replace(/\+/g, " ");
    return (!specName) || spec.getFullName().indexOf(queryString) === 0;
  };

  // ### addCustomMatchers ###
  // 
  addCustomMatchers = function() {
    jasmine.addMatchers(jasmineCustomMatchers);
  };

  var jasmineCustomMatchers = {

    // expect('kernels/illegalKernel.cl').not.toBuild();
    //
    toBuild: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          try {
            var pathToSource = actual;
            src = loadSource(pathToSource);
            var ctx = createContext();
            program = ctx.createProgram(src);
            devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
            device = devices[0];
            program.build(devices);
            DEBUG("Building '" + pathToSource + "' did not throw any exception");
            return { pass: true };
          } catch(e) {
            DEBUG("Building '" + pathToSource + "' threw " + e.name);
            try {
              DEBUG("Build log: " + program.getBuildInfo(device, WebCL.BUILD_LOG));
            } catch (e2) {
              DEBUG("Failed to get BUILD_LOG: ", e2);
            }
            return { pass: false };
          }
        },
      };
    },

    // expect('myFunction(validArg)').not.toThrow();
    // expect('myFunction(invalidArg)').toThrow('TypeError');
    //
    toThrow: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          try {
            var wrapper = new Function(actual);
            wrapper.apply(this, arguments);
            return { 
              pass: false,
              message: "Expected '" + actual + "' to throw " + (expected || "any exception") + ", but it threw nothing.",
            };
          } catch(e) {
            DEBUG(e);
            var result = {};
            result.pass = (expected === undefined) || (e.name === expected);
            if (expected === undefined) {
              result.message = "Expected '" + actual + "' not to throw any exception, but it threw " + e.name + ".";
            } else if (e.name !== expected) {
              result.message = "Expected '" + actual + "' to throw " + expected + ", but it threw " + e.name + ".";
            }
            return result;
          }
        },
      };
    },

    // expect(42).toPass(function(v) { return (v > 0 && v < 100); });
    // expect("foo").toPass(function(v) { return typeof(v) === 'number' });
    //
    toPass: function(util, customEqualityTesters) {
      return {
        compare: function(actual, validator) {
          var result = {};
          result.pass = validator(eval(actual));
          if (result.pass) {
            result.message = "Expected '" + actual + "' not to be valid according to " + validator.toString().replace(/\n/g, "");
          } else {
            result.message = "Expected '" + actual + "' to be valid according to " + validator.toString().replace(/\n/g, "");
          }
          return result;
        }
      };
    },

    // expect('getElements() instanceof Array').toEvalAs(true);
    //
    toEvalAs: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var actualResult = eval(actual);
          var expectedResult = eval(expected);
          return { pass: (actualResult === expectedResult) }
        },
      };
    },

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

  // ### getDeviceAtIndex() ###
  // 
  getDeviceAtIndex = function(index) {
    if (index === null) {
      DEBUG("Selected device [0] (DEFAULT)");
      return webcl.getPlatforms()[0].getDevices()[0];
    } else {
      var devices = [];
      webcl.getPlatforms().forEach(function(plat) {
        Array.prototype.push.apply(devices, plat.getDevices());
      });
      DEBUG("Selected device ["+index+"]");
      return devices[index];
    }
  };

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

