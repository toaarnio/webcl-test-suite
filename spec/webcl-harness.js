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
//  * setup()
//  * setupWithSource()
//  * setupWithWait()
//  * getSelectedDevice()
//  * createContext()
//  * loadSource(uri)
//  * supportsWorkGroupSize()
//  * enumString()
//  * argc()
//  * fuzz()
//
(function() {

  (function getURLParameters() {
    READY = (getURLParameter('run') === 'true');
    STRICT = (getURLParameter('strict') === 'true');
    INFO = (getURLParameter('info') === 'true') ? console.info.bind(console) : new Function();
    ERROR = (getURLParameter('debug') === 'false') ? new Function() : console.error.bind(console);
    DEBUG = (getURLParameter('debug') === 'false') ? new Function() : console.debug.bind(console);
    TRACE = (getURLParameter('trace') === 'true') ? console.log.bind(console) : new Function();
    SELECTED_DEVICE_INDEX = isNaN(+getURLParameter('device')) ? null : +getURLParameter('device');
  })();

  // ### setup() ###
  //
  // Calls the given 'setupFunction' and sets 'suite.preconditions' to either true or false,
  // depending on whether the setup function returns successfully or throws an exception.
  // Individual tests may then check the flag and set their status to "pending", for example.
  // 
  // Example:
  //    beforeEach(setup.bind(this, function() { 
  //      ctx = createContext();
  //      queue = ctx.createCommandQueue();
  //    }));
  //
  setup = function(setupFunction) {
    suite = this;
    if (suite.parentSuite.preconditions === false) {
      suite.preconditions = false;
    } else try {
      setupFunction.call(suite);
      suite.preconditions = true;
    } catch (e) {
      ERROR(suite.parentSuite.description + " -> " + suite.description + ": Test preconditions failed: " + e);
      suite.preconditions = false;
    }
  };

  // ### setupWithSource() ###
  // 
  // Loads a kernel source file asynchronously from the given URI and passes it to the first
  // callback function (whenLoaded).  The other callback function (whenDone) is provided by
  // beforeEach(), and is called at the end to tell Jasmine that the actual test case can be
  // invoked.  The 'suite.preconditions' flag is also set, as documented in setup().
  //
  // Example:
  //    beforeEach(setupWithSource.bind(this, 'kernels/argtypes.cl', function(src) { 
  //      program = ctx.createProgram(src);
  //      program.build();
  //    }));
  //
  setupWithSource = function(uri, whenLoaded, whenDone) {
    var self = this;
    if (self.src === undefined) {
      try {
        loadSource(uri, function(source) { 
          self.src = source;
          finalize();
        });
      } catch (e) {
        ERROR("Failed to load " + uri + ": " + e);
        finalize();
      }
    } else {
      finalize();
    }
    
    function finalize() {
      setup.call(self, whenLoaded.bind(self, self.src));
      whenDone();
    }
  };

  // ### setupWithWait() ###
  //
  // Calls 'whenReady' as soon as 'testIfReady' returns true.  The 'suite.preconditions' flag is
  // also set, as documented in setup().
  // 
  // Example:
  //    beforeEach(setupWithWait.bind(this, function() { return resourcesLoaded; }, function() { 
  //      doStuffWithResources();
  //    }));
  //
  setupWithWait = function(testIfReady, whenReady, whenDone) {
    var self = this;
    var intervalID = intervalFunc() || window.setInterval(intervalFunc, 5);

    function intervalFunc() {
      if (testIfReady() === true) {
        window.clearInterval(intervalID);
        setup.call(self, whenReady);
        whenDone();
        return true;
      }
    };
  };

  // ### getSelectedDevice() ###
  //
  // Returns the currently selected WebCLDevice.
  // 
  getSelectedDevice = function() {
    index = SELECTED_DEVICE_INDEX || 0;
    var devices = [];
    webcl.getPlatforms().forEach(function(plat) {
      Array.prototype.push.apply(devices, plat.getDevices());
    });

    if (devices[index] === undefined)
      throw "WebCL Test Suite: Requested the device at index "+index+", but there are only "+devices.length+" device(s) in this system."

    return devices[index];
  };

  // ### createContext() ###
  //
  // Creates a new WebCLContext for the currently selected Device.
  //
  createContext = function() {
    try {
      var selected = getSelectedDevice();
      var ctx = webcl.createContext(selected);
      var device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
      var vendorId = device.getInfo(WebCL.DEVICE_VENDOR_ID);
      DEBUG("Creating a Context for Device " + deviceVendors[vendorId] + " (VENDOR_ID="+vendorId+")");
      ctx.vendor = deviceVendors[vendorId];
      return ctx;
    } catch (e) {
      throw e;
    }
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
    var validURI = (typeof(uri) === 'string') && (uri.lastIndexOf('.cl') === uri.length-3);
    if (validURI) {
      return xhrLoad(uri, callback);
    } else {
      throw "loadSource: invalid URI.";
    }
  };

  // ### supportsWorkGroupSize() ###
  //
  // Examples:
  //   if (!supportsWorkGroupSize(1024) pending();
  //   if (!supportsWorkGroupSize(1024, [64, 64, 64])) pending();
  // 
  supportsWorkGroupSize = function(minimumGroupSize, minimumGroupDims) {
    if (device.getInfo(WebCL.DEVICE_MAX_WORK_GROUP_SIZE) < minimumGroupSize) {
      return false;
    }

    var ok = true;
    if (minimumGroupDims) {
      device.getInfo(WebCL.DEVICE_MAX_WORK_ITEM_SIZES).forEach(function(val, i) { 
        ok = ok && (val >= minimumGroupDims[i]);
      });
    }

    return ok;
  };
  
  // ### enumString() ###
  //
  // Returns the human-readable string representation of the given
  // WebCL enumerated value. For example, `enumString(-10)` will
  // return the string `"IMAGE_FORMAT_NOT_SUPPORTED"`.
  //
  enumString = function(enumValue) {
    for (var e in WebCL) {
      if (WebCL[e] === enumValue) {
        return e;
      }
    }
  };

  // ### argc() ###
  // 
  // Calls the given function with an invalid number of arguments and checks that the given
  // exception is thrown.
  //
  // Examples:
  //    argc('ctx.getSupportedImageFormats', ['undefined'], 'WEBCL_SYNTAX_ERROR');
  //    argc('kernel.setArg', ['0', 'buffer'], 'WEBCL_SYNTAX_ERROR');
  //
  argc = function(funcName, validArgs, exceptionName) {
    
    expect(arguments.length).toEqual(3);
    
    var maxArgs = validArgs.length;
    var minArgs = validArgs.indexOf('undefined');
    minArgs = (minArgs === -1) ? maxArgs : minArgs;
    
    for (var i=0; i < minArgs; i++) {
      var args = validArgs.slice(0, i);
      var argStr = args.join(", ");
      var callStr = funcName + "(" + argStr + ")";
      expect(callStr).toThrow(exceptionName);
    }
    var argStr = validArgs.concat('null').join(", ");
    var callStr = funcName + "(" + argStr + ")";
    expect(callStr).toThrow(exceptionName);

  };

  // ### fuzz() ###
  // 
  // Calls the given function with deliberately invalid arguments and checks that the given
  // exception is thrown.
  //
  // Example:
  //    fuzz('ctx.getInfo', [ 'Enum' ], [ 'WebCL.CONTEXT_NUM_DEVICES' ], null, [0], 'INVALID_VALUE');
  //
  fuzz = function(funcName, signature, validArgs, customInvalidArgs, argsToTest, exceptionName) {

    // For each input type, define a list of values that are to be considered invalid.  For example,
    // 1.01 must not be accepted as an integer.
    //
    var fuzzMap = {
      Boolean :             [ 'undefined', 'null', '-1', '0', '1',              '[]', '[1]', '{}', '""', '"foo"'                               ],
      Int :                 [ 'undefined', 'null',                      '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
      Uint :                [ 'undefined', 'null', '-1',                '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
      OptionalUint:         [                      '-1',                '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
      UintNonZero :         [ 'undefined', 'null', '-1', '0',           '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
      Enum :                [ 'undefined', 'null', '-1', '0', '0x2001', '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
      OptionalEnum :        [              'null', '-1', '0', '0x2001', '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
      String :              [ 'undefined', 'null', '-1', '0',                   '[]', '[1]', '{}',                'true',                      ],
      NonEmptyString :      [ 'undefined', 'null', '-1', '0',                   '[]', '[1]', '{}', '""',          'true',                      ],
      OptionalString :      [                      '-1', '0', '1',              '[]', '[1]', '{}',                'true',                      ],
      Array :               [ 'undefined', 'null', '-1', '0', '1',                           '{}', '""', '"foo"', 'true', 'new Uint32Array(8)' ],
      OptionalArray :       [                      '-1', '0', '1',                           '{}', '""', '"foo"', 'true', 'new Uint32Array(8)' ],
      NonEmptyArray :       [ 'undefined', 'null', '-1', '0', '1',              '[]',        '{}', '""', '"foo"', 'true', 'new Uint32Array(8)' ],
      UintArray3 :          [ 'undefined', 'null', '-1', '0', '1', '[0,0]',     '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(3)' ],
      TypedArray :          [ 'undefined', 'null', '-1', '0', '1',              '[]', '[1]', '{}', '""', '"foo"', 'true', 'new ArrayBuffer(8)' ],
      OptionalTypedArray :  [                      '-1', '0', '1',              '[]', '[1]', '{}', '""', '"foo"', 'true', 'new ArrayBuffer(8)' ],
      WebCLObject :         [ 'undefined', 'null', '-1', '0', '1',              '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(8)', 'webcl'],
      OptionalWebCLObject : [                      '-1', '0', '1',              '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(8)', 'webcl'],
    };
    
    expect(arguments.length).toEqual(6);
    expect(signature.length).toBeGreaterThan(0);
    expect(signature.length).toEqual(validArgs.length);

    for (var i=0; i < signature.length; i++) {
      var invalidArgs = undefined;
      if (Array.isArray(signature[i])) {
        var arrayElementTypes = signature[i];
        invalidArgs = [ '[0]', '[0, 0]', '[0, 0, 0, 0]' ];
        var invalidArgsForElement0 = fuzzMap[arrayElementTypes[0]];
        var invalidArgsForElement1 = fuzzMap[arrayElementTypes[1]];
        var invalidArgsForElement2 = fuzzMap[arrayElementTypes[2]];
        var invalidArrayArgs = "'["+invalidArgsForElement0+", "+invalidArgsForElement1+", "+invalidArgsForElement2+"]'";
        DEBUG("fuzz args for UintArray3: ", invalidArrayArgs);
      } else {
        invalidArgs = fuzzMap[signature[i]];
        expect(invalidArgs).not.toBeUndefined();
      }
      if (argsToTest.indexOf(i) !== -1) {
        if (customInvalidArgs && customInvalidArgs[i]) {
          invalidArgs = invalidArgs.concat(customInvalidArgs[i]);
        }
        for (var j=0; j < invalidArgs.length; j++) {
          var args = validArgs.slice();
          args[i] = invalidArgs[j];
          argStr = args.join(", ");
          expect(funcName + "(" + argStr + ")").toThrow(exceptionName);
        }
      }
    }
  };

  // ### addCustomMatchers ###
  // 
  addCustomMatchers = function() {
    jasmine.addMatchers(jasmineCustomMatchers);
  };

  var jasmineCustomMatchers = {

    // expect('kernels/illegalKernel.cl').not.toBuild('-w');
    // expect('kernels/illegalKernel.cl').not.toBuild();
    // expect(myProgram).not.toBuild();
    //
    toBuild: function(util, customEqualityTesters) {
      return {
        compare: function(actual, buildOptions) {
          try {
            program = actual;
            if (typeof(actual) === 'string') {
              var src = loadSource(actual);
              program = ctx.createProgram(src);
            }
            var devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
            program.build(devices, buildOptions);
            DEBUG("Building '" + actual + "' did not throw any exceptions");
            return { pass: true };
          } catch(e) {
            DEBUG("Building '" + actual + "' threw " + e.name + ":\n" + e.message);
            return { pass: false };
          }
        },
        negativeCompare: function(actual, buildOptions) {
          try {
            program = actual;
            if (typeof(actual) === 'string') {
              var src = loadSource(actual);
              program = ctx.createProgram(src);
            }
            var devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
            program.build(devices, buildOptions);
            DEBUG("Building '" + actual + "' did not throw any exceptions");
            return { pass: false };
          } catch(e) {
            if (program instanceof WebCLProgram) {
              DEBUG("Building '" + actual + "' threw " + e.name + ":\n" + e.message);
              return { pass: true };
            }
            return { 
              pass: false,
              message: "Test case setup failed.",
            }
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
            var wrapper = typeof(actual) === 'function' ? actual : new Function(actual);
            wrapper.apply(this, arguments);
            return { 
              pass: false,
              message: "Expected '" + actual + "' to throw " + (expected || "any exception") + ", but it threw nothing.",
            };
          } catch(e) {
            DEBUG(e);
            var result = {};
            result.pass = (expected === undefined) || (e.name === expected && e.message && e.message.length > 0 && e.message !== e.name);
            if (expected === undefined) {
              result.message = "Expected '" + actual + "' not to throw any exception, but it threw " + e.name + ": " + e.message;
            } else if (e.name !== expected) {
              result.message = "Expected '" + actual + "' to throw " + expected + ", but it threw " + e.name + ": " + e.message;
            } else if (!e.message || e.message === e.name) {
              result.message = "Expected '" + actual + "' to throw " + expected + 
                " with a meaningful error message, but the message was just '" + e.message + "'.";
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
          var result = {};
          result.pass = (actualResult === expectedResult);
          if (result.pass === false) {
            result.message = "Expected '" + actual + "' to equal '" + expected + "' (" + expectedResult + "), but it was " + actualResult + ".";
          }
          return result;
        },
      };
    },

    // expect('program.getInfo(WebCL.PROGRAM_SOURCE)').toEvalTo('kernel void dummy() {}');
    //
    toEvalTo: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var actualResult = eval(actual);
          var expectedResult = expected;
          var result = {};
          result.pass = (actualResult === expectedResult);
          if (result.pass === false) {
            result.message = "Expected '" + actual + "' to evaluate to '" + expected + "', but it was '" + actualResult + "'.";
          }
          return result;
        },
      };
    },

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

  // [PRIVATE]
  //
  jasmine.getEnv().specFilter = function(spec) {
    var queryString = getURLParameter('spec');
    var specName = queryString && queryString.replace(/\+/g, " ");
    return (!specName) || spec.getFullName().indexOf(queryString) === 0;
  };

  // [PRIVATE]
  //
  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
  };

  // [PRIVATE]
  //
  var deviceVendors = {
    999 : "Qualcomm - Android",
    4098 : "AMD - Windows",
    4318 : "NVIDIA - Windows",
    32902 : "Intel - Windows",
    16918016 : "NVIDIA Discrete GPU - Apple",
    33695232 : "NVIDIA Integrated GPU - Apple",
    0xffffffff : "Intel CPU - Apple",
  };

})();
