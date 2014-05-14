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

  // Inject a 5-millisecond "sleep" between each test to avoid freezing
  // the browser on slow machines.

  beforeEach(function(done) {
    setTimeout(done, 5);
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Runtime -> createContext
  // 
  describe("createContext", function() {

    beforeEach(setup.bind(this, function() {
      aPlatform = webcl.getPlatforms()[0];
      aDevice = aPlatform.getDevices()[0];
    }));

    it("createContext() must work", function() {
      expect('ctx = webcl.createContext()').not.toThrow();
      expect('ctx instanceof WebCLContext').toEvalAs(true);
    });

    it("createContext(DEVICE_TYPE_DEFAULT) must work", function() {
      expect('webcl.createContext(WebCL.DEVICE_TYPE_DEFAULT)').not.toThrow();
    });

    it("createContext(CPU || GPU || ACCELERATOR) must work", function() {
      var types = [ WebCL.DEVICE_TYPE_CPU, WebCL.DEVICE_TYPE_GPU, WebCL.DEVICE_TYPE_ACCELERATOR ];
      for (var t=0, found=false; t < types.length && !found; t++) {
        try {
          ctx = webcl.createContext(types[t]);
          found = true;
        } catch (e) {
          if (e.name !== 'DEVICE_NOT_FOUND') throw e;
        }
      }
      expect(ctx instanceof WebCLContext).toBeTruthy();
    });

    it("createContext(aPlatform) must work", function() {
      expect('webcl.createContext(aPlatform)').not.toThrow();
    });

    it("createContext(aPlatform, CPU || GPU || ACCELERATOR) must work", function() {
      var types = [ WebCL.DEVICE_TYPE_CPU, WebCL.DEVICE_TYPE_GPU, WebCL.DEVICE_TYPE_ACCELERATOR ];
      for (var t=0, found=false; t < types.length && !found; t++) {
        try {
          ctx = webcl.createContext(aPlatform, types[t]);
          found = true;
        } catch (e) {
          if (e.name !== 'DEVICE_NOT_FOUND') throw e;
        }
      }
      expect(ctx instanceof WebCLContext).toBeTruthy();
    });

    it("createContext(aDevice) must work", function() {
      expect('webcl.createContext(aDevice)').not.toThrow();
    });

    it("createContext([aDevice]) must work", function() {
      expect('webcl.createContext([aDevice])').not.toThrow();
    });

    it("createContext(aPlatform, DEVICE_TYPE_ALL) must work", function() {
      expect('webcl.createContext(aPlatform, WebCL.DEVICE_TYPE_ALL)').not.toThrow();
    });

    it("createContext(DEVICE_TYPE_ACCELERATOR) must throw", function() {
      expect('webcl.createContext(WebCL.DEVICE_TYPE_ACCELERATOR)').toThrow('DEVICE_NOT_FOUND');
    });

    it("createContext(aPlatform, DEVICE_TYPE_ACCELERATOR) must throw", function() {
      expect('webcl.createContext(aPlatform, WebCL.DEVICE_TYPE_ACCELERATOR)').toThrow('DEVICE_NOT_FOUND');
    });

    it("createContext(<invalid deviceType>) must throw", function() {
      expect('webcl.createContext(WebCL.DEVICE_TYPE_ALL)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(0)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(0x1234)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(null)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext("")').toThrow('INVALID_DEVICE_TYPE');
    });

    it("createContext(aPlatform, <invalid deviceType>) must throw", function() {
      expect('webcl.createContext(aPlatform, 0)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(aPlatform, 0x1234)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(aPlatform, null)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(aPlatform, "")').toThrow('INVALID_DEVICE_TYPE');
    });

    it("createContext(<invalid device or platform>) must throw", function() {
      expect('webcl.createContext({})').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(webcl)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(WebCL)').toThrow('INVALID_DEVICE_TYPE');
      expect('webcl.createContext(WebCLDevice)').toThrow('INVALID_DEVICE_TYPE');
    });

    it("createContext(<invalid device array>) must throw", function() {
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

    beforeEach(setup.bind(this, function() {
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
        expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES)').not.toThrow();
        expect('ctx.getInfo(WebCL.CONTEXT_DEVICES)').not.toThrow();
        expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES) === 1').toEvalAs(true);
        expect('ctx.getInfo(WebCL.CONTEXT_DEVICES).length === 1').toEvalAs(true);
        expect('ctx.getInfo(WebCL.CONTEXT_DEVICES)[0] === device').toEvalAs(true);
      });

      it("getInfo(<invalid arguments>) must throw", function() {
        argc('ctx.getInfo', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('ctx.getInfo', signature, valid, invalid, [0], 'INVALID_VALUE');
      });

    });


    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLContext -> getSupportedImageFormats
    // 

    describe("getSupportedImageFormats", function() {

      var signature = [ 'OptionalEnum' ];
      var valid = [ 'undefined' ];

      it("getSupportedImageFormats() must work", function() {
        expect('formats = ctx.getSupportedImageFormats()').not.toThrow();
        expect('formats instanceof Array').toEvalAs(true);
        expect('formats[0] instanceof WebCLImageDescriptor').toEvalAs(true);
        expect('ctx.getSupportedImageFormats(WebCL.MEM_READ_WRITE)').not.toThrow();
        expect('ctx.getSupportedImageFormats(WebCL.MEM_WRITE_ONLY)').not.toThrow();
        expect('ctx.getSupportedImageFormats(WebCL.MEM_READ_ONLY)').not.toThrow();
      });

      it("getSupportedImageFormats() must be equivalent to getSupportedImageFormats(MEM_READ_WRITE)", function() {
        formats = ctx.getSupportedImageFormats();
        formatsReadWrite = ctx.getSupportedImageFormats(WebCL.MEM_READ_WRITE);
        expect('formats.length').toEvalAs('formatsReadWrite.length');
        for (i=0; i < formats.length; i++) {
          expect('formats[i].channelOrder === formatsReadWrite[i].channelOrder').toEvalAs(true);
          expect('formats[i].channelType === formatsReadWrite[i].channelType').toEvalAs(true);
        }
      });

      it("getSupportedImageFormats() must return the mandatory formats", function() {
        function rgbaFilter(item) { return (item.channelOrder === WebCL.RGBA); }
        rgbaFormatsReadWrite = ctx.getSupportedImageFormats(WebCL.MEM_READ_WRITE).filter(rgbaFilter);
        rgbaFormatsReadWrite = ctx.getSupportedImageFormats(WebCL.MEM_READ_WRITE).filter(rgbaFilter);
        rgbaFormatsWriteOnly = ctx.getSupportedImageFormats(WebCL.MEM_WRITE_ONLY).filter(rgbaFilter);
        rgbaFormatsReadOnly = ctx.getSupportedImageFormats(WebCL.MEM_READ_ONLY).filter(rgbaFilter);
        expect('rgbaFormatsReadWrite.length >= 10').toEvalAs(true);
        expect('rgbaFormatsWriteOnly.length >= 10').toEvalAs(true);
        expect('rgbaFormatsReadOnly.length >= 10').toEvalAs(true);
      });

      it("getSupportedImageFormats(<invalid arguments>) must throw", function() {
        argc('ctx.getSupportedImageFormats', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('ctx.getSupportedImageFormats', signature, valid, null, [0], 'INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLContext -> createCommandQueue
    // 
    describe("createCommandQueue", function() {

      var signature = [ 'OptionalWebCLObject', 'OptionalUint' ];
      var valid = [ 'undefined', 'undefined' ];
      var invalid = [ 'ctx', '0x4', ];

      it("createCommandQueue(<validDevice>) must work", function() {
        expect('ctx.createCommandQueue()').not.toThrow();
        expect('ctx.createCommandQueue(null)').not.toThrow();
        expect('ctx.createCommandQueue(device)').not.toThrow();
        expect('ctx.createCommandQueue(undefined, 0)').not.toThrow();
        expect('ctx.createCommandQueue(null, 0)').not.toThrow();
        expect('ctx.createCommandQueue(device, 0)').not.toThrow();
        expect('ctx.createCommandQueue() instanceof WebCLCommandQueue').toEvalAs(true);
      });

      it("createCommandQueue(<validDevice>, <supportedProperties>) must work", function() {
        supportedProperties = device.getInfo(WebCL.DEVICE_QUEUE_PROPERTIES);
        expect('ctx.createCommandQueue(device, supportedProperties)').not.toThrow();
        expect('ctx.createCommandQueue(null, supportedProperties)').not.toThrow();
        expect('ctx.createCommandQueue(undefined, supportedProperties)').not.toThrow();
      });

      it("createCommandQueue(<invalid arguments>) must throw", function() {
        argc('ctx.createCommandQueue', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('ctx.createCommandQueue', signature, valid, invalid, [0], 'INVALID_DEVICE');
        fuzz('ctx.createCommandQueue', signature, valid, invalid, [1], 'INVALID_VALUE');
      });

      it("createCommandQueue(<validDevice>, <unsupportedProperties>) must throw", function() {
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
        expect('ctx.createProgram("foobar")').not.toThrow();
        expect('ctx.createProgram("foobar") instanceof WebCLProgram').toEvalAs(true);
      });

      it("createProgram(<invalid arguments>) must throw", function() {
        argc('ctx.createProgram', valid, 'WEBCL_SYNTAX_ERROR');
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
      var invalid = [ 'WebCL.MEM_TYPE', '0x10000000000', 'new Uint8Array(1023)' ];

      it("createBuffer(<valid memFlags>) must work", function() {
        expect('ctx.createBuffer(WebCL.MEM_READ_ONLY, 1024)').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_WRITE_ONLY, 1024)').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_READ_WRITE, 1024)').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_READ_WRITE, 1024) instanceof WebCLBuffer').toEvalAs(true);
      });

      it("createBuffer(<valid hostPtr>) must work", function() {
        expect('ctx.createBuffer(WebCL.MEM_READ_ONLY, 1024, new Uint8Array(1024))').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_READ_ONLY, 1024, new Uint8Array(1025))').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_WRITE_ONLY, 1024, new Uint16Array(512))').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_READ_WRITE, 1024, new Float32Array(256))').not.toThrow();
        expect('ctx.createBuffer(WebCL.MEM_READ_WRITE, 1024, new Float64Array(128)) instanceof WebCLBuffer').toEvalAs(true);
      });

      it("createBuffer(<invalid arguments>) must throw", function() {
        argc('ctx.createBuffer', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('ctx.createBuffer', signature, valid, null, [0], 'INVALID_VALUE');
        fuzz('ctx.createBuffer', signature, valid, invalid, [1], 'INVALID_VALUE');
        fuzz('ctx.createBuffer', signature, valid, invalid, [2], 'INVALID_HOST_PTR');
        expect('ctx.createBuffer(WebCL.MEM_READ_WRITE, 0)').toThrow('INVALID_BUFFER_SIZE');
        expect('ctx.createBuffer(WebCL.MEM_READ_WRITE, device.getInfo(WebCL.DEVICE_MAX_MEM_ALLOC_SIZE)+1)').toThrow('INVALID_BUFFER_SIZE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLContext -> createImage
    // 
    describe("createImage", function() {

      var signature = [ 'Enum', 'WebCLObject', 'OptionalTypedArray' ];
      var valid = [ 'WebCL.MEM_READ_WRITE', '{ width: 4, height: 4 }', 'undefined' ];
      var invalid = [ 'WebCL.MEM_TYPE', '{ width: -1, height: 4 }', 'new Uint8Array(4*4*4-1)' ];

      it("createImage(<valid memFlags>) must work", function() {
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 64, height: 64 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_WRITE_ONLY, { width: 64, height: 64 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_WRITE, { width: 64, height: 64 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_WRITE, { width: 64, height: 64 }) instanceof WebCLImage').toEvalAs(true);
      });

      it("createImage(<valid descriptor>) must work", function() {
        expect('desc = new WebCLImageDescriptor()').not.toThrow();
        expect('desc.width = 11; desc.height = 17;').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, desc)').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17 })').not.toThrow();
      });

      it("createImage(<any supported format>) must work", function() {
        formats = ctx.getSupportedImageFormats();
        for (i=0;  i < formats.length; i++) {
          formats[i].width = 7;
          formats[i].height = 11;
          DEBUG("createImage(" + enumString(formats[i].channelOrder) + " [" + formats[i].channelOrder + "], " + 
                enumString(formats[i].channelType) + " [" + formats[i].channelType + "])");
          expect('ctx.createImage(WebCL.MEM_READ_WRITE, formats[i])').not.toThrow();
        }
      });

      it("createImage(<valid dimensions>) must work", function() {
        maxSupportedWidth = device.getInfo(WebCL.DEVICE_IMAGE2D_MAX_WIDTH);
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 37, height: 1 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_WRITE_ONLY, { width: 1, height: 1025 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_WRITE, { width: 19, height: 11 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_WRITE, { width: maxSupportedWidth, height: 2 })').not.toThrow();
      });

      it("createImage(<valid hostPtr>) must work", function() {
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17 }, new Uint8Array(11*17*4))').not.toThrow();
      });

      it("createImage(<valid rowPitch>) must work", function() {
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17, rowPitch: 0 })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17, rowPitch: 0 }, new Uint8Array(11*17*4))').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 11, height: 17, rowPitch: 11*4 }, new Uint8Array(11*17*4))').not.toThrow();
      });

      it("createImage(<invalid arguments>) must throw", function() {
        argc('ctx.createImage', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('ctx.createImage', signature, valid, invalid, [0], 'INVALID_VALUE');
        fuzz('ctx.createImage', signature, valid, invalid, [1], 'INVALID_IMAGE_DESCRIPTOR');
        fuzz('ctx.createImage', signature, valid, invalid, [2], 'INVALID_HOST_PTR');
      });

      it("createImage(<invalid descriptor>) must throw", function() {
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4 })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: null })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: {} })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: [] })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: "" })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: ctx })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: -4 })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: null })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: {} })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: [] })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: "" })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: ctx })').toThrow('INVALID_IMAGE_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: -1 })').toThrow('INVALID_IMAGE_DESCRIPTOR');
      });

      it("createImage(<invalid image format>) must throw", function() {
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: null })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: {} })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: [] })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: "" })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: ctx })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: null })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: {} })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: [] })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: "" })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: ctx })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
      });

      it("createImage(<invalid dimensions>) must throw", function() {
        maxSupportedWidth = device.getInfo(WebCL.DEVICE_IMAGE2D_MAX_WIDTH);
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 0 })').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 1024*1024, height: 1 })').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: maxSupportedWidth+1, height: 1 })').toThrow('INVALID_IMAGE_SIZE');
      });

      it("createImage(<invalid rowPitch>) must throw", function() {
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: 1 })').toThrow('INVALID_IMAGE_SIZE');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, rowPitch: 15 }, new Uint8Array(4*4*4))').toThrow('INVALID_IMAGE_SIZE');
      });

      it("createImage(<invalid hostPtr>) must throw", function() {
        fuzz('ctx.createImage', signature, valid, invalid, [2], 'INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width:1, height:1, channelType: WebCL.FLOAT }, new Uint8Array(15))').toThrow('INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width:4, height:4, rowPitch: 0 }, new Uint8Array(4*4*4-1))').toThrow('INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width:4, height:4, rowPitch: 100 }, new Uint8Array(4*4*4-1))').toThrow('INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width:4, height:4, rowPitch: 0 }, new Uint8Array(4*4*4-1))').toThrow('INVALID_HOST_PTR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width:4, height:4 }, new Uint8Array(0))').toThrow('INVALID_HOST_PTR');
      });

      it("createImage(<invalid channelOrder>) must throw", function() {
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: WebCL.RGBA })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: WebCL.FLOAT })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: 0 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelOrder: -1 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
      });

      it("createImage(<invalid channelType>) must throw", function() {
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: WebCL.FLOAT })').not.toThrow();
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: WebCL.RGBA })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: 0 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, { width: 4, height: 4, channelType: -1 })').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
      });

      it("createImage(<invalid channelOrder/channelType combination>) must throw", function() {
        invalidFormat = { width: 4, height: 4, channelOrder: WebCL.RGBA, channelType: WebCL.UNORM_SHORT_555 };
        expect('ctx.createImage(WebCL.MEM_READ_ONLY, invalidFormat)').toThrow('INVALID_IMAGE_FORMAT_DESCRIPTOR');
      });

      it("createImage(<unsupported image format>) must throw", function() {
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

      it("createSampler(<valid arguments>) must not throw", function() {
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

      it("createSampler(<invalid arguments>) must throw", function() {
        argc('ctx.createSampler', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('ctx.createSampler', signature, valid, invalid, [0, 1, 2], 'INVALID_VALUE');
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
        expect('ctx.createUserEvent()').not.toThrow();
        expect('ctx.createUserEvent() instanceof WebCLUserEvent').toEvalAs(true);
      });

      it("createUserEvent(<invalid arguments) must throw", function() {
        expect('ctx.createUserEvent(null)').toThrow('WEBCL_SYNTAX_ERROR');
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

    beforeEach(setup.bind(this, function() {
      ctx = createContext();
      sampler = ctx.createSampler(true, WebCL.ADDRESS_CLAMP, WebCL.FILTER_NEAREST);
    }));

    it("getInfo(<validEnum>) must work", function() {
      expect('sampler.getInfo(WebCL.SAMPLER_CONTEXT)').not.toThrow();
      expect('sampler.getInfo(WebCL.SAMPLER_NORMALIZED_COORDS)').not.toThrow();
      expect('sampler.getInfo(WebCL.SAMPLER_ADDRESSING_MODE)').not.toThrow();
      expect('sampler.getInfo(WebCL.SAMPLER_FILTER_MODE)').not.toThrow();
      expect('sampler.getInfo(WebCL.SAMPLER_CONTEXT) === ctx').toEvalAs(true);
      expect('sampler.getInfo(WebCL.SAMPLER_NORMALIZED_COORDS) === true').toEvalAs(true);
      expect('sampler.getInfo(WebCL.SAMPLER_ADDRESSING_MODE) === WebCL.ADDRESS_CLAMP').toEvalAs(true);
      expect('sampler.getInfo(WebCL.SAMPLER_FILTER_MODE) === WebCL.FILTER_NEAREST').toEvalAs(true);
    });

    it("getInfo(<invalid arguments>) must throw", function() {
      argc('sampler.getInfo', valid, 'WEBCL_SYNTAX_ERROR');
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
      
      beforeEach(setup.bind(this, function() {
        ctx = createContext();
        device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
        align = device.getInfo(WebCL.DEVICE_MEM_BASE_ADDR_ALIGN)/8;
        unaligned = align-1;
        size = align*2;
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, size);
      }));

      describe("createSubBuffer", function() {

        var signature = [ 'Enum', 'Uint', 'UintNonZero' ];
        var valid = [ 'WebCL.MEM_READ_WRITE', '0', '32' ];
        var invalid = [ 'WebCL.MEM_TYPE', 'size', 'size*2' ];

        it("createSubBuffer(<valid arguments>) must work", function() {
          expect('buffer.createSubBuffer(WebCL.MEM_READ_ONLY, 0, 32)').not.toThrow();
          expect('buffer.createSubBuffer(WebCL.MEM_WRITE_ONLY, 0, 32)').not.toThrow();
          expect('buffer.createSubBuffer(WebCL.MEM_READ_WRITE, 0, 32)').not.toThrow();
          expect('buffer.createSubBuffer(WebCL.MEM_READ_WRITE, 0, 32) instanceof WebCLBuffer').toEvalAs(true);
          expect('buffer.createSubBuffer(WebCL.MEM_READ_WRITE, align, 32)').not.toThrow();
          expect('buffer.createSubBuffer(WebCL.MEM_READ_WRITE, align, align)').not.toThrow();
        });

        it("createSubBuffer(<invalid arguments>) must throw", function() {
          argc('buffer.createSubBuffer', valid, 'WEBCL_SYNTAX_ERROR');
          fuzz('buffer.createSubBuffer', signature, valid, invalid, [0, 1, 2], 'INVALID_VALUE');
        });

        it("createSubBuffer(<invalid origin/size>) must throw", function() {
          expect('buffer.createSubBuffer(WebCL.MEM_READ_ONLY, size, 1)').toThrow('INVALID_VALUE');
          expect('buffer.createSubBuffer(WebCL.MEM_READ_ONLY, size-1, 2)').toThrow('INVALID_VALUE');
          expect('buffer.createSubBuffer(WebCL.MEM_READ_ONLY, align, align+1)').toThrow('INVALID_VALUE');
          expect('buffer.createSubBuffer(WebCL.MEM_READ_ONLY, 0, size+1)').toThrow('INVALID_VALUE');
          expect('buffer.createSubBuffer(WebCL.MEM_READ_ONLY, align-1, 1)').toThrow('MISALIGNED_SUB_BUFFER_OFFSET');
        });

        it("createSubBuffer() must throw if this buffer is already a sub-buffer", function() {
          expect('subBuffer = buffer.createSubBuffer(WebCL.MEM_READ_WRITE, 0, 16)').not.toThrow();
          expect('subBuffer.createSubBuffer(WebCL.MEM_READ_WRITE, 0, 8)').toThrow('INVALID_MEM_OBJECT');
        });

        it("createSubBuffer() must throw if trying to upgrade read/write permissions", function() {
          expect('readOnlyBuffer = ctx.createBuffer(WebCL.MEM_READ_ONLY, 1024)').not.toThrow();
          expect('writeOnlyBuffer = ctx.createBuffer(WebCL.MEM_WRITE_ONLY, 1024)').not.toThrow();
          expect('readOnlyBuffer.createSubBuffer(WebCL.MEM_READ_WRITE, 0, 16)').toThrow('INVALID_VALUE');
          expect('readOnlyBuffer.createSubBuffer(WebCL.MEM_WRITE_ONLY, 0, 16)').toThrow('INVALID_VALUE');
          expect('writeOnlyBuffer.createSubBuffer(WebCL.MEM_READ_WRITE, 0, 16)').toThrow('INVALID_VALUE');
          expect('writeOnlyBuffer.createSubBuffer(WebCL.MEM_READ_ONLY, 0, 16)').toThrow('INVALID_VALUE');
        });

      });

      describe("getInfo", function() {

        var signature = [ 'Enum' ];
        var valid = [ 'WebCL.MEM_TYPE' ];

        it("getInfo(<validEnum>) must work on regular buffers", function() {
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

        it("getInfo(<validEnum>) must work on sub-buffers", function() {
          expect('subBuffer = buffer.createSubBuffer(WebCL.MEM_READ_ONLY, align, 32)').not.toThrow();
          expect('subBuffer.getInfo(WebCL.MEM_TYPE)').not.toThrow();
          expect('subBuffer.getInfo(WebCL.MEM_FLAGS)').not.toThrow();
          expect('subBuffer.getInfo(WebCL.MEM_CONTEXT)').not.toThrow();
          expect('subBuffer.getInfo(WebCL.MEM_ASSOCIATED_MEMOBJECT)').not.toThrow();
          expect('subBuffer.getInfo(WebCL.MEM_OFFSET)').not.toThrow();
          expect('subBuffer.getInfo(WebCL.MEM_TYPE) === WebCL.MEM_OBJECT_BUFFER').toEvalAs(true);
          expect('subBuffer.getInfo(WebCL.MEM_FLAGS) === WebCL.MEM_READ_ONLY').toEvalAs(true);
          expect('subBuffer.getInfo(WebCL.MEM_CONTEXT) === ctx').toEvalAs(true);
          expect('subBuffer.getInfo(WebCL.MEM_ASSOCIATED_MEMOBJECT) === buffer').toEvalAs(true);
          expect('subBuffer.getInfo(WebCL.MEM_OFFSET)').toEvalAs(align);
        });

        it("getInfo(<invalid arguments>) must throw", function() {
          argc('buffer.getInfo', valid, 'WEBCL_SYNTAX_ERROR');
          fuzz('buffer.getInfo', signature, valid, null, [0], 'INVALID_VALUE');
        });

      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLMemoryObject -> WebCLImage
    // 
    describe("WebCLImage", function() {
      
      var signature = [ 'OptionalEnum' ];
      var valid = [ 'undefined' ];

      beforeEach(setup.bind(this, function() {
        ctx = createContext();
        var descriptor = { width : 33, height : 17 };
        image = ctx.createImage(WebCL.MEM_READ_WRITE, descriptor);
      }));

      it("getInfo() must work", function() {
        expect('image.getInfo()').not.toThrow();
        expect('image.getInfo() instanceof WebCLImageDescriptor').toEvalAs(true);
        expect('image.getInfo().width').toEvalAs('33');
        expect('image.getInfo().height').toEvalAs('17');
        expect('image.getInfo().rowPitch').toEvalAs('33*4');
        expect('image.getInfo().channelOrder').toEvalAs('WebCL.RGBA');
        expect('image.getInfo().channelType').toEvalAs('WebCL.UNORM_INT8');
      });

      it("getInfo() must work with non-default channelType (WebCL.FLOAT)", function() {
        descriptor = { width: 19, height: 11, channelOrder: WebCL.RGBA, channelType: WebCL.FLOAT };
        expect('image1 = ctx.createImage(WebCL.MEM_READ_ONLY, descriptor)').not.toThrow();
        expect('image1.getInfo().width').toEvalAs('19');
        expect('image1.getInfo().height').toEvalAs('11');
        expect('image1.getInfo().rowPitch').toEvalAs('19*4*4');
        expect('image1.getInfo().channelOrder').toEvalAs('WebCL.RGBA');
        expect('image1.getInfo().channelType').toEvalAs('WebCL.FLOAT');
      });

      it("getInfo() must work with non-default channelOrder (WebCL.A)", function() {
        descriptor = { width: 11, height: 27, channelOrder: WebCL.A, channelType: WebCL.UNORM_INT8 };
        expect('image1 = ctx.createImage(WebCL.MEM_READ_ONLY, descriptor)').not.toThrow();
        expect('image1.getInfo().width').toEvalAs('11');
        expect('image1.getInfo().height').toEvalAs('27');
        expect('image1.getInfo().rowPitch').toEvalAs('11');
        expect('image1.getInfo().channelOrder').toEvalAs('WebCL.A');
        expect('image1.getInfo().channelType').toEvalAs('WebCL.UNORM_INT8');
      });

      it("getInfo(<validEnum>) must work", function() {
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

      it("getInfo(<invalid arguments>) must throw", function() {
        argc('image.getInfo', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('image.getInfo', signature, valid, null, [0], 'INVALID_VALUE');
      });

    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Runtime -> WebCLProgram
  // 
  describe("WebCLProgram", function() {
    
    beforeEach(setup.bind(this, function() {
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

      it("getInfo(<invalid arguments>) must throw", function() {
        argc('program.getInfo', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('program.getInfo', signature, valid, null, [0], 'INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLProgram -> build
    // 
    describe("build", function() {

      var signature = [ 'OptionalArray', 'OptionalString', 'OptionalFunction' ];
      var valid = [ 'undefined', 'undefined', 'undefined' ];
      var invalid = [ 'device', '[program]', '{}' ];

      it("build() must work in synchronous form", function() {
        expect('program.build()').not.toThrow();
        expect('program.build(null)').not.toThrow();
        expect('program.build(devices)').not.toThrow();
      });

      wait("build() must work in asynchronous form", function(done) {
        program.build([device], null, function() { 
          expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_SUCCESS');
          done(); 
        });
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS) < 0').toEvalAs(true);
      });

      it("build(<valid build options>) must not throw", function() {
        expect('program.build(devices, null)').not.toThrow();
        [ '',
          '-D foo',
          '-D foo=0xdeadbeef',
          '-D VALID_OPTION=0xdeadbeef',
          '-D VALID_OPTION=0.001',
          '-D VALID_OPTION=0.001f',
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

      it("build(<multiple valid build options>) must not throw", function() {
        expect('program.build(devices, "-cl-opt-disable -Werror")').not.toThrow();
      });

      it("build(<invalid arguments>) must throw", function() {
        argc('program.build', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('program.build', signature, valid, invalid, [0], 'INVALID_VALUE');
        fuzz('program.build', signature, valid, invalid, [1], 'INVALID_BUILD_OPTIONS');
        fuzz('program.build', signature, valid, invalid, [2], 'TypeError');
      });

      it("build(<invalid build options>) must throw", function() {
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

      it("build() must throw if program source is invalid", function() {
        program = ctx.createProgram("obviously invalid");
        expect('program.build(devices)').toThrow('BUILD_PROGRAM_FAILURE');
      });

      wait("build() must throw if called synchronously from a WebCLCallback", function(done) {
        program.build(null, null, function() {
          expect('program.build()').toThrow('INVALID_OPERATION');
          expect('program.build(null)').toThrow('INVALID_OPERATION');
          expect('program.build(devices)').toThrow('INVALID_OPERATION');
          expect('program.build([device])').toThrow('INVALID_OPERATION');
          expect('program.build([device])').toThrow('INVALID_OPERATION');
          done();
        });
      });

      wait("build() must throw if a previous build is still in progress", function(done) {
        program.build(null, null, function() {
          expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_SUCCESS');
          done();
        });
        expect('program.build()').toThrow('INVALID_OPERATION');
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

      it("getBuildInfo(<validDevice>, <validEnum>) must work before build()", function() {
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG)').not.toThrow();
      });

      it("getBuildInfo(<validDevice>, <validEnum>) must work after build()", function() {
        expect('program.build(devices)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG)').not.toThrow();
      });

      it("getBuildInfo(PROGRAM_BUILD_STATUS) must report the expected status", function() {
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_NONE');
        expect('program.build(devices)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_SUCCESS');
        program = ctx.createProgram("obviously invalid");
        expect('program.build(devices)').toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_ERROR');
      });

      it("getBuildInfo(PROGRAM_BUILD_OPTIONS) must report the given build options", function() {
        expect('program.build(devices)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('typeof program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS) === "string"').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS).length === 0').toEvalAs(true);
        expect('program.build(devices, "-w -D foo=0xdeadbeef")').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_OPTIONS) === "-w -D foo=0xdeadbeef"').toEvalAs(true);
      });

      it("getBuildInfo(PROGRAM_BUILD_LOG) must report the expected build errors", function() {
        program = ctx.createProgram("obviously invalid");
        expect('program.build(devices)').toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).length > 0').toEvalAs(true);
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_LOG).indexOf("error") !== -1').toEvalAs(true);
      });
        
      it("getBuildInfo(<invalid arguments>) must throw", function() {
        argc('program.getBuildInfo', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('program.getBuildInfo', signature, valid, invalid, [0], 'INVALID_DEVICE');
        fuzz('program.getBuildInfo', signature, valid, invalid, [1], 'INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLProgram -> createKernel*
    // 
    describe("createKernel[*]", function() {

      var signature = [ 'String' ];
      var valid = [ '"dummy"' ];

      it("createKernel*(<valid arguments>) must work", function() {
        expect('program.build()').not.toThrow();
        expect('program.createKernel("dummy")').not.toThrow();
        expect('program.createKernel("dummy") instanceof WebCLKernel').toEvalAs(true);
        expect('program.createKernelsInProgram()').not.toThrow();
        expect('program.createKernelsInProgram().length === 1').toEvalAs(true);
        expect('program.createKernelsInProgram()[0] instanceof WebCLKernel').toEvalAs(true);
      });

      it("createKernel*(<invalid arguments>) must throw", function() {
        expect('program.build()').not.toThrow();
        argc('program.createKernel', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('program.createKernel', signature, valid, null, [0], 'INVALID_KERNEL_NAME');
        argc('program.createKernelsInProgram', [], 'WEBCL_SYNTAX_ERROR');
      });

      it("createKernel*() must throw if the program has not been built successfully", function() {
        expect('program.createKernel("dummy")').toThrow('INVALID_PROGRAM_EXECUTABLE');
        expect('program.createKernelsInProgram()').toThrow('INVALID_PROGRAM_EXECUTABLE');
        expect('program.build(null, "--invalid-option")').toThrow('INVALID_BUILD_OPTIONS');
        expect('program.createKernel("dummy")').toThrow('INVALID_PROGRAM_EXECUTABLE');
        expect('program.createKernelsInProgram()').toThrow('INVALID_PROGRAM_EXECUTABLE');
        expect('program = ctx.createProgram("kernel void dummy() { invalidStatement; }")').not.toThrow();
        expect('program.build()').toThrow('BUILD_PROGRAM_FAILURE');
        expect('program.createKernel("dummy")').toThrow('INVALID_PROGRAM_EXECUTABLE');
        expect('program.createKernelsInProgram()').toThrow('INVALID_PROGRAM_EXECUTABLE');
      });

      it("createKernel*() must throw if the most recent build was not successful", function() {
        expect('program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }")').not.toThrow();
        expect('program.build()').not.toThrow();
        expect('program.build(null, "-D kernel=foo")').toThrow('BUILD_PROGRAM_FAILURE');
        expect('program.createKernel("dummy")').toThrow('INVALID_PROGRAM_EXECUTABLE');
        expect('program.createKernelsInProgram()').toThrow('INVALID_PROGRAM_EXECUTABLE');
      });

      it("build() must throw if kernels are already created", function() {
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
    
    beforeEach(setup.bind(this, function() {
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

      beforeEach(setup.bind(this, function() {
        program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
        program.build();
        kernel = program.createKernel("dummy");
      }));

      it("getInfo(<validEnum>) must work", function() {
        expect('kernel.getInfo(WebCL.KERNEL_FUNCTION_NAME)').not.toThrow();
        expect('kernel.getInfo(WebCL.KERNEL_NUM_ARGS)').not.toThrow();
        expect('kernel.getInfo(WebCL.KERNEL_CONTEXT)').not.toThrow();
        expect('kernel.getInfo(WebCL.KERNEL_PROGRAM)').not.toThrow();
        expect('kernel.getInfo(WebCL.KERNEL_FUNCTION_NAME) === "dummy"').toEvalAs(true);
        expect('kernel.getInfo(WebCL.KERNEL_NUM_ARGS) === 1').toEvalAs(true);
        expect('kernel.getInfo(WebCL.KERNEL_CONTEXT) === ctx').toEvalAs(true);
        expect('kernel.getInfo(WebCL.KERNEL_PROGRAM) === program').toEvalAs(true);
      });

      it("getInfo(<invalid arguments) must throw", function() {
        argc('kernel.getInfo', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('kernel.getInfo', signature, valid, null, [0], 'INVALID_VALUE');
      });
      
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLKernel -> getWorkGroupInfo
    // 
    describe("getWorkGroupInfo", function() {

      var signature = [ 'OptionalWebCLObject', 'Enum' ];
      var valid = [ 'device', 'WebCL.KERNEL_WORK_GROUP_SIZE' ];

      beforeEach(setup.bind(this, function() {
        ctx = createContext();
        devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
        device = devices[0];
        program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
        program.build();
        kernel = program.createKernel("dummy");
      }));

      it("getWorkGroupInfo(<valid enum>) must work", function() {
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
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_WORK_GROUP_SIZE)').not.toThrow();
        expect('kernel.getWorkGroupInfo(undefined, WebCL.KERNEL_WORK_GROUP_SIZE)').not.toThrow();
        expect('kernel.getWorkGroupInfo(null, WebCL.KERNEL_WORK_GROUP_SIZE)').not.toThrow();
      });

      it("getWorkGroupInfo(COMPILE_WORK_GROUP_SIZE) must report the expected reqd_work_group_size", function() {
        program = ctx.createProgram("kernel __attribute__((reqd_work_group_size(4, 3, 2))) void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
        expect('program.build()').not.toThrow();
        expect('kernel = program.createKernel("dummy")').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)').not.toThrow();
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE) instanceof Array').toEvalAs(true);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)[0]').toEvalAs(4);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)[1]').toEvalAs(3);
        expect('kernel.getWorkGroupInfo(device, WebCL.KERNEL_COMPILE_WORK_GROUP_SIZE)[2]').toEvalAs(2);
      });

      it("getWorkGroupInfo(<invalid arguments>) must throw", function() {
        argc('kernel.getWorkGroupInfo', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('kernel.getWorkGroupInfo', signature, valid, null, [0], 'INVALID_DEVICE');
        fuzz('kernel.getWorkGroupInfo', signature, valid, null, [1], 'INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLKernel -> setArg
    // 
    describe("setArg", function() {

      beforeEach(setupWithSource.bind(this, 'kernels/argtypes.cl', function(src) {
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, 128);
        image = ctx.createImage(WebCL.MEM_READ_WRITE, { width: 32, height: 32 });
        sampler = ctx.createSampler(true, WebCL.ADDRESS_REPEAT, WebCL.FILTER_NEAREST);
        program = ctx.createProgram(src);
        program.build(devices);
        kernelWithMemArgs = program.createKernel('objects');
        kernelWithScalarArgs = program.createKernel('scalars');
        kernelWithVectorArgs = program.createKernel('vectors');
        kernelWithLocalArgs = program.createKernel('localmem');
      }));

      it("setArg(index, clObject) must work if clObject matches the expected type", function() {
        expect('kernelWithMemArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithMemArgs.setArg(0, buffer)').not.toThrow();
        expect('kernelWithMemArgs.setArg(1, image)').not.toThrow();
        expect('kernelWithMemArgs.setArg(2, image)').not.toThrow();
        expect('kernelWithMemArgs.setArg(3, sampler)').not.toThrow();
      });

      it("setArg(index, value) must work if value matches the expected scalar type", function() {
        expect('kernelWithScalarArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithScalarArgs.setArg(1, new Int8Array(1))').not.toThrow();    // char
        expect('kernelWithScalarArgs.setArg(2, new Int16Array(1))').not.toThrow();   // short
        expect('kernelWithScalarArgs.setArg(3, new Int32Array(1))').not.toThrow();   // int
        expect('kernelWithScalarArgs.setArg(4, new Uint32Array(2))').not.toThrow();  // long
        expect('kernelWithScalarArgs.setArg(5, new Uint8Array(1))').not.toThrow();   // uchar
        expect('kernelWithScalarArgs.setArg(6, new Uint16Array(1))').not.toThrow();  // ushort
        expect('kernelWithScalarArgs.setArg(7, new Uint32Array(1))').not.toThrow();  // uint
        expect('kernelWithScalarArgs.setArg(8, new Uint32Array(2))').not.toThrow();  // ulong
        expect('kernelWithScalarArgs.setArg(9, new Float32Array(1))').not.toThrow(); // float
      });

      it("setArg(index, value) must work if value matches the expected vector type", function() {
        expect('kernelWithVectorArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithVectorArgs.setArg(1, new Int8Array(4))').not.toThrow();    // char4
        expect('kernelWithVectorArgs.setArg(2, new Int16Array(4))').not.toThrow();   // short4
        expect('kernelWithVectorArgs.setArg(3, new Int32Array(4))').not.toThrow();   // int4
        expect('kernelWithVectorArgs.setArg(4, new Uint32Array(8))').not.toThrow();  // long4
        expect('kernelWithVectorArgs.setArg(5, new Uint8Array(4))').not.toThrow();   // uchar4
        expect('kernelWithVectorArgs.setArg(6, new Uint16Array(4))').not.toThrow();  // ushort4
        expect('kernelWithVectorArgs.setArg(7, new Uint32Array(4))').not.toThrow();  // uint4
        expect('kernelWithVectorArgs.setArg(8, new Uint32Array(8))').not.toThrow();  // ulong4
        expect('kernelWithVectorArgs.setArg(9, new Float32Array(4))').not.toThrow(); // float4
      });

      it("setArg(index, value) must work if a local memory size is passed in using Uint32Array of length 1", function() {
        expect('kernelWithLocalArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithLocalArgs.setArg(1, new Uint32Array([10]))').not.toThrow();
      });

      it("setArg(<invalid arguments>) must throw", function() {
        var signature = [ 'Uint', 'Array' ];
        var valid = [ '0', 'new Int8Array(1)' ];
        var invalid = [ '10', '0xdeadbeef' ]; 
        expect('kernelWithScalarArgs instanceof WebCLKernel').toEvalAs(true);
        argc('kernelWithScalarArgs.setArg', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz("kernelWithScalarArgs.setArg", signature, valid, invalid, [0], "INVALID_ARG_INDEX");
        fuzz("kernelWithScalarArgs.setArg", signature, valid, invalid, [1], "INVALID_ARG_VALUE");
      });

      it("setArg(<buffer from another context>) must throw", function() {
        expect('kernelWithMemArgs instanceof WebCLKernel').toEvalAs(true);
        expect('ctx2 = createContext()').not.toThrow();
        expect('queue2 = ctx2.createCommandQueue()').not.toThrow();
        expect('bufferFromAnotherContext = ctx2.createBuffer(WebCL.MEM_READ_WRITE, 1024)').not.toThrow();
        expect('kernelWithMemArgs.setArg(0, bufferFromAnotherContext)').toThrow('INVALID_CONTEXT');
      });

      it("setArg(index, clObject) must throw if clObject does not match the expected type (CRITICAL)", function() {
        expect('kernelWithMemArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithMemArgs.setArg(0, image)').toThrow();
        expect('kernelWithMemArgs.setArg(0, sampler)').toThrow();
        expect('kernelWithMemArgs.setArg(1, buffer)').toThrow();
        expect('kernelWithMemArgs.setArg(1, sampler)').toThrow();
        expect('kernelWithMemArgs.setArg(2, buffer)').toThrow();
        expect('kernelWithMemArgs.setArg(2, sampler)').toThrow();
        expect('kernelWithMemArgs.setArg(3, buffer)').toThrow();
        expect('kernelWithMemArgs.setArg(3, image)').toThrow();
      });

      xit("setArg(index, clObject) must throw if an arbitrary integer is passed in (CRITICAL)", function() {
        expect('kernelWithMemArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithMemArgs.setArg(0, new Uint32Array(1))').toThrow('INVALID_MEM_OBJECT'); // global uint* expected
        expect('kernelWithMemArgs.setArg(0, new Uint32Array(2))').toThrow('INVALID_MEM_OBJECT'); // global uint* expected
        expect('kernelWithMemArgs.setArg(1, new Uint32Array(1))').toThrow('INVALID_MEM_OBJECT'); // read_only image2d_t expected
        expect('kernelWithMemArgs.setArg(1, new Uint32Array(2))').toThrow('INVALID_MEM_OBJECT'); // read_only image2d_t expected
        expect('kernelWithMemArgs.setArg(2, new Uint32Array(1))').toThrow('INVALID_MEM_OBJECT'); // write_only image2d_t expected
        expect('kernelWithMemArgs.setArg(2, new Uint32Array(2))').toThrow('INVALID_MEM_OBJECT'); // write_only image2d_t expected
        expect('kernelWithMemArgs.setArg(3, new Uint32Array(1))').toThrow('INVALID_SAMPLER');    // sampler_t expected
        expect('kernelWithMemArgs.setArg(3, new Uint32Array(2))').toThrow('INVALID_SAMPLER');    // sampler_t expected
      });

      it("setArg(index, value) must throw if value is not an ArrayBufferView (CRITICAL)", function() {
        expect('kernelWithScalarArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithScalarArgs.setArg(3, new ArrayBuffer(4))').toThrow('INVALID_ARG_VALUE'); // int expected
        expect('kernelWithScalarArgs.setArg(4, new ArrayBuffer(8))').toThrow('INVALID_ARG_VALUE'); // long expected
        expect('kernelWithScalarArgs.setArg(3, [42])').toThrow('INVALID_ARG_VALUE');               
        expect('kernelWithScalarArgs.setArg(4, [42])').toThrow('INVALID_ARG_VALUE');               
        expect('kernelWithScalarArgs.setArg(3, 42)').toThrow('INVALID_ARG_VALUE');                
        expect('kernelWithScalarArgs.setArg(4, 42)').toThrow('INVALID_ARG_VALUE');
        expect('kernelWithScalarArgs.setArg(3, {})').toThrow('INVALID_ARG_VALUE');
        expect('kernelWithScalarArgs.setArg(4, {})').toThrow('INVALID_ARG_VALUE');
        expect('kernelWithScalarArgs.setArg(3, buffer)').toThrow('INVALID_ARG_VALUE');
        expect('kernelWithScalarArgs.setArg(4, buffer)').toThrow('INVALID_ARG_VALUE');
        expect('kernelWithScalarArgs.setArg(3, image)').toThrow('INVALID_ARG_VALUE');
        expect('kernelWithScalarArgs.setArg(4, image)').toThrow('INVALID_ARG_VALUE');
        expect('kernelWithScalarArgs.setArg(3, sampler)').toThrow('INVALID_ARG_VALUE');
        expect('kernelWithScalarArgs.setArg(4, sampler)').toThrow('INVALID_ARG_VALUE');
        expect('kernelWithScalarArgs.setArg(3, kernelWithScalarArgs)').toThrow('INVALID_ARG_VALUE');
        expect('kernelWithScalarArgs.setArg(4, kernelWithScalarArgs)').toThrow('INVALID_ARG_VALUE');
      });

      it("setArg(index, value) must throw if value does not match the expected scalar size", function() {
        expect('kernelWithScalarArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithScalarArgs.setArg(1, new Int8Array(0))').toThrow('INVALID_ARG_SIZE');    // char
        expect('kernelWithScalarArgs.setArg(1, new Int8Array(2))').toThrow('INVALID_ARG_SIZE');    // char
        expect('kernelWithScalarArgs.setArg(2, new Int16Array(2))').toThrow('INVALID_ARG_SIZE');   // short
        expect('kernelWithScalarArgs.setArg(3, new Int32Array(2))').toThrow('INVALID_ARG_SIZE');   // int
        expect('kernelWithScalarArgs.setArg(4, new Uint32Array(1))').toThrow('INVALID_ARG_SIZE');  // long
        expect('kernelWithScalarArgs.setArg(4, new Uint32Array(3))').toThrow('INVALID_ARG_SIZE');  // long
        expect('kernelWithScalarArgs.setArg(5, new Uint8Array(2))').toThrow('INVALID_ARG_SIZE');   // uchar
        expect('kernelWithScalarArgs.setArg(6, new Uint16Array(2))').toThrow('INVALID_ARG_SIZE');  // ushort
        expect('kernelWithScalarArgs.setArg(7, new Uint32Array(2))').toThrow('INVALID_ARG_SIZE');  // uint
        expect('kernelWithScalarArgs.setArg(8, new Uint32Array(1))').toThrow('INVALID_ARG_SIZE');  // ulong
        expect('kernelWithScalarArgs.setArg(8, new Uint32Array(1))').toThrow('INVALID_ARG_SIZE');  // ulong
        expect('kernelWithScalarArgs.setArg(9, new Float32Array(2))').toThrow('INVALID_ARG_SIZE'); // float
      });

      it("setArg(index, value) must throw if value does not match the expected vector size", function() {
        expect('kernelWithVectorArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithVectorArgs.setArg(1, new Int8Array(0))').toThrow('INVALID_ARG_SIZE');    // char4
        expect('kernelWithVectorArgs.setArg(2, new Int16Array(3))').toThrow('INVALID_ARG_SIZE');   // short4
        expect('kernelWithVectorArgs.setArg(3, new Int32Array(5))').toThrow('INVALID_ARG_SIZE');   // int4
        expect('kernelWithVectorArgs.setArg(4, new Uint32Array(16))').toThrow('INVALID_ARG_SIZE'); // long4
        expect('kernelWithVectorArgs.setArg(5, new Uint8Array(8))').toThrow('INVALID_ARG_SIZE');   // uchar4
        expect('kernelWithVectorArgs.setArg(6, new Uint16Array(2))').toThrow('INVALID_ARG_SIZE');  // ushort4
        expect('kernelWithVectorArgs.setArg(7, new Uint32Array(8))').toThrow('INVALID_ARG_SIZE');  // uint4
        expect('kernelWithVectorArgs.setArg(8, new Uint32Array(4))').toThrow('INVALID_ARG_SIZE');  // ulong4
        expect('kernelWithVectorArgs.setArg(8, new Uint32Array(16))').toThrow('INVALID_ARG_SIZE'); // ulong4
        expect('kernelWithVectorArgs.setArg(9, new Float32Array(8))').toThrow('INVALID_ARG_SIZE'); // float4
      });

      it("setArg(index, value) must throw if value type is wrong, even if the size is right", function() {
        expect('kernelWithScalarArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithScalarArgs.setArg(1, new Uint8Array(1))').toThrow('INVALID_ARG_VALUE');    // char
        expect('kernelWithScalarArgs.setArg(2, new Uint16Array(1))').toThrow('INVALID_ARG_VALUE');   // short
        expect('kernelWithScalarArgs.setArg(2, new Uint8Array(2))').toThrow('INVALID_ARG_VALUE');    // short
        expect('kernelWithScalarArgs.setArg(2, new Int8Array(2))').toThrow('INVALID_ARG_VALUE');     // short
        expect('kernelWithScalarArgs.setArg(3, new Uint32Array(1))').toThrow('INVALID_ARG_VALUE');   // int
        expect('kernelWithScalarArgs.setArg(3, new Uint16Array(2))').toThrow('INVALID_ARG_VALUE');   // int
        expect('kernelWithScalarArgs.setArg(3, new Int16Array(2))').toThrow('INVALID_ARG_VALUE');    // int
        expect('kernelWithScalarArgs.setArg(3, new Uint8Array(4))').toThrow('INVALID_ARG_VALUE');    // int
        expect('kernelWithScalarArgs.setArg(3, new Int8Array(4))').toThrow('INVALID_ARG_VALUE');     // int
        expect('kernelWithScalarArgs.setArg(3, new Float32Array(1))').toThrow('INVALID_ARG_VALUE');  // int
        expect('kernelWithScalarArgs.setArg(4, new Float32Array(2))').toThrow('INVALID_ARG_VALUE');  // long
      });

      it("setArg(index, value) must throw if a local memory size is passed in using anything but Uint32Array of length 1", function() {
        expect('kernelWithLocalArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithLocalArgs.setArg(1, new Int32Array(1))').toThrow();
        expect('kernelWithLocalArgs.setArg(1, new Uint16Array(2))').toThrow();
        expect('kernelWithLocalArgs.setArg(1, new ArrayBuffer(4))').toThrow();
        expect('kernelWithLocalArgs.setArg(1, new Uint32Array(0))').toThrow();
        expect('kernelWithLocalArgs.setArg(1, new Uint32Array(2))').toThrow();
        expect('kernelWithLocalArgs.setArg(1, [42])').toThrow();
        expect('kernelWithLocalArgs.setArg(1, 42)').toThrow();
        expect('kernelWithLocalArgs.setArg(1, {})').toThrow();
        expect('kernelWithLocalArgs.setArg(1, buffer)').toThrow();
        expect('kernelWithLocalArgs.setArg(1, image)').toThrow();
        expect('kernelWithLocalArgs.setArg(1, sampler)').toThrow();
        expect('kernelWithLocalArgs.setArg(1, kernel)').toThrow();
      });

      it("setArg(index, value) must throw if attempting to set local memory size to zero", function() {
        expect('kernelWithLocalArgs instanceof WebCLKernel').toEvalAs(true);
        expect('kernelWithLocalArgs.setArg(1, new Uint32Array([0]))').toThrow('INVALID_ARG_SIZE');
      });

    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Runtime -> WebCLCommandQueue
  // 
  describe("WebCLCommandQueue", function() {

    beforeEach(setup.bind(this, function() {
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

      it("getInfo(<valid enum>) must work", function() {
        expect('queue.getInfo(WebCL.QUEUE_CONTEXT)').not.toThrow();
        expect('queue.getInfo(WebCL.QUEUE_DEVICE)').not.toThrow();
        expect('queue.getInfo(WebCL.QUEUE_PROPERTIES)').not.toThrow();
        expect('queue.getInfo(WebCL.QUEUE_CONTEXT) === ctx').toEvalAs(true);
        expect('queue.getInfo(WebCL.QUEUE_DEVICE) === device').toEvalAs(true);
        expect('queue.getInfo(WebCL.QUEUE_PROPERTIES) === 0').toEvalAs(true);
      });

      it("getInfo(<invalid enum>) must throw", function() {
        argc('queue.getInfo', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('queue.getInfo', signature, valid, null, [0], 'TypeError');
        expect('queue.getInfo(0x2001)').toThrow('INVALID_VALUE');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLCommandQueue -> enqueue[Read,Write,Copy]Buffer
    // 
    describe("enqueue[*]Buffer", function() {

      var signature = [ 'WebCLObject',            // buffer
                        'Boolean',                // blockingRead/Write
                        'Uint',                   // bufferOffset
                        'Uint',                   // numBytes
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

      beforeEach(setup.bind(this, function() {
        numBytes = 1024;
        hostPtr = new Uint8Array(numBytes);
        hostPtr32f = new Float32Array(numBytes/4);
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, numBytes);
        image = ctx.createImage(WebCL.MEM_READ_WRITE, { width: 32, height: 32 });
      }));

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe("enqueueReadBuffer", function() {

        it("enqueueReadBuffer(<valid arguments>) must work", function() {
          expect('queue.enqueueReadBuffer(buffer, true, 0, numBytes, hostPtr)').not.toThrow();
          expect('queue.enqueueReadBuffer(buffer, true, 0, numBytes, hostPtr32f)').not.toThrow();
          expect('queue.enqueueReadBuffer(buffer, true, 1, numBytes-1, hostPtr)').not.toThrow();
          expect('queue.enqueueReadBuffer(buffer, true, numBytes-1, 1, hostPtr)').not.toThrow();
          expect('queue.enqueueReadBuffer(buffer, true, 0, 1, new Uint8Array(1))').not.toThrow();
          expect('queue.enqueueReadBuffer(buffer, false, 0, numBytes, hostPtr); queue.finish();').not.toThrow();
        });

        it("enqueueReadBuffer(<invalid arguments>) must throw", function() {
          argc('queue.enqueueReadBuffer', valid, 'WEBCL_SYNTAX_ERROR');
          fuzz('queue.enqueueReadBuffer', signature, valid, null, [0], 'INVALID_MEM_OBJECT');
          fuzz('queue.enqueueReadBuffer', signature, valid, null, [1, 2, 3, 4], 'TypeError');
          fuzz('queue.enqueueReadBuffer', signature, valid, null, [5], 'TypeError');
          fuzz('queue.enqueueReadBuffer', signature, valid, null, [6], 'INVALID_EVENT');
        });

        it("enqueueReadBuffer(<invalid buffer>) must throw", function() {
          expect('queue.enqueueReadBuffer(image, true, 0, 32, hostPtr)').toThrow('INVALID_MEM_OBJECT');
        });

        it("enqueueReadBuffer(<buffer from another context>) must throw", function() {
          ctx2 = createContext();
          queue2 = ctx2.createCommandQueue();
          expect('queue2.enqueueReadBuffer(buffer, true, 0, numBytes, hostPtr)').toThrow('INVALID_CONTEXT');
        });

        it("enqueueReadBuffer(<invalid numBytes>) must throw", function() {
          expect('queue.enqueueReadBuffer(buffer, true, 0, numBytes-1, hostPtr32f)').toThrow('INVALID_VALUE');
        });

        it("enqueueReadBuffer(<buffer region out of bounds>) must throw", function() {
          expect('queue.enqueueReadBuffer(buffer, true, 1, numBytes, hostPtr)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadBuffer(buffer, true, numBytes, 1, hostPtr)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadBuffer(buffer, true, numBytes-1, 2, hostPtr)').toThrow('INVALID_VALUE');
        });

        it("enqueueReadBuffer(<hostPtr region out of bounds>) must throw", function() {
          expect('queue.enqueueReadBuffer(buffer, true, 0, numBytes, hostPtr.subarray(0,-1))').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadBuffer(buffer, true, 0, 1, new Uint8Array(0))').toThrow('INVALID_VALUE');
        });

      });

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe("enqueueWriteBuffer", function() {

        it("enqueueWriteBuffer(<valid arguments>) must work", function() {
          expect('queue.enqueueWriteBuffer(buffer, true, 0, numBytes, hostPtr)').not.toThrow();
          expect('queue.enqueueWriteBuffer(buffer, true, 0, numBytes, hostPtr32f)').not.toThrow();
          expect('queue.enqueueWriteBuffer(buffer, true, 1, numBytes-1, hostPtr)').not.toThrow();
          expect('queue.enqueueWriteBuffer(buffer, true, numBytes-1, 1, hostPtr)').not.toThrow();
          expect('queue.enqueueWriteBuffer(buffer, true, 0, 1, new Uint8Array(1))').not.toThrow();
          expect('queue.enqueueWriteBuffer(buffer, false, 0, numBytes, hostPtr); queue.finish();').not.toThrow();
        });

        it("enqueueWriteBuffer(<invalid arguments>) must throw", function() {
          argc('queue.enqueueWriteBuffer', valid, 'WEBCL_SYNTAX_ERROR');
          fuzz('queue.enqueueWriteBuffer', signature, valid, null, [0], 'INVALID_MEM_OBJECT');
          fuzz('queue.enqueueWriteBuffer', signature, valid, null, [1, 2, 3, 4], 'TypeError');
          fuzz('queue.enqueueWriteBuffer', signature, valid, null, [5], 'TypeError');
          fuzz('queue.enqueueWriteBuffer', signature, valid, null, [6], 'INVALID_EVENT');
        });

        it("enqueueWriteBuffer(<invalid buffer>) must throw", function() {
          expect('queue.enqueueWriteBuffer(image, true, 0, 32, hostPtr)').toThrow('INVALID_MEM_OBJECT');
        });

        it("enqueueWriteBuffer(<buffer from another context>) must throw", function() {
          ctx2 = createContext();
          queue2 = ctx2.createCommandQueue();
          expect('queue2.enqueueWriteBuffer(buffer, true, 0, numBytes, hostPtr)').toThrow('INVALID_CONTEXT');
        });

        it("enqueueWriteBuffer(<invalid numBytes>) must throw", function() {
          expect('queue.enqueueWriteBuffer(buffer, true, 0, numBytes-1, hostPtr32f)').toThrow('INVALID_VALUE');
        });

        it("enqueueWriteBuffer(<buffer region out of bounds>) must throw", function() {
          expect('queue.enqueueWriteBuffer(buffer, true, 1, numBytes, hostPtr)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteBuffer(buffer, true, numBytes, 1, hostPtr)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteBuffer(buffer, true, numBytes-1, 2, hostPtr)').toThrow('INVALID_VALUE');
        });

        it("enqueueWriteBuffer(<hostPtr region out of bounds>) must throw", function() {
          expect('queue.enqueueWriteBuffer(buffer, true, 0, numBytes, hostPtr.subarray(0,-1))').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteBuffer(buffer, true, 0, 1, new Uint8Array(0))').toThrow('INVALID_VALUE');
        });

      });

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe("enqueueCopyBuffer", function() {
        
        var signature = [ 'WebCLObject',            // srcBuffer
                          'WebCLObject',            // dstBuffer
                          'Uint',                   // srcOffset
                          'Uint',                   // dstOffset
                          'Uint',                   // numBytes
                          'OptionalArray',          // eventWaitList
                          'OptionalWebCLObject'     // event
                        ];

        var valid = [ 'buffer1', 
                      'buffer2',
                      '0',
                      '0',
                      'numBytes',
                      'undefined',
                      'undefined'
                    ];

        beforeEach(setup.bind(this, function() {
          numBytes = 1024;
          buffer1 = ctx.createBuffer(WebCL.MEM_READ_WRITE, numBytes);
          buffer2 = ctx.createBuffer(WebCL.MEM_READ_WRITE, numBytes);
        }));

        it("enqueueCopyBuffer(<valid arguments>) must work", function() {
          expect('queue.enqueueCopyBuffer(buffer1, buffer2, 0, 0, numBytes)').not.toThrow();
        });

        it("enqueueCopyBuffer(<invalid arguments>) must throw", function() {
          argc('queue.enqueueCopyBuffer', valid, 'WEBCL_SYNTAX_ERROR');
          fuzz('queue.enqueueCopyBuffer', signature, valid, null, [0, 1], 'INVALID_MEM_OBJECT');
          fuzz('queue.enqueueCopyBuffer', signature, valid, null, [2, 3, 4], 'TypeError');
          fuzz('queue.enqueueCopyBuffer', signature, valid, null, [5], 'TypeError');
          fuzz('queue.enqueueCopyBuffer', signature, valid, null, [6], 'INVALID_EVENT');
        });

      });

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe("enqueueCopyBufferRect", function() {
        
        var signature = [ 'WebCLObject',            // srcBuffer
                          'WebCLObject',            // dstBuffer
                          'Array',                  // srcOrigin
                          'Array',                  // dstOrigin
                          'Array',                  // region
                          'Uint',                   // srcRowPitch
                          'Uint',                   // srcSlicePitch
                          'Uint',                   // dstRowPitch
                          'Uint',                   // dstSlicePitch
                          'OptionalArray',          // eventWaitList
                          'OptionalWebCLObject'     // event
                        ];

        var valid = [ 'buffer1', 
                      'buffer2',
                      '[0,0,0]',
                      '[0,0,0]',
                      '[3,4,5]',
                      0, 0, 0, 0,
                      'undefined',
                      'undefined'
                    ];

        beforeEach(setup.bind(this, function() {
          numBytes = 1024;
          buffer1 = ctx.createBuffer(WebCL.MEM_READ_WRITE, numBytes);
          buffer2 = ctx.createBuffer(WebCL.MEM_READ_WRITE, numBytes);
        }));

        it("enqueueCopyBufferRect(<valid arguments>) must work", function() {
          expect('queue.enqueueCopyBufferRect(buffer1, buffer2, [0,0,0], [0,0,0], [32,32,1], 0, 0, 0, 0)').not.toThrow();
        });

        it("enqueueCopyBufferRect(<invalid arguments>) must throw", function() {
          argc('queue.enqueueCopyBufferRect', valid, 'WEBCL_SYNTAX_ERROR');
          fuzz('queue.enqueueCopyBufferRect', signature, valid, null, [0, 1], 'INVALID_MEM_OBJECT');
          fuzz('queue.enqueueCopyBufferRect', signature, valid, null, [2, 3, 4, 5, 6, 7, 8], 'TypeError');
          fuzz('queue.enqueueCopyBufferRect', signature, valid, null, [9], 'TypeError');
          fuzz('queue.enqueueCopyBufferRect', signature, valid, null, [10], 'INVALID_EVENT');
        });

      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLCommandQueue -> enqueue[Read,Write]Image
    // 
    describe("enqueue[*]Image", function() {

      var signature = [ 'WebCLObject',            // image
                        'Boolean',                // blockingRead/Write
                        'Array',                  // origin (TODO: change spec to allow null!)
                        'Array',                  // region (TODO: change spec to allow null!)
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

      beforeEach(setup.bind(this, function() {
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
        pixels[0] = 0xfc;
        pixels[100] = 0xcf;
        pixelsf32 = new Float32Array(W*H*C);
        image = ctx.createImage(WebCL.MEM_READ_WRITE, descriptorRGBA8, pixels);
        imagef32 = ctx.createImage(WebCL.MEM_READ_WRITE, descriptorRGBAf32);
        buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, W*H*C);
      }));

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe("enqueueReadImage", function() {

        it("enqueueReadImage(<valid arguments>) must work with RGBA8", function() {
          expect('queue.enqueueReadImage(image, true, [0, 0], [W, H], 0, pixels)').not.toThrow();
          expect('queue.enqueueReadImage(image, true, [0, 0], [W, H], bytesPerRow, pixels)').not.toThrow();
          expect('queue.enqueueReadImage(image, true, [0, 0], [W, H], bytesPerRow, pixels)').not.toThrow();
          expect('queue.enqueueReadImage(image, true, [W-1, 0], [1, H], 0, pixels)').not.toThrow();
          expect('queue.enqueueReadImage(image, true, [0, H-1], [W, 1], 0, pixels)').not.toThrow();
          expect('queue.enqueueReadImage(image, true, [W-1, 0], [1, H], bytesPerRow, pixels)').not.toThrow();
          expect('queue.enqueueReadImage(image, false, [0, 0], [W, H], 0, pixels); queue.finish();').not.toThrow();
        });

        it("enqueueReadImage(<valid arguments>) must work with RGBAf32", function() {
          expect('queue.enqueueReadImage(imagef32, true, [0, 0], [W, H], 0, pixelsf32)').not.toThrow();
          expect('queue.enqueueReadImage(imagef32, true, [0, 0], [W, H], bytesPerRowf32, pixelsf32)').not.toThrow();
          expect('queue.enqueueReadImage(imagef32, true, [0, 0], [W, H], bytesPerRowf32, pixelsf32)').not.toThrow();
          expect('queue.enqueueReadImage(imagef32, true, [W-1, 0], [1, H], 0, pixelsf32)').not.toThrow();
        });

        it("enqueueReadImage(<valid arguments>) must return the expected data", function() {
          results = new Uint8Array(W*H*C);
          expect('queue.enqueueReadImage(image, true, [0, 0], [W, H], 0, results)').not.toThrow();
          expect('results[0]').toEvalTo(0xfc);
          expect(results[100]).toEqual(0xcf);
        });

        it("enqueueReadImage(<invalid arguments>) must throw", function() {
          argc('queue.enqueueReadImage', valid, 'WEBCL_SYNTAX_ERROR');
          fuzz('queue.enqueueReadImage', signature, valid, null, [0], 'INVALID_MEM_OBJECT');
          fuzz('queue.enqueueReadImage', signature, valid, null, [1, 2, 3, 4, 5], 'TypeError');
          fuzz('queue.enqueueReadImage', signature, valid, null, [6], 'TypeError');
          fuzz('queue.enqueueReadImage', signature, valid, null, [7], 'INVALID_EVENT');
        });

        it("enqueueReadImage(<invalid image>) must throw", function() {
          expect('queue.enqueueReadImage(buffer, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        });

        it("enqueueReadImage(<image from another context>) must throw", function() {
          ctx2 = createContext();
          queue2 = ctx2.createCommandQueue();
          expect('queue2.enqueueReadImage(image, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_CONTEXT');
        });

        it("enqueueReadImage(<invalid origin>) must throw", function() {
          expect('queue.enqueueReadImage(image, true, [0], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0, 0, 0], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0, null], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0, "foo"], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0, -1], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        });

        it("enqueueReadImage(<invalid region>) must throw", function() {
          expect('queue.enqueueReadImage(image, true, [0,0], [W], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,0], [W, H, 1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,0], [W, null], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,0], [W, "foo"], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,0], [W, -1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,0], [0, 0], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,0], [1, 0], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,0], [0, 1], 0, pixels)').toThrow('INVALID_VALUE');
        });

        it("enqueueReadImage(<invalid hostRowPitch>) must throw", function() {
          expect('queue.enqueueReadImage(image, true, [0,0], [W, H], bytesPerRow-1, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,0], [W, H], bytesPerRow+1, new Uint16Array(2*W*H*C))').toThrow('INVALID_VALUE');
        });

        it("enqueueReadImage(<invalid hostPtr>) must throw", function() {
          expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, new Uint8Array(2))').toThrow('INVALID_VALUE');
        });

        it("enqueueReadImage(<image region out-of-bounds>) must throw", function() {
          expect('queue.enqueueReadImage(image, true, [0,0], [W+1, 1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,0], [1, H+1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [1,0], [W, 1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,1], [1, H], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [W,0], [1, 1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,H-1], [1, 2], 0, pixels)').toThrow('INVALID_VALUE');
        });

        it("enqueueReadImage(<hostPtr region out-of-bounds>) must throw", function() {
          expect('queue.enqueueReadImage(image, true, [0,0], [W, H], 0, pixels.subarray(0,-2))').toThrow('INVALID_VALUE');
          expect('queue.enqueueReadImage(image, true, [0,0], [1, 1], 0, pixels.subarray(0, 3))').toThrow('INVALID_VALUE');
        });

      });

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe("enqueueWriteImage", function() {

        it("enqueueWriteImage(<valid arguments>) must work with RGBA8", function() {
          expect('queue.enqueueWriteImage(image, true, [0, 0], [W, H], 0, pixels)').not.toThrow();
          expect('queue.enqueueWriteImage(image, true, [0, 0], [W, H], bytesPerRow, pixels)').not.toThrow();
          expect('queue.enqueueWriteImage(image, true, [0, 0], [W, H], bytesPerRow, pixels)').not.toThrow();
          expect('queue.enqueueWriteImage(image, true, [W-1, 0], [1, H], 0, pixels)').not.toThrow();
          expect('queue.enqueueWriteImage(image, true, [0, H-1], [W, 1], 0, pixels)').not.toThrow();
          expect('queue.enqueueWriteImage(image, true, [W-1, 0], [1, H], bytesPerRow, pixels)').not.toThrow();
          expect('queue.enqueueWriteImage(image, false, [0, 0], [W, H], 0, pixels); queue.finish();').not.toThrow();
        });

        it("enqueueWriteImage(<valid arguments>) must work with RGBAf32", function() {
          expect('queue.enqueueWriteImage(imagef32, true, [0, 0], [W, H], 0, pixelsf32)').not.toThrow();
          expect('queue.enqueueWriteImage(imagef32, true, [0, 0], [W, H], bytesPerRowf32, pixelsf32)').not.toThrow();
          expect('queue.enqueueWriteImage(imagef32, true, [0, 0], [W, H], bytesPerRowf32, pixelsf32)').not.toThrow();
          expect('queue.enqueueWriteImage(imagef32, true, [W-1, 0], [1, H], 0, pixelsf32)').not.toThrow();
        });

        it("enqueueWriteImage(<valid arguments>) must really write the given data", function() {
          results = new Uint8Array(W*H*C);
          pixels[5] = 0xce;
          pixels[95] = 0xec;
          expect('queue.enqueueWriteImage(image, true, [0, 0], [W, H], 0, pixels)').not.toThrow();
          expect('queue.enqueueReadImage(image, true, [0, 0], [W, H], 0, results)').not.toThrow();
          expect('results[5]').toEvalTo(0xce);
          expect(results[95]).toEqual(0xec);
        });

        it("enqueueWriteImage(<invalid arguments>) must throw", function() {
          argc('queue.enqueueWriteImage', valid, 'WEBCL_SYNTAX_ERROR');
          fuzz('queue.enqueueWriteImage', signature, valid, null, [0], 'INVALID_MEM_OBJECT');
          fuzz('queue.enqueueWriteImage', signature, valid, null, [1, 2, 3, 4, 5], 'TypeError');
          fuzz('queue.enqueueWriteImage', signature, valid, null, [6], 'TypeError');
          fuzz('queue.enqueueWriteImage', signature, valid, null, [7], 'INVALID_EVENT');
        });

        it("enqueueWriteImage(<invalid image>) must throw", function() {
          expect('queue.enqueueWriteImage(buffer, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_MEM_OBJECT');
        });

        it("enqueueWriteImage(<image from another context>) must throw", function() {
          ctx2 = createContext();
          queue2 = ctx2.createCommandQueue();
          expect('queue2.enqueueWriteImage(image, true, [0,0], [W, H], 0, pixels)').toThrow('INVALID_CONTEXT');
        });

        it("enqueueWriteImage(<invalid origin>) must throw", function() {
          expect('queue.enqueueWriteImage(image, true, [0], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0, 0, 0], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0, null], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0, "foo"], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0, -1], [W, H], 0, pixels)').toThrow('INVALID_VALUE');
        });

        it("enqueueWriteImage(<invalid region>) must throw", function() {
          expect('queue.enqueueWriteImage(image, true, [0,0], [W], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,0], [W, H, 1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,0], [W, null], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,0], [W, "foo"], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,0], [W, -1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,0], [0, 0], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,0], [1, 0], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,0], [0, 1], 0, pixels)').toThrow('INVALID_VALUE');
        });

        it("enqueueWriteImage(<invalid hostRowPitch>) must throw", function() {
          expect('queue.enqueueWriteImage(image, true, [0,0], [W, H], bytesPerRow-1, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,0], [W, H], bytesPerRow+1, new Uint16Array(2*W*H*C))').toThrow('INVALID_VALUE');
        });

        it("enqueueWriteImage(<invalid hostPtr>) must throw", function() {
          expect('queue.enqueueWriteImage(image, true, [0,0], [W, H], 0, new Uint8Array(2))').toThrow('INVALID_VALUE');
        });

        it("enqueueWriteImage(<image region out-of-bounds>) must throw", function() {
          expect('queue.enqueueWriteImage(image, true, [0,0], [W+1, 1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,0], [1, H+1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [1,0], [W, 1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,1], [1, H], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [W,0], [1, 1], 0, pixels)').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,H-1], [1, 2], 0, pixels)').toThrow('INVALID_VALUE');
        });

        it("enqueueWriteImage(<hostPtr region out-of-bounds>) must throw", function() {
          expect('queue.enqueueWriteImage(image, true, [0,0], [W, H], 0, pixels.subarray(0,-2))').toThrow('INVALID_VALUE');
          expect('queue.enqueueWriteImage(image, true, [0,0], [1, 1], 0, pixels.subarray(0, 3))').toThrow('INVALID_VALUE');
        });

      });

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe("enqueueCopyImage", function() {
        
        var signature = [ 'WebCLObject',            // srcImage
                          'WebCLObject',            // dstImage
                          'Array',                  // srcOrigin (TODO change spec to allow null)
                          'Array',                  // dstOrigin (TODO change spec to allow null)
                          'Array',                  // region (TODO change spec to allow null)
                          'OptionalArray',          // eventWaitList
                          'OptionalWebCLObject'     // event
                        ];

        var valid = [ 'image1', 
                      'image2',
                      '[0, 0]',
                      '[0, 0]',
                      '[W, H]',
                      'undefined',
                      'undefined'
                    ];

        beforeEach(setup.bind(this, function() {
          W = 32;
          H = 32;
          C = 4;
          BPP = C*1;
          bytesPerRow = BPP * W;
          BPPf32 = C*4;
          bytesPerRowf32 = BPPf32 * W;
          var descriptorRGBA8 = { width : W, height : H };
          var descriptorRGBAf32 = { width : W, height : H, channelOrder : WebCL.RGBA, channelType: WebCL.FLOAT };
          image1 = ctx.createImage(WebCL.MEM_READ_WRITE, descriptorRGBA8);
          image2 = ctx.createImage(WebCL.MEM_READ_WRITE, descriptorRGBA8);
          imagef32 = ctx.createImage(WebCL.MEM_READ_WRITE, descriptorRGBAf32);
          buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, W*H*C);
        }));

        it("enqueueCopyImage(<valid arguments>) must work", function() {
          expect('queue.enqueueCopyImage(image1, image2, [0,0], [0,0], [W,H])').not.toThrow();
        });

        it("enqueueCopyImage(<invalid arguments>) must throw", function() {
          argc('queue.enqueueCopyImage', valid, 'WEBCL_SYNTAX_ERROR');
          fuzz('queue.enqueueCopyImage', signature, valid, null, [0, 1], 'INVALID_MEM_OBJECT');
          fuzz('queue.enqueueCopyImage', signature, valid, null, [2, 3, 4], 'TypeError');
          fuzz('queue.enqueueCopyImage', signature, valid, null, [5], 'TypeError');
          fuzz('queue.enqueueCopyImage', signature, valid, null, [6], 'INVALID_EVENT');
          expect('queue.enqueueCopyImage(image1, image2, [0,0,0], [0,0], [W,H])').toThrow('INVALID_VALUE');
          expect('queue.enqueueCopyImage(image1, image2, [0,0], [0,0,0], [W,H])').toThrow('INVALID_VALUE');
          expect('queue.enqueueCopyImage(image1, image2, [0,0], [0,0], [W,H,1])').toThrow('INVALID_VALUE');
          expect('queue.enqueueCopyImage(image1, image2, ["0",0], [0,0], [W,H])').toThrow('INVALID_VALUE');
          expect('queue.enqueueCopyImage(image1, image2, [-1,0], [0,0], [W,H])').toThrow('INVALID_VALUE');
          expect('queue.enqueueCopyImage(image1, image2, [0,0], [0,.1], [W,H])').toThrow('INVALID_VALUE');
          expect('queue.enqueueCopyImage(image1, image2, [0,0], [0,0], [W,H-0.5])').toThrow('INVALID_VALUE');
          expect('queue.enqueueCopyImage(image1, image2, [0,0], [0,0], [0,0])').toThrow('INVALID_VALUE');
          expect('queue.enqueueCopyImage(image1, image2, [0,0], [0,0], [1,0])').toThrow('INVALID_VALUE');
          expect('queue.enqueueCopyImage(image1, image2, [0,0], [0,0], [0,1])').toThrow('INVALID_VALUE');
        });

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
                        'Array',                  // globalWorkSize
                        'OptionalArray',          // localWorkSize
                        'OptionalArray',          // eventWaitList (TODO: change spec to explicitly allow empty array)
                        'OptionalWebCLObject'     // event
                      ];

      var valid = [ 'kernel', 
                    '1',
                    'null',
                    '[7]',
                    'undefined',
                    'undefined',
                    'undefined'
                  ];

      beforeEach(setup.bind(this, function() {
        buffer = ctx.createBuffer(WebCL.MEM_READ_ONLY, 128);
        program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[get_global_id(0)]=0xdeadbeef; }");
        devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
        program.build(devices);
        kernel = program.createKernelsInProgram()[0];
        kernel.setArg(0, buffer);
      }));

      it("must work with minimal/default arguments", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], null, null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], null, null, null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], null, [], null); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7], undefined, [], null); queue.finish()').not.toThrow();
      });

      it("must work if workDim === {1, 2, 3}", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [8, 2   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [2, 2, 3]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3.0, null, [2, 2, 3]); queue.finish()').not.toThrow();
      });

      it("must work if globalWorkOffset !== null", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0      ], [7      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [1      ], [7      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, [1, 2   ], [7, 2   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, [1, 2, 1], [2, 1, 2]); queue.finish()').not.toThrow();
      });

      it("must work if localWorkSize !== null (work-group size == 1)", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [7      ], [1      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [8, 2   ], [1, 1   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [3, 2, 2], [1, 1, 1]); queue.finish()').not.toThrow();
      });

      // This test assumes that the OpenCL device supports a flattened work-group size of at least
      // 4, and 2 in each dimension. Otherwise, the test is marked pending.
      //
      it("must work if localWorkSize !== null (work-group size > 1)", function() {
        if (!supportsWorkGroupSize(4, [2, 2, 2])) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [8      ], [2      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [8, 2   ], [2, 2   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [3, 2, 2], [1, 2, 2]); queue.finish()').not.toThrow();
      });

      it("must work if globalWorkOffset !== null and localWorkSize !== null (work-group size == 1)", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0      ], [7      ], [1      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, [1, 1   ], [7, 2   ], [1, 1   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, [0, 1, 1], [3, 2, 2], [1, 1, 1]); queue.finish()').not.toThrow();
      });

      // This test assumes that the OpenCL device supports a flattened work-group size of at least
      // 4, and 2 in each dimension. Otherwise, the test is marked pending.
      //
      it("must work if globalWorkOffset !== null and localWorkSize !== null (work-group size > 1)", function() {
        if (!supportsWorkGroupSize(4, [2, 2, 2])) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, [1      ], [8      ], [2      ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 2, [1, 1   ], [6, 2   ], [2, 2   ]); queue.finish()').not.toThrow();
        expect('queue.enqueueNDRangeKernel(kernel, 3, [1, 2, 2], [3, 2, 2], [1, 2, 2]); queue.finish()').not.toThrow();
      });

      it("enqueueNDRangeKernel(<invalid arguments> must throw", function() {
        argc('queue.enqueueNDRangeKernel', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('queue.enqueueNDRangeKernel', signature, valid, null, [0], 'INVALID_KERNEL');
        fuzz('queue.enqueueNDRangeKernel', signature, valid, null, [1, 2, 3, 4], 'TypeError');
        fuzz('queue.enqueueNDRangeKernel', signature, valid, null, [5], 'TypeError');
        fuzz('queue.enqueueNDRangeKernel', signature, valid, null, [6], 'INVALID_EVENT');
      });

      it("must throw if kernel is from another WebCLContext", function() {
        ctx2 = createContext();
        queue2 = ctx2.createCommandQueue();
        expect('queue2.enqueueNDRangeKernel(kernel, 1, null, [7]); queue.finish()').toThrow('INVALID_CONTEXT');
      });

      it("must throw if globalWorkSize.length != workDim", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [    ])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [   1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [1, 1])').toThrow('INVALID_GLOBAL_WORK_SIZE');
      });

      it("must throw if globalWorkOffset.length != workDim", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, [    ], [      1])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, [1, 1], [      1])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 2, [   1], [   1, 1])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 3, [   1], [1, 1, 1])').toThrow('INVALID_GLOBAL_OFFSET');
      });

      it("must throw if localWorkSize.length != workDim", function() {
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [      1], [    ])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [      1], [1, 1])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 2, null, [   1, 1], [   1])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [1, 1, 1], [1, 1])').toThrow('INVALID_WORK_GROUP_SIZE');
      });

      it("must throw if globalWorkSize[i] is not an integer in [1, 2^32)", function() {
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
        expect('queue.enqueueNDRangeKernel(kernel, 1, [-1], [7])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, [1.001], [7])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, ["1"], [7])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, [null], [7])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, ["foo"], [7])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0xffffffff+1], [7])').toThrow('INVALID_GLOBAL_OFFSET');
      });

      it("must throw if globalWorkOffset[i] + globalWorkSize[i] is not an integer in [1, 2^32)", function() {
        expect('queue instanceof WebCLCommandQueue').toEvalAs(true);
        expect('queue.enqueueNDRangeKernel(kernel, 1, [0xfffffffe], [2])').toThrow('INVALID_GLOBAL_OFFSET');
        expect('queue.enqueueNDRangeKernel(kernel, 1, [2], [0xfffffffe])').toThrow('INVALID_GLOBAL_OFFSET');
      });

      // This test assumes that the OpenCL device supports a work-group size of at least 2 in each
      // dimension. Otherwise, the test is marked pending.
      //
      it("must throw if globalWorkSize[i] % localWorkSize[i] !== 0", function() {
        if (!supportsWorkGroupSize(2, [2, 2, 2])) pending();
        expect('queue.enqueueNDRangeKernel(kernel, 1, null, [3], [2])').toThrow('INVALID_WORK_GROUP_SIZE');
        expect('queue.enqueueNDRangeKernel(kernel, 3, null, [4, 1, 3], [1, 1, 2])').toThrow('INVALID_WORK_GROUP_SIZE');
      });

      // This test assumes that the OpenCL device does NOT support work-group sizes up to 2^12=4096.
      // Also, the device must allow for at least 16 work-items in each dimension.  Otherwise, the
      // test is marked pending.
      //
      it("must throw if localWorkSize exceeds device-specific limits", function() {
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
    
    beforeEach(setup.bind(this, function() {
      ctx = createContext();
      queue = ctx.createCommandQueue(null, WebCL.QUEUE_PROFILING_ENABLE);
      userEvent = ctx.createUserEvent();
      emptyEvent = new WebCLEvent();
      event = new WebCLEvent();
      event1 = new WebCLEvent();
      event2 = new WebCLEvent();
    }));

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLEvent -> Initialization
    // 
    describe("Initializing", function() {

      it("new WebCLEvent() must work", function() {
        expect('event instanceof WebCLEvent').toEvalAs(true);
      });

      it("enqueue*(<emptyEvent>) must work", function() {
        expect('queue.enqueueMarker(emptyEvent)').not.toThrow();
      });

      it("enqueue*(<populatedEvent>) must throw", function() {
        expect('queue.enqueueMarker(event)').not.toThrow();
        expect('queue.enqueueMarker(event)').toThrow('INVALID_EVENT');
      });

      it("enqueue*(<releasedEvent>) must throw", function() {
        expect('queue.enqueueMarker(event)').not.toThrow();
        expect('event.release()').not.toThrow();
        expect('queue.enqueueMarker(event)').toThrow('INVALID_EVENT');
      });

      it("enqueue*(<userEvent>) must throw", function() {
        expect('queue.enqueueMarker(userEvent)').toThrow('INVALID_EVENT');
      });

      it("enqueue*(<invalidEvent>) must throw", function() {
        expect('queue.enqueueMarker("foo")').toThrow('INVALID_EVENT');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLEvent -> Wait lists
    // 
    describe("Waiting", function() {

      var API = {
        'webcl.waitForEvents' : { 
          signature : [ 'Array', 'OptionalFunction' ],
          validArgs : [ '[ emptyEvent ]', 'undefined' ],
        },
      };

      it("waitForEvents(<valid eventWaitList>) must work", function() {
        expect('queue.enqueueMarker(event)').not.toThrow();
        expect('webcl.waitForEvents([event])').not.toThrow();
      });

      it("enqueueWaitForEvents(<valid eventWaitList>) must work", function() {
        expect('queue.enqueueMarker(event)').not.toThrow();
        expect('queue.enqueueWaitForEvents([event])').not.toThrow();
        expect('queue.finish()').not.toThrow();
      });

      it("enqueueWriteImage(<valid eventWaitList>) must work", function() {
        W = 32; H = 32;
        hostPtr = new Uint8Array(W*H*4);
        image = ctx.createImage(WebCL.MEM_READ_WRITE, { width: W, height: H});
        expect('queue.enqueueWriteImage(image, false, [0, 0], [W, H], 0, hostPtr, null, event)').not.toThrow();
        expect('queue.enqueueWriteImage(image, false, [0, 0], [W, H], 0, hostPtr, [event])').not.toThrow();
        expect('queue.finish()').not.toThrow();
      });

      it("enqueueCopyImage(<valid arguments>) must work", function() {
        W = 32; H = 32;
        hostPtr = new Uint8Array(W*H*4);
        image1 = ctx.createImage(WebCL.MEM_READ_WRITE, { width: W, height: H});
        image2 = ctx.createImage(WebCL.MEM_READ_WRITE, { width: W*2, height: H+16});
        expect('queue.enqueueCopyImage(image1, image2, [0,0], [0,0], [W,H], null, event)').not.toThrow();
        expect('queue.enqueueCopyImage(image2, image1, [0,0], [0,0], [W,H], [event])').not.toThrow();
        expect('queue.finish()').not.toThrow();
      });

      it("enqueueCopyBuffer[Rect](<valid eventWaitList>) must work", function() {
        numBytes = 1024;
        buffer1 = ctx.createBuffer(WebCL.MEM_READ_WRITE, numBytes);
        buffer2 = ctx.createBuffer(WebCL.MEM_READ_WRITE, numBytes);
        expect('queue.enqueueCopyBuffer(buffer1, buffer2, 0, 0, numBytes, null, event1)').not.toThrow();
        expect('queue.enqueueCopyBuffer(buffer2, buffer1, 0, 0, numBytes, [event1], event2)').not.toThrow();
        expect('queue.enqueueCopyBufferRect(buffer1, buffer2, [0,0,0], [0,0,0], [32,32,1], 0, 0, 0, 0, [event2])').not.toThrow();
        expect('queue.finish()').not.toThrow();
      });
      
      it("waitForEvents(<invalid arguments>) must throw", function() {
        argc('webcl.waitForEvents', API['webcl.waitForEvents'].validArgs);
        fuzz2('webcl.waitForEvents', API, [0], 'TypeError');
        expect('webcl.waitForEvents([])').toThrow('INVALID_VALUE');
      });

      it("waitForEvents(<invalid event in wait list>) must throw", function() {
        expect('webcl.waitForEvents([userEvent])').toThrow('INVALID_EVENT_WAIT_LIST');
        expect('webcl.waitForEvents([emptyEvent])').toThrow('INVALID_EVENT_WAIT_LIST');
      });

      it("waitForEvents(<events in different contexts>) must throw", function() {
        eventCtx1 = new WebCLEvent();
        eventCtx2 = new WebCLEvent();
        ctx2 = createContext();
        queue2 = ctx2.createCommandQueue();
        expect('queue.enqueueMarker(eventCtx1)').not.toThrow();
        expect('queue2.enqueueMarker(eventCtx2)').not.toThrow();
        expect('webcl.waitForEvents([eventCtx1, eventCtx2])').toThrow('INVALID_CONTEXT');
      });

      it("enqueueWaitForEvents(<invalid event in wait list>) must throw", function() {
        userEvent.setStatus(-1);
        expect('queue.enqueueWaitForEvents([userEvent])').toThrow('EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST');
        expect('queue.enqueueWaitForEvents([emptyEvent])').toThrow('INVALID_EVENT_WAIT_LIST');
        expect('queue.enqueueMarker(emptyEvent)').not.toThrow();
        expect('queue.enqueueWaitForEvents([emptyEvent])').not.toThrow();
        expect('queue.finish()').not.toThrow();
      });

      it("enqueueWaitForEvents(<events in different contexts>) must throw", function() {
        eventCtx1 = new WebCLEvent();
        eventCtx2 = new WebCLEvent();
        ctx2 = createContext();
        queue2 = ctx2.createCommandQueue();
        expect('queue.enqueueMarker(eventCtx1)').not.toThrow();
        expect('queue2.enqueueMarker(eventCtx2)').not.toThrow();
        expect('queue.enqueueWaitForEvents([eventCtx1, eventCtx2])').toThrow('INVALID_CONTEXT');
      });
      
      it("enqueueWriteImage(<invalid event in wait list>) must throw", function() {
        W = 32; H = 32;
        hostPtr = new Uint8Array(W*H*4);
        image = ctx.createImage(WebCL.MEM_READ_WRITE, { width: W, height: H});
        expect('queue.enqueueWriteImage(image, true, [0, 0], [W, H], 0, hostPtr, [userEvent])').toThrow('INVALID_EVENT_WAIT_LIST');
        expect('queue.enqueueWriteImage(image, true, [0, 0], [W, H], 0, hostPtr, [emptyEvent])').toThrow('INVALID_EVENT_WAIT_LIST');
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    // Runtime -> WebCLEvent -> getInfo
    // 
    describe("getInfo", function() {

      var API = {
        'event.getInfo' : { 
          signature : [ 'Enum' ],
          validArgs : [ 'WebCL.EVENT_COMMAND_TYPE' ],
          invalidArgs : [ 'WebCL.PROFILING_COMMAND_SUBMIT' ]
        },
      };

      it("getInfo(<valid enum>) must work on a populated event", function() {
        expect('queue.enqueueMarker(event); queue.finish();').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_CONTEXT)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_QUEUE)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_TYPE)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS)').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_CONTEXT) === ctx').toEvalAs(true);
        expect('event.getInfo(WebCL.EVENT_COMMAND_QUEUE) === queue').toEvalAs(true);
        expect('event.getInfo(WebCL.EVENT_COMMAND_TYPE) === WebCL.COMMAND_MARKER').toEvalAs(true);
        expect('event.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS) === WebCL.COMPLETE').toEvalAs(true);
      });

      it("getInfo(<valid enum>) must work on a user event", function() {
        expect('userEvent = ctx.createUserEvent()').not.toThrow();
        expect('userEvent.getInfo(WebCL.EVENT_CONTEXT)').not.toThrow();
        expect('userEvent.getInfo(WebCL.EVENT_COMMAND_QUEUE)').not.toThrow();
        expect('userEvent.getInfo(WebCL.EVENT_COMMAND_TYPE)').not.toThrow();
        expect('userEvent.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS)').not.toThrow();
        expect('userEvent.getInfo(WebCL.EVENT_CONTEXT) === ctx').toEvalAs(true);
        expect('userEvent.getInfo(WebCL.EVENT_COMMAND_QUEUE) === null').toEvalAs(true);
        expect('userEvent.getInfo(WebCL.EVENT_COMMAND_TYPE) === WebCL.COMMAND_USER').toEvalAs(true);
        expect('userEvent.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS) === WebCL.SUBMITTED').toEvalAs(true);
      });

      it("getInfo(<valid enum>) must throw on an unpopulated event", function() {
        expect('event.getInfo(WebCL.EVENT_COMMAND_QUEUE)').toThrow('INVALID_EVENT');
        expect('event.getInfo(WebCL.EVENT_CONTEXT)').toThrow('INVALID_EVENT');
        expect('event.getInfo(WebCL.EVENT_COMMAND_TYPE)').toThrow('INVALID_EVENT');
        expect('event.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS)').toThrow('INVALID_EVENT');
      });

      it("getInfo(<invalid arguments>) must throw", function() {
        expect('queue.enqueueMarker(event)').not.toThrow();
        argc2('event.getInfo', API, 'WEBCL_SYNTAX_ERROR');
        fuzz2('event.getInfo', API, [0], 'INVALID_VALUE');
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
        expect('queue.enqueueMarker(event); queue.finish();').not.toThrow();
        expect('event.getInfo(WebCL.EVENT_COMMAND_EXECUTION_STATUS) === WebCL.COMPLETE').toEvalAs(true);
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_QUEUED)').not.toThrow();
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_SUBMIT)').not.toThrow();
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_START)').not.toThrow();
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_END)').not.toThrow();
      });

      it("getProfilingInfo(<validEnum>) return values must be ordered QUEUED <= SUBMIT <= START <= END", function() {
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
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_QUEUED)').toThrow('INVALID_EVENT');
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_SUBMIT)').toThrow('INVALID_EVENT');
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_START)').toThrow('INVALID_EVENT');
        expect('event.getProfilingInfo(WebCL.PROFILING_COMMAND_END)').toThrow('INVALID_EVENT');
      });

      it("getProfilingInfo(<validEnum>) must throw on a user event", function() {
        expect('userEvent = ctx.createUserEvent()').not.toThrow();
        expect('userEvent.getProfilingInfo(WebCL.PROFILING_COMMAND_QUEUED)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('userEvent.getProfilingInfo(WebCL.PROFILING_COMMAND_SUBMIT)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('userEvent.getProfilingInfo(WebCL.PROFILING_COMMAND_START)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
        expect('userEvent.getProfilingInfo(WebCL.PROFILING_COMMAND_END)').toThrow('PROFILING_INFO_NOT_AVAILABLE');
      });

      it("getProfilingInfo(<invalid arguments>) must throw", function() {
        expect('queue.enqueueMarker(event); queue.finish();').not.toThrow();
        argc('event.getProfilingInfo', valid, 'WEBCL_SYNTAX_ERROR');
        fuzz('event.getProfilingInfo', signature, valid, invalid, [0], 'INVALID_VALUE');
      });

    });
    
  });
 
  //////////////////////////////////////////////////////////////////////////////
  //
  // Runtime -> Functionality
  // 
  describe("Functionality", function() {
    
    beforeEach(setup.bind(this, function() {
      ctx = createContext();
      device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
      queue = ctx.createCommandQueue(device);

      W = 32; H = 32; Ch = 4;
      descriptorRGBA8 = { width : W, height : H };
      descriptorRGBAf32 = { width : W, height : H, channelOrder : WebCL.RGBA, channelType: WebCL.FLOAT };
    }));

    xit("createBuffer(hostPtr) + enqueueReadBuffer[Rect]", function() {
    });

    xit("createImage(hostPtr) + enqueueReadImage", function() {
    });

    xit("enqueueWriteBuffer[Rect] + enqueueReadBuffer[Rect]", function() {
    });

    xit("enqueueWriteImage + enqueueReadImage", function() {
    });

    xit("enqueueWriteBuffer + enqueueCopyBuffer[Rect] + enqueueReadBuffer", function() {
    });

    xit("enqueueWriteImage + enqueueCopyImage + enqueueReadImage", function() {
    });

    xit("enqueueWriteBuffer + enqueueCopyBufferToImage + enqueueReadImage", function() {
    });

    xit("enqueueWriteImage + enqueueCopyImageToBuffer + enqueueReadBuffer", function() {
    });

    xit("enqueueWriteBuffer + enqueueNDRangeKernel + enqueueReadBuffer", function() {
    });

    it("enqueueWriteImage + enqueueNDRangeKernel + enqueueReadImage", function() {
      hostArraySrc = new Float32Array(W*H*Ch);
      hostArrayDst = new Float32Array(W*H*Ch);
      fillRandomBytes(hostArraySrc);
      hostArraySrc[0] = 3.141;
      expect('kernels/copyImage.cl').toBuild();
      expect('copyKernel = program.createKernelsInProgram()[0]').not.toThrow();
      expect('srcImage = ctx.createImage(WebCL.MEM_READ_WRITE, descriptorRGBAf32)').not.toThrow();
      expect('dstImage = ctx.createImage(WebCL.MEM_READ_WRITE, descriptorRGBAf32)').not.toThrow();
      expect('copyKernel.setArg(0, srcImage)').not.toThrow();
      expect('copyKernel.setArg(1, dstImage)').not.toThrow();
      expect('queue.enqueueWriteImage(srcImage, true, [0,0], [W,H], 0, hostArraySrc)').not.toThrow();
      expect('queue.enqueueNDRangeKernel(copyKernel, 2, null, [W,H])').not.toThrow();
      expect('queue.enqueueReadImage(dstImage, true, [0,0], [W,H], 0, hostArrayDst)').not.toThrow();
      expect(hostArraySrc[0]).toBeCloseTo(3.141, 3);
      expect(hostArrayDst[0]).toBeCloseTo(3.141, 3);
      arrayCompare(hostArrayDst, hostArraySrc);

      function fillRandomBytes(array) {
        var buffer = new DataView(array.buffer);
        var len = array.byteLength;
        for (var i=0; i < len; i++) {
          buffer.setInt8(i, Math.floor(Math.random()*255))
        }
      }
      function arrayCompare(arr1, arr2) {
        var len = Math.min(arr1.length, arr2.length);
        for (var i=0; i < len; i++) {
          expect(arr1[i]).toEqual(arr2[i]);
        }
      }
    });

  });

  //////////////////////////////////////////////////////////////////////////////

  beforeEach(addCustomMatchers);
  afterEach(function() { webcl.releaseAll(); });

});
