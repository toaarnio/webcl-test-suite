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

describe("Platform", function() {

  //////////////////////////////////////////////////////////////////////////////
  //
  // Platform -> getPlatforms
  // 
  describe("getPlatforms", function() {

    it("getPlatforms() must not throw", function() {
      expect('webcl.getPlatforms()').not.toThrow();
    });

    it("getPlatforms() must return a WebCLPlatform array with length >= 1", function() {
      expect('webcl.getPlatforms() instanceof Array').toEvalAs(true);
      expect('webcl.getPlatforms().length >= 1').toEvalAs(true);
      expect('webcl.getPlatforms()[0] instanceof WebCLPlatform').toEvalAs(true)
    });

    it("getPlatforms(invalidArgument) must throw", function() {
      expect('webcl.getPlatforms()').not.toThrow();
      expect('webcl.getPlatforms("foo")').toThrow();
      expect('webcl.getPlatforms(0x1234)').toThrow();
      expect('webcl.getPlatforms({})').toThrow();
    });
    
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Platform -> getDevices
  // 
  describe("getDevices", function() {

    it("getDevices(ALL || DEFAULT) must not throw", function() {
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        expect('platforms['+i+'].getDevices()').not.toThrow();
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_DEFAULT)').not.toThrow();
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL)').not.toThrow();
      }
    });

    it("getDevices(ALL || DEFAULT) must return a WebCLDevice array with length >= 1", function() {
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        expect('platforms['+i+'].getDevices()').not.toThrow();
        expect('platforms['+i+'].getDevices() instanceof Array').toEvalAs(true);
        expect('platforms['+i+'].getDevices().length >= 1').toEvalAs(true);
        expect('platforms['+i+'].getDevices()[0] instanceof WebCLDevice').toEvalAs(true);
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL)').not.toThrow();
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL) instanceof Array').toEvalAs(true);
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL).length >= 1').toEvalAs(true);
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL)[0] instanceof WebCLDevice').toEvalAs(true);
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_DEFAULT)').not.toThrow();
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_DEFAULT) instanceof Array').toEvalAs(true);
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_DEFAULT).length >= 1').toEvalAs(true);
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_DEFAULT)[0] instanceof WebCLDevice').toEvalAs(true);
      }
    });

    it("getDevices(CPU || GPU || ACCELERATOR) must not throw", function() {
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        var defaultDevice = platforms[i].getDevices(WebCL.DEVICE_TYPE_DEFAULT)[0];
        var defaultDeviceType = defaultDevice.getInfo(WebCL.DEVICE_TYPE);
        switch (defaultDeviceType) {
        case WebCL.DEVICE_TYPE_CPU:
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_CPU)').not.toThrow();
          break;
        case WebCL.DEVICE_TYPE_GPU:
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_GPU)').not.toThrow();
          break;
        case WebCL.DEVICE_TYPE_ACCELERATOR:
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ACCELERATOR)').not.toThrow();
          break;
        default:
          throw "Unrecognized device type (" + defaultDeviceType + ") on platform["+i+"]!";
        }
      }
    });

    it("getDevices(CPU || GPU || ACCELERATOR) must return a WebCLDevice array with length >= 1", function() {
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        var defaultDevice = platforms[i].getDevices(WebCL.DEVICE_TYPE_DEFAULT)[0];
        var defaultDeviceType = defaultDevice.getInfo(WebCL.DEVICE_TYPE);
        switch (defaultDeviceType) {
        case WebCL.DEVICE_TYPE_CPU:
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_CPU)').not.toThrow();
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_CPU) instanceof Array').toEvalAs(true);
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_CPU).length >= 1').toEvalAs(true);
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_CPU)[0] instanceof WebCLDevice').toEvalAs(true);
          break;
        case WebCL.DEVICE_TYPE_GPU:
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_GPU)').not.toThrow();
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_GPU) instanceof Array').toEvalAs(true);
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_GPU).length >= 1').toEvalAs(true);
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_GPU)[0] instanceof WebCLDevice').toEvalAs(true);
          break;
        case WebCL.DEVICE_TYPE_ACCELERATOR:
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ACCELERATOR)').not.toThrow();
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ACCELERATOR) instanceof Array').toEvalAs(true);
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ACCELERATOR).length >= 1').toEvalAs(true);
          expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ACCELERATOR)[0] instanceof WebCLDevice').toEvalAs(true);
          break;
        default:
          throw "Unrecognized device type (" + defaultDeviceType + ") on platform["+i+"]!";
        }
      }
    });

    it("getDevices(invalidArgument) must throw", function() {
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        expect('platforms['+i+'].getDevices()').not.toThrow();
        expect('platforms['+i+'].getDevices(0)').toThrow('INVALID_DEVICE_TYPE');
        expect('platforms['+i+'].getDevices(3)').toThrow('INVALID_DEVICE_TYPE');
        expect('platforms['+i+'].getDevices(5)').toThrow('INVALID_DEVICE_TYPE');
        expect('platforms['+i+'].getDevices(9)').toThrow('INVALID_DEVICE_TYPE');
        expect('platforms['+i+'].getDevices(null)').toThrow('INVALID_DEVICE_TYPE');
        expect('platforms['+i+'].getDevices({})').toThrow('INVALID_DEVICE_TYPE');
        expect('platforms['+i+'].getDevices(platforms[0])').toThrow('INVALID_DEVICE_TYPE');
      }
    });
  });
    
  //////////////////////////////////////////////////////////////////////////////
  //
  // Platform -> getInfo
  // 
  describe("getInfo", function() {
    
    beforeEach(function() {
      try {
        device = getDeviceAtIndex(DEVICE_INDEX);
      } catch(e) {}
      if (device === undefined) {
        pending();
      }
    });

    it("platform.getInfo(<validEnum>) must return the expected kind of value", function() {
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

    it("platform.getInfo(<invalidEnum>) must throw", function() {
      platform = webcl.getPlatforms()[0];
      expect('platform.getInfo(WebCL.PLATFORM_VENDOR)').not.toThrow();
      expect('platform.getInfo(WebCL.DEVICE_VENDOR)').toThrow('INVALID_VALUE');
      expect('platform.getInfo(WebCL.CONTEXT_PLATFORM)').toThrow('INVALID_VALUE');
      expect('platform.getInfo(WebCL.BUILD_ERROR)').toThrow('INVALID_VALUE');
      expect('platform.getInfo(0x101A)').toThrow('INVALID_VALUE'); // DEVICE_MIN_DATA_TYPE_ALIGN_SIZE
      expect('platform.getInfo(-1)').toThrow('INVALID_VALUE');
      expect('platform.getInfo(0)').toThrow('INVALID_VALUE');
      expect('platform.getInfo("foo")').toThrow('INVALID_VALUE');
      expect('platform.getInfo({})').toThrow('INVALID_VALUE');
      expect('platform.getInfo(device)').toThrow('INVALID_VALUE');
      expect('platform.getInfo()').toThrow('INVALID_VALUE');
    });

    it("device.getInfo(<validEnum>) must not throw", function() {
      for (enumName in deviceInfoEnums) {
        enumValue = deviceInfoEnums[enumName];
        expect('device.getInfo(WebCL.'+enumName+')').not.toThrow();
      }
    });

    it("device.getInfo(<validEnum>) must return the expected kind of value", function() {
      device = getDeviceAtIndex(DEVICE_INDEX);
      for (enumName in deviceInfoEnums) {
        matcher = deviceInfoEnumMatchers[enumName];
        value = device.getInfo(WebCL[enumName]);
        expect('device.getInfo(WebCL.'+enumName+') // ' + value).toPass(matcher);
        INFO(enumName+ ': ' + device.getInfo(WebCL[enumName]));
      }
    });

    it("device.getInfo(<invalidEnum>) must throw", function() {
      device = getDeviceAtIndex(DEVICE_INDEX);
      expect('device.getInfo(WebCL.DEVICE_VENDOR)').not.toThrow();
      expect('device.getInfo(WebCL.PLATFORM_VENDOR)').toThrow('INVALID_VALUE');
      expect('device.getInfo(WebCL.CONTEXT_PLATFORM)').toThrow('INVALID_VALUE');
      expect('device.getInfo(WebCL.BUILD_ERROR)').toThrow('INVALID_VALUE');
      expect('device.getInfo(0x101A)').toThrow('INVALID_VALUE'); // DEVICE_MIN_DATA_TYPE_ALIGN_SIZE
      expect('device.getInfo(-1)').toThrow('INVALID_VALUE');
      expect('device.getInfo(0)').toThrow('INVALID_VALUE');
      expect('device.getInfo("foo")').toThrow('INVALID_VALUE');
      expect('device.getInfo({})').toThrow('INVALID_VALUE');
      expect('device.getInfo(device)').toThrow('INVALID_VALUE');
      expect('device.getInfo()').toThrow('INVALID_VALUE');
    });

    it("device.getInfo(<nonEnabledExtensionEnum>) must throw", function() {
      device = getDeviceAtIndex(DEVICE_INDEX);
      expect('device.getInfo(WebCL.DEVICE_VENDOR)').not.toThrow();
      for (enumName in extensionEnums) {
        enumValue = extensionEnums[enumName];
        expect('device.getInfo(WebCL.'+enumName+')').toThrow('INVALID_VALUE');
      }
    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Platform -> JavaScript semantics
  // 
  describe("JavaScript semantics", function() {

    it("objects must accommodate user-defined fields", function() {
      platform = webcl.getPlatforms()[0];
      expect('webcl.foo = "bar"').not.toThrow();
      expect('webcl.foo === "bar"').toEvalAs(true);
      expect('platform.name = "foo"').not.toThrow();
      expect('platform.name === "foo"').toEvalAs(true);
    });
    
    it("platform getters must return the same object every time", function() {
      platform = webcl.getPlatforms()[0];
      device = platform.getDevices()[0];
      expect('platform === webcl.getPlatforms()[0]').toEvalAs(true);
      expect('device === platform.getDevices()[0]').toEvalAs(true);
      expect('platform === device.getInfo(WebCL.DEVICE_PLATFORM)').toEvalAs(true);
    });

    it("dynamic getters must return the same object every time", function() {
      context = webcl.createContext();
      queue = context.createCommandQueue();
      platform = webcl.getPlatforms()[0];
      device = platform.getDevices()[0];
      expect('device === context.getInfo(WebCL.CONTEXT_DEVICES)[0]').toEvalAs(true);
      expect('context === queue.getInfo(WebCL.QUEUE_CONTEXT)').toEvalAs(true);
      expect('device === queue.getInfo(WebCL.QUEUE_DEVICE)').toEvalAs(true);
    });

  });

  //////////////////////////////////////////////////////////////////////////////

  xdescribe("Jasmine customizations", function() {

    it(".toThrow()", function() {
      expect('illegalStatement').toThrow();
    });

    it(".not.toThrow()", function() {
      expect('var validStatement').not.toThrow();
    });

    it(".toThrow('EXCEPTION_NAME')", function() {
      customException = { name: 'CUSTOM_EXCEPTION' };
      expect('illegalStatement').toThrow('ReferenceError');
      expect('throw customException').toThrow('CUSTOM_EXCEPTION');
    });

    it(".not.toThrow('EXCEPTION_NAME')", function() {
      customException = { name: 'CUSTOM_EXCEPTION' }
      expect('var validStatement').not.toThrow('ReferenceError');
      expect('throw customException').not.toThrow('ReferenceError');
    });

    it(".toThrow() [MUST FAIL]", function() {
      expect('var validStatement').toThrow();
    });

    it(".not.toThrow() [MUST FAIL]", function() {
      expect('illegalStatement').not.toThrow();
    });

    it(".toThrow('EXCEPTION_NAME') [MUST FAIL]", function() {
      customException = { name: 'CUSTOM_EXCEPTION' };
      expect('var validStatement').toThrow('ReferenceError');
      expect('throw customException').toThrow('ReferenceError');
    });

    it(".not.toThrow('EXCEPTION_NAME') [MUST FAIL]", function() {
      customException = { name: 'CUSTOM_EXCEPTION' };
      expect('illegalStatement').not.toThrow('ReferenceError');
      expect('throw customException').not.toThrow('CUSTOM_EXCEPTION');
    });

  });

  //////////////////////////////////////////////////////////////////////////////

  beforeEach(addCustomMatchers);

  afterEach(function() { 
    //testSuiteTrace(this);
    releaseAll();
  });

});
