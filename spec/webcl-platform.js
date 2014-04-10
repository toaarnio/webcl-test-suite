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

  beforeEach(enforcePreconditions.bind(this, function() {
    aPlatform = webcl.getPlatforms()[0];
  }));

  //////////////////////////////////////////////////////////////////////////////
  //
  // Platform -> getPlatforms
  // 
  describe("getPlatforms", function() {

    it("getPlatforms() must not throw", function() {
      if (window.webcl === undefined) pending();
      expect('webcl.getPlatforms()').not.toThrow();
    });

    it("getPlatforms() must return a WebCLPlatform array with length >= 1", function() {
      if (!suite.preconditions) pending();
      expect('webcl.getPlatforms() instanceof Array').toEvalAs(true);
      expect('webcl.getPlatforms().length >= 1').toEvalAs(true);
      expect('webcl.getPlatforms()[0] instanceof WebCLPlatform').toEvalAs(true)
    });

    it("getPlatforms(<invalid arguments>) must throw", function() {
      if (!suite.preconditions) pending();
      argc('webcl.getPlatforms', [], [], 'WEBCL_SYNTAX_ERROR');
    });
    
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Platform -> getDevices
  // 
  describe("getDevices", function() {

    it("getDevices(ALL || DEFAULT) must not throw", function() {
      if (!suite.preconditions) pending();
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        expect('platforms['+i+'].getDevices()').not.toThrow();
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_DEFAULT)').not.toThrow();
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL)').not.toThrow();
      }
    });

    it("getDevices(ALL || DEFAULT) must return a WebCLDevice array with length >= 1", function() {
      if (!suite.preconditions) pending();
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
      if (!suite.preconditions) pending();
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
      if (!suite.preconditions) pending();
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

    it("getDevices(<invalid arguments>) must throw", function() {
      if (!suite.preconditions) pending();
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        argc('platforms['+i+'].getDevices', ['UintNonZero'], ['undefined'], 'WEBCL_SYNTAX_ERROR');
        fuzz('platforms['+i+'].getDevices', ['UintNonZero'], ['undefined'], null, [0], 'INVALID_DEVICE_TYPE');
      }
    });
  });
    
  //////////////////////////////////////////////////////////////////////////////
  //
  // Platform -> getInfo
  // 
  describe("getInfo", function() {
    
    beforeEach(enforcePreconditions.bind(this, function() {
      DEBUG("Testing on Device ["+(DEVICE_INDEX || 0)+"]")
      device = getDeviceAtIndex(DEVICE_INDEX);
    }));

    it("platform.getInfo(<validEnum>) must return the expected kind of value", function() {
      if (!suite.preconditions) pending();
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

    it("platform.getInfo(<invalid arguments>) must throw", function() {
      if (!suite.preconditions) pending();
      platform = webcl.getPlatforms()[0];
      argc('platform.getInfo', ['UintNonZero'], ['WebCL.PLATFORM_VENDOR'], 'WEBCL_SYNTAX_ERROR');
      expect('platform.getInfo(WebCL.PLATFORM_VENDOR)').not.toThrow();
      expect('platform.getInfo(WebCL.DEVICE_VENDOR)').toThrow('INVALID_VALUE');
      expect('platform.getInfo(WebCL.CONTEXT_PLATFORM)').toThrow('INVALID_VALUE');
      expect('platform.getInfo(WebCL.BUILD_ERROR)').toThrow('INVALID_VALUE');
      expect('platform.getInfo(0x101A)').toThrow('INVALID_VALUE'); // DEVICE_MIN_DATA_TYPE_ALIGN_SIZE
    });

    it("device.getInfo(<validEnum>) must not throw", function() {
      if (!suite.preconditions) pending();
      for (enumName in deviceInfoEnums) {
        enumValue = deviceInfoEnums[enumName];
        expect('device.getInfo(WebCL.'+enumName+')').not.toThrow();
      }
    });

    it("device.getInfo(<validEnum>) must return the expected kind of value", function() {
      if (!suite.preconditions) pending();
      device = getDeviceAtIndex(DEVICE_INDEX);
      for (enumName in deviceInfoEnums) {
        matcher = deviceInfoEnumMatchers[enumName];
        value = device.getInfo(WebCL[enumName]);
        expect('device.getInfo(WebCL.'+enumName+') // ' + value).toPass(matcher);
        INFO(enumName+ ': ' + device.getInfo(WebCL[enumName]));
      }
    });

    it("device.getInfo(<invalid arguments>) must throw", function() {
      if (!suite.preconditions) pending();
      device = getDeviceAtIndex(DEVICE_INDEX);
      argc('device.getInfo', ['UintNonZero'], ['WebCL.DEVICE_VENDOR'], 'WEBCL_SYNTAX_ERROR');
      expect('device.getInfo(WebCL.DEVICE_VENDOR)').not.toThrow();
      expect('device.getInfo(WebCL.PLATFORM_VENDOR)').toThrow('INVALID_VALUE');
      expect('device.getInfo(WebCL.CONTEXT_PLATFORM)').toThrow('INVALID_VALUE');
      expect('device.getInfo(WebCL.BUILD_ERROR)').toThrow('INVALID_VALUE');
      expect('device.getInfo(0x101A)').toThrow('INVALID_VALUE'); // DEVICE_MIN_DATA_TYPE_ALIGN_SIZE
    });

    it("device.getInfo(<nonEnabledExtensionEnum>) must throw", function() {
      if (!suite.preconditions) pending();
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

    beforeEach(enforcePreconditions.bind(this, function() {
      aPlatform = webcl.getPlatforms()[0];
      aDevice = aPlatform.getDevices()[0];
    }));

    it("objects must accommodate user-defined fields", function() {
      if (!suite.preconditions) pending();
      platform = webcl.getPlatforms()[0];
      expect('webcl.foo = "bar"').not.toThrow();
      expect('webcl.foo === "bar"').toEvalAs(true);
      expect('platform.name = "foo"').not.toThrow();
      expect('platform.name === "foo"').toEvalAs(true);
    });
    
    it("platform getters must return the same object every time", function() {
      if (!suite.preconditions) pending();
      platform = webcl.getPlatforms()[0];
      device = platform.getDevices()[0];
      expect('platform === webcl.getPlatforms()[0]').toEvalAs(true);
      expect('device === platform.getDevices()[0]').toEvalAs(true);
      expect('platform === device.getInfo(WebCL.DEVICE_PLATFORM)').toEvalAs(true);
    });

  });

  //////////////////////////////////////////////////////////////////////////////

  xdescribe("Jasmine customizations", function() {

    it(".toThrow()", function() {
      expect('illegalStatement').toThrow();
      expect(function() { illegalStatement; }).toThrow();
    });

    it(".not.toThrow()", function() {
      expect('var validStatement').not.toThrow();
      expect(function() { var validStatement; }).not.toThrow();
    });

    it(".toThrow('EXCEPTION_NAME')", function() {
      customException = { name: 'CUSTOM_EXCEPTION' };
      expect('illegalStatement').toThrow('ReferenceError');
      expect('throw customException').toThrow('CUSTOM_EXCEPTION');
      expect(function() { illegalStatement; }).toThrow('ReferenceError');
      expect(function() { throw customException; }).toThrow('CUSTOM_EXCEPTION');
    });

    it(".not.toThrow('EXCEPTION_NAME')", function() {
      customException = { name: 'CUSTOM_EXCEPTION' }
      expect('var validStatement').not.toThrow('ReferenceError');
      expect('throw customException').not.toThrow('ReferenceError');
      expect(function() { var validStatement; }).not.toThrow('ReferenceError');
      expect(function() { throw customException; }).not.toThrow('ReferenceError');
    });

    it(".toThrow() [MUST FAIL]", function() {
      expect('var validStatement').toThrow();
      expect(function() { var validStatement; }).toThrow();
    });

    it(".not.toThrow() [MUST FAIL]", function() {
      expect('illegalStatement').not.toThrow();
      expect(function() { illegalStatement; }).not.toThrow();
    });

    it(".toThrow('EXCEPTION_NAME') [MUST FAIL]", function() {
      customException = { name: 'CUSTOM_EXCEPTION' };
      expect('var validStatement').toThrow('ReferenceError');
      expect('throw customException').toThrow('ReferenceError');
      expect(function() { var validStatement; }).toThrow('ReferenceError');
      expect(function() { throw customException; }).toThrow('ReferenceError');
    });

    it(".not.toThrow('EXCEPTION_NAME') [MUST FAIL]", function() {
      customException = { name: 'CUSTOM_EXCEPTION' };
      expect('illegalStatement').not.toThrow('ReferenceError');
      expect('throw customException').not.toThrow('CUSTOM_EXCEPTION');
      expect(function() { illegalStatement; }).not.toThrow('ReferenceError');
      expect(function() { throw customException; }).not.toThrow('CUSTOM_EXCEPTION');
    });

  });

  //////////////////////////////////////////////////////////////////////////////

  beforeEach(addCustomMatchers);

});
