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
// Test suite setup & utility functions + global variables:
//
//  * GLOBALS = { DEVICES, DEVICE_INDEX, targetVersion }
//
//  * INFO(msg)
//  * ERROR(msg)
//  * WARN(msg)
//  * DEBUG(msg)
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

jasmine.webclTestHarness = function() {

  var thiz = this;

  GLOBALS = {};

  GLOBALS.targetVersion = "2014-09-02";

  GLOBALS.DEVICES = getDeviceList();

  GLOBALS.DEVICE_INDEX = getDeviceIndexFromURL(GLOBALS.DEVICES.length);

  GLOBALS.WEBCL_TEST_HARNESS = this;

  var API = [
    'createContext',
    'getSelectedDevice',
    'getDeviceName',
    'loadSource',
    'supportsWorkGroupSize',
    'enumString',
    'setup',
    'setupWithSource',
    'setupWithWait',
    'addCustomMatchers',
    'argc',
    'fuzz',
    'argc2',
    'fuzz2',
  ];

  this.initialize = function() {

    promptForInstall();
    promptForUpdate();
    setupLogFunctions();
    customizeJasmineSpecFilter();
    customizeJasmineIt();
    customizeJasmineBeforeEach();
    customizeJasmineMatchers();
    addFuzzTestHelpers();
    
    API.forEach(function(name) {
      window[name] = thiz[name];
    });
  };

  // ### createContext() ###
  //
  // Creates a Context for the currently selected Device.
  //
  this.createContext = function() {
    var selected = thiz.getSelectedDevice();
    var ctx = webcl.createContext(selected);
    var device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
    var deviceName = thiz.getDeviceName(device);
    INFO("Creating a Context for Device " + deviceName);
    return ctx;
  };

  // ### getSelectedDevice() ###
  //
  // Returns the currently selected Device.
  //
  this.getSelectedDevice = function() {
    index = GLOBALS.DEVICE_INDEX;
    return GLOBALS.DEVICES[index];
  };

  // ### getDeviceName() ###
  //
  // Returns a human-readable name for the given WebCLDevice.
  //
  this.getDeviceName = function(device) {

    var deviceVendors = {
      604 : "ARM",
      999 : "Qualcomm",
      4098 : "AMD",
      4318 : "NVIDIA",
      32902 : "Intel",
      16918016 : "NVIDIA Discrete",
      33695232 : "NVIDIA Integrated",
      0xffffffff : "Intel",
    };

    var deviceTypes = {
      2 : "CPU",
      4 : "GPU",
      8 : "ACCELERATOR",
    };

    var vendorId = device.getInfo(WebCL.DEVICE_VENDOR_ID);
    var vendorString = deviceVendors[vendorId];
    var deviceType = device.getInfo(WebCL.DEVICE_TYPE);
    var deviceTypeString = deviceTypes[deviceType];
    var deviceNameString = device.getInfo(WebCL.DEVICE_NAME);
    var deviceName = vendorString + " " + deviceTypeString + " (" + deviceNameString + ")";
    return vendorString? deviceName : "<unidentified: " + deviceName + ">";
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
  this.loadSource = function(uri, callback) {
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
  this.supportsWorkGroupSize = function(minimumGroupSize, minimumGroupDims) {
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
  this.enumString = function(enumValue) {
    for (var e in WebCL) {
      if (WebCL[e] === enumValue) {
        return e;
      }
    }
  };

  // [PRIVATE]
  //
  function promptForInstall() {
    var isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0);
    var hasWebCL = (window.webcl && webcl.version);
    if (isFirefox && !hasWebCL) {
      var message = "This page requires Nokia WebCL for Firefox. Install?"
      if (confirm(message)) window.location = 'webcl-1.0.xpi';
    }
  };

  // [PRIVATE]
  //
  function promptForUpdate() {
    if (window.webcl && webcl.version) {
      var currentVersion = webcl.version.slice(0,10);
      var targetVersion = GLOBALS.targetVersion;
      if (currentVersion < targetVersion) {
        var message = "Update Nokia WebCL?\n\nLatest version:\t\t"+targetVersion+"\nCurrently installed:\t"+currentVersion;
        if (confirm(message)) window.location = 'webcl-1.0.xpi';
      }
    }
  };

  // [PRIVATE]
  //
  function getDeviceList() {
    var devices = [];
    if (window.webcl) {
      webcl.getPlatforms().forEach(function(plat) {
        Array.prototype.push.apply(devices, plat.getDevices());
      });
    }
    return devices;
  };

  // [PRIVATE]
  //
  function getDeviceIndexFromURL(numDevices) {
    var index = isNaN(+getURLParameter('device')) ? 0 : +getURLParameter('device');
    index = Math.min(index, Math.max(0, numDevices-1));
    return index;
  };

  // [PRIVATE]
  //
  function setupLogFunctions() {
    INFO = (getURLParameter('info') === 'false') ? new Function() : console.info.bind(console);
    ERROR = (getURLParameter('debug') === 'false') ? new Function() : console.error.bind(console);
    WARN = (getURLParameter('warn') === 'false') ? new Function() : console.warn.bind(console);
    DEBUG = (getURLParameter('debug') === 'false') ? new Function() : console.debug.bind(console);
  };

  // [PRIVATE]
  //
  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
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
  function customizeJasmineSpecFilter() {

    jasmine.getEnv().specFilter = function(spec) {
      var queryString = getURLParameter('spec');
      var specName = queryString && queryString.replace(/\+/g, " ");
      return (!specName) || spec.getFullName().indexOf(queryString) === 0;
    };

  };

  // [PRIVATE]
  //
  function customizeJasmineIt() {

    // ### oit() ###
    //
    // oit("the jasmine original 'it' is now called 'oit'", testFunc);
    //
    oit = jasmine.getEnv().it;

    // ### it() ###
    //
    // it("this is marked pending if 'suite.preconditions' is false", testFunc);
    //
    it = function(testDescription, testFunc) {
      return oit(testDescription, function() { 
        if (!suite || suite.preconditions) {
          var start = Date.now();
          testFunc();
          var elapsed = Date.now() - start;
          if (elapsed > 20) {
            INFO("PERF: " + elapsed + " ms: " + testDescription);
          }
        } else {
          pending();
        }
      });
    };

    // ### wait() ###
    //
    // wait("equivalent to 'it', but used for asynchronous tests", asyncTestFunc);
    //
    // Rules concerning the asyncTestFunc:
    //  1. The test function MUST set 'suite.done = true' when ready.
    //  2. If the flag is not set within 1000 ms, the test is marked as a failure.
    //  3. The test function MUST NOT throw exceptions from any callback.
    //
    // Example:
    // 
    //   wait("must not crash or throw on build(<callback>)", function(done) {
    //     var src = loadSource('kernels/rng.cl');
    //     program = ctx.createProgram(src);
    //     program.build(null, null, function() {
    //       try {                   // <== !IMPORTANT! Wrap everything in a try-catch.
    //         suite.done = true;    // <== !IMPORTANT! Set this flag to signal completion.
    //         expect(...);          // <== !IMPORTANT! Use expectations as usual.
    //       } catch(e) {}
    //     });
    //   });
    //
    wait = function(testDescription, asyncTestFunc) {
      return oit(testDescription, function(done) { 
        if (!suite || suite.preconditions) {
          suite.startTime = Date.now();
          suite.done = false;
          asyncTestFunc(done);
          waitFor(done);
        } else {
          pending();
          done();
        }
      });
    };

    jasmine.getEnv().wait = wait;
    jasmine.getEnv().oit = oit;
    jasmine.getEnv().it = it;

    // [PRIVATE]
    //
    function waitFor(done) {
      var count = 0;
      var intervalId = window.setInterval(function() {
        if (suite.done) {
          done();
          window.clearInterval(intervalId);
        } else if (++count > 100) {
          window.clearInterval(intervalId);
        }
      }, 10);
    };

  };

  // [PRIVATE]
  // 
  function customizeJasmineBeforeEach() {

    jasmine.getEnv().customBeforeEach = function(suite, precondFunc) {
      precondFunc = precondFunc || null;
      beforeEach.call(suite, setup.bind(suite, precondFunc));
    }

    window.customBeforeEach = jasmine.getEnv().customBeforeEach;

    // ### setup() ###
    //
    // Defines 'window.suite' and sets 'suite.preconditions' to either true or false, depending on
    // whether the given 'setupFunction' returns successfully or throws an exception.  This function
    // must be called from the beforeEach context, as in the example below.  Note that setupFunction
    // is mandatory, but may be null (in which case suite.preconditions is set to true).
    // 
    // Examples:
    //    beforeEach(setup.bind(this, null));
    //
    //    beforeEach(setup.bind(this, function() { 
    //      ctx = createContext();
    //      queue = ctx.createCommandQueue();
    //    }));
    //
    thiz.setup = function(setupFunction) {
      window.suite = this;
      suite.preconditions = false;
      if (suite.parentSuite.preconditions !== false) {
        try {
          var start = Date.now();
          if (setupFunction) setupFunction.call(suite);
          var elapsed = Date.now() - start;
          if (elapsed > 10) {
            INFO("PERF: " + elapsed + " ms: beforeEach " + suite.description);
          }
          suite.preconditions = true;
        } catch (e) {
          ERROR(suite.parentSuite.description + " -> " + suite.description + ": Test preconditions failed: " + e);
        }
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
    thiz.setupWithSource = function(uri, whenLoaded, whenDone) {
      var self = this;
      if (self.src === undefined) {
        try {
          loadSource(uri, function(source) { 
            self.src = source;
            finalize(true);
          });
        } catch (e) {
          finalize(false);
        }
      } else {
        finalize(true);
      }

      function finalize(status) {
        if (status === true) {
          setup.call(self, whenLoaded.bind(self, self.src));
          whenDone();
        } else {
          setup.call(self, function() { throw "Failed to load URI: " + uri; });
          whenDone();
        }
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
    thiz.setupWithWait = function(testIfReady, whenReady, whenDone) {
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
    
  };

  // [PRIVATE]
  // 
  function customizeJasmineMatchers() {  

    // ### addCustomMatchers ###
    // 
    thiz.addCustomMatchers = function() {
      jasmine.addMatchers(jasmineCustomMatchers);
    };

    var jasmineCustomMatchers = {

      // ### expect('kernelURL').toBuild('--build-options') ###
      //
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

      // ### expect('expression').toThrow('ExceptionName') ###
      //
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
              DEBUG(e.name + ": " + e.message);
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

      // ### expect(expression).toPass(testFunction) ###
      //
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

      // ### expect('expression').toEvalAs('expected') ###
      //
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

      // ### expect('expression').toEvalTo(expected) ###
      //
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
  };


  function addFuzzTestHelpers() {

    // ### argc() ###
    // 
    // Calls the given function with an invalid number of arguments and checks that the given
    // exception is thrown.  The exception name may be omitted, in which case WEBCL_SYNTAX_ERROR is
    // assumed.  Optional arguments at the end of the argument list are denoted with the string
    // 'undefined', as in the example below.
    //
    // Examples:
    //    argc('ctx.getSupportedImageFormats', ['undefined'], 'WEBCL_SYNTAX_ERROR');
    //    argc('kernel.setArg', ['0', 'buffer']);
    //
    thiz.argc = function(funcNameStr, validArgs, exceptionName) {
      
      expect(arguments.length).not.toBeLessThan(2);
      expect(arguments.length).not.toBeGreaterThan(3);

      exceptionName = exceptionName || 'WEBCL_SYNTAX_ERROR';
      
      var maxArgs = validArgs.length;
      var minArgs = validArgs.indexOf('undefined');
      minArgs = (minArgs === -1) ? maxArgs : minArgs;
      
      for (var i=0; i < minArgs; i++) {
        var args = validArgs.slice(0, i);
        var argStr = args.join(", ");
        var callStr = funcNameStr + "(" + argStr + ")";
        expect(callStr).toThrow(exceptionName);
      }
      var argStr = validArgs.concat('null').join(", ");
      var callStr = funcNameStr + "(" + argStr + ")";
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
    thiz.fuzz = function(callStr, signature, validArgs, customInvalidArgs, argsToTest, exceptionName) {

      // For each input type, define a list of values that are to be considered invalid.  For example,
      // 1.01 must not be accepted as an integer.
      //
      var fuzzMap = {
        Boolean :             [ 'undefined', 'null', '-1', '0', '1',              '[]', '[1]', '{}', '""', '"foo"'                               ],
        Int :                 [ 'undefined', 'null',                      '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
        Uint :                [ 'undefined', 'null', '-1',                '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
        OptionalUint:         [                      '-1',                '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
        UintNonZero :         [ 'undefined', 'null', '-1',                '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
        Enum :                [ 'undefined', 'null', '-1',                '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
        OptionalEnum :        [              'null', '-1',                '1.01', '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(1)' ],
        String :              [ 'undefined', 'null', '-1', '0',                   '[]', '[1]', '{}',                'true',                      ],
        OptionalString :      [                      '-1', '0', '1',              '[]', '[1]', '{}',                'true',                      ],
        Array :               [ 'undefined', 'null', '-1', '0', '1',                           '{}', '""', '"foo"', 'true', 'new Uint32Array(8)' ],
        OptionalArray :       [                      '-1', '0', '1',                           '{}', '""', '"foo"', 'true', 'new Uint32Array(8)' ],
        NonEmptyArray :       [ 'undefined', 'null', '-1', '0', '1',              '[]',        '{}', '""', '"foo"', 'true', 'new Uint32Array(8)' ],
        UintArray3 :          [ 'undefined', 'null', '-1', '0', '1', '[0,0]',     '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(3)' ],
        TypedArray :          [ 'undefined', 'null', '-1', '0', '1',              '[]', '[1]', '{}', '""', '"foo"', 'true', 'new ArrayBuffer(8)' ],
        OptionalTypedArray :  [                      '-1', '0', '1',              '[]', '[1]', '{}', '""', '"foo"', 'true', 'new ArrayBuffer(8)' ],
        WebCLObject :         [ 'undefined', 'null', '-1', '0', '1',              '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(8)', 'webcl'],
        OptionalWebCLObject : [                      '-1', '0', '1',              '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(8)', 'webcl'],
        OptionalFunction    : [                      '-1', '0', '1',              '[]', '[1]', '{}', '""', '"foo"', 'true', 'new Uint32Array(8)', 'webcl'],
      };
      
      expect(arguments.length).toEqual(6);
      expect(typeof callStr).toEqual('string');
      expect(signature.length).toBeGreaterThan(0);
      expect(signature.length).toEqual(validArgs.length);

      for (var i=0; i < signature.length; i++) {
        var invalidArgs = undefined;
        invalidArgs = fuzzMap[signature[i]];
        expect(invalidArgs).not.toBeUndefined();

        if (argsToTest.indexOf(i) !== -1) {
          if (customInvalidArgs && customInvalidArgs[i]) {
            invalidArgs = invalidArgs.concat(customInvalidArgs[i]);
          }
          for (var j=0; j < invalidArgs.length; j++) {
            var args = validArgs.slice();
            args[i] = invalidArgs[j];
            argStr = args.join(", ");
            expect(callStr + "(" + argStr + ")").toThrow(exceptionName);
          }
        }
      }
    };

    thiz.argc2 = function(callStr, api, expectedExceptionName) {

      expect(arguments.length).not.toBeLessThan(2);
      expect(arguments.length).not.toBeGreaterThan(3);
      expect(typeof api).toEqual('object');
      expect(typeof callStr).toEqual('string');
      expect(typeof api[callStr]).toEqual('object');
      expect(Array.isArray(api[callStr]['signature'])).toEqual(true);
      expect(Array.isArray(api[callStr]['validArgs'])).toEqual(true);

      argc(callStr, api[callStr].validArgs, expectedExceptionName);
    };

    thiz.fuzz2 = function(callStr, api, argsToTest, expectedExceptionName) {
      
      expect(arguments.length).toEqual(4);
      expect(typeof api).toEqual('object');
      expect(typeof callStr).toEqual('string');
      expect(typeof api[callStr]).toEqual('object');
      expect(Array.isArray(api[callStr]['signature'])).toEqual(true);
      expect(Array.isArray(api[callStr]['validArgs'])).toEqual(true);

      fuzz(callStr, api[callStr].signature, api[callStr].validArgs, api[callStr].invalidArgs || null, argsToTest, expectedExceptionName);
    };

  };

};

(function setupHarness() {
  var webclHarness = new jasmine.webclTestHarness();
  webclHarness.initialize();
})();
