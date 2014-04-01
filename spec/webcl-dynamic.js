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

describe("Runtime", function() {

  //////////////////////////////////////////////////////////////////////////////
  //
  // Runtime -> createContext
  // 
  describe("createContext", function() {

    beforeEach(enforcePreconditions.bind(this, function() {
      aPlatform = webcl.getPlatforms()[0];
      aDevice = aPlatform.getDevices()[0];
    }));

    it("createContext() must not throw", function() {
      if (!suite.preconditions) pending();
      expect('webcl.createContext()').not.toThrow();
      expect('webcl.createContext() instanceof WebCLContext').toEvalAs(true);
    });

    it("createContext(DEVICE_TYPE_DEFAULT) must not throw", function() {
      if (!suite.preconditions) pending();
      expect('webcl.createContext(WebCL.DEVICE_TYPE_DEFAULT)').not.toThrow();
    });

    it("createContext(CPU || GPU || ACCELERATOR) must not throw", function() {
      if (!suite.preconditions) pending();
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
      if (!suite.preconditions) pending();
      expect('webcl.createContext(aPlatform)').not.toThrow();
    });

    it("createContext(aPlatform, CPU || GPU || ACCELERATOR) must not throw", function() {
      if (!suite.preconditions) pending();
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
      if (!suite.preconditions) pending();
      expect('webcl.createContext(aDevice)').not.toThrow();
    });

    it("createContext([aDevice]) must not throw", function() {
      if (!suite.preconditions) pending();
      expect('webcl.createContext([aDevice])').not.toThrow();
    });

    it("createContext(aPlatform, DEVICE_TYPE_ALL) must not throw", function() {
      if (!suite.preconditions) pending();
      expect('webcl.createContext(aPlatform, WebCL.DEVICE_TYPE_ALL)').not.toThrow();
    });

    it("createContext(DEVICE_TYPE_ACCELERATOR) must throw", function() {
      if (!suite.preconditions) pending();
      expect('webcl.createContext(WebCL.DEVICE_TYPE_ACCELERATOR)').toThrow('DEVICE_NOT_FOUND');
    });

    it("createContext(aPlatform, DEVICE_TYPE_ACCELERATOR) must throw", function() {
      if (!suite.preconditions) pending();
      expect('webcl.createContext(aPlatform, WebCL.DEVICE_TYPE_ACCELERATOR)').toThrow('DEVICE_NOT_FOUND');
    });

    it("createContext(<invalid deviceType>) must throw", function() {
      if (!suite.preconditions) pending();
      expect('webcl.createContext(WebCL.DEVICE_TYPE_ALL)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(0)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(0x1234)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(null)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext("")').toThrow('INVALID_DEVICE_TYPE');
    });

    it("createContext(aPlatform, <invalid deviceType>) must throw", function() {
      if (!suite.preconditions) pending();
      expect('webcl.createContext(aPlatform, 0)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(aPlatform, 0x1234)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(aPlatform, null)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(aPlatform, "")').toThrow('INVALID_DEVICE_TYPE');
    });

    it("createContext(<invalid device or platform>) must throw", function() {
      if (!suite.preconditions) pending();
      expect('webcl.createContext({})').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(webcl)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(WebCL)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(WebCLDevice)').toThrow('INVALID_DEVICE_TYPE');
    });

    it("createContext(<invalid device array>) must throw", function() {
      if (!suite.preconditions) pending();
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
  // Runtime -> WebCLContext
  // 
  describe("WebCLContext", function() {

    beforeEach(enforcePreconditions.bind(this, function() {
      ctx = createContext();
      device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
    }));

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLContext -> getInfo
    // 
    describe("getInfo", function() {

      var signature = [ 'Enum' ];
      var valid = [ 'WebCL.CONTEXT_NUM_DEVICES' ];
      var invalid = [ 'WebCL.CONTEXT_PROPERTIES' ];

      it("getInfo(<validEnum>) must work", function() {
        if (!suite.preconditions) pending();
        expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES)').not.toThrow();
        expect('ctx.getInfo(WebCL.CONTEXT_DEVICES)').not.toThrow();
        expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES) === 1').toEvalAs(true);
        expect('ctx.getInfo(WebCL.CONTEXT_DEVICES).length === 1').toEvalAs(true);
        expect('ctx.getInfo(WebCL.CONTEXT_DEVICES)[0] === device').toEvalAs(true);
      });

      it("getInfo(<invalidEnum>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('ctx.getInfo', signature, valid, invalid, [0], 'INVALID_VALUE');
      });

    });


    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLContext -> getSupportedImageFormats
    // 

    describe("getSupportedImageFormats", function() {

      var signature = [ 'OptionalEnum' ];
      var valid = [ 'WebCL.MEM_READ_WRITE' ];

      it("getSupportedImageFormats(<validEnum>) must work", function() {
        if (!suite.preconditions) pending();
        expect('ctx.getSupportedImageFormats()').not.toThrow();
        expect('ctx.getSupportedImageFormats() instanceof Array').toEvalAs(true);
        expect('ctx.getSupportedImageFormats().length >= 10').toEvalAs(true);
        expect('ctx.getSupportedImageFormats()[0] instanceof WebCLImageDescriptor').toEvalAs(true);
        expect('ctx.getSupportedImageFormats(WebCL.MEM_READ_WRITE)').not.toThrow();
        expect('ctx.getSupportedImageFormats(WebCL.MEM_WRITE_ONLY)').not.toThrow();
        expect('ctx.getSupportedImageFormats(WebCL.MEM_READ_ONLY)').not.toThrow();
      });

      it("getSupportedImageFormats() must be equivalent to getSupportedImageFormats(MEM_READ_WRITE)", function() {
        if (!suite.preconditions) pending();
        formats = ctx.getSupportedImageFormats();
        formatsReadWrite = ctx.getSupportedImageFormats(WebCL.MEM_READ_WRITE);
        expect('formats.length').toEvalAs('formatsReadWrite.length');
        for (i=0; i < formats.length; i++) {
          expect('formats[i].channelOrder === formatsReadWrite[i].channelOrder').toEvalAs(true);
          expect('formats[i].channelType === formatsReadWrite[i].channelType').toEvalAs(true);
        }
      });

      it("getSupportedImageFormats(<validEnum>) must return the mandatory formats", function() {
        if (!suite.preconditions) pending();
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
        if (!suite.preconditions) pending();
        fuzz('ctx.getSupportedImageFormats', signature, valid, null, [0], 'INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLContext -> createCommandQueue
    // 
    describe("createCommandQueue", function() {

      var signature = [ 'OptionalWebCLObject', 'OptionalUint' ];
      var valid = [ 'null', '0' ];
      var invalid = [ 'ctx', '0x4', ];

      it("createCommandQueue(<validDevice>) must work", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createCommandQueue()').not.toThrow();
        expect('ctx.createCommandQueue(null)').not.toThrow();
        expect('ctx.createCommandQueue(device)').not.toThrow();
        expect('ctx.createCommandQueue(undefined, 0)').not.toThrow();
        expect('ctx.createCommandQueue(null, 0)').not.toThrow();
        expect('ctx.createCommandQueue(device, 0)').not.toThrow();
        expect('ctx.createCommandQueue() instanceof WebCLCommandQueue').toEvalAs(true);
      });

      it("createCommandQueue(<validDevice>, <supportedProperties>) must work", function() {
        if (!suite.preconditions) pending();
        supportedProperties = device.getInfo(WebCL.DEVICE_QUEUE_PROPERTIES);
        expect('ctx.createCommandQueue(device, supportedProperties)').not.toThrow();
        expect('ctx.createCommandQueue(null, supportedProperties)').not.toThrow();
        expect('ctx.createCommandQueue(undefined, supportedProperties)').not.toThrow();
      });

      it("createCommandQueue(<invalidDevice>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('ctx.createCommandQueue', signature, valid, invalid, [0], 'INVALID_DEVICE');
      });

      it("createCommandQueue(<validDevice>, <invalidProperties>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('ctx.createCommandQueue', signature, valid, invalid, [1], 'INVALID_VALUE');
      });

      it("createCommandQueue(<validDevice>, <unsupportedProperties>) must throw", function() {
        if (!suite.preconditions) pending();
        allProperties = WebCL.QUEUE_PROFILING_ENABLE | WebCL.QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE;
        supportedProperties = device.getInfo(WebCL.DEVICE_QUEUE_PROPERTIES);
        if (allProperties !== supportedProperties)
          expect('ctx.createCommandQueue(device, allProperties)').toThrow('INVALID_QUEUE_PROPERTIES');
        else 
          expect('ctx.createCommandQueue(device, allProperties)').not.toThrow();
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLContext -> createProgram
    // 
    describe("createProgram", function() {

      var signature = [ 'NonEmptyString' ];
      var valid = [ '"foo"' ];

      it("createProgram(<validString>) must not throw", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createProgram("foobar")').not.toThrow();
        expect('ctx.createProgram("foobar") instanceof WebCLProgram').toEvalAs(true);
      });

      it("createProgram(<invalidString>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('ctx.createProgram', signature, valid, null, [0], 'INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLContext -> createBuffer
    // 
    describe("createBuffer", function() {

      var signature = [ 'Enum', 'Uint', 'OptionalTypedArray' ];
      var valid = [ 'WebCL.MEM_READ_WRITE', '1024', 'undefined' ];

      it("createBuffer(<validMemFlags>) must not throw", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createBuffer(WebCL.MEM_READ_ONLY, 1024)').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_WRITE_ONLY, 1024)').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_READ_WRITE, 1024)').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_READ_WRITE, 1024) instanceof WebCLBuffer').toEvalAs(true);
      });

      it("createBuffer(<invalidMemFlags>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('ctx.createBuffer', signature, valid, null, [0], 'INVALID_VALUE');
      });

      it("createBuffer(<invalidSize>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('ctx.createBuffer', signature, valid, null, [1], 'INVALID_BUFFER_SIZE');
      });

      it("createBuffer(<invalidHostPtr>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('ctx.createBuffer', signature, valid, null, [2], 'INVALID_HOST_PTR');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLContext -> createImage
    // 
    describe("createImage", function() {

      it("createImage(<validMemFlags>) must work", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 64, height: 64 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_WRITE_ONLY, { width: 64, height: 64 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_WRITE, { width: 64, height: 64 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_WRITE, { width: 64, height: 64 }) instanceof WebCLImage').toEvalAs(true);
      });

      it("createImage(<validDescriptor>) must work", function() {
        if (!suite.preconditions) pending();
        expect('desc = new WebCLImageDescriptor()').not.toThrow();
        expect('desc.width = 11; desc.height = 17;').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, desc)').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17 })').not.toThrow();
      });

      it("createImage(<anySupportedFormat>) must work", function() {
        if (!suite.preconditions) pending();
        formats = ctx.getSupportedImageFormats();
        for (i=0;  i < formats.length; i++) {
          formats[i].width = 7;
          formats[i].height = 11;
          DEBUG("createImage(" + enumString(formats[i].channelOrder) + " [" + formats[i].channelOrder + "], " + 
                enumString(formats[i].channelType) + " [" + formats[i].channelType + "])");
          expect('ctx.createImage(WebCL.MEM_READ_WRITE, formats[i])').not.toThrow();
        }
      });

      it("createImage(<validDimensions>) must work", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 37, height: 1 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_WRITE_ONLY, { width: 1, height: 1025 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_WRITE, { width: 19, height: 11 })').not.toThrow();
      });

      it("createImage(<validHostPtr>) must work", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17 }, new Uint8Array(11*17*4))').not.toThrow();
      });

      it("createImage(<validRowPitch>) must work", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17, rowPitch: 0 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17, rowPitch: 0 }, new Uint8Array(11*17*4))').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17, rowPitch: 11*4 }, new Uint8Array(11*17*4))').not.toThrow();
      });

      it("createImage() must throw", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createImage()').toThrow();
      });

      it("createImage(<invalidMemFlags>) must throw", function() {
        if (!suite.preconditions) pending();
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
        if (!suite.preconditions) pending();
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
        if (!suite.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 0 })').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: -4 })').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 1024*1024, height: 1 })').toThrow('INVALID_IMAGE_SIZE');
      });

      it("createImage(<invalidRowPitch>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: -1 })').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: 1 })').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: 15 }, new Uint8Array(4*4*4))').toThrow('INVALID_IMAGE_SIZE');
      });

      it("createImage(<invalidHostPtr>) must throw", function() {
        if (!suite.preconditions) pending();
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
        if (!suite.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: WebCL.RGBA })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: WebCL.FLOAT })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: 0 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: -1 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
      });

      it("createImage(<invalidChannelType>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: WebCL.RGBA })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: 0 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: -1 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
      });

      it("createImage(<unsupportedImageFormat>) must throw", function() {
        if (!suite.preconditions) pending();
        unsupportedFormat = { width: 4, height: 4, channelOrder: WebCL.RGB, channelType: WebCL.UNORM_SHORT_555 };
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, unsupportedFormat)').toThrow('IMAGE_FORMAT_NOT_SUPPORTED');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLContext -> createSampler
    // 
    describe("createSampler", function() {

      var signature = [ 'Boolean', 'Enum', 'Enum' ];
      var valid = [ 'true', 'WebCL.ADDRESS_CLAMP', 'WebCL.FILTER_NEAREST' ];
      var invalid = [ 'WebCL.FALSE', 'WebCL.FILTER_NEAREST', 'WebCL.ADDRESS_CLAMP' ];

      it("createSampler(<validArguments>) must not throw", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createSampler(true, WebCL.ADDRESS_CLAMP, WebCL.FILTER_NEAREST)').not.toThrow();
        expect('ctx.createSampler(true, WebCL.ADDRESS_CLAMP, WebCL.FILTER_LINEAR)').not.toThrow();
        expect('ctx.createSampler(true, WebCL.ADDRESS_CLAMP_TO_EDGE, WebCL.FILTER_NEAREST)').not.toThrow();
        expect('ctx.createSampler(true, WebCL.ADDRESS_CLAMP_TO_EDGE, WebCL.FILTER_LINEAR)').not.toThrow();
        expect('ctx.createSampler(true, WebCL.ADDRESS_REPEAT, WebCL.FILTER_NEAREST)').not.toThrow();
        expect('ctx.createSampler(true, WebCL.ADDRESS_REPEAT, WebCL.FILTER_LINEAR)').not.toThrow();
        expect('ctx.createSampler(true, WebCL.ADDRESS_MIRRORED_REPEAT, WebCL.FILTER_NEAREST)').not.toThrow();
        expect('ctx.createSampler(true, WebCL.ADDRESS_MIRRORED_REPEAT, WebCL.FILTER_LINEAR)').not.toThrow();
        expect('ctx.createSampler(true, WebCL.ADDRESS_MIRRORED_REPEAT, WebCL.FILTER_LINEAR) instanceof WebCLSampler').toEvalAs(true);
      });

      it("createSampler(<invalidArguments>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('ctx.createSampler', signature, valid, invalid, [0], 'INVALID_VALUE');
        expect('ctx.createSampler(false, WebCL.ADDRESS_REPEAT, WebCL.FILTER_NEAREST)').toThrow('INVALID_VALUE');
        expect('ctx.createSampler(false, WebCL.ADDRESS_MIRRORED_REPEAT, WebCL.FILTER_NEAREST)').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLContext -> createUserEvent
    // 
    describe("createUserEvent", function() {

      it("createUserEvent() must work", function() {
        if (!suite.preconditions) pending();
        expect('ctx.createUserEvent()').not.toThrow();
        expect('ctx.createUserEvent() instanceof WebCLUserEvent').toEvalAs(true);
      });

    });

  });

  
  //////////////////////////////////////////////////////////////////////////////
  //
  // Runtime -> WebCLSampler
  // 
  describe("WebCLSampler", function() {
    
    var signature = [ 'Enum' ];
    var valid = [ 'WebCL.SAMPLER_FILTER_MODE' ];

    beforeEach(enforcePreconditions.bind(this, function() {
      ctx = createContext();
      sampler = ctx.createSampler(true, WebCL.ADDRESS_CLAMP, WebCL.FILTER_NEAREST);
    }));

    it("getInfo(<validEnum>) must work", function() {
      if (!suite.preconditions) pending();
      expect('sampler.getInfo(WebCL.SAMPLER_CONTEXT)').not.toThrow();
      expect('sampler.getInfo(WebCL.SAMPLER_NORMALIZED_COORDS)').not.toThrow();
      expect('sampler.getInfo(WebCL.SAMPLER_ADDRESSING_MODE)').not.toThrow();
      expect('sampler.getInfo(WebCL.SAMPLER_FILTER_MODE)').not.toThrow();
      expect('sampler.getInfo(WebCL.SAMPLER_CONTEXT) === ctx').toEvalAs(true);
      expect('sampler.getInfo(WebCL.SAMPLER_NORMALIZED_COORDS) === true').toEvalAs(true);
      expect('sampler.getInfo(WebCL.SAMPLER_ADDRESSING_MODE) === WebCL.ADDRESS_CLAMP').toEvalAs(true);
      expect('sampler.getInfo(WebCL.SAMPLER_FILTER_MODE) === WebCL.FILTER_NEAREST').toEvalAs(true);
    });

    it("getInfo(<invalidEnum>) must throw", function() {
      if (!suite.preconditions) pending();
      fuzz('sampler.getInfo', signature, valid, null, [0], 'INVALID_VALUE');
    });

  });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Runtime -> WebCLMemoryObject
  // 
  describe("WebCLMemoryObject", function() {

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLMemoryObject -> WebCLBuffer
    // 
    describe("WebCLBuffer", function() {
      
      var signature = [ 'Enum' ];
      var valid = [ 'WebCL.MEM_TYPE' ];

      beforeEach(enforcePreconditions.bind(this, function() {
        ctx = createContext();
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, 128, new Uint8Array(128));
      }));

      it("getInfo(<validEnum>) must work", function() {
        if (!suite.preconditions) pending();
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
        if (!suite.preconditions) pending();
        fuzz('buffer.getInfo', signature, valid, null, [0], 'INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLMemoryObject -> WebCLImage
    // 
    describe("WebCLImage", function() {
      
      var signature = [ 'OptionalEnum' ];
      var valid = [ 'WebCL.MEM_TYPE' ];

      beforeEach(enforcePreconditions.bind(this, function() {
        ctx = createContext();
        var descriptor = { width : 33, height : 17 };
        image = ctx.createImage(WebCL.MEM_READ_WRITE, descriptor);
      }));

      it("getInfo() must work", function() {
        if (!suite.preconditions) pending();
        expect('image.getInfo()').not.toThrow();
        expect('image.getInfo() instanceof WebCLImageDescriptor').toEvalAs(true);
        expect('image.getInfo().width').toEvalAs('33');
        expect('image.getInfo().height').toEvalAs('17');
        expect('image.getInfo().rowPitch').toEvalAs('33*4');
        expect('image.getInfo().channelOrder').toEvalAs('WebCL.RGBA');
        expect('image.getInfo().channelType').toEvalAs('WebCL.UNORM_INT8');
      });

      it("getInfo() must work with non-default channelType (WebCL.FLOAT)", function() {
        if (!suite.preconditions) pending();
        descriptor = { width: 19, height: 11, channelOrder: WebCL.RGBA, channelType: WebCL.FLOAT };
        expect('image1 = ctx.createImage(WebCL.MEM_READ_ONLY, descriptor)').not.toThrow();
        expect('image1.getInfo().width').toEvalAs('19');
        expect('image1.getInfo().height').toEvalAs('11');
        expect('image1.getInfo().rowPitch').toEvalAs('19*4*4');
        expect('image1.getInfo().channelOrder').toEvalAs('WebCL.RGBA');
        expect('image1.getInfo().channelType').toEvalAs('WebCL.FLOAT');
      });

      it("getInfo() must work with non-default channelOrder (WebCL.A)", function() {
        if (!suite.preconditions) pending();
        descriptor = { width: 11, height: 27, channelOrder: WebCL.A, channelType: WebCL.UNORM_INT8 };
        expect('image1 = ctx.createImage(WebCL.MEM_READ_ONLY, descriptor)').not.toThrow();
        expect('image1.getInfo().width').toEvalAs('11');
        expect('image1.getInfo().height').toEvalAs('27');
        expect('image1.getInfo().rowPitch').toEvalAs('11');
        expect('image1.getInfo().channelOrder').toEvalAs('WebCL.A');
        expect('image1.getInfo().channelType').toEvalAs('WebCL.UNORM_INT8');
      });

      it("getInfo(<validEnum>) must work", function() {
        if (!suite.preconditions) pending();
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
        if (!suite.preconditions) pending();
        fuzz('image.getInfo', signature, valid, null, [0], 'INVALID_VALUE');
      });

    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Runtime -> WebCLProgram
  // 
  describe("WebCLProgram", function() {
    
    beforeEach(enforcePreconditions.bind(this, function() {
      ctx = createContext();
      program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
      devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
      device = devices[0];
    }));

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLProgram -> getInfo
    // 
    describe("getInfo", function() {

      var signature = [ 'Enum' ];
      var valid = [ 'WebCL.PROGRAM_NUM_DEVICES' ];

      it("getInfo(<validEnum>) must work", function() {
        if (!suite.preconditions) pending();
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
        if (!suite.preconditions) pending();
        fuzz('program.getInfo', signature, valid, null, [0], 'INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLProgram -> build
    // 
    describe("build", function() {

      var signature = [ 'OptionalArray', 'OptionalString' ];
      var valid = [ 'devices', '"-D foo"' ];
      var invalid = [ 'device', 'program' ];

      it("build(<validDeviceArray>) must not throw", function() {
        if (!suite.preconditions) pending();
        expect('program.build()').not.toThrow();
        expect('program.build(null)').not.toThrow();
        expect('program.build(devices)').not.toThrow();
      });

      it("build(<validDeviceArray>, <validBuildOption>) must not throw", function() {
        if (!suite.preconditions) pending();
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
        if (!suite.preconditions) pending();
        expect('program.build(devices, "-cl-opt-disable -Werror")').not.toThrow();
      });

      it("build(<invalidDeviceArray>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('program.build', signature, valid, invalid, [0], 'INVALID_VALUE');
        expect('program.build([program])').toThrow('INVALID_DEVICE');
      });

      it("build(<invalidBuildOptions>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('program.build', signature, valid, invalid, [1], 'INVALID_BUILD_OPTIONS');
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
      });

      it("must throw if program source is invalid", function() {
        if (!suite.preconditions) pending();
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
    // Runtime -> WebCLProgram -> getBuildInfo
    // 
    describe("getBuildInfo", function() {

      var signature = [ 'WebCLObject', 'Enum' ];
      var valid = [ 'device', 'WebCL.PROGRAM_BUILD_STATUS' ];
      var invalid = [ 'program', 'WebCL.PROGRAM_NUM_DEVICES' ];

      it("getBuildInfo(<validDevice>, <validEnum>) must work", function() {
        if (!suite.preconditions) pending();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG)').not.toThrow();
      });

      it("getBuildInfo(PROGRAM_BUILD_STATUS) must report the expected status", function() {
        if (!suite.preconditions) pending();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_NONE');
        expect('program.build(devices)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_SUCCESS');
        program = ctx.createProgram("obviously invalid");
        expect('program.build(devices)').toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_ERROR');
      });

      it("getBuildInfo(PROGRAM_BUILD_OPTIONS) must report the given build options", function() {
        if (!suite.preconditions) pending();
        expect('program.build(devices)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('typeof program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS) === "string"').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS).length === 0').toEvalAs(true);
        expect('program.build(devices, "-w -D foo=0xdeadbeef")').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS) === "-w -D foo=0xdeadbeef"').toEvalAs(true);
      });

      it("getBuildInfo(PROGRAM_BUILD_LOG) must report the expected build errors", function() {
        if (!suite.preconditions) pending();
        program = ctx.createProgram("obviously invalid");
        expect('program.build(devices)').toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).length > 0').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).indexOf("error") !== -1').toEvalAs(true);
      });
        
      it("getBuildInfo(<invalidDevice>, <validEnum>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('program.getBuildInfo', signature, valid, invalid, [0], 'INVALID_DEVICE');
      });

      it("getBuildInfo(<validDevice>, <invalidEnum>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('program.getBuildInfo', signature, valid, invalid, [1], 'INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLProgram -> createKernel
    // 
    describe("createKernel", function() {

      var signature = [ 'String' ];
      var valid = [ '"dummy"' ];

      it("createKernel(<validName>) must work", function() {
        if (!suite.preconditions) pending();
        expect('program.build()').not.toThrow();
        expect('program.createKernel("dummy")').not.toThrow();
      });

      it("createKernel(<invalidName>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('program.build()').not.toThrow();
        fuzz('program.createKernel', signature, valid, null, [0], 'INVALID_KERNEL_NAME');
      });

      it("createKernelsInProgram() must work", function() {
        if (!suite.preconditions) pending();
        expect('program.build()').not.toThrow();
        expect('program.createKernelsInProgram()').not.toThrow();
        expect('program.createKernelsInProgram().length === 1').toEvalAs(true);
      });

      it("build() must throw if kernels are already created", function() {
        if (!suite.preconditions) pending();
        expect('program.build(devices)').not.toThrow();
        expect('program.createKernel("dummy")').not.toThrow();
        expect('program.build(devices)').toThrow('INVALID_OPERATION');
      });

    });

  });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Runtime -> WebCLKernel
  // 
  describe("WebCLKernel", function() {
    
    beforeEach(enforcePreconditions.bind(this, function() {
      ctx = createContext();
      devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
      device = devices[0];
    }));

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLKernel -> getInfo
    // 
    describe("getInfo", function() {

      var signature = [ 'Enum' ];
      var valid = [ 'WebCL.KERNEL_FUNCTION_NAME' ];

      beforeEach(enforcePreconditions.bind(this, function() {
        program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
        program.build();
        kernel = program.createKernel("dummy");
      }));

      it("getInfo(<validEnum>) must work", function() {
        if (!suite.preconditions) pending();
        expect('kernel.getInfo(WebCL.KERNEL_FUNCTION_NAME)').not.toThrow();
        expect('kernel.getInfo(WebCL.KERNEL_NUM_ARGS)').not.toThrow();
        expect('kernel.getInfo(WebCL.KERNEL_CONTEXT)').not.toThrow();
        expect('kernel.getInfo(WebCL.KERNEL_PROGRAM)').not.toThrow();
        expect('kernel.getInfo(WebCL.KERNEL_FUNCTION_NAME) === "dummy"').toEvalAs(true);
        expect('kernel.getInfo(WebCL.KERNEL_NUM_ARGS) === 1').toEvalAs(true);
        expect('kernel.getInfo(WebCL.KERNEL_CONTEXT) === ctx').toEvalAs(true);
        expect('kernel.getInfo(WebCL.KERNEL_PROGRAM) === program').toEvalAs(true);
      });

      it("getInfo(<invalidEnum>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('kernel.getInfo', signature, valid, null, [0], 'INVALID_VALUE');
      });
      
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLKernel -> getWorkGroupInfo
    // 
    describe("getWorkGroupInfo", function() {

      var signature = [ 'WebCLObject', 'Enum' ];
      var valid = [ 'device', 'WebCL.KERNEL_WORK_GROUP_SIZE' ];

      beforeEach(enforcePreconditions.bind(this, function() {
        ctx = createContext();
        devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
        device = devices[0];
        program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
        program.build();
        kernel = program.createKernel("dummy");
      }));

      it("getWorkGroupInfo(<validEnum>) must work", function() {
        if (!suite.preconditions) pending();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_WORK_GROUP_SIZE)').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_LOCAL_MEM_SIZE)').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_PREFERRED_WORK_GROUP_SIZE_MULTIPLE)').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_PRIVATE_MEM_SIZE)').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_WORK_GROUP_SIZE) >= 1').toEvalAs(true);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE) instanceof Array').toEvalAs(true);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)[0]').toEvalAs(0);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)[1]').toEvalAs(0);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)[2]').toEvalAs(0);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_LOCAL_MEM_SIZE) >= 0').toEvalAs(true);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_PREFERRED_WORK_GROUP_SIZE_MULTIPLE)').not.toEvalAs(0);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_PRIVATE_MEM_SIZE) >= 0').toEvalAs(true);
      });

      it("getWorkGroupInfo(COMPILE_WORK_GROUP_SIZE) must report the expected reqd_work_group_size", function() {
        if (!suite.preconditions) pending();
        program = ctx.createProgram("kernel __attribute__((reqd_work_group_size(4, 3, 2))) void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
        expect('program.build()').not.toThrow();
        expect('kernel = program.createKernel("dummy")').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE) instanceof Array').toEvalAs(true);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)[0]').toEvalAs(4);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)[1]').toEvalAs(3);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)[2]').toEvalAs(2);
      });

      it("getWorkGroupInfo(<invalid device>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('kernel.getWorkGroupInfo', signature, valid, null, [0], 'INVALID_DEVICE');
      });

      it("getWorkGroupInfo(<invalid enum>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('kernel.getWorkGroupInfo', signature, valid, null, [1], 'INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLKernel -> setArg
    // 
    describe("setArg", function() {

      var src = loadSource('kernels/argtypes.cl');

      beforeEach(enforcePreconditions.bind(this, function() {
        program = ctx.createProgram(src);
        program.build(devices);
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, 128);
        image = ctx.createImage(WebCL.MEM_READ_WRITE, { width: 32, height: 32 });
        sampler = ctx.createSampler(true, WebCL.ADDRESS_REPEAT, WebCL.FILTER_NEAREST);
      }));

      it("setArg(index, clObject) must work if clObject matches the expected type", function() {
        if (!suite.preconditions) pending();
        kernel = program.createKernel('objects');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(0, buffer)').not.toThrow();
        expect('kernel.setArg(1, image)').not.toThrow();
        expect('kernel.setArg(2, image)').not.toThrow();
        expect('kernel.setArg(3, sampler)').not.toThrow();
      });

      it("setArg(index, value) must work if value matches the expected scalar type", function() {
        if (!suite.preconditions) pending();
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

      it("setArg(index, value) must work if value matches the expected vector type", function() {
        if (!suite.preconditions) pending();
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

      it("setArg(index, value) must work if a local memory size is passed in using Uint32Array of length 1", function() {
        if (!suite.preconditions) pending();
        kernel = program.createKernel('localmem');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Uint32Array([10]))').not.toThrow();
      });

      it("setArg(<invalid index>) must throw", function() {
        if (!suite.preconditions) pending();
        var signature = [ 'Uint' ];
        var valid = [ '0' ];
        var invalid = [ '10' ]; 
        kernel = program.createKernel('scalars');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        fuzz("kernel.setArg", signature, valid, invalid, [0], "INVALID_ARG_INDEX");
      });

      it("setArg(<buffer from another context>) must throw", function() {
        if (!suite.preconditions) pending();
        kernel = program.createKernel('objects');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        ctx2 = createContext();
        queue2 = ctx2.createCommandQueue();
        bufferFromAnotherContext = ctx2.createBuffer(WebCL.MEM_READ_WRITE, 1024);
        expect('kernel.setArg(0, bufferFromAnotherContext)').toThrow('INVALID_CONTEXT');
      });

      it("setArg(index, clObject) must throw if clObject does not match the expected type (CRITICAL)", function() {
        if (!suite.preconditions) pending();
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

      xit("setArg(index, clObject) must throw if an arbitrary integer is passed in (CRITICAL)", function() {
        if (!suite.preconditions) pending();
        kernel = program.createKernel('objects');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(0, new Uint32Array(1))').toThrow('INVALID_MEM_OBJECT'); // global uint* expected
        expect('kernel.setArg(0, new Uint32Array(2))').toThrow('INVALID_MEM_OBJECT'); // global uint* expected
        expect('kernel.setArg(1, new Uint32Array(1))').toThrow('INVALID_MEM_OBJECT'); // read_only image2d_t expected
        expect('kernel.setArg(1, new Uint32Array(2))').toThrow('INVALID_MEM_OBJECT'); // read_only image2d_t expected
        expect('kernel.setArg(2, new Uint32Array(1))').toThrow('INVALID_MEM_OBJECT'); // write_only image2d_t expected
        expect('kernel.setArg(2, new Uint32Array(2))').toThrow('INVALID_MEM_OBJECT'); // write_only image2d_t expected
        expect('kernel.setArg(3, new Uint32Array(1))').toThrow('INVALID_SAMPLER');    // sampler_t expected
        expect('kernel.setArg(3, new Uint32Array(2))').toThrow('INVALID_SAMPLER');    // sampler_t expected
      });

      it("setArg(index, value) must throw if value is not an ArrayBufferView (CRITICAL)", function() {
        if (!suite.preconditions) pending();
        kernel = program.createKernel('scalars');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(3, new ArrayBuffer(4))').toThrow('INVALID_ARG_VALUE'); // int expected
        expect('kernel.setArg(4, new ArrayBuffer(8))').toThrow('INVALID_ARG_VALUE'); // long expected
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
        if (!suite.preconditions) pending();
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
        if (!suite.preconditions) pending();
        kernel = program.createKernel('vectors');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Int8Array(0))').toThrow('INVALID_ARG_SIZE');    // char4
        expect('kernel.setArg(2, new Int16Array(3))').toThrow('INVALID_ARG_SIZE');   // short4
        expect('kernel.setArg(3, new Int32Array(5))').toThrow('INVALID_ARG_SIZE');   // int4
        expect('kernel.setArg(4, new Uint32Array(16))').toThrow('INVALID_ARG_SIZE'); // long4
        expect('kernel.setArg(5, new Uint8Array(8))').toThrow('INVALID_ARG_SIZE');   // uchar4
        expect('kernel.setArg(6, new Uint16Array(2))').toThrow('INVALID_ARG_SIZE');  // ushort4
        expect('kernel.setArg(7, new Uint32Array(8))').toThrow('INVALID_ARG_SIZE');  // uint4
        expect('kernel.setArg(8, new Uint32Array(4))').toThrow('INVALID_ARG_SIZE');  // ulong4
        expect('kernel.setArg(8, new Uint32Array(16))').toThrow('INVALID_ARG_SIZE'); // ulong4
        expect('kernel.setArg(9, new Float32Array(8))').toThrow('INVALID_ARG_SIZE'); // float4
      });

      it("setArg(index, value) must throw if value type is wrong, even if the size is right", function() {
        if (!suite.preconditions) pending();
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

      it("setArg(index, value) must throw if a local memory size is passed in using anything but Uint32Array of length 1", function() {
        if (!suite.preconditions) pending();
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
        if (!suite.preconditions) pending();
        kernel = program.createKernel('localmem');
        expect('kernel instanceof WebCLKernel').toEvalAs(true);
        expect('kernel.setArg(1, new Uint32Array([0]))').toThrow('INVALID_ARG_SIZE');
      });

    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Runtime -> WebCLCommandQueue
  // 
  describe("WebCLCommandQueue", function() {

    beforeEach(enforcePreconditions.bind(this, function() {
      ctx = createContext();
      devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
      device = devices[0];
      queue = ctx.createCommandQueue(device);
    }));

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLCommandQueue -> getInfo
    // 
    describe("getInfo", function() {

      var signature = [ 'Enum' ];
      var valid = [ 'WebCL.QUEUE_PROPERTIES' ];

      it("getInfo(<validEnum>) must work", function() {
        if (!suite.preconditions) pending();
        expect('queue.getInfo(WebCL.QUEUE_CONTEXT)').not.toThrow();
        expect('queue.getInfo(WebCL.QUEUE_DEVICE)').not.toThrow();
        expect('queue.getInfo(WebCL.QUEUE_PROPERTIES)').not.toThrow();
        expect('queue.getInfo(WebCL.QUEUE_CONTEXT) === ctx').toEvalAs(true);
        expect('queue.getInfo(WebCL.QUEUE_DEVICE) === device').toEvalAs(true);
        expect('queue.getInfo(WebCL.QUEUE_PROPERTIES) === 0').toEvalAs(true);
      });

      it("getInfo(<invalidEnum>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.getInfo', signature, valid, null, [0], 'INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLCommandQueue -> enqueueReadBuffer
    // 
    describe("enqueueReadBuffer", function() {

      var signature = [ 'WebCLObject',            // buffer
                        'Boolean',                // blockingRead
                        'Uint',                   // bufferOffset
                        'UintNonZero',            // numBytes
                        'TypedArray',             // hostPtr
                        'OptionalArray',          // eventWaitList
                        'OptionalWebCLObject'     // event
                      ];

      var valid = [ 'buffer', 
                    'true',
                    '0',
                    'numBytes',
                    'hostPtr',
                    'undefined',
                    'undefined'
                  ];

      beforeEach(enforcePreconditions.bind(this, function() {
        numBytes = 1024;
        hostPtr = new Uint8Array(numBytes);
        hostPtr32f = new Float32Array(numBytes/4);
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, numBytes);
        image = ctx.createImage(WebCL.MEM_READ_WRITE, { width: 32, height: 32 });
      }));

      it("enqueueReadBuffer(<valid arguments>) must work", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueReadBuffer(buffer, true, 0, numBytes, hostPtr)').not.toThrow();
        expect('queue.enqueueReadBuffer(buffer, true, 0, numBytes, hostPtr32f)').not.toThrow();
        expect('queue.enqueueReadBuffer(buffer, true, 1, numBytes-1, hostPtr)').not.toThrow();
        expect('queue.enqueueReadBuffer(buffer, true, numBytes-1, 1, hostPtr)').not.toThrow();
        expect('queue.enqueueReadBuffer(buffer, true, 0, 1, new Uint8Array(1))').not.toThrow();
        expect('queue.enqueueReadBuffer(buffer, false, 0, numBytes, hostPtr); queue.finish();').not.toThrow();
      });

      it("enqueueReadBuffer(<invalid buffer>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueReadBuffer', signature, valid, null, [0], 'INVALID_MEM_OBJECT');
        expect('queue.enqueueReadBuffer(image, true, 0, 32, hostPtr)').toThrow('INVALID_MEM_OBJECT');
      });

      it("enqueueReadBuffer(<buffer from another context>) must throw", function() {
        if (!suite.preconditions) pending();
        ctx2 = createContext();
        queue2 = ctx2.createCommandQueue();
        expect('queue2.enqueueReadBuffer(buffer, true, 0, numBytes, hostPtr)').toThrow('INVALID_CONTEXT');
      });

      it("enqueueReadBuffer(<invalid blockingRead>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueReadBuffer', signature, valid, null, [1], 'INVALID_VALUE');
      });

      it("enqueueReadBuffer(<invalid bufferOffset>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueReadBuffer', signature, valid, null, [2], 'INVALID_VALUE');
      });

      it("enqueueReadBuffer(<invalid numBytes>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueReadBuffer', signature, valid, null, [3], 'INVALID_VALUE');
        expect('queue.enqueueReadBuffer(buffer, true, 0, numBytes-1, hostPtr32f)').toThrow('INVALID_VALUE');
      });

      it("enqueueReadBuffer(<invalid hostPtr>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueReadBuffer', signature, valid, null, [4], 'INVALID_VALUE');
      });

      it("enqueueReadBuffer(<buffer region out of bounds>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueReadBuffer(buffer, true, 1, numBytes, hostPtr)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadBuffer(buffer, true, numBytes, 1, hostPtr)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadBuffer(buffer, true, numBytes-1, 2, hostPtr)').toThrow('INVALID_VALUE');
      });

      it("enqueueReadBuffer(<hostPtr region out of bounds>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueReadBuffer(buffer, true, 0, numBytes, hostPtr.subarray(0,-1))').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadBuffer(buffer, true, 0, 1, new Uint8Array(0))').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLCommandQueue -> enqueueWriteBuffer
    // 
    describe("enqueueWriteBuffer", function() {

      var signature = [ 'WebCLObject',            // buffer
                        'Boolean',                // blockingWrite
                        'Uint',                   // bufferOffset
                        'UintNonZero',            // numBytes
                        'TypedArray',             // hostPtr
                        'OptionalArray',          // eventWaitList
                        'OptionalWebCLObject'     // event
                      ];

      var valid = [ 'buffer', 
                    'true',
                    '0',
                    'numBytes',
                    'hostPtr',
                    'undefined',
                    'undefined'
                  ];

      beforeEach(enforcePreconditions.bind(this, function() {
        numBytes = 1024;
        hostPtr = new Uint8Array(numBytes);
        hostPtr32f = new Float32Array(numBytes/4);
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, numBytes);
        image = ctx.createImage(WebCL.MEM_READ_WRITE, { width: 32, height: 32 });
      }));

      it("enqueueWriteBuffer(<valid arguments>) must work", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueWriteBuffer(buffer, true, 0, numBytes, hostPtr)').not.toThrow();
        expect('queue.enqueueWriteBuffer(buffer, true, 0, numBytes, hostPtr32f)').not.toThrow();
        expect('queue.enqueueWriteBuffer(buffer, true, 1, numBytes-1, hostPtr)').not.toThrow();
        expect('queue.enqueueWriteBuffer(buffer, true, numBytes-1, 1, hostPtr)').not.toThrow();
        expect('queue.enqueueWriteBuffer(buffer, true, 0, 1, new Uint8Array(1))').not.toThrow();
        expect('queue.enqueueWriteBuffer(buffer, false, 0, numBytes, hostPtr); queue.finish();').not.toThrow();
      });

      it("enqueueWriteBuffer(<invalid buffer>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueWriteBuffer', signature, valid, null, [0], 'INVALID_MEM_OBJECT');
        expect('queue.enqueueWriteBuffer(image, true, 0, 32, hostPtr)').toThrow('INVALID_MEM_OBJECT');
      });

      it("enqueueWriteBuffer(<buffer from another context>) must throw", function() {
        if (!suite.preconditions) pending();
        ctx2 = createContext();
        queue2 = ctx2.createCommandQueue();
        expect('queue2.enqueueWriteBuffer(buffer, true, 0, numBytes, hostPtr)').toThrow('INVALID_CONTEXT');
      });

      it("enqueueWriteBuffer(<invalid blockingWrite>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueWriteBuffer', signature, valid, null, [1], 'INVALID_VALUE');
      });

      it("enqueueWriteBuffer(<invalid bufferOffset>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueWriteBuffer', signature, valid, null, [2], 'INVALID_VALUE');
      });

      it("enqueueWriteBuffer(<invalid numBytes>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueWriteBuffer', signature, valid, null, [3], 'INVALID_VALUE');
        expect('queue.enqueueWriteBuffer(buffer, true, 0, numBytes-1, hostPtr32f)').toThrow('INVALID_VALUE');
      });

      it("enqueueWriteBuffer(<invalid hostPtr>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueWriteBuffer', signature, valid, null, [4], 'INVALID_VALUE');
      });

      it("enqueueWriteBuffer(<buffer region out of bounds>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueWriteBuffer(buffer, true, 1, numBytes, hostPtr)').toThrow('INVALID_VALUE');
        expect('queue.enqueueWriteBuffer(buffer, true, numBytes, 1, hostPtr)').toThrow('INVALID_VALUE');
        expect('queue.enqueueWriteBuffer(buffer, true, numBytes-1, 2, hostPtr)').toThrow('INVALID_VALUE');
      });

      it("enqueueWriteBuffer(<hostPtr region out of bounds>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueWriteBuffer(buffer, true, 0, numBytes, hostPtr.subarray(0,-1))').toThrow('INVALID_VALUE');
        expect('queue.enqueueWriteBuffer(buffer, true, 0, 1, new Uint8Array(0))').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLCommandQueue -> enqueueReadImage
    // 
    describe("enqueueReadImage", function() {

      var signature = [ 'WebCLObject',            // image
                        'Boolean',                // blockingRead
                        'NonEmptyArray',          // origin (TODO: change spec to allow null!)
                        'NonEmptyArray',          // region (TODO: change spec to allow null!)
                        'Uint',                   // hostRowPitch
                        'TypedArray',             // hostPtr
                        'OptionalArray',          // eventWaitList (TODO: change spec to explicitly allow empty array)
                        'OptionalWebCLObject'     // event
                      ];

      var valid = [ 'image', 
                    'true',
                    '[0, 0]',
                    '[W, H]',
                    '0',
                    'pixels',
                    'undefined',
                    'undefined'
                  ];

      beforeEach(enforcePreconditions.bind(this, function() {
        W = 32;
        H = 32;
        C = 4;
        BPP = C*1;
        bytesPerRow = BPP * W;
        BPPf32 = C*4;
        bytesPerRowf32 = BPPf32 * W;
        var descriptorRGBA8 = { width : W, height : H };
        var descriptorRGBAf32 = { width : W, height : H, channelOrder : WebCL.RGBA, channelType: WebCL.FLOAT };
        pixels = new Uint8Array(W*H*C);
        pixelsf32 = new Float32Array(W*H*C);
        image = ctx.createImage(WebCL.MEM_READ_WRITE, descriptorRGBA8);
        imagef32 = ctx.createImage(WebCL.MEM_READ_WRITE, descriptorRGBAf32);
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, W*H*C);
      }));

      it("enqueueReadImage(<valid arguments>) must work with RGBA8", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueReadImage(image, true, [0, 0], [W, H], 0, pixels)').not.toThrow();
        expect('queue.enqueueReadImage(image, true, [0, 0], [W, H], bytesPerRow, pixels)').not.toThrow();
        expect('queue.enqueueReadImage(image, true, [0, 0], [W, H], bytesPerRow, pixels)').not.toThrow();
        expect('queue.enqueueReadImage(image, true, [W-1, 0], [1, H], 0, pixels)').not.toThrow();
        expect('queue.enqueueReadImage(image, true, [0, H-1], [W, 1], 0, pixels)').not.toThrow();
        expect('queue.enqueueReadImage(image, true, [W-1, 0], [1, H], bytesPerRow, pixels)').not.toThrow();
        expect('queue.enqueueReadImage(image, false, [0, 0], [W, H], 0, pixels); queue.finish();').not.toThrow();
      });

      it("enqueueReadImage(<valid arguments>) must work with RGBAf32", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueReadImage(imagef32, true, [0, 0], [W, H], 0, pixelsf32)').not.toThrow();
        expect('queue.enqueueReadImage(imagef32, true, [0, 0], [W, H], bytesPerRowf32, pixelsf32)').not.toThrow();
        expect('queue.enqueueReadImage(imagef32, true, [0, 0], [W, H], bytesPerRowf32, pixelsf32)').not.toThrow();
        expect('queue.enqueueReadImage(imagef32, true, [W-1, 0], [1, H], 0, pixelsf32)').not.toThrow();
      });

      it("enqueueReadImage(<invalid image>) must throw", function() {
        if (!suite.preconditions) pending(); 
        fuzz('queue.enqueueReadImage', signature, valid, null, [0], 'INVALID_MEM_OBJECT');
        expect('queue.enqueueReadImage(buffer, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
      });

      it("enqueueReadImage(<image from another context>) must throw", function() {
        if (!suite.preconditions) pending();
        ctx2 = createContext();
        queue2 = ctx2.createCommandQueue();
        expect('queue2.enqueueReadImage(image, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_CONTEXT');
      });

      it("enqueueReadImage(<invalid blockingRead>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueReadImage', signature, valid, null, [1], 'INVALID_VALUE');
      });

      it("enqueueReadImage(<invalid origin>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueReadImage', signature, valid, null, [2], 'INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0, 0, 0], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0, null], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0, "foo"], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0, -1], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
      });

      it("enqueueReadImage(<invalid region>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueReadImage', signature, valid, null, [3], 'INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H, 1], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, null], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, "foo"], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, -1], 0, pixels)').toThrow('INVALID_VALUE');
      });

      it("enqueueReadImage(<invalid hostRowPitch>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueReadImage', signature, valid, null, [4], 'INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], bytesPerRow-1, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], bytesPerRow+1, new Uint16Array(2*W*H*C))').toThrow('INVALID_VALUE');
      });

      it("enqueueReadImage(<invalid hostPtr>) must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueReadImage', signature, valid, null, [5], 'INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, new Uint8Array(2))').toThrow('INVALID_VALUE');
      });

      it("enqueueReadImage(<image region out-of-bounds>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueReadImage(image, true, [0,0], [W+1, 1], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [1, H+1], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [1,0], [W, 1], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,1], [1, H], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [W,0], [1, 1], 0, pixels)').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,H-1], [1, 2], 0, pixels)').toThrow('INVALID_VALUE');
      });

      it("enqueueReadImage(<hostPtr region out-of-bounds>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, pixels.subarray(0,-2))').toThrow('INVALID_VALUE');
        expect('queue.enqueueReadImage(image, true, [0,0], [1, 1], 0, pixels.subarray(0, 3))').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLCommandQueue -> enqueueNDRangeKernel
    // 
    describe("enqueueNDRangeKernel", function() {
      
      var signature = [ 'WebCLObject',            // kernel
                        'Uint',                   // workDim
                        'OptionalArray',          // globalOffset
                        'NonEmptyArray',          // globalWorkSize
                        'OptionalArray',          // localWorkSize
                        'OptionalArray',          // eventWaitList (TODO: change spec to explicitly allow empty array)
                        'OptionalWebCLObject'     // event
                      ];

      var valid = [ 'kernel', 
                    '1',
                    'null',
                    '[7]',
                    'null',
                    'undefined',
                    'undefined'
                  ];

      beforeEach(enforcePreconditions.bind(this, function() {
        buffer = ctx.createBuffer(WebCL.MEM_READ_ONLY, 128);
        program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[get_global_id(0)]=0xdeadbeef; }");
        devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
        program.build(devices);
        kernel = program.createKernelsInProgram()[0];
        kernel.setArg(0, buffer);
      }));

      it("enqueueNDRangeKernel(<invalid kernel> must throw", function() {
        if (!suite.preconditions) pending();
        fuzz('queue.enqueueNDRangeKernel', signature, valid, null, [0], 'INVALID_KERNEL');
      });

      it("must work with minimal/default arguments", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], null, null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], null, null, null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], null, [], null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], undefined, [], null); queue.finish()').not.toThrow();
      });

      it("must work if workDim === {1, 2, 3}", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [8, 2   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [2, 2, 3]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3.0, null, [2, 2, 3]); queue.finish()').not.toThrow();
      });

      it("must work if globalWorkOffset !== null", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0      ], [7      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [1      ], [7      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, [1, 2   ], [7, 2   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, [1, 2, 1], [2, 1, 2]); queue.finish()').not.toThrow();
      });

      // This test assumes that the OpenCL device supports a work-group size of at least 2 in each
      // dimension. Otherwise, the test is marked pending.
      //
      it("must work if localWorkSize !== null", function() {
        if (!suite.preconditions) pending();
        if (!supportsWorkGroupSize(2, [2, 2, 2])) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7      ], [1      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [8      ], [2      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [9      ], [3      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [8, 2   ], [1, 1   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [8, 2   ], [2, 2   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [3, 2, 2], [1, 1, 1]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [3, 2, 2], [1, 2, 2]); queue.finish()').not.toThrow();
      });

      // This test assumes that the OpenCL device supports a work-group size of at least 2 in each
      // dimension. Otherwise, the test is marked pending.
      //
      it("must work if globalWorkOffset and localWorkSize !== null", function() {
        if (!suite.preconditions) pending();
        if (!supportsWorkGroupSize(4, [2, 2, 2])) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0      ], [7      ], [1      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [1      ], [8      ], [2      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, [1, 1   ], [7, 2   ], [1, 1   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, [1, 1   ], [6, 2   ], [2, 2   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, [0, 1, 1], [3, 2, 2], [1, 1, 1]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, [1, 2, 2], [3, 2, 2], [1, 2, 2]); queue.finish()').not.toThrow();
      });

      it("must throw if kernel is not a valid WebCLKernel", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(null, 1, null, [1])').toThrow('INVALID_KERNEL');
        expect('queue.enqueueNDRangeKernel("foo", 1, null, [1])').toThrow('INVALID_KERNEL');
        expect('queue.enqueueNDRangeKernel(ctx, 1, null, [1])').toThrow('INVALID_KERNEL');
      });

      it("must throw if kernel is from another WebCLContext", function() {
        if (!suite.preconditions) pending();
        ctx2 = createContext();
        queue2 = ctx2.createCommandQueue();
        expect('queue2.enqueueNDRangeKernel(kernel, 1, null, [7]); queue.finish()').toThrow('INVALID_CONTEXT');
      });

      it("must throw if workDim is not equal to 1, 2, or 3", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 0, null, [])').toThrow('INVALID_WORK_DIMENSION')
        expect('queue.enqueueNDRangeKernel(kernel, null, null, [1])').toThrow('INVALID_WORK_DIMENSION')
        expect('queue.enqueueNDRangeKernel(kernel, "1", null, [1])').toThrow('INVALID_WORK_DIMENSION')
        expect('queue.enqueueNDRangeKernel(kernel, [1], null, [1])').toThrow('INVALID_WORK_DIMENSION')
        expect('queue.enqueueNDRangeKernel(kernel, 1.001, null, [1])').toThrow('INVALID_WORK_DIMENSION')
        expect('queue.enqueueNDRangeKernel(kernel, 4, null, [1])').toThrow('INVALID_WORK_DIMENSION');
      });

      it("must throw if globalWorkSize is not an array", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, null)').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, "foo")').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, {})').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, 1)').toThrow('INVALID_GLOBAL_WORK_SIZE');
      });

      it("must throw if globalWorkOffset is not an array", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, "", [1])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, {}, [1])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, 1, [1])').toThrow('INVALID_GLOBAL_OFFSET');
      });

      it("must throw if localWorkSize is not an array", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1], "")').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1], {})').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1], 1)').toThrow('INVALID_WORK_GROUP_SIZE');
      });

      it("must throw if globalWorkSize.length != workDim", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [    ])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [   1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
      });

      it("must throw if globalWorkOffset.length != workDim", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [    ], [      1])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, [1, 1], [      1])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 2, [   1], [   1, 1])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 3, [   1], [1, 1, 1])').toThrow('INVALID_GLOBAL_OFFSET');
      });

      it("must throw if localWorkSize.length != workDim", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [      1], [    ])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [      1], [1, 1])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [   1, 1], [   1])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [1, 1, 1], [1, 1])').toThrow('INVALID_WORK_GROUP_SIZE');
      });

      it("must throw if globalWorkSize[i] is not an integer in [1, 2^32)", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [0])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [-1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1.001])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, ["1"])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [null])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, ["foo"])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [0xffffffff+1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [7, 0])').toThrow('INVALID_GLOBAL_WORK_SIZE');
      });

      it("must throw if localWorkSize[i] is not an integer in [1, 2^32)", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], [0])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], [-1])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], [1.001])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], ["1"])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], [null])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], ["foo"])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], [0xffffffff+1])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [7, 2], [1, 0])').toThrow('INVALID_WORK_GROUP_SIZE');
      });

      it("must throw if globalWorkOffset[i] is not an integer in [0, 2^32)", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [-1], [7])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, [1.001], [7])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, ["1"], [7])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, [null], [7])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, ["foo"], [7])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0xffffffff+1], [7])').toThrow('INVALID_GLOBAL_OFFSET');
      });

      it("must throw if globalWorkOffset[i] + globalWorkSize[i] is not an integer in [1, 2^32)", function() {
        if (!suite.preconditions) pending();
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0xfffffffe], [2])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, [2], [0xfffffffe])').toThrow('INVALID_GLOBAL_OFFSET');
      });

      // This test assumes that the OpenCL device supports a work-group size of at least 2 in each
      // dimension. Otherwise, the test is marked pending.
      //
      it("must throw if globalWorkSize[i] % localWorkSize[i] !== 0", function() {
        if (!suite.preconditions) pending();
        if (!supportsWorkGroupSize(2, [2, 2, 2])) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [3], [2])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [4, 1, 3], [1, 1, 2])').toThrow('INVALID_WORK_GROUP_SIZE');
      });

      // This test assumes that the OpenCL device does NOT support work-group sizes up to 2^12=4096.
      // Also, the device must allow for at least 16 work-items in each dimension.  Otherwise, the
      // test is marked pending.
      //
      it("must throw if localWorkSize exceeds device-specific limits", function() {
        if (!suite.preconditions) pending();
        if (supportsWorkGroupSize(4096)) pending();
        if (!supportsWorkGroupSize(16, [16, 16, 16])) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [256, 256, 256], [16, 16, 16])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [32768], [4096])').toThrow();
      });

    });

  });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Runtime -> WebCLEvent
  // 
  describe("WebCLEvent", function() {
    
    beforeEach(enforcePreconditions.bind(this, function() {
      ctx = createContext();
      queue = ctx.createCommandQueue(null, WebCL.QUEUE_PROFILING_ENABLE);
      event = new WebCLEvent();
    }));

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLEvent -> initialization
    // 
    describe("Initialization", function() {

      it("new WebCLEvent() must work", function() {
        if (!suite.preconditions) pending();
        expect('event instanceof WebCLEvent').toEvalAs(true);
      });

      it("enqueue*(<emptyEvent>) must work", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueMarker(event)').not.toThrow();
      });

      it("enqueue*(<populatedEvent>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueMarker(event)').not.toThrow();
        expect('queue.enqueueMarker(event)').toThrow('INVALID_EVENT');
      });

      it("enqueue*(<releasedEvent>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueMarker(event)').not.toThrow();
        expect('event.release()').not.toThrow();
        expect('queue.enqueueMarker(event)').toThrow('INVALID_EVENT');
      });

      it("enqueue*(<userEvent>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('userEvent = ctx.createUserEvent()').not.toThrow();
        expect('queue.enqueueMarker(userEvent)').toThrow('INVALID_EVENT');
      });

      it("enqueue*(<invalidEvent>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueMarker("foo")').toThrow('INVALID_EVENT');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLEvent -> getInfo
    // 
    describe("getInfo", function() {

      var signature = [ 'Enum' ];
      var valid = [ 'WebCL.EVENT_COMMAND_TYPE' ];
      var invalid = [ 'WebCL.PROFILING_COMMAND_SUBMIT' ]

      it("getInfo(<validEnum>) must work on a populated event", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueMarker(event); queue.finish();').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_QUEUE)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_CONTEXT)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_TYPE)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_QUEUE) === queue').toEvalAs(true);
        expect('event.getInfo(WebCL.EVENT_CONTEXT) === ctx').toEvalAs(true);
        expect('event.getInfo(WebCL.EVENT_COMMAND_TYPE) === WebCL.COMMAND_MARKER').toEvalAs(true);
        expect('event.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS) === WebCL.COMPLETE').toEvalAs(true);
      });

      it("getInfo(<validEnum>) must throw on an unpopulated event", function() {
        if (!suite.preconditions) pending();
        expect('event.getInfo(WebCL.EVENT_COMMAND_QUEUE)').toThrow('INVALID_EVENT');
        expect('event.getInfo(WebCL.EVENT_CONTEXT)').toThrow('INVALID_EVENT');
        expect('event.getInfo(WebCL.EVENT_COMMAND_TYPE)').toThrow('INVALID_EVENT');
        expect('event.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS)').toThrow('INVALID_EVENT');
      });

      it("getInfo(<invalidEnum>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueMarker(event)').not.toThrow();
        fuzz('event.getInfo', signature, valid, invalid, [0], 'INVALID_VALUE');
      });

    });
    
    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLEvent -> getProfilingInfo
    // 
    describe("getProfilingInfo", function() {

      var signature = [ 'Enum' ];
      var valid = [ 'WebCL.PROFILING_COMMAND_SUBMIT' ];
      var invalid = [ 'WebCL.EVENT_CONTEXT' ]

      it("getProfilingInfo(<validEnum>) must work on a populated event", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueMarker(event); queue.finish();').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS) === WebCL.COMPLETE').toEvalAs(true);
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_QUEUED)').not.toThrow();
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_SUBMIT)').not.toThrow();
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_START)').not.toThrow();
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_END)').not.toThrow();
      });

      it("getProfilingInfo(<validEnum>) return values must be ordered QUEUED <= SUBMIT <= START <= END", function() {
        if (!suite.preconditions) pending();
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, 16);
        hostPtr = new Uint8Array(16);
        expect('queue.enqueueReadBuffer(buffer, true, 0, 16, hostPtr, null, event)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS) === WebCL.COMPLETE').toEvalAs(true);
        event.queued = event.getProfilingInfo(WebCL.PROFILING_COMMAND_QUEUED);
        event.submit = event.getProfilingInfo(WebCL.PROFILING_COMMAND_SUBMIT);
        event.start = event.getProfilingInfo(WebCL.PROFILING_COMMAND_START);
        event.end = event.getProfilingInfo(WebCL.PROFILING_COMMAND_END);
        expect(event.queued).not.toBeGreaterThan(event.submit);
        expect(event.submit).not.toBeGreaterThan(event.start);
        expect(event.start).not.toBeGreaterThan(event.end);
      });

      it("getProfilingInfo(<validEnum>) must throw on an unpopulated event", function() {
        if (!suite.preconditions) pending();
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_QUEUED)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_SUBMIT)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_START)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_END)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
      });

      it("getProfilingInfo(<validEnum>) must throw on a user event", function() {
        if (!suite.preconditions) pending();
        expect('userEvent = ctx.createUserEvent()').not.toThrow();
        expect('userEvent.getProfilingInfo(WebCL.PROFILING_COMMAND_QUEUED)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('userEvent.getProfilingInfo(WebCL.PROFILING_COMMAND_SUBMIT)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('userEvent.getProfilingInfo(WebCL.PROFILING_COMMAND_START)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('userEvent.getProfilingInfo(WebCL.PROFILING_COMMAND_END)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
      });

      it("getProfilingInfo(<invalidEnum>) must throw", function() {
        if (!suite.preconditions) pending();
        expect('queue.enqueueMarker(event); queue.finish();').not.toThrow();
        fuzz('event.getProfilingInfo', signature, valid, invalid, [0], 'INVALID_VALUE');
      });

    });
    
  });

  //////////////////////////////////////////////////////////////////////////////

  beforeEach(addCustomMatchers);
  afterEach(releaseAll);

});
