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

describe("Robustness", function() {

  beforeEach(function(done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
    setTimeout(done, 5);
  });

  customBeforeEach(this, function() {
    ctx = createContext();
    device = ctx.getInfo(WebCL.CONTEXT_DEVICES)[0];
  });

  // RESOLVED: Some OpenCL drivers screw up reference counting if using clRetain.
  // WORKAROUND: Do not use clRetain in the WebCL layer.
  //
  it("must not crash or throw on releaseAll()", function() {
    program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
    expect('program.build()').not.toThrow();
    expect('kernel = program.createKernel("dummy")').not.toThrow();
    expect('webcl.releaseAll()').not.toThrow();
  });

  // RESOLVED: Some OpenCL drivers screw up reference counting if using clRetain.
  // WORKAROUND: Do not use clRetain in the WebCL layer.
  //
  it("must not crash or throw when calling release() more than once", function()  {
    ctx.release();
    expect('ctx.release()').not.toThrow();
    expect('webcl.releaseAll()').not.toThrow();
  });

  // RESOLVED: Some OpenCL drivers screw up reference counting if using clRetain.
  // WORKAROUND: Do not use clRetain in the WebCL layer.
  //
  it("must not crash or throw when manually releasing objects in 'wrong' order", function() {
    program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
    expect('program.build()').not.toThrow();
    expect('kernel = program.createKernel("dummy")').not.toThrow();
    expect('program.release()').not.toThrow();
    expect('kernel.release()').not.toThrow();
    expect('webcl.releaseAll()').not.toThrow();
  });

  // RESOLVED: Some OpenCL drivers screw up reference counting if using clRetain.
  // WORKAROUND: Do not use clRetain in the WebCL layer.
  //
  it("must throw when trying to use an object that has been released", function() {
    program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
    event = new WebCLEvent();
    userEvent = ctx.createUserEvent();
    queue = ctx.createCommandQueue();
    image = ctx.createImage(WebCL.MEM_READ_WRITE, { width: 16, height: 16 });
    buffer = ctx.createBuffer(WebCL.MEM_READ_WRITE, 512);
    sampler = ctx.createSampler(true, WebCL.ADDRESS_REPEAT, WebCL.FILTER_NEAREST);
    expect('program.build()').not.toThrow();
    expect('kernel = program.createKernel("dummy")').not.toThrow();
    expect('queue.enqueueMarker(event)').not.toThrow();
    expect('queue.finish()').not.toThrow();
    expect('webcl.releaseAll()').not.toThrow();
    expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES)').toThrow('INVALID_CONTEXT');
    expect('buffer.getInfo(WebCL.MEM_CONTEXT)').toThrow('INVALID_MEM_OBJECT');
    expect('image.getInfo(WebCL.MEM_CONTEXT)').toThrow('INVALID_MEM_OBJECT');
    expect('program.getInfo(WebCL.PROGRAM_CONTEXT)').toThrow('INVALID_PROGRAM');
    expect('kernel.getInfo(WebCL.KERNEL_CONTEXT)').toThrow('INVALID_KERNEL');
    expect('queue.getInfo(WebCL.QUEUE_CONTEXT)').toThrow('INVALID_COMMAND_QUEUE');
    expect('sampler.getInfo(WebCL.SAMPLER_CONTEXT)').toThrow('INVALID_SAMPLER');
    expect('userEvent.getInfo(WebCL.EVENT_CONTEXT)').toThrow('INVALID_EVENT');
    expect('event.getInfo(WebCL.EVENT_CONTEXT)').toThrow('INVALID_EVENT');
    expect('webcl.releaseAll()').not.toThrow();
  });

  // RESOLVED: Intel CPU driver crashes when releasing an unfinished user event.
  // WORKAROUND: Force user event status to -1 before clReleaseEvent.
  //
  it("must not crash or throw when releasing user events", function() {
    expect('userEvent = ctx.createUserEvent()').not.toThrow();
    expect('userEvent.release()').not.toThrow();
    expect('ctx.release()').not.toThrow();
  });

  // RESOLVED: Erroneous typecast in WebCL bindings (lib_ocl/commandqueue.jsm).
  //
  it("must not crash or throw on enqueueNDRangeKernel if workDim === 2", function() {
    queue = ctx.createCommandQueue();
    buffer = ctx.createBuffer(WebCL.MEM_READ_ONLY, 128);
    program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
    devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
    program.build(devices);
    kernel = program.createKernelsInProgram()[0];
    kernel.setArg(0, buffer);
    expect('queue.enqueueNDRangeKernel(kernel, 2, null, [8, 2   ]); queue.finish()').not.toThrow();
  });

  // Known failures as of 2014-03-05:
  //  * None
  //
  wait("must not crash or throw on build(<callback>)", function(done) {
    var src = loadSource('kernels/rng.cl');
    program = ctx.createProgram(src);
    program.build(null, null, function() {
      try {
        suite.done = true;
        var elapsed = Date.now() - suite.startTime;
        DEBUG("program.build() callback invoked, build took " + elapsed + " ms");
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').not.toThrow();
        expect('program.getBuildInfo(device, WebCL.PROGRAM_BUILD_STATUS)').toEvalAs('WebCL.BUILD_SUCCESS');
        expect('program.createKernelsInProgram()').not.toThrow();
      } catch(e) {}
    });
  });

  // Known failures as of 2014-05-21:
  //  * Win7 / Firefox 32-bit / NVIDIA GPU driver (crashes)
  //
  wait("must not crash on waitForEvents(<valid eventWaitList>, <valid callback>)", function(done) {
    queue = ctx.createCommandQueue();
    event = new WebCLEvent();
    window.waitForEventsHandler = function() {
      suite.done = true;
      DEBUG("waitForEvents callback");
    };
    expect('queue.enqueueMarker(event)').not.toThrow();
    expect('webcl.waitForEvents([event], window.waitForEventsHandler)').not.toThrow();
  });

  // Known failures as of 2014-03-05:
  //  * Win7 / Firefox 32-bit / NVIDIA GPU driver (crashes)
  //  * Win7 / Firefox 64-bit / Intel CPU driver (crashes randomly)
  //  * Mac OSX 10.9 (crashes)
  //
  it("must not crash on setArg(<invalidArgument>)", function() {
    var r = confirm("This test case will crash your browser on all known OpenCL drivers. Run anyway?");
    if (r === false) pending();
    src = loadSource('kernels/argtypes.cl');
    expect('program = ctx.createProgram(src)').not.toThrow();
    expect('program.build()').not.toThrow();
    expect('kernel = program.createKernel("objects")').not.toThrow();
    expect('kernel.setArg(0, new Uint32Array( [0xdeadbeef] ))').toThrow('INVALID_MEM_OBJECT');  // WebCLBuffer expected
    expect('kernel.setArg(0, new Uint32Array( [-1, -2, -3] ))').toThrow('INVALID_MEM_OBJECT');  // WebCLBuffer expected
    expect('kernel.setArg(1, new Uint32Array( [0xdeadbeef] ))').toThrow('INVALID_MEM_OBJECT');  // WebCLImage expected
    expect('kernel.setArg(1, new Uint32Array( [-1, -2, -3] ))').toThrow('INVALID_MEM_OBJECT');  // WebCLImage expected
    expect('kernel.setArg(2, new Uint32Array( [0xdeadbeef] ))').toThrow('INVALID_MEM_OBJECT');  // WebCLImage expected
    expect('kernel.setArg(2, new Uint32Array( [-1, -2, -3] ))').toThrow('INVALID_MEM_OBJECT');  // WebCLImage expected
    expect('kernel.setArg(3, new Uint32Array( [0xdeadbeef] ))').toThrow('INVALID_SAMPLER');     // WebCLSampler expected
    expect('kernel.setArg(3, new Uint32Array( [-1, -2, -3] ))').toThrow('INVALID_SAMPLER');     // WebCLSampler expected
    expect('webcl.releaseAll()').not.toThrow();
  });

  // Known failures as of 2014-02-12:
  //  * Win7 / NVIDIA GPU driver
  //  * Win7 / Intel CPU driver
  //  * Win7 / Intel GPU driver (crashes)
  //
  it("must not crash on compiling a program that uses 'extern' variables", function() {
    var r = confirm("This test case will crash your browser on the Intel HD4400 GPU on Windows. Run anyway?");
    if (r === false) pending();
    expect('kernels/externVariable.cl').not.toBuild();
  });

  // Known failures as of 2014-02-12:
  //  * Win7 / NVIDIA GPU driver (crashes)
  //  * Win7 / Intel CPU driver (freezes)
  //
  it("must not crash compiling a kernel that allocates 6 GB of 'local' memory", function() {
    var r = confirm("This test case will crash your browser on Windows. Run anyway?");
    if (r === false) pending();
    expect('kernels/largeArrayLocal.cl').not.toBuild();
    expect('kernels/largeArrayLocal.cl').not.toBuild();
    expect('webcl.releaseAll()').not.toThrow();
  });

  beforeEach(addCustomMatchers);
});
