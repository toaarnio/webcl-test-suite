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
      expect('webcl.getPlatforms()').not.toThrow();
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

    it("getDevices() must not throw", function() {
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        expect('platforms['+i+'].getDevices()').not.toThrow();
      }
    });

    it("getDevices(DEVICE_TYPE_ALL) must not throw", function() {
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL)').not.toThrow();
      }
    });

    it("getDevices(DEVICE_TYPE_DEFAULT) must not throw", function() {
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL)').not.toThrow();
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

    it("getDevices() must return a WebCLDevice array with length >= 1", function() {
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        expect('platforms['+i+'].getDevices()').not.toThrow();
        expect('platforms['+i+'].getDevices() instanceof Array').toEvalAs(true);
        expect('platforms['+i+'].getDevices().length >= 1').toEvalAs(true);
        expect('platforms['+i+'].getDevices()[0] instanceof WebCLDevice').toEvalAs(true);
      }
    });

    it("getDevices(DEVICE_TYPE_ALL) must return a WebCLDevice array with length >= 1", function() {
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL)').not.toThrow();
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL) instanceof Array').toEvalAs(true);
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL).length >= 1').toEvalAs(true);
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_ALL)[0] instanceof WebCLDevice').toEvalAs(true);
      }
    });

    it("getDevices(DEVICE_TYPE_DEFAULT) must return a WebCLDevice array with length >= 1", function() {
      platforms = webcl.getPlatforms();
      for (i=0; i < platforms.length; i++) {
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_DEFAULT)').not.toThrow();
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_DEFAULT) instanceof Array').toEvalAs(true);
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_DEFAULT).length >= 1').toEvalAs(true);
        expect('platforms['+i+'].getDevices(WebCL.DEVICE_TYPE_DEFAULT)[0] instanceof WebCLDevice').toEvalAs(true);
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
      }
    });
  });
    
  //////////////////////////////////////////////////////////////////////////////
  //
  // Platform -> getInfo
  // 
  describe("getInfo", function() {

    it("must work on all platforms", function() {
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

    it("must work on all devices", function() {
      platforms = webcl.getPlatforms();
      for (var i=0; i < platforms.length; i++) {
        devices = platforms[i].getDevices();
        for (var j=0; j < devices.length; j++) {
          device = devices[j];
          for (enumName in deviceInfoEnums) {
            validate = function(enumName) {
              var matcher = deviceInfoEnumMatchers[enumName];
              return matcher(device.getInfo(WebCL[enumName]));
            };
            enumValue = deviceInfoEnums[enumName];
            expect('info = device.getInfo(WebCL.'+enumName+')').not.toThrow();
            expect('validate("'+enumName+'")').toEvalAs('true');
            INFO(enumName+': '+info);
          }
        }
      }
    });

    xit("return values must be as specified", function() {
      platform = webcl.getPlatforms()[0];
      device = platform.getDevices()[0];
      enumName = 'DEVICE_TYPE';
      matcher = deviceInfoEnumMatchers[enumName];
      value = device.getInfo(WebCL.DEVICE_TYPE);
      expect(value).toPass(validator);
      function validator() {
        return (value === 2 || value === 4);
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
    
    it("getters must return the same object every time (CRITICAL)", function() {
      platform = webcl.getPlatforms()[0];
      expect('webcl.getPlatforms()[0] === webcl.getPlatforms()[0]').toEvalAs(true);
      expect('platform === platform.getDevices()[0].getInfo(WebCL.DEVICE_PLATFORM)').toEvalAs(true);
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
