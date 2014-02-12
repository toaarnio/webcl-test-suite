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

describe("Functionality", function() {

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> createContext (proposed simplified API)
  // 
  describe("createContext", function() {
    
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

    it("createContext(aPlatform, DEVICE_TYPE_ALL)", function() {
      defaultPlatform = webcl.getPlatforms()[0];
      expect('createContextSimplified(defaultPlatform, WebCL.DEVICE_TYPE_ALL)').not.toThrow();
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

    it("throw on createContext(DEVICE_TYPE_ALL)", function() {
      expect('createContextSimplified(WebCL.DEVICE_TYPE_ALL)').toThrow();
      expect('createContextSimplified(WebCL.DEVICE_TYPE_ALL)').toThrow('INVALID_DEVICE_TYPE');
    });

    it("throw on createContext(DEVICE_TYPE_ACCELERATOR)", function() {
      expect('createContextSimplified(WebCL.DEVICE_TYPE_ACCELERATOR)').toThrow();
      expect('createContextSimplified(WebCL.DEVICE_TYPE_ACCELERATOR)').toThrow('DEVICE_NOT_FOUND');
    });

    it("throw on createContext(aPlatform, DEVICE_TYPE_ACCELERATOR)", function() {
      defaultPlatform = webcl.getPlatforms()[0];
      expect('createContextSimplified(defaultPlatform, WebCL.DEVICE_TYPE_ACCELERATOR)').toThrow();
      expect('createContextSimplified(defaultPlatform, WebCL.DEVICE_TYPE_ACCELERATOR)').toThrow('DEVICE_NOT_FOUND');
    });

    it("throw on createContext(0)", function() {
      expect('createContextSimplified(0)').toThrow();
      expect('createContextSimplified(0)').toThrow('INVALID_DEVICE_TYPE');
    });

    it("throw on createContext(0x1234)", function() {
      expect('createContextSimplified(0x1234)').toThrow();
      expect('createContextSimplified(0x1234)').toThrow('INVALID_DEVICE_TYPE');
    });

    it("throw on createContext(null)", function() {
      expect('createContextSimplified(null)').toThrow();
    });

    it("throw on createContext('foobar')", function() {
      expect('createContextSimplified("foobar")').toThrow();
    });

    it("throw on createContext([])", function() {
      expect('createContextSimplified([])').toThrow();
      expect('createContextSimplified([])').toThrow('INVALID_VALUE');
    });

    it("throw on createContext([null])", function() {
      expect('createContextSimplified([null])').toThrow();
      expect('createContextSimplified([null])').toThrow('INVALID_DEVICE');
    });

    it("throw on createContext(['foobar'])", function() {
      expect('createContextSimplified(["foobar"])').toThrow();
      expect('createContextSimplified(["foobar"])').toThrow('INVALID_DEVICE');
    });

    it("throw on createContext([aDevice, undefined])", function() {
      defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
      expect('createContextSimplified([defaultDevice, undefined])').toThrow();
      expect('createContextSimplified([defaultDevice, undefined])').toThrow('INVALID_DEVICE');
    });

    it("throw on createContext([aDevice, null])", function() {
      defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
      expect('createContextSimplified([defaultDevice, null])').toThrow();
      expect('createContextSimplified([defaultDevice, null])').toThrow('INVALID_DEVICE');
    });

    it("throw on createContext([aDevice, 'foobar'])", function() {
      defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
      expect('createContextSimplified([defaultDevice, "foobar"])').toThrow();
      expect('createContextSimplified([defaultDevice, "foobar"])').toThrow('INVALID_DEVICE');
    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> createContext
  // 
  xdescribe("createContext (legacy)", function() {

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

    it("must throw if properties === 'foobar'", function() {
      expect('webcl.createContext("foobar");').toThrow();
    });

    it("must throw if properties.devices === 'foobar'", function() {
      expect('webcl.createContext({ devices: "foobar" });').toThrow();
    });

    it("must throw if properties.platform === 'foobar'", function() {
      expect('webcl.createContext({ platform: "foobar" });').toThrow();
    });

    it("must throw if properties.deviceType === 'foobar'", function() {
      expect('webcl.createContext({ deviceType: "foobar" });').toThrow();
    });

    it("must throw if properties.devices === []", function() {
      expect('webcl.createContext({ devices: [] });').toThrow();
    });

    it("must throw if properties.devices === [undefined]", function() {
      expect('webcl.createContext({ devices: [undefined] });').toThrow();
    });

    it("must throw if properties.devices === [null]", function() {
      expect('webcl.createContext({ devices: [null] });').toThrow();
    });

    it("must throw if properties.devices === [device, undefined]", function() {
      defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
      expect('webcl.createContext({ devices: [defaultDevice, undefined] });').toThrow();
    });

    it("must throw if properties.devices === [device, null]", function() {
      defaultDevice = webcl.getPlatforms()[0].getDevices()[0];
      expect('webcl.createContext({ devices: [defaultDevice, null] });').toThrow();
    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLContext
  // 
  describe("WebCLContext", function() {

    beforeEach(function() {
      try {
        ctx = createContext();
        device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
      } catch (e) {
        ERROR("Functionality -> WebCLContext -> beforeEach: Unable to create WebCLContext, all tests will fail!");
        throw e;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLContext -> getInfo
    // 
    describe("getInfo", function() {

      it("must support getInfo(CONTEXT_NUM_DEVICES)", function() {
        expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES) > 0').toEvalAs(true);
      });

      it("must support getInfo(CONTEXT_DEVICES)", function() {
        expect('ctx.getInfo(WebCL.CONTEXT_DEVICES) instanceof Array').toEvalAs(true);
      });

      it("must throw on getInfo(CONTEXT_PROPERTIES)", function() {
        expect('ctx instanceof WebCLContext').toEvalAs(true);
        expect('ctx.getInfo(WebCL.CONTEXT_PROPERTIES)').toThrow('INVALID_VALUE');
      });

      it("must throw on getInfo(CONTEXT_REFERENCE_COUNT)", function() {
        expect('ctx instanceof WebCLContext').toEvalAs(true);
        expect('ctx.getInfo(WebCL.CONTEXT_REFERENCE_COUNT)').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLContext -> createCommandQueue
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

      it("must throw if device === <invalid>", function() {
        expect('ctx instanceof WebCLContext').toEvalAs(true);
        expect('ctx.createCommandQueue("foobar")').toThrow('INVALID_DEVICE');
        expect('ctx.createCommandQueue([])').toThrow('INVALID_DEVICE');
        expect('ctx.createCommandQueue(ctx)').toThrow('INVALID_DEVICE');
      });

      it("must throw if device === null, properties === <invalid>", function() {
        expect('ctx instanceof WebCLContext').toEvalAs(true);
        expect('ctx.createCommandQueue(null, "foobar")').toThrow('INVALID_VALUE');
        expect('ctx.createCommandQueue(null, [])').toThrow('INVALID_VALUE');
        expect('ctx.createCommandQueue(null, 0x4)').toThrow('INVALID_VALUE');
      });

      it("must throw if device === aDevice, properties === <invalid>", function() {
        expect('ctx instanceof WebCLContext').toEvalAs(true);
        expect('ctx.createCommandQueue(device, "foobar")').toThrow('INVALID_VALUE');
        expect('ctx.createCommandQueue(device, [])').toThrow('INVALID_VALUE');
        expect('ctx.createCommandQueue(device, 0x4)').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLContext -> createProgram
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

      it("must not validate or build the source", function() {
        var src = "foobar";
        program = ctx.createProgram(src);
        expect('program instanceof WebCLProgram').toEvalAs(true);
      });

      it("must throw if source === ''/null/undefined/omitted", function() {
        expect('ctx instanceof WebCLContext').toEvalAs(true);
        expect('ctx.createProgram("")').toThrow('INVALID_VALUE');
        expect('ctx.createProgram(null)').toThrow('INVALID_VALUE');
        expect('ctx.createProgram(undefined)').toThrow('INVALID_VALUE');
        expect('ctx.createProgram()').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLContext -> createBuffer
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
    // Functionality -> WebCLContext -> createImage
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
          channelType : WebCL.UNSIGNED_INT8,
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

      it("must work with width=1024, height=1", function() {
        var descriptor = { 
          channelOrder : WebCL.RGBA,
          channelType : WebCL.UNSIGNED_INT8,
          width : 1024, 
          height : 1,
          rowPitch : 0,
        };
        imageReadOnly = ctx.createImage(WebCL.MEM_READ_ONLY, descriptor);
        imageWriteOnly = ctx.createImage(WebCL.MEM_WRITE_ONLY, descriptor);
        imageReadWrite = ctx.createImage(WebCL.MEM_READ_WRITE, descriptor);
        expect('imageReadOnly instanceof WebCLImage').toEvalAs(true);
        expect('imageWriteOnly instanceof WebCLImage').toEvalAs(true);
        expect('imageReadWrite instanceof WebCLImage').toEvalAs(true);
      });

      it("must throw if rowPitch !== 0 and hostPtr === null/undefined", function() {
        descriptorFail = { width : 64, height : 64, rowPitch : 1 };
        descriptorPass = { width : 64, height : 64, rowPitch : 0 };
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, descriptorFail)').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, descriptorPass)').not.toThrow();
      });

      it("must throw if 0 < rowPitch < widthInBytes and hostPtr === <valid>", function() {
        descriptorFail = { width : 64, height : 64, rowPitch : 100 };
        descriptorPass = { width : 64, height : 64, rowPitch : 0 };
        hostPtr = new Uint8Array(64*64*4);
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, descriptorFail, hostPtr)').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, descriptorPass, hostPtr)').not.toThrow();
      });

    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLBuffer
  // 
  describe("WebCLBuffer", function() {
    
    beforeEach(function() {
      try {
        ctx = createContext();
        devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
        device = devices[0];
      } catch (e) {
        ERROR("Functionality -> WebCLBuffer -> beforeEach: Unable to create WebCLContext, all tests will fail!");
        throw e;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLImage -> getInfo
    // 
    describe("getInfo", function() {

      it("must support all query enums", function() {
        buffer = ctx.createBuffer(WebCL.MEM_READ_ONLY, 1024);
        expect('buffer instanceof WebCLBuffer').toEvalAs(true);
        expect('buffer.getInfo(WebCL.MEM_TYPE)').not.toThrow();
        expect('buffer.getInfo(WebCL.MEM_FLAGS)').not.toThrow();
        expect('buffer.getInfo(WebCL.MEM_CONTEXT)').not.toThrow();
        expect('buffer.getInfo(WebCL.MEM_ASSOCIATED_MEMOBJECT)').not.toThrow();
        expect('buffer.getInfo(WebCL.MEM_OFFSET)').not.toThrow();
      });
    });
    
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLImage
  // 
  describe("WebCLImage", function() {
    
    beforeEach(function() {
      try {
        ctx = createContext();
        devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
        device = devices[0];
      } catch (e) {
        ERROR("Functionality -> WebCLImage -> beforeEach: Unable to create WebCLContext, all tests will fail!");
        throw e;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLImage -> getInfo
    // 
    describe("getInfo", function() {

      it("must return a non-null object", function() {
        var descriptor = { width : 64, height : 64 };
        image = ctx.createImage(WebCL.MEM_READ_ONLY, descriptor);
        expect('image instanceof WebCLImage').toEvalAs(true);
        expect('image.getInfo()').not.toThrow();
        expect('image.getInfo() != null').toEvalAs(true);
      });
    });
    
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLProgram
  // 
  describe("WebCLProgram", function() {
    
    src = "kernel void dummy() {}";

    beforeEach(function() {
      try {
        ctx = createContext();
        devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
        device = devices[0];
      } catch (e) {
        ERROR("Functionality -> WebCLProgram -> beforeEach: Unable to create WebCLContext, all tests will fail!");
        throw e;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLProgram -> getInfo
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
      it("must support getInfo(PROGRAM_CONTEXT)", function() {
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
    // Functionality -> WebCLProgram -> build
    // 
    describe("build", function() {

      it("must work with an empty argument list", function() {
        program = ctx.createProgram(src);
        expect('program.build()').not.toThrow();
      });

      it("must work if devices === null", function() {
        program = ctx.createProgram(src);
        expect('program.build(null)').not.toThrow();
      });

      it("must work if devices === [ aDevice ]", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices)').not.toThrow();
      });

      it("must work if devices === [ aDevice ], options = null", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices, null)').not.toThrow();
      });

      it("must work if devices === [ aDevice ], options = ''", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices, "")').not.toThrow();
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
          expect('program.build(devices, "' + val + '")').not.toThrow();
        });
      });

      it("must work if devices = [ aDevice ],  options === '-cl-opt-disable -Werror'", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices, "-cl-opt-disable -Werror")').not.toThrow();
      });

      it("must throw if devices === []", function() {
        program = ctx.createProgram(src);
        expect('program instanceof WebCLProgram').toEvalAs(true);
        expect('program.build([])').toThrow('INVALID_VALUE');
      });

      // This test is known to crash on Intel OpenCL / Win7 -- but
      // not when run separately from the rest of the build() tests
      // --> moved to Crash tests until we have a fix or workaround
      xit("must throw if options === '-invalid-option'", function() {
        program = ctx.createProgram(src);
        expect('program instanceof WebCLProgram').toEvalAs(true);
        expect('program.build(devices, "-invalid-option")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(null, "-invalid-option")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(undefined, "-invalid-option")').toThrow('INVALID_BUILD_OPTIONS');
      });

      it("must throw if kernel source is obviously invalid", function() {
        var src = "obviously invalid";
        program = ctx.createProgram(src);
        expect('program instanceof WebCLProgram').toEvalAs(true);
        expect('program.build()').toThrow('BUILD_PROGRAM_FAILURE');
        expect('program.build(null)').toThrow('BUILD_PROGRAM_FAILURE');
        expect('program.build(devices)').toThrow('BUILD_PROGRAM_FAILURE');
        expect('program.build(devices, "-w")').toThrow('BUILD_PROGRAM_FAILURE');
      });

      it("must throw if kernel source is slightly invalid", function() {
        var src = "kernel int dummy() {}";
        program = ctx.createProgram(src);
        expect('program instanceof WebCLProgram').toEvalAs(true);
        expect('program.build()').toThrow('BUILD_PROGRAM_FAILURE');
        expect('program.build(null)').toThrow('BUILD_PROGRAM_FAILURE');
        expect('program.build(devices)').toThrow('BUILD_PROGRAM_FAILURE');
        expect('program.build(devices, "-w")').toThrow('BUILD_PROGRAM_FAILURE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLProgram -> getBuildInfo
    // 
    describe("getBuildInfo", function() {

      it("must support PROGRAM_BUILD_STATUS", function() {
        program = ctx.createProgram(src);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').not.toThrow();
      });

      it("must support PROGRAM_BUILD_STATUS === BUILD_NONE", function() {
        program = ctx.createProgram(src);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS) === WebCL.BUILD_NONE').toEvalAs(true);
      });

      it("must support PROGRAM_BUILD_STATUS === BUILD_SUCCESS", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS) === WebCL.BUILD_SUCCESS').toEvalAs(true);
      });

      it("must support PROGRAM_BUILD_STATUS === BUILD_ERROR", function() {
        var src = "obviously invalid";
        program = ctx.createProgram(src);
        expect('program.build(devices)').toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS) === WebCL.BUILD_ERROR').toEvalAs(true);
      });

      it("must support PROGRAM_BUILD_LOG before build()", function() {
        program = ctx.createProgram(src);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG)').not.toThrow();
        expect('typeof program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG) === "string"').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).length === 0').toEvalAs(true);
      });

      it("must support PROGRAM_BUILD_LOG after build()", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG)').not.toThrow();
        expect('typeof program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG) === "string"').toEvalAs(true);
      });

      it("must report errors in PROGRAM_BUILD_LOG", function() {
        var src = "obviously invalid";
        program = ctx.createProgram(src);
        expect('program.build(devices)').toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).length > 0').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).indexOf("error") !== -1').toEvalAs(true);
      });
        
      it("must support PROGRAM_BUILD_OPTIONS with empty options", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('typeof program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS) === "string"').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS).length === 0').toEvalAs(true);
      });

      it("must support PROGRAM_BUILD_OPTIONS with non-empty options", function() {
        program = ctx.createProgram(src);
        expect('program.build(devices, "-w -D foo=0xdeadbeef")').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS) === "-w -D foo=0xdeadbeef"').toEvalAs(true);
      });

      it("must throw if device === undefined/null/<invalid>", function() {
        program = ctx.createProgram(src);
        expect('program instanceof WebCLProgram').toEvalAs(true);
        expect('program.getBuildInfo("foobar", WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_DEVICE');
        expect('program.getBuildInfo([], WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_DEVICE');
        expect('program.getBuildInfo(null, WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_DEVICE');
        expect('program.getBuildInfo(undefined, WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_DEVICE');
        expect('program.getBuildInfo(undefined, WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_DEVICE');
      });

      it("must throw if name === omitted/undefined/null/<invalid>", function() {
        program = ctx.createProgram(src);
        expect('program instanceof WebCLProgram').toEvalAs(true);
        expect('program.getBuildInfo(device)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, undefined)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, null)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, 0)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, -1)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, 0x1180)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, 0x1184)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, WebCL.PROGRAM_NUM_DEVICES)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, "foobar")').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, device)').toThrow('INVALID_VALUE');
      });

    });
    
  });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLKernel
  // 
  describe("WebCLKernel", function() {
    
    src = "kernel void dummy() {}";

    beforeEach(function() {
      try {
        ctx = createContext();
        devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
        device = devices[0];
      } catch (e) {
        ERROR("Functionality -> WebCLKernel -> beforeEach: Unable to create WebCLContext, all tests will fail!");
        throw e;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLKernel -> getWorkGroupInfo
    // 
    describe("getWorkGroupInfo", function() {

      it("must support KERNEL_WORK_GROUP_SIZE", function() {
        program = ctx.createProgram(src);
        program.build(devices);
        kernel = program.createKernelsInProgram()[0];
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_WORK_GROUP_SIZE)').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_WORK_GROUP_SIZE) >= 1').toEvalAs(true);
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLKernel -> setArg
    // 
    describe("setArg", function() {

      src = loadSource('kernels/argtypes.cl');
      
      beforeEach(function() {
        program = ctx.createProgram(src);
        expect('program.build(devices)').not.toThrow();
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, 128);
        expect('buffer instanceof WebCLBuffer').toEvalAs(true);
        image = ctx.createImage(WebCL.MEM_READ_WRITE, { width: 32, height: 32 });
        expect('image instanceof WebCLImage').toEvalAs(true);
        sampler = ctx.createSampler(true, WebCL.ADDRESS_REPEAT, WebCL.FILTER_NEAREST);
        expect('sampler instanceof WebCLSampler').toEvalAs(true);
      });

      it("setArg(index, clObject) must not throw if clObject matches the expected type", function() {
        kernel = program.createKernel('objects');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(0, buffer)').not.toThrow();
        expect('kernel.setArg(1, image)').not.toThrow();
        expect('kernel.setArg(2, image)').not.toThrow();
        expect('kernel.setArg(3, sampler)').not.toThrow();
      });

      it("setArg(index, clObject) must throw if clObject does not match the expected type (CRITICAL)", function() {
        kernel = program.createKernel('objects');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(0, image)').toThrow();
        expect('kernel.setArg(0, sampler)').toThrow();
        expect('kernel.setArg(1, buffer)').toThrow();
        expect('kernel.setArg(1, sampler)').toThrow();
        expect('kernel.setArg(2, buffer)').toThrow();
        expect('kernel.setArg(2, sampler)').toThrow();
        expect('kernel.setArg(3, buffer)').toThrow();
        expect('kernel.setArg(3, image)').toThrow();
      });

      it("setArg(index, clObject) must throw if an arbitrary integer is passed in (CRITICAL)", function() {
        kernel = program.createKernel('objects');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(0, new Uint32Array(1))').toThrow('INVALID_MEM_OBJECT');
        expect('kernel.setArg(0, new Uint32Array(2))').toThrow('INVALID_MEM_OBJECT');
        expect('kernel.setArg(1, new Uint32Array(1))').toThrow('INVALID_MEM_OBJECT');
        expect('kernel.setArg(1, new Uint32Array(2))').toThrow('INVALID_MEM_OBJECT');
        expect('kernel.setArg(3, new Uint32Array(1))').toThrow('INVALID_SAMPLER');
        expect('kernel.setArg(3, new Uint32Array(2))').toThrow('INVALID_SAMPLER');
      });

      it("setArg(index, value) must not throw if value matches the expected scalar type", function() {
        kernel = program.createKernel('scalars');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Int8Array(1))').not.toThrow();    // char
        expect('kernel.setArg(2, new Int16Array(1))').not.toThrow();   // short
        expect('kernel.setArg(3, new Int32Array(1))').not.toThrow();   // int
        expect('kernel.setArg(4, new Uint32Array(2))').not.toThrow();  // long
        expect('kernel.setArg(5, new Uint8Array(1))').not.toThrow();   // uchar
        expect('kernel.setArg(6, new Uint16Array(1))').not.toThrow();  // ushort
        expect('kernel.setArg(7, new Uint32Array(1))').not.toThrow();  // uint
        expect('kernel.setArg(8, new Uint32Array(2))').not.toThrow();  // ulong
        expect('kernel.setArg(9, new Float32Array(1))').not.toThrow(); // float
      });

      it("setArg(index, value) must not throw if value matches the expected vector type", function() {
        kernel = program.createKernel('vectors');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Int8Array(4))').not.toThrow();    // char4
        expect('kernel.setArg(2, new Int16Array(4))').not.toThrow();   // short4
        expect('kernel.setArg(3, new Int32Array(4))').not.toThrow();   // int4
        expect('kernel.setArg(4, new Uint32Array(8))').not.toThrow();  // long4
        expect('kernel.setArg(5, new Uint8Array(4))').not.toThrow();   // uchar4
        expect('kernel.setArg(6, new Uint16Array(4))').not.toThrow();  // ushort4
        expect('kernel.setArg(7, new Uint32Array(4))').not.toThrow();  // uint4
        expect('kernel.setArg(8, new Uint32Array(8))').not.toThrow();  // ulong4
        expect('kernel.setArg(9, new Float32Array(4))').not.toThrow(); // float4
      });

      it("setArg(index, value) must throw if value is not an ArrayBufferView (CRITICAL)", function() {
        kernel = program.createKernel('scalars');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(3, new ArrayBuffer(4))').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(4, new ArrayBuffer(8))').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(3, [42])').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(4, [42])').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(3, 42)').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(4, 42)').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(3, {})').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(4, {})').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(3, buffer)').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(4, buffer)').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(3, image)').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(4, image)').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(3, sampler)').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(4, sampler)').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(3, kernel)').toThrow('INVALID_ARG_VALUE');
        expect('kernel.setArg(4, kernel)').toThrow('INVALID_ARG_VALUE');
      });

      it("setArg(index, value) must throw if value does not match the expected scalar size", function() {
        kernel = program.createKernel('scalars');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Int8Array(0))').toThrow('INVALID_ARG_SIZE');    // char
        expect('kernel.setArg(1, new Int8Array(2))').toThrow('INVALID_ARG_SIZE');    // char
        expect('kernel.setArg(2, new Int16Array(2))').toThrow('INVALID_ARG_SIZE');   // short
        expect('kernel.setArg(3, new Int32Array(2))').toThrow('INVALID_ARG_SIZE');   // int
        expect('kernel.setArg(4, new Uint32Array(1))').toThrow('INVALID_ARG_SIZE');  // long
        expect('kernel.setArg(4, new Uint32Array(3))').toThrow('INVALID_ARG_SIZE');  // long
        expect('kernel.setArg(5, new Uint8Array(2))').toThrow('INVALID_ARG_SIZE');   // uchar
        expect('kernel.setArg(6, new Uint16Array(2))').toThrow('INVALID_ARG_SIZE');  // ushort
        expect('kernel.setArg(7, new Uint32Array(2))').toThrow('INVALID_ARG_SIZE');  // uint
        expect('kernel.setArg(8, new Uint32Array(1))').toThrow('INVALID_ARG_SIZE');  // ulong
        expect('kernel.setArg(8, new Uint32Array(1))').toThrow('INVALID_ARG_SIZE');  // ulong
        expect('kernel.setArg(9, new Float32Array(2))').toThrow('INVALID_ARG_SIZE'); // float
      });

      it("setArg(index, value) must throw if value does not match the expected vector size", function() {
        kernel = program.createKernel('vectors');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Int8Array(5))').toThrow('INVALID_ARG_SIZE');    // char4
        expect('kernel.setArg(2, new Int16Array(5))').toThrow('INVALID_ARG_SIZE');   // short4
        expect('kernel.setArg(3, new Int32Array(5))').toThrow('INVALID_ARG_SIZE');   // int4
        expect('kernel.setArg(4, new Uint32Array(9))').toThrow('INVALID_ARG_SIZE');  // long4
        expect('kernel.setArg(5, new Uint8Array(3))').toThrow('INVALID_ARG_SIZE');   // uchar4
        expect('kernel.setArg(6, new Uint16Array(3))').toThrow('INVALID_ARG_SIZE');  // ushort4
        expect('kernel.setArg(7, new Uint32Array(3))').toThrow('INVALID_ARG_SIZE');  // uint4
        expect('kernel.setArg(8, new Uint32Array(4))').toThrow('INVALID_ARG_SIZE');  // ulong4
        expect('kernel.setArg(8, new Uint32Array(16))').toThrow('INVALID_ARG_SIZE');  // ulong4
        expect('kernel.setArg(9, new Float32Array(3))').toThrow('INVALID_ARG_SIZE'); // float4
      });

      it("setArg(index, value) must throw if value type is wrong, even if the size is right", function() {
        kernel = program.createKernel('scalars');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Uint8Array(1))').toThrow('INVALID_ARG_VALUE');    // char
        expect('kernel.setArg(2, new Uint16Array(1))').toThrow('INVALID_ARG_VALUE');   // short
        expect('kernel.setArg(2, new Uint8Array(2))').toThrow('INVALID_ARG_VALUE');    // short
        expect('kernel.setArg(2, new Int8Array(2))').toThrow('INVALID_ARG_VALUE');     // short
        expect('kernel.setArg(3, new Uint32Array(1))').toThrow('INVALID_ARG_VALUE');   // int
        expect('kernel.setArg(3, new Uint16Array(2))').toThrow('INVALID_ARG_VALUE');   // int
        expect('kernel.setArg(3, new Int16Array(2))').toThrow('INVALID_ARG_VALUE');    // int
        expect('kernel.setArg(3, new Uint8Array(4))').toThrow('INVALID_ARG_VALUE');    // int
        expect('kernel.setArg(3, new Int8Array(4))').toThrow('INVALID_ARG_VALUE');     // int
        expect('kernel.setArg(3, new Float32Array(1))').toThrow('INVALID_ARG_VALUE');  // int
        expect('kernel.setArg(4, new Float32Array(2))').toThrow('INVALID_ARG_VALUE');  // long
      });

      it("setArg(index, value) must not throw if a local memory size is passed in using Uint32Array(1)", function() {
        kernel = program.createKernel('localmem');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Uint32Array([10]))').not.toThrow();
      });

      it("setArg(index, value) must throw if a local memory size is passed in using anything but Uint32Array(1)", function() {
        kernel = program.createKernel('localmem');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Int32Array(1))').toThrow();
        expect('kernel.setArg(1, new Uint16Array(2))').toThrow();
        expect('kernel.setArg(1, new ArrayBuffer(4))').toThrow();
        expect('kernel.setArg(1, new Uint32Array(0))').toThrow();
        expect('kernel.setArg(1, new Uint32Array(2))').toThrow();
        expect('kernel.setArg(1, [42])').toThrow();
        expect('kernel.setArg(1, 42)').toThrow();
        expect('kernel.setArg(1, {})').toThrow();
        expect('kernel.setArg(1, buffer)').toThrow();
        expect('kernel.setArg(1, image)').toThrow();
        expect('kernel.setArg(1, sampler)').toThrow();
        expect('kernel.setArg(1, kernel)').toThrow();
      });

      it("setArg(index, value) must throw if attempting to set local memory size to zero", function() {
        kernel = program.createKernel('localmem');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Uint32Array([0]))').toThrow('INVALID_ARG_SIZE');
      });

    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLCommandQueue
  // 
  describe("WebCLCommandQueue", function() {
    
    // This test is known to crash on Win7
    // --> moved to Crash tests until we have a fix or workaround
    it("must support getInfo(QUEUE_CONTEXT)", function() {
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
    // Functionality -> WebCLCommandQueue -> enqueueNDRangeKernel
    // 
    describe("enqueueNDRangeKernel", function() {

      beforeEach(function() {
        try {
          ctx = createContext();
          queue = ctx.createCommandQueue(null, 0);
          src = "kernel void dummy() {}";
          program = ctx.createProgram(src);
          devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
          program.build(devices);
          kernel = program.createKernelsInProgram()[0];
        } catch (e) {
          ERROR("Functionality -> WebCLCommandQueue -> enqueueNDRangeKernel -> beforeEach: Unable to create WebCLContext, all tests will fail!");
          throw e;
        }
      });
      
      it("must work if all arguments are fully specified", function() {
        event = new WebCLEvent();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], [], event); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1, 1], [1, 1], [], event); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, [0, 0, 0], [1, 1, 1], [1, 1, 1], [], event); queue.finish()').not.toThrow();
      });

      it("must work if event === null/undefined/omitted", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], [], null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], []); queue.finish()').not.toThrow();
      });

      it("must work if eventWaitList === []/null/undefined/omitted", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], []); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], undefined); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1]); queue.finish()').not.toThrow();
      });

      it("must work if localWorkSize === null/undefined/omitted", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], undefined); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1]); queue.finish()').not.toThrow();
      });

      it("must work if globalWorkOffset === null/undefined", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1], [1]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, undefined, [1], [1]); queue.finish()').not.toThrow();
      });

      it("must work with all-default arguments", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1]); queue.finish()').not.toThrow();
      });

      it("must throw if kernel is not a valid WebCLKernel", function() {
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
        expect('queue.enqueueNDRangeKernel("foo", 1, [0], [1], [1])').toThrow('INVALID_KERNEL');
        expect('queue.enqueueNDRangeKernel(ctx, 1, [0], [1], [1])').toThrow('INVALID_KERNEL');
      });

      it("must throw if workDim is not equal to 1, 2, or 3", function() {
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
        expect('queue.enqueueNDRangeKernel(kernel, 0, [0], [1], [1])').toThrow('INVALID_WORK_DIMENSION')
        expect('queue.enqueueNDRangeKernel(kernel, 4, [0, 0, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1])').toThrow('INVALID_WORK_DIMENSION');
      });

      it("must throw if globalWorkSize.length != workDim", function() {
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1, 1], [1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1], [1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1, 1, 1], [1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 3, [0, 0, 0], [1, 1], [1, 1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 3, [0, 0, 0], [1, 1, 1, 1], [1, 1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
      });

      it("must throw if globalWorkSize[i] > 2^32-1", function() {
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [0xffffffff+1], [1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1, 0xffffffff+1], [1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLCommandQueue -> enqueueReadImage
    // 
    describe("enqueueRead", function() {

      beforeEach(function() {
        try {
          W = 32;
          H = 32;
          BPP = 4;
          bytesPerRow = BPP*W;
          ctx = createContext();
          queue = ctx.createCommandQueue(null, 0);
          descriptor = { width : W, height : H };
          pixels = new Uint8Array(W*H*BPP);
          image = ctx.createImage(WebCL.MEM_READ_WRITE, descriptor);
          buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, W*H*BPP);
          if (!image instanceof WebCLImage || !buffer instanceof WebCLBuffer)
            throw { name: "TEST_SUITE_FAILURE", message: "beforeEach: Unable to create WebCL resources, all tests will fail!" };
        } catch (e) {
          ERROR("Functionality -> WebCLCommandQueue -> enqueueRead -> beforeEach: Unable to create WebCL resources, all tests will fail!");
          throw e;
        }
      });

      it("enqueueReadImage(<valid arguments>) must not throw", function() {
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, pixels)').not.toThrow();
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], bytesPerRow, pixels)').not.toThrow();
      });

      it("enqueueReadImage(<invalid image>) must throw", function() {
        expect('queue.enqueueReadImage(undefined, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage(null, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage({}, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage([], true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage(ctx, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage(queue, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage(buffer, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
      });

      it("enqueueReadImage(<image from another context>) must throw", function() {
        ctx2 = createContext();
        queue2 = ctx2.createCommandQueue(null, 0);
        expect('queue2.enqueueReadImage(image, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_CONTEXT');
      });

      it("enqueueReadImage(<invalid blockingRead>) must throw", function() { // TODO what exception type?
        expect('queue.enqueueReadImage(image, undefined, [0,0], [W, H], 0, pixels)').toThrow();
        expect('queue.enqueueReadImage(image, null, [0,0], [W, H], 0, pixels)').toThrow();
        expect('queue.enqueueReadImage(image, "foo", [0,0], [W, H], 0, pixels)').toThrow();
        expect('queue.enqueueReadImage(image, 0, [0,0], [W, H], 0, pixels)').toThrow();
      });

      it("enqueueReadImage(<invalid origin>) must throw", function() {
        expect('queue.enqueueReadImage(image, true, undefined, [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, null, [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0, 0, 0], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0, null], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0, "foo"], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0, -1], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
      });

      it("enqueueReadImage(<invalid region>) must throw", function() {
        expect('queue.enqueueReadImage(image, true, [0,0], undefined, 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], null, 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H, 1], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, null], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, "foo"], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, -1], 0, pixels)').toThrow('INVALID_VALUE');
      });

      it("enqueueReadImage(<invalid hostRowPitch>) must throw", function() {
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], -1, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], bytesPerRow-1, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], undefined, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], null, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], "foo", pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], [], pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], {}, pixels)').toThrow('INVALID_VALUE');
      });

      it("enqueueReadImage(<invalid hostPtr>) must throw", function() {
      });

      it("enqueueReadImage(<image region out-of-bounds>) must throw", function() {
      });

      it("enqueueReadImage(<hostPtr region out-of-bounds>) must throw", function() {
      });

    });
      
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> Kernel language
  // 
  describe("Kernel language", function() {

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> Kernel language -> Validator
    // 
    describe("Validator", function() {

      it("must not allow 'goto'", function() {
        expect('kernels/goto.cl').not.toBuild();
      });

      it("must not allow 'printf'", function() {
        expect('kernels/printf.cl').not.toBuild();
      });

      it("must not allow kernel-to-kernel calls", function() {
        expect('kernels/kernel-to-kernel.cl').not.toBuild();
      });

      it("must not allow CLK_ADDRESS_NONE", function() {
        expect('kernels/illegalSampler1.cl').not.toBuild();
      });

      it("must not allow CLK_NORMALIZED_COORDS_FALSE | CLK_ADDRESS_MODE_REPEAT", function() {
        expect('kernels/illegalSampler2.cl').not.toBuild();
      });

      // Performs an out-of-bounds write to an int variable through a long
      // pointer. The WebCL validator should catch the illegal pointer cast
      // from int* to long*.
      //
      it("must not allow casting an int* to long*", function() {
        expect('kernels/pointerSizeCast.cl').not.toBuild();
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> Kernel language -> Compiler
    // 
    describe("Compiler (OpenCL 1.1)", function() {

      // Known failures as of 2014-02-12:
      //  * <none>
      //
      it("must not allow 'memcpy'", function() {
        expect('kernels/memcpy.cl').not.toBuild();
      });

      // Known failures as of 2014-02-12:
      //  * Win7 / NVIDIA GPU driver
      //  * Win7 / Intel CPU driver
      //
      it("must not allow 'extern'", function() {
        expect('kernels/extern.cl').not.toBuild();
      });

      // Known failures as of 2014-02-05:
      //  * Win7 / NVIDIA GPU driver
      //  * Win7 / Intel CPU driver
      //
      it("must not allow pointer casts between address spaces", function() {
        expect('kernels/pointerAddressSpaceCast.cl').not.toBuild();
      });

      // Known failures as of 2014-02-05:
      //  * Win7 / NVIDIA GPU driver
      //  * Win7 / Intel CPU driver
      //
      it("must not allow the 'extern' keyword", function() {
        expect('kernels/externQualifier.cl').not.toBuild();
      });

      // Known failures as of 2014-02-05:
      //  * <none>
      //
      it("must not allow initializing 'local' variables", function() {
        expect('kernels/localMemInit.cl').not.toBuild();
      });

      // Known failures as of 2014-02-05:
      //  * Win7 / NVIDIA GPU driver
      //  * Win7 / Intel CPU driver
      //
      it("must not allow declaring 'local' variables in inner scope", function() {
        expect('kernels/localMemAlloc.cl').not.toBuild();
      });

      // Known failures as of 2014-02-05:
      //  * <none>
      //
      it("must not allow dynamic memory allocation", function() {
        expect('kernels/dynamicArray.cl').not.toBuild();
      });

      // Known failures as of 2014-02-05:
      //  * Win7 / NVIDIA GPU driver
      //  * Win7 / Intel CPU driver
      //
      it("must not allow local memory pointer as return value", function() {
        expect('kernels/localMemReturn.cl').not.toBuild();
      });

      // Known failures as of 2014-02-05:
      //  * <none>
      //
      it("must not allow writing to 'constant' address space", function() {
        expect('kernels/constantWrite.cl').not.toBuild();
      });

      // Known failures as of 2014-02-05:
      //  * Win7 / NVIDIA GPU driver
      //  * Win7 / Intel CPU driver
      //
      it("must not allow allocating 6 GB of 'private' memory", function() {
        expect('kernels/largeArrayPrivate.cl').not.toBuild();
      });

      // Known failures as of 2014-02-12:
      //  * Win7 / NVIDIA GPU driver (crashes on second run)
      //  * Win7 / Intel CPU driver (freezes on first run)
      //
      xit("must not allow allocating 6 GB of 'local' memory", function() {
        expect('kernels/largeArrayLocal.cl').not.toBuild();
      });

      // Known failures as of 2014-02-12:
      //  * <none>
      //
      it("must not allow allocating 6 GB of 'global' memory", function() {
        expect('kernels/largeArrayGlobal.cl').not.toBuild();
      });

    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> Robustness
  // 
  describe("Robustness", function() {

    it("must not crash or throw when calling release() more than once (CRITICAL)", function()  {
      ctx = createContext();
      ctx.release();
      expect('ctx.release()').not.toThrow();
    });

    it("must throw when trying to use an object that has been released", function() {
      ctx = createContext();
      ctx.release();
      expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES)').toThrow('WEBCL_IMPLEMENTATION_FAILURE');
    });

    // This test is known to crash on Intel OpenCL / Win7
    // --> moved to Crash tests until we have a fix or workaround
    it("build() must throw if options === '-invalid-option'", function() {
      ctx = createContext();
      program = ctx.createProgram(src);
      devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
      expect('program instanceof WebCLProgram').toEvalAs(true);
      expect('program.build(devices, "-invalid-option")').toThrow('INVALID_BUILD_OPTIONS');
      expect('program.build(null, "-invalid-option")').toThrow('INVALID_BUILD_OPTIONS');
      expect('program.build(undefined, "-invalid-option")').toThrow('INVALID_BUILD_OPTIONS');
    });

    // Known failures as of 2014-02-12:
    //  * Win7 / NVIDIA GPU driver (crashes on second run)
    //  * Win7 / Intel CPU driver (freezes on first run)
    //
    xit("must not allow allocating 6 GB of 'local' memory", function() {
      expect('kernels/largeArrayLocal.cl').not.toBuild();
    });

  });

  //////////////////////////////////////////////////////////////////////////////

  beforeEach(addCustomMatchers);

  afterEach(function() { 
    //testSuiteTrace(this);
    releaseAll();
  });

});
