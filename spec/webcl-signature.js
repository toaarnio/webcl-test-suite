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
// Properties -> Signature
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

  //////////////////////////////////////////////////////////////

  beforeEach(function() {
    this.addMatchers({
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
    });
  });

  afterEach(function() { testSuiteTrace(this); });

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

});
