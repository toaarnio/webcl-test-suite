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

describe("Properties", function() {
  
  afterEach(function() {
    var resultStr = this.results().passed() ? "PASS" : "FAIL";
    TRACE(testSuiteAsString(this.suite) + " -> " + this.description + ": " + resultStr);
  });

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
});
