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
  // Functionality -> createContext
  // 
  describe("createContext", function() {

    beforeEach(function() {
      self = self || {};
      try {
        aPlatform = webcl.getPlatforms()[0];
        aDevice = aPlatform.getDevices()[0];
        self.preconditions = true;
      } catch (e) {
        ERROR("createContext -> beforeEach: Caught exception " + e);
        ERROR("createContext -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
        self.preconditions = false;
      }
    });

    it("createContext() must not throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext()').not.toThrow();
      expect('webcl.createContext(undefined)').not.toThrow();
    });

    it("createContext(DEVICE_TYPE_DEFAULT) must not throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext(WebCL.DEVICE_TYPE_DEFAULT)').not.toThrow();
    });

    it("createContext(CPU || GPU || ACCELERATOR) must not throw", function() {
      if (!self.preconditions) pending();
      var types = [ WebCL.DEVICE_TYPE_CPU, WebCL.DEVICE_TYPE_GPU, WebCL.DEVICE_TYPE_ACCELERATOR ];
      for (var t=0, found=false; t < types.length && !found; t++) {
        try {
          ctx = webcl.createContext(types[t]);
        } catch (e) {
          if (e.name !== 'DEVICE_NOT_FOUND') throw e;
        }
      }
      expect(ctx instanceof WebCLContext).toBeTruthy();
    });

    it("createContext(aPlatform) must not throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext(aPlatform)').not.toThrow();
    });

    it("createContext(aPlatform, CPU || GPU || ACCELERATOR) must not throw", function() {
      if (!self.preconditions) pending();
      var types = [ WebCL.DEVICE_TYPE_CPU, WebCL.DEVICE_TYPE_GPU, WebCL.DEVICE_TYPE_ACCELERATOR ];
      for (var t=0, found=false; t < types.length && !found; t++) {
        try {
          ctx = webcl.createContext(aPlatform, types[t]);
        } catch (e) {
          if (e.name !== 'DEVICE_NOT_FOUND') throw e;
        }
      }
      expect(ctx instanceof WebCLContext).toBeTruthy();
    });

    it("createContext(aDevice) must not throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext(aDevice)').not.toThrow();
    });

    it("createContext([aDevice]) must not throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext([aDevice])').not.toThrow();
    });

    it("createContext(aPlatform, DEVICE_TYPE_ALL) must not throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext(aPlatform, WebCL.DEVICE_TYPE_ALL)').not.toThrow();
    });

    it("createContext(DEVICE_TYPE_ACCELERATOR) must throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext(WebCL.DEVICE_TYPE_ACCELERATOR)').toThrow('DEVICE_NOT_FOUND');
    });

    it("createContext(aPlatform, DEVICE_TYPE_ACCELERATOR) must throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext(aPlatform, WebCL.DEVICE_TYPE_ACCELERATOR)').toThrow('DEVICE_NOT_FOUND');
    });

    it("createContext(<invalid deviceType>) must throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext(WebCL.DEVICE_TYPE_ALL)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(0)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(0x1234)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(null)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext("")').toThrow('INVALID_DEVICE_TYPE');
    });

    it("createContext(aPlatform, <invalid deviceType>) must throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext(aPlatform, 0)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(aPlatform, 0x1234)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(aPlatform, null)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(aPlatform, "")').toThrow('INVALID_DEVICE_TYPE');
    });

    it("createContext(<invalid device or platform>) must throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext({})').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(webcl)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(WebCL)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(WebCLDevice)').toThrow('INVALID_DEVICE_TYPE');
    });

    it("createContext(<invalid device array>) must throw", function() {
      if (!self.preconditions) pending();
      expect('webcl.createContext([])').toThrow('INVALID_VALUE');
      expect('webcl.createContext([undefined])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([null])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([1])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([""])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([webcl])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([WebCLDevice])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([aPlatform])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([aDevice, undefined])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([aDevice, null])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([aDevice, []])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([aDevice, ""])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([aDevice, aPlatform])').toThrow('INVALID_DEVICE');
      expect('webcl.createContext([aDevice, WebCLDevice])').toThrow('INVALID_DEVICE');
    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLContext
  // 
  describe("WebCLContext", function() {

    beforeEach(function() {
      self = self || {};
      try {
        ctx = createContext();
        device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
        self.preconditions = true;
      } catch (e) {
        ERROR("WebCLContext -> beforeEach: Caught exception " + e);
        ERROR("WebCLContext -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
        self.preconditions = false;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLContext -> getInfo
    // 
    describe("getInfo", function() {

      it("getInfo(<validEnum>) must work", function() {
        if (!self.preconditions) pending();
        expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES)').not.toThrow();
        expect('ctx.getInfo(WebCL.CONTEXT_DEVICES)').not.toThrow();
        expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES) === 1').toEvalAs(true);
        expect('ctx.getInfo(WebCL.CONTEXT_DEVICES).length === 1').toEvalAs(true);
        expect('ctx.getInfo(WebCL.CONTEXT_DEVICES)[0] === device').toEvalAs(true);
      });

      it("getInfo(<invalidEnum>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.getInfo()').toThrow('INVALID_VALUE');
        expect('ctx.getInfo(0)').toThrow('INVALID_VALUE');
        expect('ctx.getInfo(3)').toThrow('INVALID_VALUE');
        expect('ctx.getInfo(0x1001)').toThrow('INVALID_VALUE');
        expect('ctx.getInfo(-1)').toThrow('INVALID_VALUE');
        expect('ctx.getInfo("")').toThrow('INVALID_VALUE');
        expect('ctx.getInfo([])').toThrow('INVALID_VALUE');
        expect('ctx.getInfo({})').toThrow('INVALID_VALUE');
        expect('ctx.getInfo(ctx)').toThrow('INVALID_VALUE');
        expect('ctx.getInfo(WebCL.CONTEXT_REFERENCE_COUNT)').toThrow('INVALID_VALUE');
        expect('ctx.getInfo(WebCL.CONTEXT_PROPERTIES)').toThrow('INVALID_VALUE');
      });

      it("getSupportedImageFormats(<validEnum>) must work", function() {
        if (!self.preconditions) pending();
        expect('ctx.getSupportedImageFormats()').not.toThrow();
        expect('ctx.getSupportedImageFormats() instanceof Array').toEvalAs(true);
        expect('ctx.getSupportedImageFormats().length >= 10').toEvalAs(true);
        expect('ctx.getSupportedImageFormats()[0] instanceof WebCLImageDescriptor').toEvalAs(true);
        expect('ctx.getSupportedImageFormats(WebCL.MEM_READ_WRITE)').not.toThrow();
        expect('ctx.getSupportedImageFormats(WebCL.MEM_WRITE_ONLY)').not.toThrow();
        expect('ctx.getSupportedImageFormats(WebCL.MEM_READ_ONLY)').not.toThrow();
      });

      it("getSupportedImageFormats() must be equivalent to getSupportedImageFormats(MEM_READ_WRITE)", function() {
        if (!self.preconditions) pending();
        formats = ctx.getSupportedImageFormats();
        formatsReadWrite = ctx.getSupportedImageFormats(WebCL.MEM_READ_WRITE);
        expect('formats.length').toEvalAs('formatsReadWrite.length');
        for (i=0; i < formats.length; i++) {
          expect('formats[i].channelOrder === formatsReadWrite[i].channelOrder').toEvalAs(true);
          expect('formats[i].channelType === formatsReadWrite[i].channelType').toEvalAs(true);
        }
      });

      it("getSupportedImageFormats(<validEnum>) must return the mandatory formats", function() {
        if (!self.preconditions) pending();
        function rgbaFilter(item) { return (item.channelOrder === WebCL.RGBA); }
        rgbaFormatsReadWrite = ctx.getSupportedImageFormats(WebCL.MEM_READ_WRITE).filter(rgbaFilter);
        rgbaFormatsReadWrite = ctx.getSupportedImageFormats(WebCL.MEM_READ_WRITE).filter(rgbaFilter);
        rgbaFormatsWriteOnly = ctx.getSupportedImageFormats(WebCL.MEM_WRITE_ONLY).filter(rgbaFilter);
        rgbaFormatsReadOnly = ctx.getSupportedImageFormats(WebCL.MEM_READ_ONLY).filter(rgbaFilter);
        expect('rgbaFormatsReadWrite.length >= 10').toEvalAs(true);
        expect('rgbaFormatsWriteOnly.length >= 10').toEvalAs(true);
        expect('rgbaFormatsReadOnly.length >= 10').toEvalAs(true);
      });

      it("getSupportedImageFormats(<invalidEnum>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.getSupportedImageFormats(0)').toThrow('INVALID_VALUE');
        expect('ctx.getSupportedImageFormats(3)').toThrow('INVALID_VALUE');
        expect('ctx.getSupportedImageFormats(5)').toThrow('INVALID_VALUE');
        expect('ctx.getSupportedImageFormats(6)').toThrow('INVALID_VALUE');
        expect('ctx.getSupportedImageFormats(0x1001)').toThrow('INVALID_VALUE');
        expect('ctx.getSupportedImageFormats(-1)').toThrow('INVALID_VALUE');
        expect('ctx.getSupportedImageFormats("")').toThrow('INVALID_VALUE');
        expect('ctx.getSupportedImageFormats([])').toThrow('INVALID_VALUE');
        expect('ctx.getSupportedImageFormats({})').toThrow('INVALID_VALUE');
        expect('ctx.getSupportedImageFormats(ctx)').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLContext -> createCommandQueue
    // 
    describe("createCommandQueue", function() {

      it("createCommandQueue(<validDevice>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createCommandQueue()').not.toThrow();
        expect('ctx.createCommandQueue(undefined)').not.toThrow();
        expect('ctx.createCommandQueue(null)').not.toThrow();
        expect('ctx.createCommandQueue(device)').not.toThrow();
        expect('ctx.createCommandQueue(undefined, 0)').not.toThrow();
        expect('ctx.createCommandQueue(null, 0)').not.toThrow();
        expect('ctx.createCommandQueue(device, 0)').not.toThrow();
      });

      it("createCommandQueue(<validDevice>, <supportedProperties>) must not throw", function() {
        if (!self.preconditions) pending();
        supportedProperties = device.getInfo(WebCL.DEVICE_QUEUE_PROPERTIES);
        expect('ctx.createCommandQueue(device, supportedProperties)').not.toThrow();
      });

      it("createCommandQueue(<validDevice>, <invalidProperties>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createCommandQueue(null, "foobar")').toThrow('INVALID_VALUE');
        expect('ctx.createCommandQueue(null, "")').toThrow('INVALID_VALUE');
        expect('ctx.createCommandQueue(null, [])').toThrow('INVALID_VALUE');
        expect('ctx.createCommandQueue(null, 0x4)').toThrow('INVALID_VALUE');
        expect('ctx.createCommandQueue(device, "foobar")').toThrow('INVALID_VALUE');
        expect('ctx.createCommandQueue(device, "")').toThrow('INVALID_VALUE');
        expect('ctx.createCommandQueue(device, [])').toThrow('INVALID_VALUE');
        expect('ctx.createCommandQueue(device, 0x4)').toThrow('INVALID_VALUE');
      });

      it("createCommandQueue(<validDevice>, <unsupportedProperties>) must throw", function() {
        if (!self.preconditions) pending();
        allProperties = WebCL.QUEUE_PROFILING_ENABLE | WebCL.QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE;
        supportedProperties = device.getInfo(WebCL.DEVICE_QUEUE_PROPERTIES);
        if (allProperties !== supportedProperties)
          expect('ctx.createCommandQueue(device, allProperties)').toThrow('INVALID_QUEUE_PROPERTIES');
        else 
          expect('ctx.createCommandQueue(device, allProperties)').not.toThrow();
      });

      it("createCommandQueue(<invalidDevice>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createCommandQueue("foobar")').toThrow('INVALID_DEVICE');
        expect('ctx.createCommandQueue([])').toThrow('INVALID_DEVICE');
        expect('ctx.createCommandQueue(ctx)').toThrow('INVALID_DEVICE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLContext -> createProgram
    // 
    describe("createProgram", function() {

      it("createProgram(<validString>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createProgram("foobar")').not.toThrow();
      });

      it("createProgram(<invalidString>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx instanceof WebCLContext').toEvalAs(true);
        expect('ctx.createProgram("")').toThrow('INVALID_VALUE');
        expect('ctx.createProgram(null)').toThrow('INVALID_VALUE');
        expect('ctx.createProgram(undefined)').toThrow('INVALID_VALUE');
        expect('ctx.createProgram(ctx)').toThrow('INVALID_VALUE');
        expect('ctx.createProgram([])').toThrow('INVALID_VALUE');
        expect('ctx.createProgram()').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLContext -> createBuffer
    // 
    describe("createBuffer", function() {

      it("createBuffer(<validMemFlags>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createBuffer(WebCL.MEM_READ_ONLY, 1024)').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_WRITE_ONLY, 1024)').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_READ_WRITE, 1024)').not.toThrow();
      });

      it("createBuffer(<invalidMemFlags>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createBuffer(0, 1024)').toThrow('INVALID_VALUE');
        expect('ctx.createBuffer(-1, 1024)').toThrow('INVALID_VALUE');
        expect('ctx.createBuffer("", 1024)').toThrow('INVALID_VALUE');
        expect('ctx.createBuffer([], 1024)').toThrow('INVALID_VALUE');
        expect('ctx.createBuffer(ctx, 1024)').toThrow('INVALID_VALUE');
        expect('ctx.createBuffer(WebCL.RGBA, 1024)').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLContext -> createImage
    // 
    describe("createImage", function() {

      it("createImage(<validMemFlags>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 64, height: 64 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_WRITE_ONLY, { width: 64, height: 64 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_WRITE, { width: 64, height: 64 })').not.toThrow();
      });

      it("createImage(<validDescriptor>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('desc = new WebCLImageDescriptor()').not.toThrow();
        expect('desc.width = 11; desc.height = 17;').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, desc)').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17 })').not.toThrow();
      });

      it("createImage(<validDimensions>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 37, height: 1 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_WRITE_ONLY, { width: 1, height: 1025 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_WRITE, { width: 19, height: 11 })').not.toThrow();
      });

      it("createImage(<validHostPtr>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17 }, new Uint8Array(11*17*4))').not.toThrow();
      });

      it("createImage(<validRowPitch>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17, rowPitch: 0 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17, rowPitch: 0 }, new Uint8Array(11*17*4))').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17, rowPitch: 11*4 }, new Uint8Array(11*17*4))').not.toThrow();
      });

      it("createImage() must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createImage()').toThrow();
      });

      it("createImage(<invalidMemFlags>) must throw", function() {
        if (!self.preconditions) pending();
        descriptor = { width: 64, height: 64 };
        expect('ctx.createImage(undefined, descriptor)').toThrow('INVALID_VALUE');
        expect('ctx.createImage(null, descriptor)').toThrow('INVALID_VALUE');
        expect('ctx.createImage(0, descriptor)').toThrow('INVALID_VALUE');
        expect('ctx.createImage(-1, descriptor)').toThrow('INVALID_VALUE');
        expect('ctx.createImage("", descriptor)').toThrow('INVALID_VALUE');
        expect('ctx.createImage([], descriptor)').toThrow('INVALID_VALUE');
        expect('ctx.createImage(ctx, descriptor)').toThrow('INVALID_VALUE');
        expect('ctx.createImage(WebCL.RGBA, descriptor)').toThrow('INVALID_VALUE');
      });

      it("createImage(<invalidDescriptor>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY)').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, null)').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, {})').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, [])').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, "")').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, ctx)').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4 })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: null })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: {} })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: [] })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: "" })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: ctx })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: null })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: {} })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: [] })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: "" })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: ctx })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: null })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: {} })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: [] })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: "" })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: ctx })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: null })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: {} })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: [] })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: "" })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: ctx })').toThrow('INVALID_IMAGE_DESCRIPTOR');
      });

      it("createImage(<invalidDimensions>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 0 })').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: -4 })').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 1024*1024, height: 1 })').toThrow('INVALID_IMAGE_SIZE');
      });

      it("createImage(<invalidRowPitch>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: -1 })').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: 1 })').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: 15 }, new Uint8Array(4*4*4))').toThrow('INVALID_IMAGE_SIZE');
      });

      it("createImage(<invalidHostPtr>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: 0 }, new Uint8Array(4*4*4-1))').toThrow('INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: 100 }, new Uint8Array(4*4*4-1))').toThrow('INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: 0 }, new Uint8Array(4*4*4-1))').toThrow('INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4 }, new Uint8Array(0))').toThrow('INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4 }, [])').toThrow('INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4 }, ctx)').toThrow('INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4 }, 1024)').toThrow('INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4 }, 0)').toThrow('INVALID_HOST_PTR');
      });

      it("createImage(<invalidChannelOrder>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: WebCL.RGBA })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: WebCL.FLOAT })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: 0 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: -1 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
      });

      it("createImage(<invalidChannelType>) must throw", function() {
        if (!self.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: WebCL.RGBA })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: 0 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: -1 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
      });

      it("createImage(<unsupportedImageFormat>) must throw", function() {
        if (!self.preconditions) pending();
        unsupportedFormat = { width: 4, height: 4, channelOrder: WebCL.RGB, channelType: WebCL.UNORM_SHORT_555 };
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, unsupportedFormat)').toThrow('IMAGE_FORMAT_NOT_SUPPORTED');
      });

    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLBuffer
  // 
  describe("WebCLBuffer", function() {
    
    beforeEach(function() {
      self = self || {};
      try {
        ctx = createContext();
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, 123);
        self.preconditions = true;
      } catch (e) {
        ERROR("WebCLBuffer -> beforeEach: Caught exception " + e);
        ERROR("WebCLBuffer -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
        self.preconditions = false;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLBuffer -> getInfo
    // 
    describe("getInfo", function() {

      it("getInfo(<validEnum>) must work", function() {
        if (!self.preconditions) pending();
        expect('buffer.getInfo(WebCL.MEM_TYPE)').not.toThrow();
        expect('buffer.getInfo(WebCL.MEM_FLAGS)').not.toThrow();
        expect('buffer.getInfo(WebCL.MEM_CONTEXT)').not.toThrow();
        expect('buffer.getInfo(WebCL.MEM_ASSOCIATED_MEMOBJECT)').not.toThrow();
        expect('buffer.getInfo(WebCL.MEM_OFFSET)').not.toThrow();
        expect('buffer.getInfo(WebCL.MEM_TYPE) === WebCL.MEM_OBJECT_BUFFER').toEvalAs(true);
        expect('buffer.getInfo(WebCL.MEM_FLAGS) === WebCL.MEM_READ_WRITE').toEvalAs(true);
        expect('buffer.getInfo(WebCL.MEM_CONTEXT) === ctx').toEvalAs(true);
        expect('buffer.getInfo(WebCL.MEM_ASSOCIATED_MEMOBJECT) === null').toEvalAs(true);
        expect('buffer.getInfo(WebCL.MEM_OFFSET) === 0').toEvalAs(true);
      });

      it("getInfo(<invalidEnum>) must throw", function() {
        if (!self.preconditions) pending();
        expect('buffer.getInfo()').toThrow('INVALID_VALUE');
        expect('buffer.getInfo(0)').toThrow('INVALID_VALUE');
        expect('buffer.getInfo(1)').toThrow('INVALID_VALUE');
        expect('buffer.getInfo(-1)').toThrow('INVALID_VALUE');
        expect('buffer.getInfo(WebCL.MEM_OBJECT_BUFFER)').toThrow('INVALID_VALUE');
        expect('buffer.getInfo(null)').toThrow('INVALID_VALUE');
        expect('buffer.getInfo({})').toThrow('INVALID_VALUE');
        expect('buffer.getInfo([])').toThrow('INVALID_VALUE');
        expect('buffer.getInfo("")').toThrow('INVALID_VALUE');
        expect('buffer.getInfo("foo")').toThrow('INVALID_VALUE');
      });

    });
    
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLImage
  // 
  describe("WebCLImage", function() {
    
    beforeEach(function() {
      self = self || {};
      try {
        ctx = createContext();
        var descriptor = { width : 33, height : 17 };
        image = ctx.createImage(WebCL.MEM_READ_WRITE, descriptor);
        self.preconditions = true;
      } catch (e) {
        ERROR("WebCLImage -> beforeEach: Caught exception " + e);
        ERROR("WebCLImage -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
        self.preconditions = false;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLImage -> getInfo
    // 
    describe("getInfo", function() {

      it("getInfo() must work", function() {
        if (!self.preconditions) pending();
        expect('image.getInfo()').not.toThrow();
        expect('image.getInfo() instanceof WebCLImageDescriptor').toEvalAs(true);
        expect('image.getInfo().width').toEvalAs('33');
        expect('image.getInfo().height').toEvalAs('17');
        expect('image.getInfo().rowPitch').toEvalAs('33*4');
        expect('image.getInfo().channelOrder').toEvalAs('WebCL.RGBA');
        expect('image.getInfo().channelType').toEvalAs('WebCL.UNORM_INT8');
      });

      it("getInfo() must work with non-default channelType", function() {
        if (!self.preconditions) pending();
        descriptor = { width: 19, height: 11, channelOrder: WebCL.RGBA, channelType: WebCL.FLOAT };
        expect('image1 = ctx.createImage(WebCL.MEM_READ_ONLY, descriptor)').not.toThrow();
        expect('image1.getInfo().width').toEvalAs('19');
        expect('image1.getInfo().height').toEvalAs('11');
        expect('image1.getInfo().rowPitch').toEvalAs('19*4*4');
        expect('image1.getInfo().channelOrder').toEvalAs('WebCL.RGBA');
        expect('image1.getInfo().channelType').toEvalAs('WebCL.FLOAT');
      });

      it("getInfo(<validEnum>) must work", function() {
        if (!self.preconditions) pending();
        expect('image.getInfo(WebCL.MEM_TYPE)').not.toThrow();
        expect('image.getInfo(WebCL.MEM_FLAGS)').not.toThrow();
        expect('image.getInfo(WebCL.MEM_CONTEXT)').not.toThrow();
        expect('image.getInfo(WebCL.MEM_ASSOCIATED_MEMOBJECT)').not.toThrow();
        expect('image.getInfo(WebCL.MEM_OFFSET)').not.toThrow();
        expect('image.getInfo(WebCL.MEM_TYPE)').toEvalAs('WebCL.MEM_OBJECT_IMAGE2D');
        expect('image.getInfo(WebCL.MEM_FLAGS)').toEvalAs('WebCL.MEM_READ_WRITE');
        expect('image.getInfo(WebCL.MEM_CONTEXT) === ctx').toEvalAs(true);
        expect('image.getInfo(WebCL.MEM_ASSOCIATED_MEMOBJECT) === null').toEvalAs(true);
        expect('image.getInfo(WebCL.MEM_OFFSET) === 0').toEvalAs(true);
      });

      it("getInfo(<invalidEnum>) must throw", function() {
        if (!self.preconditions) pending();
        expect('image.getInfo(0)').toThrow('INVALID_VALUE');
        expect('image.getInfo(1)').toThrow('INVALID_VALUE');
        expect('image.getInfo(-1)').toThrow('INVALID_VALUE');
        expect('image.getInfo(WebCL.MEM_OBJECT_IMAGE2D)').toThrow('INVALID_VALUE');
        expect('image.getInfo({})').toThrow('INVALID_VALUE');
        expect('image.getInfo([])').toThrow('INVALID_VALUE');
        expect('image.getInfo("")').toThrow('INVALID_VALUE');
        expect('image.getInfo("foo")').toThrow('INVALID_VALUE');
      });

    });
    
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLEvent
  // 
  describe("WebCLEvent", function() {
    
    beforeEach(function() {
      self = self || {};
      try {
        ctx = createContext();
        self.preconditions = true;
      } catch (e) {
        ERROR("WebCLEvent -> beforeEach: Caught exception " + e);
        ERROR("WebCLEvent -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
        self.preconditions = false;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLEvent -> getInfo
    // 
    describe("getInfo", function() {

      it("new WebCLEvent() must work", function() {
        if (!self.preconditions) pending();
        expect('event = new WebCLEvent()').not.toThrow();
        expect('event instanceof WebCLEvent').toEvalAs(true);
      });

      it("getInfo(<validEnum>) must work for an empty event", function() {
        if (!self.preconditions) pending();
        expect('event = new WebCLEvent()').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_QUEUE)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_CONTEXT)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_TYPE)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS) === -1').toEvalAs(true);
      });

      it("getInfo(<validEnum>) must work for a populated event", function() {
        pending();
      });

      it("getInfo(<invalidEnum>) must throw", function() {
        if (!self.preconditions) pending();
        expect('event = new WebCLEvent()').not.toThrow();
        expect('event.getInfo(0)').toThrow('INVALID_VALUE');
        expect('event.getInfo(1)').toThrow('INVALID_VALUE');
        expect('event.getInfo(-1)').toThrow('INVALID_VALUE');
        expect('event.getInfo(WebCL.PROFILING_COMMAND_QUEUED)').toThrow('INVALID_VALUE');
        expect('event.getInfo(null)').toThrow('INVALID_VALUE');
        expect('event.getInfo({})').toThrow('INVALID_VALUE');
        expect('event.getInfo([])').toThrow('INVALID_VALUE');
        expect('event.getInfo("")').toThrow('INVALID_VALUE');
        expect('event.getInfo("foo")').toThrow('INVALID_VALUE');
      });

    });
    
    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLEvent -> getProfilingInfo
    // 
    describe("getProfilingInfo", function() {

      it("getProfilingInfo(<validEnum>) must work for an empty event", function() {
        if (!self.preconditions) pending();
        expect('event = new WebCLEvent()').not.toThrow();
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_QUEUED)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_SUBMIT)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_START)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_END)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
      });

      it("getProfilingInfo(<validEnum>) must work for a populated event", function() {
        pending();
      });

      it("getProfilingInfo(<invalidEnum>) must throw", function() {
        if (!self.preconditions) pending();
        expect('event = new WebCLEvent()').not.toThrow();
        expect('event.getProfilingInfo(0)').toThrow('INVALID_VALUE');
        expect('event.getProfilingInfo(1)').toThrow('INVALID_VALUE');
        expect('event.getProfilingInfo(-1)').toThrow('INVALID_VALUE');
        expect('event.getProfilingInfo(WebCL.EVENT_CONTEXT)').toThrow('INVALID_VALUE');
        expect('event.getProfilingInfo(null)').toThrow('INVALID_VALUE');
        expect('event.getProfilingInfo({})').toThrow('INVALID_VALUE');
        expect('event.getProfilingInfo([])').toThrow('INVALID_VALUE');
        expect('event.getProfilingInfo("")').toThrow('INVALID_VALUE');
        expect('event.getProfilingInfo("foo")').toThrow('INVALID_VALUE');
      });

    });
    
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLProgram
  // 
  describe("WebCLProgram", function() {
    
    beforeEach(function() {
      self = self || {};
      try {
        ctx = createContext();
        program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
        devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
        device = devices[0];
        self.preconditions = true;
      } catch (e) {
        ERROR("WebCLProgram -> beforeEach: Caught exception " + e);
        ERROR("WebCLProgram -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
        self.preconditions = false;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLProgram -> getInfo
    // 
    describe("getInfo", function() {

      it("getInfo(<validEnum>) must work", function() {
        if (!self.preconditions) pending();
        expect('program.getInfo(WebCL.PROGRAM_NUM_DEVICES)').not.toThrow();
        expect('program.getInfo(WebCL.PROGRAM_DEVICES)').not.toThrow();
        expect('program.getInfo(WebCL.PROGRAM_CONTEXT)').not.toThrow();
        expect('program.getInfo(WebCL.PROGRAM_SOURCE)').not.toThrow();
        expect('program.getInfo(WebCL.PROGRAM_NUM_DEVICES) === 1').toEvalAs(true);
        expect('program.getInfo(WebCL.PROGRAM_DEVICES).length === 1').toEvalAs(true);
        expect('program.getInfo(WebCL.PROGRAM_DEVICES)[0] === device').toEvalAs(true);
        expect('program.getInfo(WebCL.PROGRAM_CONTEXT) === ctx').toEvalAs(true);
        expect('program.getInfo(WebCL.PROGRAM_SOURCE)').toEvalTo("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
      });

      it("getInfo(<invalidEnum>) must throw", function() {
        if (!self.preconditions) pending();
        expect('program.getInfo()').toThrow('INVALID_VALUE');
        expect('program.getInfo(0)').toThrow('INVALID_VALUE');
        expect('program.getInfo(1)').toThrow('INVALID_VALUE');
        expect('program.getInfo(-1)').toThrow('INVALID_VALUE');
        expect('program.getInfo(WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_VALUE');
        expect('program.getInfo(null)').toThrow('INVALID_VALUE');
        expect('program.getInfo({})').toThrow('INVALID_VALUE');
        expect('program.getInfo([])').toThrow('INVALID_VALUE');
        expect('program.getInfo("")').toThrow('INVALID_VALUE');
        expect('program.getInfo("foo")').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLProgram -> build
    // 
    describe("build", function() {

      it("build(<validDeviceArray>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('program.build()').not.toThrow();
        expect('program.build(null)').not.toThrow();
        expect('program.build(devices)').not.toThrow();
      });

      it("build(<validDeviceArray>, <validBuildOption>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('program.build(devices, null)').not.toThrow();
        [ '',
          '-D foo',
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

      it("build(<validDeviceArray>, <multipleValidBuildOptions>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('program.build(devices, "-cl-opt-disable -Werror")').not.toThrow();
      });

      it("build(<invalidDeviceArray>) must throw", function() {
        if (!self.preconditions) pending();
        expect('program.build([])').toThrow('INVALID_VALUE');
        expect('program.build({})').toThrow('INVALID_VALUE');
        expect('program.build("")').toThrow('INVALID_VALUE');
        expect('program.build(program)').toThrow('INVALID_VALUE');
        expect('program.build(device)').toThrow('INVALID_VALUE');
        expect('program.build([program])').toThrow('INVALID_DEVICE');
      });

      it("build(<invalidBuildOptions>) must throw", function() {
        if (!self.preconditions) pending();
        expect('program.build(devices, "-cl-std=CL1.1")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(devices, "-cl-std=CL1.2")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(devices, "-cl-kernel-arg-info")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(devices, "-cl-fp32-correctly-rounded-divide-sqrt")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(devices, "-invalid-option")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(devices, "-I /usr/bin")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(devices, "-D -D foo")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(devices, "-D foo=#include<file.h>")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(devices, "-D foo=")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(devices, "-D =bar")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(devices, [])').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.build(devices, program)').toThrow('INVALID_BUILD_OPTIONS');
      });

      it("must throw if program source is invalid", function() {
        if (!self.preconditions) pending();
        program = ctx.createProgram("obviously invalid");
        expect('program.build(devices)').toThrow('BUILD_PROGRAM_FAILURE');
      });

      it("must throw if called synchronously from a WebCLCallback", function() {
        pending();
      });

      it("must throw if a previous build has not completed", function() {
        pending();
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLProgram -> getBuildInfo
    // 
    describe("getBuildInfo", function() {

      it("getBuildInfo(<validDevice>, <validEnum>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG)').not.toThrow();
      });

      it("getBuildInfo(<invalidDevice>, <validEnum>) must throw", function() {
        if (!self.preconditions) pending();
        expect('program.getBuildInfo("foobar", WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_DEVICE');
        expect('program.getBuildInfo("", WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_DEVICE');
        expect('program.getBuildInfo([], WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_DEVICE');
        expect('program.getBuildInfo(null, WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_DEVICE');
        expect('program.getBuildInfo(undefined, WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_DEVICE');
        expect('program.getBuildInfo(program, WebCL.PROGRAM_BUILD_STATUS)').toThrow('INVALID_DEVICE');
      });

      it("getBuildInfo(<validDevice>, <invalidEnum>) must throw", function() {
        if (!self.preconditions) pending();
        expect('program.getBuildInfo(device)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, undefined)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, null)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, "")').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, 0)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, -1)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, 0x1180)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, 0x1184)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, WebCL.PROGRAM_NUM_DEVICES)').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, "foobar")').toThrow('INVALID_VALUE');
        expect('program.getBuildInfo(device, device)').toThrow('INVALID_VALUE');
      });

      it("getBuildInfo(PROGRAM_BUILD_STATUS) must work", function() {
        if (!self.preconditions) pending();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_NONE');
        expect('program.build(devices)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_SUCCESS');
        program = ctx.createProgram("obviously invalid");
        expect('program.build(devices)').toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_ERROR');
      });

      it("getBuildInfo(PROGRAM_BUILD_OPTIONS) must work", function() {
        if (!self.preconditions) pending();
        expect('program.build(devices)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('typeof program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS) === "string"').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS).length === 0').toEvalAs(true);
        expect('program.build(devices, "-w -D foo=0xdeadbeef")').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS) === "-w -D foo=0xdeadbeef"').toEvalAs(true);
      });

      it("getBuildInfo(PROGRAM_BUILD_LOG) must actually report errors", function() {
        if (!self.preconditions) pending();
        program = ctx.createProgram("obviously invalid");
        expect('program.build(devices)').toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).length > 0').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).indexOf("error") !== -1').toEvalAs(true);
      });
        
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLProgram -> createKernel
    // 
    describe("createKernel", function() {

      it("createKernel(<validName>) must work", function() {
        if (!self.preconditions) pending();
        expect('program.build()').not.toThrow();
        expect('program.createKernel("dummy")').not.toThrow();
      });

      it("createKernel(<invalidName>) must throw", function() {
        if (!self.preconditions) pending();
        expect('program.build()').not.toThrow();
        expect('program.createKernel("foobar")').toThrow('INVALID_KERNEL_NAME');
        expect('program.createKernel()').toThrow('INVALID_KERNEL_NAME');
        expect('program.createKernel("")').toThrow('INVALID_KERNEL_NAME');
        expect('program.createKernel({})').toThrow('INVALID_KERNEL_NAME');
        expect('program.createKernel(program)').toThrow('INVALID_KERNEL_NAME');
      });

      it("createKernelsInProgram() must work", function() {
        if (!self.preconditions) pending();
        expect('program.build()').not.toThrow();
        expect('program.createKernelsInProgram()').not.toThrow();
        expect('program.createKernelsInProgram().length === 1').toEvalAs(true);
      });

      it("build() must throw if kernels are already created", function() {
        if (!self.preconditions) pending();
        expect('program.build(devices)').not.toThrow();
        expect('program.createKernel("dummy")').not.toThrow();
        expect('program.build(devices)').toThrow('INVALID_OPERATION');
      });

    });

  });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Functionality -> WebCLKernel
  // 
  describe("WebCLKernel", function() {
    
    beforeEach(function() {
      self = self || {};
      try {
        ctx = createContext();
        devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
        device = devices[0];
        self.preconditions = true;
      } catch (e) {
        ERROR("WebCLKernel -> beforeEach: Caught exception " + e);
        ERROR("WebCLKernel -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
        self.preconditions = false;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLKernel -> getWorkGroupInfo
    // 
    describe("getWorkGroupInfo", function() {

      it("must support KERNEL_WORK_GROUP_SIZE", function() {
        if (!self.preconditions) pending();
        program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
        expect('program.build()').not.toThrow();
        expect('kernel = program.createKernel("dummy")').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_WORK_GROUP_SIZE)').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_WORK_GROUP_SIZE) >= 1').toEvalAs(true);
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLKernel -> setArg
    // 
    describe("setArg", function() {

      var src = loadSource('kernels/argtypes.cl');

      beforeEach(function() {
        self = self || {};
        try {
          program = ctx.createProgram(src);
          program.build(devices);
          buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, 128);
          image = ctx.createImage(WebCL.MEM_READ_WRITE, { width: 32, height: 32 });
          sampler = ctx.createSampler(true, WebCL.ADDRESS_REPEAT, WebCL.FILTER_NEAREST);
          self.preconditions = true;
        } catch (e) {
          ERROR("WebCLKernel -> setArg -> beforeEach: Caught exception " + e);
          ERROR("WebCLKernel -> setArg -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
          self.preconditions = false;
        }
      });

      it("setArg(index, clObject) must not throw if clObject matches the expected type", function() {
        if (!self.preconditions) pending();
        kernel = program.createKernel('objects');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(0, buffer)').not.toThrow();
        expect('kernel.setArg(1, image)').not.toThrow();
        expect('kernel.setArg(2, image)').not.toThrow();
        expect('kernel.setArg(3, sampler)').not.toThrow();
      });

      it("setArg(index, clObject) must throw if clObject does not match the expected type (CRITICAL)", function() {
        if (!self.preconditions) pending();
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
        if (!self.preconditions) pending();
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
        if (!self.preconditions) pending();
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
        if (!self.preconditions) pending();
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
        if (!self.preconditions) pending();
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
        if (!self.preconditions) pending();
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
        if (!self.preconditions) pending();
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
        if (!self.preconditions) pending();
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
        if (!self.preconditions) pending();
        kernel = program.createKernel('localmem');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Uint32Array([10]))').not.toThrow();
      });

      it("setArg(index, value) must throw if a local memory size is passed in using anything but Uint32Array(1)", function() {
        if (!self.preconditions) pending();
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
        if (!self.preconditions) pending();
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

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLCommandQueue -> getInfo
    // 
    describe("getInfo", function() {

      beforeEach(function() {
        self = self || {};
        try {
          ctx = createContext();
          device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
          queue = ctx.createCommandQueue(device, 0);
          self.preconditions = true;
        } catch (e) {
          ERROR("WebCLCommandQueue -> getInfo -> beforeEach: Caught exception " + e);
          ERROR("WebCLCommandQueue -> getInfo -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
          self.preconditions = false;
        }
      });
    
      it("getInfo(<validEnum>) must work", function() {
        if (!self.preconditions) pending();
        expect('queue.getInfo(WebCL.QUEUE_CONTEXT)').not.toThrow();
        expect('queue.getInfo(WebCL.QUEUE_DEVICE)').not.toThrow();
        expect('queue.getInfo(WebCL.QUEUE_PROPERTIES)').not.toThrow();
        expect('queue.getInfo(WebCL.QUEUE_CONTEXT) === ctx').toEvalAs(true);
        expect('queue.getInfo(WebCL.QUEUE_DEVICE) === device').toEvalAs(true);
        expect('queue.getInfo(WebCL.QUEUE_PROPERTIES) === 0').toEvalAs(true);
      });

      it("getInfo(<invalidEnum>) must throw", function() {
        if (!self.preconditions) pending();
        expect('queue.getInfo()').toThrow('INVALID_VALUE');
        expect('queue.getInfo(0)').toThrow('INVALID_VALUE');
        expect('queue.getInfo(1)').toThrow('INVALID_VALUE');
        expect('queue.getInfo(-1)').toThrow('INVALID_VALUE');
        expect('queue.getInfo(WebCL.QUEUE_PROFILING_ENABLE)').toThrow('INVALID_VALUE');
        expect('queue.getInfo(null)').toThrow('INVALID_VALUE');
        expect('queue.getInfo({})').toThrow('INVALID_VALUE');
        expect('queue.getInfo([])').toThrow('INVALID_VALUE');
        expect('queue.getInfo("")').toThrow('INVALID_VALUE');
        expect('queue.getInfo("foo")').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLCommandQueue -> enqueueNDRangeKernel
    // 
    describe("enqueueNDRangeKernel", function() {

      beforeEach(function() {
        self = self || {};
        try {
          ctx = createContext();
          queue = ctx.createCommandQueue();
          buffer = ctx.createBuffer(WebCL.MEM_READ_ONLY, 16);
          program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
          devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
          program.build(devices);
          kernel = program.createKernelsInProgram()[0];
          kernel.setArg(0, buffer);
          self.preconditions = true;
        } catch (e) {
          ERROR("WebCLCommandQueue -> enqueueNDRangeKernel -> beforeEach: Caught exception " + e);
          ERROR("WebCLCommandQueue -> enqueueNDRangeKernel -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
          self.preconditions = false;
        }
      });

      it("must work if all arguments are fully specified", function() {
        if (!self.preconditions) pending();
        event = new WebCLEvent();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], [], event); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1, 1], [1, 1], [], event); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, [0, 0, 0], [1, 1, 1], [1, 1, 1], [], event); queue.finish()').not.toThrow();
      });

      it("must work if event === null/undefined/omitted", function() {
        if (!self.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], [], null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], []); queue.finish()').not.toThrow();
      });

      it("must work if eventWaitList === []/null/undefined/omitted", function() {
        if (!self.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], []); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1], undefined); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], [1]); queue.finish()').not.toThrow();
      });

      it("must work if localWorkSize === null/undefined/omitted", function() {
        if (!self.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1], undefined); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1]); queue.finish()').not.toThrow();
      });

      it("must work if globalWorkOffset === null/undefined", function() {
        if (!self.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1], [1]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, undefined, [1], [1]); queue.finish()').not.toThrow();
      });

      it("must work with all-default arguments", function() {
        if (!self.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1]); queue.finish()').not.toThrow();
      });

      it("must throw if kernel is not a valid WebCLKernel", function() {
        if (!self.preconditions) pending();
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
        expect('queue.enqueueNDRangeKernel("foo", 1, [0], [1], [1])').toThrow('INVALID_KERNEL');
        expect('queue.enqueueNDRangeKernel(ctx, 1, [0], [1], [1])').toThrow('INVALID_KERNEL');
      });

      it("must throw if workDim is not equal to 1, 2, or 3", function() {
        if (!self.preconditions) pending();
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
        expect('queue.enqueueNDRangeKernel(kernel, 0, [0], [1], [1])').toThrow('INVALID_WORK_DIMENSION')
        expect('queue.enqueueNDRangeKernel(kernel, 4, [0, 0, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1])').toThrow('INVALID_WORK_DIMENSION');
      });

      it("must throw if globalWorkSize.length != workDim", function() {
        if (!self.preconditions) pending();
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [1, 1], [1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1], [1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1, 1, 1], [1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 3, [0, 0, 0], [1, 1], [1, 1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 3, [0, 0, 0], [1, 1, 1, 1], [1, 1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
      });

      it("must throw if globalWorkSize[i] > 2^32-1", function() {
        if (!self.preconditions) pending();
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0], [0xffffffff+1], [1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, [0, 0], [1, 0xffffffff+1], [1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Functionality -> WebCLCommandQueue -> enqueueRead
    // 
    describe("enqueueRead", function() {

      beforeEach(function() {
        self = self || {};
        try {
          W = 32;
          H = 32;
          BPP = 4;
          bytesPerRow = BPP*W;
          ctx = createContext();
          queue = ctx.createCommandQueue();
          descriptor = { width : W, height : H };
          pixels = new Uint8Array(W*H*BPP);
          image = ctx.createImage(WebCL.MEM_READ_WRITE, descriptor);
          buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, W*H*BPP);
          self.preconditions = true;
        } catch (e) {
          ERROR("WebCLCommandQueue -> enqueueRead -> beforeEach: Caught exception " + e);
          ERROR("WebCLCommandQueue -> enqueueRead -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
          self.preconditions = false;
        }
      });

      it("enqueueReadImage(<valid arguments>) must not throw", function() {
        if (!self.preconditions) pending();
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, pixels)').not.toThrow();
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], bytesPerRow, pixels)').not.toThrow();
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], bytesPerRow, pixels)').not.toThrow();
      });

      it("enqueueReadImage(<invalid image>) must throw", function() {
        if (!self.preconditions) pending();
        expect('queue.enqueueReadImage(undefined, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage(null, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage({}, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage([], true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage(ctx, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage(queue, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage(buffer, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
      });

      it("enqueueReadImage(<image from another context>) must throw", function() {
        if (!self.preconditions) pending();
        ctx2 = createContext();
        queue2 = ctx2.createCommandQueue(null, 0);
        expect('queue2.enqueueReadImage(image, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_CONTEXT');
      });

      it("enqueueReadImage(<invalid blockingRead>) must throw", function() { // TODO what exception type?
        if (!self.preconditions) pending();
        expect('queue.enqueueReadImage(image, undefined, [0,0], [W, H], 0, pixels)').toThrow();
        expect('queue.enqueueReadImage(image, null, [0,0], [W, H], 0, pixels)').toThrow();
        expect('queue.enqueueReadImage(image, "foo", [0,0], [W, H], 0, pixels)').toThrow();
        expect('queue.enqueueReadImage(image, 0, [0,0], [W, H], 0, pixels)').toThrow();
      });

      it("enqueueReadImage(<invalid origin>) must throw", function() {
        if (!self.preconditions) pending();
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
        if (!self.preconditions) pending();
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
        if (!self.preconditions) pending();
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], -1, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], bytesPerRow-1, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], bytesPerRow+1, new Uint16Array(2*W*H*BPP))').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], undefined, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], null, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], "foo", pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], [], pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], {}, pixels)').toThrow('INVALID_VALUE');
      });

      it("enqueueReadImage(<invalid hostPtr>) must throw", function() {
        if (!self.preconditions) pending();
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, undefined)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, null)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, [])').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, {})').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, new Uint8Array(2))').toThrow('INVALID_VALUE');
      });

      it("enqueueReadImage(<image region out-of-bounds>) must throw", function() {
        if (!self.preconditions) pending();
        expect('queue.enqueueReadImage(image, true, [0,0], [W+1, 1], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [1, H+1], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [1,0], [W, 1], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,1], [1, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [W,0], [1, 1], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,H-1], [1, 2], 0, pixels)').toThrow('INVALID_VALUE');
      });

      it("enqueueReadImage(<hostPtr region out-of-bounds>) must throw", function() {
        if (!self.preconditions) pending();
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, pixels.subarray(0,-2))').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [1, 1], 0, pixels.subarray(0, 3))').toThrow('INVALID_VALUE');
      });

    });
      
  });

  //////////////////////////////////////////////////////////////////////////////

  beforeEach(addCustomMatchers);
  afterEach(releaseAll);

});
