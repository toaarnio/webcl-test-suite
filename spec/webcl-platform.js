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
// Platforms
// 
describe("Platform", function() {

  beforeEach(addCustomMatchers);

  beforeEach(setup.bind(this, function() {
    if (!window.webcl) throw "WebCL is not available";
  }));


  describe("getPlatforms", function() {

    it("getPlatforms() must work", function() {
      if (!suite.preconditions) pending();
      expect('webcl.getPlatforms()').not.toThrow();
      expect('webcl.getPlatforms() instanceof Array').toEvalAs(true);
      expect('webcl.getPlatforms().length >= 1').toEvalAs(true);
      expect('webcl.getPlatforms()[0] instanceof WebCLPlatform').toEvalAs(true)
    });

    it("getPlatforms(<invalid arguments>) must throw", function() {
      if (!suite.preconditions) pending();
      argc('webcl.getPlatforms', []);
    });

  });
    
  describe("platform.getInfo", function() {

    it("platform.getInfo(<valid enum>) must work", function() {
      if (!suite.preconditions) pending();
      expect('platforms = webcl.getPlatforms()').not.toThrow();
      function checkInfo() {
        for (var i=0; i < platforms.length; i++) {
          var name = platforms[i].getInfo(WebCL.PLATFORM_NAME)
          var vendor = platforms[i].getInfo(WebCL.PLATFORM_VENDOR)
          var version = platforms[i].getInfo(WebCL.PLATFORM_VERSION)
          var profile = platforms[i].getInfo(WebCL.PLATFORM_PROFILE)
          var extensions = platforms[i].getInfo(WebCL.PLATFORM_EXTENSIONS)
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
      expect('platform = webcl.getPlatforms()[0]').not.toThrow();
      argc('platform.getInfo', ['WebCL.PLATFORM_VENDOR']);
      expect('platform.getInfo(WebCL.PLATFORM_VENDOR)').not.toThrow();
      expect('platform.getInfo(WebCL.DEVICE_VENDOR)').toThrow('INVALID_VALUE');
      expect('platform.getInfo(WebCL.CONTEXT_PLATFORM)').toThrow('INVALID_VALUE');
      expect('platform.getInfo(WebCL.BUILD_ERROR)').toThrow('INVALID_VALUE');
      expect('platform.getInfo(0x101A)').toThrow('INVALID_VALUE'); // DEVICE_MIN_DATA_TYPE_ALIGN_SIZE
    });

  });


  describe("getDevices", function() {

    beforeEach(setup.bind(this, function() {
      platforms = webcl.getPlatforms();
    }));

    it("getDevices(ALL || DEFAULT) must work", function() {
      if (!suite.preconditions) pending();
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

    it("getDevices(CPU || GPU || ACCELERATOR) must work", function() {
      if (!suite.preconditions) pending();
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
      for (i=0; i < platforms.length; i++) {
        fuzz('platforms['+i+'].getDevices', ['OptionalEnum'], ['undefined'], null, [0], 'INVALID_DEVICE_TYPE');
        argc('platforms['+i+'].getDevices', ['undefined']);
      }
    });

  });


  describe("device.getInfo", function() {
    
    beforeEach(setup.bind(this, function() {
      device = getSelectedDevice();
    }));

    it("device.getInfo(<valid enum>) must not throw", function() {
      if (!suite.preconditions) pending();
      for (enumName in deviceInfoEnums) {
        enumValue = deviceInfoEnums[enumName];
        expect('device.getInfo(WebCL.'+enumName+')').not.toThrow();
      }
    });

    it("device.getInfo(<valid enum>) must return the expected kind of value", function() {
      if (!suite.preconditions) pending();
      for (enumName in deviceInfoEnums) {
        matcher = deviceInfoEnumMatchers[enumName];
        value = device.getInfo(WebCL[enumName]);
        expect('device.getInfo(WebCL.'+enumName+') // ' + value).toPass(matcher);
        INFO(enumName+ ': ' + device.getInfo(WebCL[enumName]));
      }
    });

    it("device.getInfo(<invalid arguments>) must throw", function() {
      if (!suite.preconditions) pending();
      argc('device.getInfo', ['WebCL.DEVICE_VENDOR'], 'WEBCL_SYNTAX_ERROR');
      expect('device.getInfo(WebCL.DEVICE_VENDOR)').not.toThrow();
      expect('device.getInfo(WebCL.PLATFORM_VENDOR)').toThrow('INVALID_VALUE');
      expect('device.getInfo(WebCL.CONTEXT_PLATFORM)').toThrow('INVALID_VALUE');
      expect('device.getInfo(WebCL.BUILD_ERROR)').toThrow('INVALID_VALUE');
      expect('device.getInfo(0x101A)').toThrow('INVALID_VALUE'); // DEVICE_MIN_DATA_TYPE_ALIGN_SIZE
    });

    it("device.getInfo(<non-enabled extension enum>) must throw", function() {
      if (!suite.preconditions) pending();
      expect('device.getInfo(WebCL.DEVICE_VENDOR)').not.toThrow();
      for (enumName in extensionEnums) {
        enumValue = extensionEnums[enumName];
        expect('device.getInfo(WebCL.'+enumName+')').toThrow('INVALID_VALUE');
      }
    });
    
  });


  describe("JavaScript semantics", function() {

    beforeEach(setup.bind(this, function() {
      aPlatform = webcl.getPlatforms()[0];
      aDevice = aPlatform.getDevices()[0];
    }));

    it("objects must accommodate user-defined fields", function() {
      if (!suite.preconditions) pending();
      expect('webcl.foo = "bar"').not.toThrow();
      expect('webcl.foo === "bar"').toEvalAs(true);
      expect('aPlatform.name = "foo"').not.toThrow();
      expect('aPlatform.name === "foo"').toEvalAs(true);
    });
    
    it("platform getters must return the same object every time", function() {
      if (!suite.preconditions) pending();
      expect('aPlatform === webcl.getPlatforms()[0]').toEvalAs(true);
      expect('aDevice === aPlatform.getDevices()[0]').toEvalAs(true);
      expect('aPlatform === aDevice.getInfo(WebCL.DEVICE_PLATFORM)').toEvalAs(true);
    });

  });

});
