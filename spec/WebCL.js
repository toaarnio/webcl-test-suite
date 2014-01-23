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

describe("WebCL", function() {
  
  var LOG_INFO = getURLParameter('info') || false;
  var LOG_ERROR = getURLParameter('debug') || true;
  var LOG_DEBUG = getURLParameter('debug') || true;
  var LOG_TRACE = getURLParameter('trace') || true;

  var INFO = LOG_INFO ? console.info : new Function();
  var ERROR = LOG_ERROR ? console.error : new Function();
  var DEBUG = LOG_DEBUG ? console.log : new Function();
  var TRACE = LOG_TRACE ? console.log : new Function();

  var SELECTED_DEVICE = getURLParameter('device');
  var EXCLUDE_CRASHING = getURLParameter('nocrashing') === 'true' ? true : false;
  var INCLUDE_NEGATIVE_TESTS = true;

  var deviceVendors = {
    4098 : "AMD",
    4318 : "NVIDIA",
    32902 : "Intel",
  };

  function testSuiteAsString(suite) {
    if (suite.parentSuite === null) {
      return suite.description;
    } else {
      return testSuiteAsString(suite.parentSuite) + " -> " + suite.description;
    }
  }

  beforeEach(function() {
    this.addMatchers({
      toEvalAs: function(result) {
        return eval(this.actual) === eval(result);
      },
      toFail: function() {
        var wrapper = new Function(this.actual);
        try { wrapper() } catch(e) { return true; }
        return false;
      } ,
      toReturn: function(result) {
        var wrapper = new Function(this.actual);
        return wrapper() === result;
      },
    }); 
  });

  beforeEach(function() {
    TRACE(testSuiteAsString(this.suite) + " -> " + this.description);
  });

  afterEach(function() {
    if (this.results().passed() === false) {
      TRACE("     FAIL");
    }
    try {
      webcl.releaseAll();
    } catch (e) {
      ERROR("     webcl.releaseAll FAIL: " + e);
    }
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> Signature
  // 
  describe("Signature", function() {

    it("must have the singleton 'webcl' object", function() {
      expect(webcl).toBeDefined();
    });

    it("must have all the expected classes", function() {
      for (var className in expectedClasses) {
        expect(window).toHaveFunction(className);
      }
    });

    it("must have all the expected member functions", function() {
      checkSignature('webcl', true);
      for (var className in expectedClasses) {
        checkSignature(className, true);
      }
    });

    it("must have error code enums ranging from 0 to -64", function() {
      for (var enumName in errorEnums) {
        var actualValue = WebCL[enumName];
        var expectedValue = errorEnums[enumName];
        expect(actualValue).toBeDefined();
        expect(actualValue).toEqual(expectedValue);
      }
    });

    it("must have device info enums ranging from 0x1000 to 0x103D", function() {
      for (var enumName in deviceInfoEnums) {
        var actualValue = WebCL[enumName];
        var expectedValue = deviceInfoEnums[enumName];
        expect(actualValue).toBeDefined();
        expect(actualValue).toEqual(expectedValue);
      }
    });

    if (INCLUDE_NEGATIVE_TESTS) {
      it("must not have any disallowed member functions", function() {
        checkSignature('webcl', false);
        for (var className in expectedClasses) {
          checkSignature(className, false);
        }
      });

      it("must not have any disallowed device info enums", function() {
        for (var enumName in removedDeviceInfoEnums) {
          expect('webcl').not.toHaveProperty(enumName);
        }
      });

      it("must not have error code enums that have been removed", function() {
        for (var enumName in removedErrorEnums) {
          expect(WebCL[enumName]).not.toBeDefined();
        }
      });
    }

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> JavaScript semantics
  // 
  describe("JavaScript semantics", function() {

    it("objects must accommodate user-defined fields", function() {
      platform = webcl.getPlatforms()[0];
      expect('platform.name = "foo"').not.toFail();
      expect('platform.name === "foo"').toEvalAs(true);
    });
    
    it("getters must return the same object every time (CRITICAL)", function() {
      platform = webcl.getPlatforms()[0];
      expect('webcl.getPlatforms()[0] === webcl.getPlatforms()[0]').toEvalAs(true);
      expect('platform === platform.getDevices()[0].getInfo(WebCL.DEVICE_PLATFORM)').toEvalAs(true);
    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> WebCLPlatform
  // 
  describe("WebCLPlatform", function() {

    it("must have at least one instance", function() {
      expect(webcl.getPlatforms().length).toBeGreaterThan(0);
    });

    it("must support the standard getInfo queries", function() {
      var plats = webcl.getPlatforms();
      function checkInfo() {
        for (var i=0; i < plats.length; i++) {
          var name = plats[i].getInfo(WebCL.PLATFORM_NAME)
          var vendor = plats[i].getInfo(WebCL.PLATFORM_VENDOR)
          var version = plats[i].getInfo(WebCL.PLATFORM_VERSION)
          var profile = plats[i].getInfo(WebCL.PLATFORM_PROFILE)
          var extensions = plats[i].getInfo(WebCL.PLATFORM_EXTENSIONS)
          expect(name.length).toBeGreaterThan(0);
          expect(vendor.length).toBeGreaterThan(0);
          expect(version.length).toBeGreaterThan(0);
          expect(profile.length).toBeGreaterThan(0);
          INFO("Platform["+i+"]:");
          INFO("  " + name);
          INFO("  " + vendor);
          INFO("  " + version);
          INFO("  " + profile);
        }
      };
      expect(checkInfo).not.toThrow();
    });
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> WebCLDevice
  // 
  describe("WebCLDevice", function() {

    it("must have at least one instance on each Platform", function() {
      var platforms = webcl.getPlatforms();
      for (var p=0; p < platforms.length; p++) {
        expect(platforms[p].getDevices().length).toBeGreaterThan(0);
      }
    });

    it("must not have any instances that are not actually available", function() {
      var platforms = webcl.getPlatforms();
      for (var p=0; p < platforms.length; p++) {
        var devices = platforms[p].getDevices();
        for (var d=0; d < devices.length; d++) {
          expect(devices[d].getInfo(WebCL.DEVICE_AVAILABLE)).toEqual(true);
        }
      }
    });

    it("must support the standard getInfo queries on all devices", function() {
      webcl.getPlatforms().forEach(function(plat, index) {
        plat.getDevices().forEach(function(device) {
          INFO(" ");
          INFO("Platform["+index+"]:");
          expect(checkInfo.bind(this, deviceInfoEnums, device)).not.toThrow();
          expect(checkInfo.bind(this, removedDeviceInfoEnums, device)).toThrow();
          function checkInfo(enumList, device) {
            for (var enumName in enumList) {
              var enumVal = enumList[enumName];
              var property = device.getInfo(enumVal)
              if (property === null) throw "getInfo(CL."+enumName+") returned null."
              INFO("  " + enumName + ": " + property);
            }
          };
        });
      });
    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> createContext
  // 
  describe("createContext", function() {

    it("must work if properties === undefined", function() {
      ctx1 = webcl.createContext();
      expect('ctx1 instanceof WebCLContext').toEvalAs(true);
    });

    it("must work if properties === null", function() {
      ctx1 = webcl.createContext(null);
      expect('ctx1 instanceof WebCLContext').toEvalAs(true);
    });

    it("must work if properties === {}", function() {
      ctx1 = webcl.createContext({});
      expect('ctx1 instanceof WebCLContext').toEvalAs(true);
    });

    it("must work if properties.devices === null", function() {
      ctx1 = webcl.createContext({ devices: null });
      expect('ctx1 instanceof WebCLContext').toEvalAs(true);
    });

    it("must work if properties.platform === null", function() {
      ctx1 = webcl.createContext({ platform: null });
      expect('ctx1 instanceof WebCLContext').toEvalAs(true);
    });

    it("must work if properties.deviceType === null", function() {
      ctx1 = webcl.createContext({ deviceType: null });
      expect('ctx1 instanceof WebCLContext').toEvalAs(true);
    });

    it("must work if properties.deviceType === DEFAULT", function() {
      ctx1 = webcl.createContext({ deviceType: WebCL.DEVICE_TYPE_DEFAULT });
      expect('ctx1 instanceof WebCLContext').toEvalAs(true);
    });

    it("must work if properties.deviceType === CPU || GPU", function() {
      ctx1 = webcl.createContext({ deviceType: WebCL.DEVICE_TYPE_CPU });
      ctx2 = webcl.createContext({ deviceType: WebCL.DEVICE_TYPE_GPU });
      expect(ctx1 instanceof WebCLContext || ctx2 instanceof WebCLContext).toBeTruthy();
    });

    it("must work if properties.devices === [ aDevice ]", function() {
      var defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
      ctx1 = webcl.createContext({ devices: [defaultDevice] });
      expect('ctx1 instanceof WebCLContext').toEvalAs(true);
    });

    it("must work if properties.platform === aPlatform", function() {
      var defaultPlatform = webcl.getPlatforms()[0];
      ctx1 = webcl.createContext({ platform: defaultPlatform });
      expect('ctx1 instanceof WebCLContext').toEvalAs(true);
    });

    it("must work if properties.platform === aPlatform and deviceType === CPU || GPU", function() {
      var defaultPlatform = webcl.getPlatforms()[0];
      ctx1 = webcl.createContext({ platform: defaultPlatform, deviceType: WebCL.DEVICE_TYPE_CPU });
      ctx2 = webcl.createContext({ platform: defaultPlatform, deviceType: WebCL.DEVICE_TYPE_GPU });
      expect(ctx1 instanceof WebCLContext || ctx2 instanceof WebCLContext).toBeTruthy();
    });

    it("must ignore Platform if Device is given", function() {
      var defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
      ctx1 = webcl.createContext({ devices: [defaultDevice], platform: "foobar" });
      expect('ctx1 instanceof WebCLContext').toEvalAs(true);
    });

    it("must ignore deviceType if Device is given", function() {
      var defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
      ctx1 = webcl.createContext({ devices: [defaultDevice], deviceType: "foobar" });
      expect('ctx1 instanceof WebCLContext').toEvalAs(true);
    });

    it("must return null if there is no device of the given deviceType", function() {
      var defaultPlatform = webcl.getPlatforms()[0];
      ctx1 = webcl.createContext({ deviceType: WebCL.DEVICE_TYPE_ACCELERATOR });
      expect(ctx1).toEqual(null);
    });

    if (INCLUDE_NEGATIVE_TESTS) {
      it("must throw if properties === 'foobar'", function() {
        expect('webcl.createContext("foobar");').toFail();
      });

      it("must throw if properties.devices === 'foobar'", function() {
        expect('webcl.createContext({ devices: "foobar" });').toFail();
      });

      it("must throw if properties.platform === 'foobar'", function() {
        expect('webcl.createContext({ platform: "foobar" });').toFail();
      });

      it("must throw if properties.deviceType === 'foobar'", function() {
        expect('webcl.createContext({ deviceType: "foobar" });').toFail();
      });

      it("must throw if properties.devices === []", function() {
        expect('webcl.createContext({ devices: [] });').toFail();
      });

      it("must throw if properties.devices === [undefined]", function() {
        expect('webcl.createContext({ devices: [undefined] });').toFail();
      });

      it("must throw if properties.devices === [null]", function() {
        expect('webcl.createContext({ devices: [null] });').toFail();
      });

      it("must throw if properties.devices === [device, undefined]", function() {
        defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
        expect('webcl.createContext({ devices: [defaultDevice, undefined] });').toFail();
      });

      it("must throw if properties.devices === [device, null]", function() {
        defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
        expect('webcl.createContext({ devices: [defaultDevice, null] });').toFail();
      });
    }

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> createContext (proposed simplified API)
  // 
  describe("createContext (proposed simplified API)", function() {
    
    it("createContext()", function() {
      ctx = createContextSimplified();
      expect('ctx instanceof WebCLContext').toEvalAs(true);
    });

    it("createContext(DEVICE_TYPE_DEFAULT)", function() {
      ctx = createContextSimplified(WebCL.DEVICE_TYPE_DEFAULT);
      expect('ctx instanceof WebCLContext').toEvalAs(true);
    });

    it("createContext(DEVICE_TYPE_CPU || DEVICE_TYPE_GPU)", function() {
      ctx1 = createContextSimplified(WebCL.DEVICE_TYPE_CPU);
      ctx2 = createContextSimplified(WebCL.DEVICE_TYPE_GPU);
      expect(ctx1 instanceof WebCLContext || ctx2 instanceof WebCLContext).toBeTruthy();
    });

    it("createContext(aPlatform)", function() {
      var defaultPlatform = webcl.getPlatforms()[0];
      ctx = createContextSimplified(defaultPlatform);
      expect('ctx instanceof WebCLContext').toEvalAs(true);
    });

    it("createContext(aPlatform, DEVICE_TYPE_CPU || DEVICE_TYPE_GPU)", function() {
      var defaultPlatform = webcl.getPlatforms()[0];
      ctx1 = createContextSimplified(defaultPlatform, WebCL.DEVICE_TYPE_CPU);
      ctx2 = createContextSimplified(defaultPlatform, WebCL.DEVICE_TYPE_GPU);
      expect(ctx1 instanceof WebCLContext || ctx2 instanceof WebCLContext).toBeTruthy();
    });

    it("createContext(aDevice)", function() {
      var defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
      ctx = createContextSimplified(defaultDevice);
      expect('ctx instanceof WebCLContext').toEvalAs(true);
    });

    it("createContext([aDevice])", function() {
      var defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
      ctx = createContextSimplified([defaultDevice]);
      expect('ctx instanceof WebCLContext').toEvalAs(true);
    });

    it("must return null if there is no device of the given deviceType", function() {
      var defaultPlatform = webcl.getPlatforms()[0];
      ctx = createContextSimplified(WebCL.DEVICE_TYPE_ACCELERATOR);
      expect(ctx).toEqual(null);
    });

    if (INCLUDE_NEGATIVE_TESTS) {
      it("throw on createContext(0)", function() {
        expect('createContextSimplified(0);').toFail();
      });

      it("throw on createContext(null)", function() {
        expect('createContextSimplified(null);').toFail();
      });

      it("throw on createContext([])", function() {
        expect('createContextSimplified([]);').toFail();
      });

      it("throw on createContext([null])", function() {
        expect('createContextSimplified([null]);').toFail();
      });

      it("throw on createContext('foobar')", function() {
        expect('createContextSimplified("foobar");').toFail();
      });

      it("throw on createContext(['foobar'])", function() {
        expect('createContextSimplified(["foobar"]);').toFail();
      });

      it("throw on createContext([aDevice, undefined])", function() {
        defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
        expect('createContextSimplified([defaultDevice, undefined]);').toFail();
      });

      it("throw on createContext([aDevice, null])", function() {
        defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
        expect('createContextSimplified([defaultDevice, null]);').toFail();
      });

      it("throw on createContext([aDevice, 'foobar'])", function() {
        defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
        expect('createContextSimplified([defaultDevice, "foobar"]);').toFail();
      });
    }

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> WebCLContext
  // 
  describe("WebCLContext", function() {

    beforeEach(function() {
      try {
        ctx = createContext();
        device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
      } catch (e) {
        ERROR("WebCL -> WebCLContext -> beforeEach: Unable to create WebCLContext, all tests will fail!");
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // WebCL -> WebCLContext -> getInfo
    // 
    describe("getInfo", function() {

      it("must support getInfo(CONTEXT_NUM_DEVICES)", function() {
        expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES) > 0').toEvalAs(true);
      });

      it("must support getInfo(CONTEXT_DEVICES)", function() {
        expect('ctx.getInfo(WebCL.CONTEXT_DEVICES) instanceof Array').toEvalAs(true);
      });

      it("must support getInfo(CONTEXT_PROPERTIES)", function() {
        expect('ctx.getInfo(WebCL.CONTEXT_PROPERTIES) instanceof WebCLContextProperties').toEvalAs(true);
      });

      if (INCLUDE_NEGATIVE_TESTS) {
        it("must not support any disallowed getInfo queries", function() {
          for (var enumName in removedContextInfoEnums) {
            expect(ctx).not.toSupportInfoEnum(enumName);
          }
        });
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // WebCL -> WebCLContext -> createCommandQueue
    // 
    describe("createCommandQueue", function() {

      it("must work with an empty argument list", function() {
        queue = ctx.createCommandQueue();
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
      });
      
      it("must work if device === null", function() {
        queue = ctx.createCommandQueue(null);
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
      });

      it("must work if device === null, properties === 0", function() {
        queue = ctx.createCommandQueue(null, 0);
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
      });

      it("must work if device === aDevice", function() {
        queue = ctx.createCommandQueue(device);
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
      });

      it("must work if device === aDevice, properties === 0", function() {
        queue = ctx.createCommandQueue(device, 0);
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
      });
      
      it("must work if device === undefined, properties === QUEUE_PROFILING_ENABLE", function() {
        queue = ctx.createCommandQueue(undefined, WebCL.QUEUE_PROFILING_ENABLE);
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
      });
      
      it("must work if device === null, properties === QUEUE_PROFILING_ENABLE", function() {
        queue = ctx.createCommandQueue(null, WebCL.QUEUE_PROFILING_ENABLE);
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
      });
      
      it("must work if device === aDevice, properties === QUEUE_PROFILING_ENABLE", function() {
        queue = ctx.createCommandQueue(device, WebCL.QUEUE_PROFILING_ENABLE);
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
      });
      
      it("must work if device === aDevice, properties === QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE", function() {
        queue = ctx.createCommandQueue(device, WebCL.QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE);
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
      });

      it("must work if device === aDevice, properties === PROFILING | OUT_OF_ORDER", function() {
        queue = ctx.createCommandQueue(device, WebCL.QUEUE_PROFILING_ENABLE | WebCL.QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE);
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
      });

      if (INCLUDE_NEGATIVE_TESTS) {
        it("must throw if device === <invalid>", function() {
          expect('ctx.createCommandQueue("foobar")').toFail();
          expect('ctx.createCommandQueue([])').toFail();
          expect('ctx.createCommandQueue(ctx)').toFail();
        });

        it("must throw if device === null, properties === <invalid>", function() {
          expect('ctx.createCommandQueue(null, "foobar")').toFail();
          expect('ctx.createCommandQueue(null, [])').toFail();
          expect('ctx.createCommandQueue(null, 0x4)').toFail();
        });

        it("must throw if device === aDevice, properties === <invalid>", function() {
          expect('ctx.createCommandQueue(device, "foobar")').toFail();
          expect('ctx.createCommandQueue(device, [])').toFail();
          expect('ctx.createCommandQueue(device, 0x4)').toFail();
        });
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // WebCL -> WebCLContext -> createProgram
    // 
    describe("createProgram", function() {

      it("must work with dummy kernel source", function() {
        var src = "kernel void dummy() {}";
        program = ctx.createProgram(src);
        expect('program instanceof WebCLProgram').toEvalAs(true);
      });

      it("must work with real kernel source", function() {
        var src = loadSource('kernels/rng.cl');
        program = ctx.createProgram(src);
        expect('program instanceof WebCLProgram').toEvalAs(true);
      });

      if (INCLUDE_NEGATIVE_TESTS) {
        it("must not validate or build the source", function() {
          var src = "foobar";
          program = ctx.createProgram(src);
          expect('program instanceof WebCLProgram').toEvalAs(true);
        });

        it("must throw if source === ''/null/undefined/omitted", function() {
          expect('ctx.createProgram("")').toFail();
          expect('ctx.createProgram(null)').toFail();
          expect('ctx.createProgram(undefined)').toFail();
          expect('ctx.createProgram()').toFail();
        });
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // WebCL -> WebCLContext -> createBuffer
    // 
    describe("createBuffer", function() {

      it("must work if flags = MEM_READ_ONLY", function() {
        buffer = ctx.createBuffer(WebCL.MEM_READ_ONLY, 1024);
        expect('buffer instanceof WebCLBuffer').toEvalAs(true);
      });

      it("must work if flags = MEM_WRITE_ONLY", function() {
        buffer = ctx.createBuffer(WebCL.MEM_WRITE_ONLY, 1024);
        expect('buffer instanceof WebCLBuffer').toEvalAs(true);
      });

      it("must work if flags = MEM_READ_WRITE", function() {
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, 1024);
        expect('buffer instanceof WebCLBuffer').toEvalAs(true);
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // WebCL -> WebCLContext -> createImage
    // 
    describe("createImage", function() {

      it("must work with a minimal WebCLImageDescriptor and flags = MEM_READ_ONLY", function() {
        var descriptor = { width : 64, height : 64 };
        image = ctx.createImage(WebCL.MEM_READ_ONLY, descriptor);
        expect('image instanceof WebCLImage').toEvalAs(true);
      });

      it("must work with a minimal WebCLImageDescriptor and flags = MEM_WRITE_ONLY", function() {
        var descriptor = { width : 64, height : 64 };
        image = ctx.createImage(WebCL.MEM_WRITE_ONLY, descriptor);
        expect('image instanceof WebCLImage').toEvalAs(true);
      });

      it("must work with a minimal WebCLImageDescriptor and flags = MEM_READ_WRITE", function() {
        var descriptor = { width : 64, height : 64 };
        image = ctx.createImage(WebCL.MEM_READ_WRITE, descriptor);
        expect('image instanceof WebCLImage').toEvalAs(true);
      });

      it("must work with a fully specified WebCLImageDescriptor and all flags", function() {
        var descriptor = { 
          channelOrder : WebCL.RGBA,
          channelType : WebCL.UNORM_INT8,
          width : 64, 
          height : 64,
          rowPitch : 0,
        };
        imageReadOnly = ctx.createImage(WebCL.MEM_READ_ONLY, descriptor);
        imageWriteOnly = ctx.createImage(WebCL.MEM_WRITE_ONLY, descriptor);
        imageReadWrite = ctx.createImage(WebCL.MEM_READ_WRITE, descriptor);
        expect('imageReadOnly instanceof WebCLImage').toEvalAs(true);
        expect('imageWriteOnly instanceof WebCLImage').toEvalAs(true);
        expect('imageReadWrite instanceof WebCLImage').toEvalAs(true);
      });

    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> WebCLProgram
  // 
  describe("WebCLProgram", function() {
    
    src = "kernel void dummy() {}";

    beforeEach(function() {
      ctx = createContext();
      devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
      device = devices[0];
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // WebCL -> WebCLProgram -> getInfo
    // 
    describe("getInfo", function() {

      it("must support getInfo(PROGRAM_NUM_DEVICES)", function() {
        var program = ctx.createProgram(src);
        var ndevices = program.getInfo(WebCL.PROGRAM_NUM_DEVICES);
        expect(typeof ndevices).toEqual('number');
      });

      it("must support getInfo(PROGRAM_DEVICES)", function() {
        program = ctx.createProgram(src);
        expect('program.getInfo(WebCL.PROGRAM_DEVICES) instanceof Array').toEvalAs(true);
      });

      // This test is known to crash on Win7
      // --> moved to Crash tests until we have a fix or workaround
      xit("must support getInfo(PROGRAM_CONTEXT)", function() {
        program = ctx.createProgram(src);
        ctxQueriedFromProgram = program.getInfo(WebCL.PROGRAM_CONTEXT);
        expect('ctxQueriedFromProgram instanceof WebCLContext').toEvalAs(true);
      });

      it("must support getInfo(PROGRAM_SOURCE)", function() {
        program = ctx.createProgram(src);
        expect('program.getInfo(WebCL.PROGRAM_SOURCE) === src').toEvalAs(true);
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // WebCL -> WebCLProgram -> build
    // 
    describe("build", function() {

      it("must work with an empty argument list", function() {
        program = ctx.createProgram(src);
        expect('program.build()').not.toFail();
      });

      it("must work if devices === null", function() {
        program = ctx.createProgram(src);
        expect('program.build(null)').not.toFail();
      });

      it("must work if devices === [ aDevice ]", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices)').not.toFail();
      });

      it("must work if devices === [ aDevice ], options = null", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices, null)').not.toFail();
      });

      it("must work if devices === [ aDevice ], options = ''", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices, "")').not.toFail();
      });

      it("must work if devices = [ aDevice ], options === '-valid-option'", function() {
        program = ctx.createProgram(src);
        [ '-D foo',
          '-D foo=0xdeadbeef',
          '-cl-opt-disable',
          '-cl-single-precision-constant',
          '-cl-denorms-are-zero',
          '-cl-mad-enable',
          '-cl-no-signed-zeros',
          '-cl-unsafe-math-optimizations',
          '-cl-finite-math-only',
          '-cl-fast-relaxed-math',
          '-w',
          '-Werror',
        ].forEach(function(val) {
          expect('program.build(devices, "' + val + '")').not.toFail();
        });
      });

      it("must work if devices = [ aDevice ],  options === '-cl-opt-disable -Werror'", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices, "-cl-opt-disable -Werror")').not.toFail();
      });

      if (INCLUDE_NEGATIVE_TESTS) {
        it("must throw if devices === []", function() {
          program = ctx.createProgram(src);
          expect('program.build([])').toFail();
        });

        it("must throw if options === '-invalid-option'", function() {
          program = ctx.createProgram(src);
          expect('program.build(devices, "-invalid-option")').toFail();
          expect('program.build([], "-invalid-option")').toFail();
          expect('program.build(null, "-invalid-option")').toFail();
          expect('program.build(undefined, "-invalid-option")').toFail();
        });

        it("must throw if kernel source is obviously invalid", function() {
          var src = "obviously invalid";
          program = ctx.createProgram(src);
          expect('program.build()').toFail();
          expect('program.build(null)').toFail();
          expect('program.build([])').toFail();
          expect('program.build(devices)').toFail();
          expect('program.build(devices, "-w")').toFail();
        });

        // This test is known to crash on Intel OpenCL / Win7
        // --> moved to Crash tests until we have a fix or workaround
        xit("must throw if kernel source is slightly invalid", function() {
          var src = "kernel int dummy() {}";
          program = ctx.createProgram(src);
          expect('program.build()').toFail();
          expect('program.build(null)').toFail();
          expect('program.build([])').toFail();
          expect('program.build(devices)').toFail();
          expect('program.build(devices, "-w")').toFail();
        });
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // WebCL -> WebCLProgram -> getBuildInfo
    // 
    describe("getBuildInfo", function() {

      it("must support PROGRAM_BUILD_STATUS", function() {
        program = ctx.createProgram(src);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').not.toFail();
      });

      it("must support PROGRAM_BUILD_STATUS === BUILD_NONE", function() {
        program = ctx.createProgram(src);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS) === WebCL.BUILD_NONE').toEvalAs(true);
      });

      it("must support PROGRAM_BUILD_STATUS === BUILD_SUCCESS", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices)').not.toFail();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS) === WebCL.BUILD_SUCCESS').toEvalAs(true);
      });

      it("must support PROGRAM_BUILD_STATUS === BUILD_ERROR", function() {
        var src = "obviously invalid";
        program = ctx.createProgram(src);
        expect('program.build(devices)').toFail();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS) === WebCL.BUILD_ERROR').toEvalAs(true);
      });

      it("must support PROGRAM_BUILD_LOG before build()", function() {
        program = ctx.createProgram(src);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG)').not.toFail();
        expect('typeof program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG) === "string"').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).length === 0').toEvalAs(true);
      });

      it("must support PROGRAM_BUILD_LOG after build()", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices)').not.toFail();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG)').not.toFail();
        expect('typeof program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG) === "string"').toEvalAs(true);
      });

      it("must report errors in PROGRAM_BUILD_LOG", function() {
        var src = "obviously invalid";
        program = ctx.createProgram(src);
        expect('program.build(devices)').toFail();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG)').not.toFail();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).length > 0').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).indexOf("error") !== -1').toEvalAs(true);
      });
        
      it("must support PROGRAM_BUILD_OPTIONS with empty options", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices)').not.toFail();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toFail();
        expect('typeof program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS) === "string"').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS).length === 0').toEvalAs(true);
      });

      it("must support PROGRAM_BUILD_OPTIONS with non-empty options", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices, "-w -D foo=0xdeadbeef")').not.toFail();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toFail();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS) === "-w -D foo=0xdeadbeef"').toEvalAs(true);
      });

      if (INCLUDE_NEGATIVE_TESTS) {
        it("must throw if device === undefined/null/<invalid>", function() {
          program = ctx.createProgram(src);
          expect('program.getBuildInfo("foobar", WebCL.PROGRAM_BUILD_STATUS)').toFail();
          expect('program.getBuildInfo([], WebCL.PROGRAM_BUILD_STATUS)').toFail();
          expect('program.getBuildInfo(null, WebCL.PROGRAM_BUILD_STATUS)').toFail();
          expect('program.getBuildInfo(undefined, WebCL.PROGRAM_BUILD_STATUS)').toFail();
          expect('program.getBuildInfo(undefined, WebCL.PROGRAM_BUILD_STATUS)').toFail();
        });

        it("must throw if name === omitted/undefined/null/<invalid>", function() {
          program = ctx.createProgram(src);
          expect('program.getBuildInfo(device)').toFail();
          expect('program.getBuildInfo(device, undefined)').toFail();
          expect('program.getBuildInfo(device, null)').toFail();
          expect('program.getBuildInfo(device, 0)').toFail();
          expect('program.getBuildInfo(device, -1)').toFail();
          expect('program.getBuildInfo(device, 0x1180)').toFail();
          expect('program.getBuildInfo(device, 0x1184)').toFail();
          expect('program.getBuildInfo(device, WebCL.PROGRAM_NUM_DEVICES)').toFail();
          expect('program.getBuildInfo(device, "foobar")').toFail();
          expect('program.getBuildInfo(device, device)').toFail();
        });
      }

    });
    
  });


  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> WebCLKernel
  // 
  describe("WebCLKernel", function() {
    
    src = "kernel void dummy() {}";

    beforeEach(function() {
      ctx = createContext();
      devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
      device = devices[0];
      program = ctx.createProgram(src);
      program.build(devices);
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // WebCL -> WebCLKernel -> getWorkGroupInfo
    // 
    describe("getWorkGroupInfo", function() {

      it("must support KERNEL_WORK_GROUP_SIZE", function() {
        kernel = program.createKernelsInProgram()[0];
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_WORK_GROUP_SIZE)').not.toFail();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_WORK_GROUP_SIZE) >= 1').toEvalAs(true);
      });

    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> WebCLCommandQueue
  // 
  describe("WebCLCommandQueue", function() {
    
    // This test is known to crash on Win7
    // --> moved to Crash tests until we have a fix or workaround
    xit("must support getInfo(QUEUE_CONTEXT)", function() {
      var ctx = createContext();
      queue = ctx.createCommandQueue(null, 0);
      ctxQueriedFromQueue = queue.getInfo(WebCL.QUEUE_CONTEXT);
      expect('ctxQueriedFromQueue instanceof WebCLContext').toEvalAs(true);
    });

    it("must support getInfo(QUEUE_DEVICE)", function() {
      var ctx = createContext();
      queue = ctx.createCommandQueue(null, 0);
      expect('queue.getInfo(WebCL.QUEUE_DEVICE) instanceof WebCLDevice').toEvalAs(true);
    });

    it("must support getInfo(QUEUE_PROPERTIES)", function() {
      var ctx = createContext();
      queue = ctx.createCommandQueue(null, 0);
      maxValidEnum = WebCL.QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE | WebCL.QUEUE_PROFILING_ENABLE;
      expect('queue.getInfo(WebCL.QUEUE_PROPERTIES) <= maxValidEnum').toEvalAs(true);
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // WebCL -> WebCLCommandQueue -> enqueueNDRangeKernel
    // 
    describe("enqueueNDRangeKernel", function() {

      beforeEach(function() {
        ctx = createContext();
        queue = ctx.createCommandQueue(null, 0);
        src = "kernel void dummy() {}";
        program = ctx.createProgram(src);
        devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
        program.build(devices);
        kernel = program.createKernelsInProgram()[0];
      });
      
      it("must work if all arguments are fully specified", function() {
        event = new WebCLEvent();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], [], event); queue.finish();').not.toFail();
        expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1, 1], [1, 1], [], event); queue.finish();').not.toFail();
        expect('queue.enqueueNDRangeKernel(kernel, 3, [0, 0, 0], [1, 1, 1], [1, 1, 1], [], event); queue.finish();').not.toFail();
      });

      it("must work if event === null/undefined/omitted", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], [], null); queue.finish();').not.toFail();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], []); queue.finish();').not.toFail();
      });

      it("must work if eventWaitList === []/null/undefined/omitted", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], []); queue.finish();').not.toFail();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], null); queue.finish();').not.toFail();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], undefined); queue.finish();').not.toFail();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1]); queue.finish();').not.toFail();
      });

      it("must work if localWorkSize === null/undefined/omitted", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], null); queue.finish();').not.toFail();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], undefined); queue.finish();').not.toFail();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1]); queue.finish();').not.toFail();
      });

      it("must work if globalWorkOffset === null/undefined", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1], [1]); queue.finish();').not.toFail();
        expect('queue.enqueueNDRangeKernel(kernel, 1, undefined, [1], [1]); queue.finish();').not.toFail();
      });

      it("must work with all-default arguments", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1]); queue.finish();').not.toFail();
      });

      if (INCLUDE_NEGATIVE_TESTS) {
        it("must throw if kernel is not a valid WebCLKernel", function() {
          expect('queue.enqueueNDRangeKernel("foo", 1, [0], [1], [1])').toFail();
          expect('queue.enqueueNDRangeKernel(ctx, 1, [0], [1], [1])').toFail();
        });

        it("must throw if workDim is not equal to 1, 2, or 3", function() {
          expect('queue.enqueueNDRangeKernel(kernel, 0, [0], [1], [1])').toFail();
          expect('queue.enqueueNDRangeKernel(kernel, 4, [0, 0, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1])').toFail();
        });

        it("must throw if globalWorkSize.length != workDim", function() {
          expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1, 1], [1])').toFail();
          expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1], [1, 1])').toFail();
          expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1, 1, 1], [1, 1])').toFail();
          expect('queue.enqueueNDRangeKernel(kernel, 3, [0, 0, 0], [1, 1], [1, 1, 1])').toFail();
          expect('queue.enqueueNDRangeKernel(kernel, 3, [0, 0, 0], [1, 1, 1, 1], [1, 1, 1])').toFail();
        });

        it("must throw if globalWorkSize[i] > 2^32-1", function() {
          expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [0xffffffff+1], [1])').toFail();
          expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1, 0xffffffff+1], [1, 1])').toFail();
        });

      }

    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> Kernel language
  // 
  describe("Kernel language", function() {
    
    it("must not allow 'goto'", function() {
      src = loadSource('kernels/goto.cl');
      var ctx = createContext();
      program = ctx.createProgram(src);
      devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
      expect('program.build(devices)').toFail();
    });

    it("must not allow kernel-to-kernel calls", function() {
      src = loadSource('kernels/kernel-to-kernel.cl');
      var ctx = createContext();
      program = ctx.createProgram(src);
      devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
      expect('program.build(devices)').toFail();
    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // WebCL -> Crash tests
  // 
  describe("Crash tests", function() {

    it("must not crash or throw when calling release() more than once (CRITICAL)", function()  {
      ctx = createContext();
      ctx.release();
      expect('ctx.release()').not.toThrow();
    });

    it("must throw when trying to use an object that has been released", function() {
      ctx = createContext();
      ctx.release();
      expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES)').toThrow();
    });

    // This test is known to crash on Win7
    // --> moved to Crash tests until we have a fix or workaround
    it("must support getInfo(PROGRAM_CONTEXT)", function() {
      ctx = createContext();
      program = ctx.createProgram(src);
      ctxQueriedFromProgram = program.getInfo(WebCL.PROGRAM_CONTEXT);
      expect('ctxQueriedFromProgram instanceof WebCLContext').toEvalAs(true);
    });

    // This test is known to crash on Win7
    // --> moved to Crash tests until we have a fix or workaround
    it("must support getInfo(QUEUE_CONTEXT)", function() {
      ctx = createContext();
      queue = ctx.createCommandQueue(null, 0);
      ctxQueriedFromQueue = queue.getInfo(WebCL.QUEUE_CONTEXT);
      expect('ctxQueriedFromQueue instanceof WebCLContext').toEvalAs(true);
    });

    // This test is known to crash on Intel OpenCL / Win7
    // --> moved to Crash tests until we have a fix or workaround
    xit("must throw if kernel source is slightly invalid", function() {
      ctx = createContext();
      var src = "kernel int dummy() {}";
      program = ctx.createProgram(src);
      expect('program.build()').toFail();
      expect('program.build(null)').toFail();
      expect('program.build([])').toFail();
      expect('program.build(devices)').toFail();
      expect('program.build(devices, "-w")').toFail();
    });

  });

  //////////////////////////////////////////////////////////////

  beforeEach(function() {
    this.addMatchers({
      toThrow: function() {
        if (typeof(this.actual) === 'string') {
          var sourceStr = this.actual;
          this.actual = Function(this.actual);
          var asExpected = jasmine.Matchers.prototype.toThrow.call(this);
          var not = this.isNot ? "not " : "";
          this.message = function() { 
            return "Expected '" + sourceStr + "' " + not + "to throw an exception."
          }
          return asExpected;
        } else {
          return jasmine.Matchers.prototype.toThrow.call(this);
        }
      },
      toHaveProperty: function(name) {
        var obj = typeof(this.actual) === "string" ? window[this.actual] : this.actual;
        return (obj[name] !== undefined);
      },
      toHaveFunction: function(name) {
        var obj = typeof(this.actual) === "string" ? window[this.actual] : this.actual;
        var exists = obj && typeof(obj[name]) === 'function';
        exists = exists || (obj && obj.prototype && typeof(obj.prototype[name]) === 'function');
        return exists;
      },
      toSupportInfoEnum: function(name) {
        var obj = this.actual;
        var val = undefined;
        try {
          val = obj.getInfo(WebCL[name]);
        } catch (e) {}
        return (val !== undefined);
      },
    });
  });

  function createContext() {
    if (SELECTED_DEVICE === null) {
      return webcl.createContext();
    } else {
      var selected = getDeviceAtIndex(SELECTED_DEVICE);
      var properties = selected ? { devices: [selected] } : null;
      var ctx = webcl.createContext(properties);
      var device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
      var vendorId = device.getInfo(WebCL.DEVICE_VENDOR_ID);
      DEBUG("Selected device: " + deviceVendors[vendorId] + " (VENDOR_ID="+vendorId+")");
      return ctx;
    }
    
    function getDeviceAtIndex(index) {
      var devices = [];
      webcl.getPlatforms().forEach(function(plat) {
        Array.prototype.push.apply(devices, plat.getDevices());
      });
      return devices[index];
    }
  };

  function createContextSimplified() {
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

  function checkSignature(className, checkExisting) {
    for (var funcName in expectedFunctions[className]) {
      if (checkExisting && expectedFunctions[className][funcName] === true) {
        expect(className).toHaveFunction(funcName);
      }
      if (!checkExisting && expectedFunctions[className][funcName] === false) {
        expect(className).not.toHaveFunction(funcName);
      }
    }
  };

  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
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
  function loadSource(uri, callback) {
    var validURI = (typeof(uri) === 'string') && uri.endsWith('.cl');
    if (validURI) {
      return xhrLoad(uri, callback);
    } else {
      throw "loadSource: invalid URI.";
    }
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

  //////////////////////////////////////////////////////////////

  var expectedClasses = {
    WebCL : true,
    WebCLPlatform : true,
    WebCLDevice : true,
    WebCLContext : true,
    WebCLCommandQueue : true,
    WebCLMemoryObject : true,
    WebCLSampler : true,
    WebCLProgram : true,
    WebCLKernel : true,
    WebCLEvent : true,
    WebCLBuffer : true,
    WebCLImage : true,
    WebCLUserEvent : true,
  };

  var expectedFunctions = {

    WebCL : {
      getPlatforms : true,
      createContext : true,
      getSupportedExtensions : true,
      enableExtension : true,
      waitForEvents : true,
      releaseAll : true,
      getPlatformIDs : false,         // renamed to getPlatforms
      createContextFromType : false,  // merged into createContext
    },

    WebCLPlatform : {
      getInfo : true,
      getDevices : true,
      getSupportedExtensions : true,
      enableExtension : true,
      getDeviceIDs : false,           // renamed to getDevices
      getPlatformInfo : false,        // renamed to getInfo
    },

    WebCLDevice : {
      getInfo : true,
      getSupportedExtensions : true,
      enableExtension : true,
      getDeviceInfo : false,          // renamed to getInfo
    },

    WebCLContext : {
      createBuffer : true,
      createCommandQueue : true,
      createImage : true,
      createProgram : true,
      createSampler : true,
      createUserEvent : true,
      getInfo : true,
      getSupportedImageFormats : true,
      release : true,
      releaseAll : true,
      createImage2D : false,            // renamed to createImage
      createImage3D : false,            // disallowed by WebCL
      createProgramWithSource : false,  // renamed to createProgram
      createProgramWithBinary : false,  // disallowed by WebCL
      getContextInfo : false,           // renamed to getInfo
      releaseCLResources : false,       // renamed to release
    },

    WebCLCommandQueue : {
      enqueueCopyBuffer : true,
      enqueueCopyBufferRect : true,
      enqueueCopyImage : true,
      enqueueCopyImageToBuffer : true,
      enqueueCopyBufferToImage : true,
      enqueueReadBuffer : true,
      enqueueReadBufferRect : true,
      enqueueReadImage : true,
      enqueueWriteBuffer : true,
      enqueueWriteBufferRect : true,
      enqueueWriteImage : true,
      enqueueNDRangeKernel : true,
      enqueueMarker : true,
      enqueueBarrier : true,
      enqueueWaitForEvents : true,
      finish : true,
      flush : true,
      getInfo : true,
      release : true,
      enqueueTask : false,              // disallowed by WebCL
      enqueueMapBuffer : false,         // disallowed by WebCL
      enqueueMapImage : false,          // disallowed by WebCL
      enqueueUnmapMemObject : false,    // disallowed by WebCL
      getCommandQueueInfo : false,      // renamed to getInfo
      releaseCLResources : false,       // renamed to release
    },

    WebCLMemoryObject : {
      getInfo : true,
      release : true,
      createSubBuffer : false,
      getImageInfo: false,              // moved to WebCLImage
      getMemObjectInfo : false,         // renamed to getInfo
      releaseCLResources : false,       // renamed to release
    },

    WebCLBuffer : {
      createSubBuffer : true,
      releaseCLResources : false,       // renamed to release
    },

    WebCLImage : {
      getInfo : true,
      getImageInfo: false,              // renamed to getInfo
      releaseCLResources : false,       // renamed to release
    },

    WebCLSampler : {
      getInfo : true,
      release : true,
      getSamplerInfo: false,            // renamed to getInfo
      releaseCLResources : false,       // renamed to release
    },

    WebCLProgram : {
      getInfo : true,
      getBuildInfo : true,
      build : true,
      createKernel : true,
      createKernelsInProgram : true,
      release : true,
      buildProgram : false,             // renamed to build
      getProgramInfo : false,           // renamed to getInfo
      getProgramBuildInfo : false,      // renamed to getBuildInfo
      releaseCLResources : false,       // renamed to release
    },

    WebCLKernel : {
      getInfo : true,
      getWorkGroupInfo : true,
      setArg : true,
      release : true,
      setKernelArg : false,             // renamed to setArg
      setKernelArgLocal : false,        // renamed to setArg
      getKernelInfo: false,             // renamed to getInfo
      getKernelWorkGroupInfo : false,   // renamed to getWorkGroupInfo
      releaseCLResources : false,       // renamed to release
    },

    WebCLEvent : {
      getInfo : true,
      getProfilingInfo : true,
      setCallback : true,
      release : true,
      setUserEventStatus : false,       // moved to WebCLUserEvent
      getEventInfo : false,             // renamed to getInfo
      getEventProfilingInfo : false,    // renamed to getProfilingInfo
      releaseCLResources : false,       // renamed to release
    },

    WebCLUserEvent : {
      setStatus : true,
      setUserEventStatus : false,       // renamed to setStatus
      releaseCLResources : false,       // renamed to release
    },
  };

  var errorEnums = {
    /* Error Codes */
    SUCCESS                                   : 0,
    DEVICE_NOT_FOUND                          : -1,
    DEVICE_NOT_AVAILABLE                      : -2,
    COMPILER_NOT_AVAILABLE                    : -3,
    MEM_OBJECT_ALLOCATION_FAILURE             : -4,
    OUT_OF_RESOURCES                          : -5,
    OUT_OF_HOST_MEMORY                        : -6,
    PROFILING_INFO_NOT_AVAILABLE              : -7,
    MEM_COPY_OVERLAP                          : -8,
    IMAGE_FORMAT_MISMATCH                     : -9,
    IMAGE_FORMAT_NOT_SUPPORTED                : -10,
    BUILD_PROGRAM_FAILURE                     : -11,
    MAP_FAILURE                               : -12,
    MISALIGNED_SUB_BUFFER_OFFSET              : -13,
    EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST : -14,
    INVALID_VALUE                             : -30,
    INVALID_DEVICE_TYPE                       : -31,
    INVALID_PLATFORM                          : -32,
    INVALID_DEVICE                            : -33,
    INVALID_CONTEXT                           : -34,
    INVALID_QUEUE_PROPERTIES                  : -35,
    INVALID_COMMAND_QUEUE                     : -36,
    INVALID_HOST_PTR                          : -37,
    INVALID_MEM_OBJECT                        : -38,
    INVALID_IMAGE_FORMAT_DESCRIPTOR           : -39,
    INVALID_IMAGE_SIZE                        : -40,
    INVALID_SAMPLER                           : -41,
    INVALID_BINARY                            : -42,
    INVALID_BUILD_OPTIONS                     : -43,
    INVALID_PROGRAM                           : -44,
    INVALID_PROGRAM_EXECUTABLE                : -45,
    INVALID_KERNEL_NAME                       : -46,
    INVALID_KERNEL_DEFINITION                 : -47,
    INVALID_KERNEL                            : -48,
    INVALID_ARG_INDEX                         : -49,
    INVALID_ARG_VALUE                         : -50,
    INVALID_ARG_SIZE                          : -51,
    INVALID_KERNEL_ARGS                       : -52,
    INVALID_WORK_DIMENSION                    : -53,
    INVALID_WORK_GROUP_SIZE                   : -54,
    INVALID_WORK_ITEM_SIZE                    : -55,
    INVALID_GLOBAL_OFFSET                     : -56,
    INVALID_EVENT_WAIT_LIST                   : -57,
    INVALID_EVENT                             : -58,
    INVALID_OPERATION                         : -59,
    //INVALID_GL_OBJECT                         : -60,  // moved to extension
    INVALID_BUFFER_SIZE                       : -61,
    //INVALID_MIP_LEVEL                         : -62,  // moved to extension
    INVALID_GLOBAL_WORK_SIZE                  : -63,
    INVALID_PROPERTY                          : -64,
  };

  var removedErrorEnums = {
    //INVALID_GL_OBJECT                        : -60,
    //INVALID_MIP_LEVEL                        : -62,
  };

  var deviceInfoEnums = {
    DEVICE_TYPE                               : 0x1000,
    DEVICE_VENDOR_ID                          : 0x1001,
    DEVICE_MAX_COMPUTE_UNITS                  : 0x1002,
    DEVICE_MAX_WORK_ITEM_DIMENSIONS           : 0x1003,
    DEVICE_MAX_WORK_GROUP_SIZE                : 0x1004,
    DEVICE_MAX_WORK_ITEM_SIZES                : 0x1005,
    DEVICE_PREFERRED_VECTOR_WIDTH_CHAR        : 0x1006,
    DEVICE_PREFERRED_VECTOR_WIDTH_SHORT       : 0x1007,
    DEVICE_PREFERRED_VECTOR_WIDTH_INT         : 0x1008,
    DEVICE_PREFERRED_VECTOR_WIDTH_LONG        : 0x1009,
    DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT       : 0x100A,
    //DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE      : 0x100B, // moved to extension
    DEVICE_MAX_CLOCK_FREQUENCY                : 0x100C,
    DEVICE_ADDRESS_BITS                       : 0x100D,
    DEVICE_MAX_READ_IMAGE_ARGS                : 0x100E,
    DEVICE_MAX_WRITE_IMAGE_ARGS               : 0x100F,
    DEVICE_MAX_MEM_ALLOC_SIZE                 : 0x1010,
    DEVICE_IMAGE2D_MAX_WIDTH                  : 0x1011,
    DEVICE_IMAGE2D_MAX_HEIGHT                 : 0x1012,
    DEVICE_IMAGE3D_MAX_WIDTH                  : 0x1013,
    DEVICE_IMAGE3D_MAX_HEIGHT                 : 0x1014,
    DEVICE_IMAGE3D_MAX_DEPTH                  : 0x1015,
    DEVICE_IMAGE_SUPPORT                      : 0x1016,
    DEVICE_MAX_PARAMETER_SIZE                 : 0x1017,
    DEVICE_MAX_SAMPLERS                       : 0x1018,
    DEVICE_MEM_BASE_ADDR_ALIGN                : 0x1019,
    //DEVICE_MIN_DATA_TYPE_ALIGN_SIZE           : 0x101A, // removed, deprecated in OpenCL 1.2
    DEVICE_SINGLE_FP_CONFIG                   : 0x101B,
    DEVICE_GLOBAL_MEM_CACHE_TYPE              : 0x101C,
    DEVICE_GLOBAL_MEM_CACHELINE_SIZE          : 0x101D,
    DEVICE_GLOBAL_MEM_CACHE_SIZE              : 0x101E,
    DEVICE_GLOBAL_MEM_SIZE                    : 0x101F,
    DEVICE_MAX_CONSTANT_BUFFER_SIZE           : 0x1020,
    DEVICE_MAX_CONSTANT_ARGS                  : 0x1021,
    DEVICE_LOCAL_MEM_TYPE                     : 0x1022,
    DEVICE_LOCAL_MEM_SIZE                     : 0x1023,
    DEVICE_ERROR_CORRECTION_SUPPORT           : 0x1024,
    DEVICE_PROFILING_TIMER_RESOLUTION         : 0x1025,
    DEVICE_ENDIAN_LITTLE                      : 0x1026,
    DEVICE_AVAILABLE                          : 0x1027,
    DEVICE_COMPILER_AVAILABLE                 : 0x1028,
    DEVICE_EXECUTION_CAPABILITIES             : 0x1029,
    DEVICE_QUEUE_PROPERTIES                   : 0x102A,
    DEVICE_NAME                               : 0x102B,
    DEVICE_VENDOR                             : 0x102C,
    DRIVER_VERSION                            : 0x102D,
    DEVICE_PROFILE                            : 0x102E,
    DEVICE_VERSION                            : 0x102F,
    DEVICE_EXTENSIONS                         : 0x1030,
    DEVICE_PLATFORM                           : 0x1031,
    //DEVICE_DOUBLE_FP_CONFIG                   : 0x1032, // moved to extension
    //DEVICE_HALF_FP_CONFIG                     : 0x1033, // moved to extension
    //DEVICE_PREFERRED_VECTOR_WIDTH_HALF        : 0x1034, // moved to extension
    DEVICE_HOST_UNIFIED_MEMORY                : 0x1035,
    DEVICE_NATIVE_VECTOR_WIDTH_CHAR           : 0x1036,
    DEVICE_NATIVE_VECTOR_WIDTH_SHORT          : 0x1037,
    DEVICE_NATIVE_VECTOR_WIDTH_INT            : 0x1038,
    DEVICE_NATIVE_VECTOR_WIDTH_LONG           : 0x1039,
    DEVICE_NATIVE_VECTOR_WIDTH_FLOAT          : 0x103A,
    //DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE         : 0x103B, // moved to extension
    //DEVICE_NATIVE_VECTOR_WIDTH_HALF           : 0x103C, // moved to extension
    DEVICE_OPENCL_C_VERSION                   : 0x103D,
  };

  var removedDeviceInfoEnums = {
    DEVICE_MIN_DATA_TYPE_ALIGN_SIZE          : 0x101A,
    //DEVICE_DOUBLE_FP_CONFIG                  : 0x1032,
    //DEVICE_HALF_FP_CONFIG                    : 0x1033,
    //DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE     : 0x100B,
    //DEVICE_PREFERRED_VECTOR_WIDTH_HALF       : 0x1034,
    //DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE        : 0x103B,
    //DEVICE_NATIVE_VECTOR_WIDTH_HALF          : 0x103C,
  };

  var extensionEnums = {
    INVALID_GL_OBJECT                        : -60,
    INVALID_MIP_LEVEL                        : -62,
    DEVICE_DOUBLE_FP_CONFIG                  : 0x1032,
    DEVICE_HALF_FP_CONFIG                    : 0x1033,
    DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE     : 0x100B,
    DEVICE_PREFERRED_VECTOR_WIDTH_HALF       : 0x1034,
    DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE        : 0x103B,
    DEVICE_NATIVE_VECTOR_WIDTH_HALF          : 0x103C,
  };

  var contextInfoEnums = {
    CONTEXT_DEVICES      : 0x1081,
    CONTEXT_PROPERTIES   : 0x1082,
    CONTEXT_NUM_DEVICES  : 0x1083,
  };

  var removedContextInfoEnums = {
    CONTEXT_REFERENCE_COUNT : 0x1080,
  };
});

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

