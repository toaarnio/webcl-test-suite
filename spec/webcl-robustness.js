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

  beforeEach(function() {
    try {
      aPlatform = webcl.getPlatforms()[0];
      aDevice = aPlatform.getDevices()[0];
      ctx = createContext();
      preconditions = true;
    } catch (e) {
      ERROR("Robustness -> beforeEach: Caught exception " + e);
      ERROR("Robustness -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
      preconditions = false;
    }
  });

  it("must not crash or throw on releaseAll()", function() {
    if (!preconditions) pending();
    program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
    expect('program.build()').not.toThrow();
    expect('kernel = program.createKernel("dummy")').not.toThrow();
    expect('webcl.releaseAll()').not.toThrow();
  });

  it("must not crash or throw when calling release() more than once", function()  {
    if (!preconditions) pending();
    ctx.release();
    expect('ctx.release()').not.toThrow();
    expect('webcl.releaseAll()').not.toThrow();
  });

  it("must not crash or throw when manually releasing objects in 'wrong' order", function() {
    if (!preconditions) pending();
    program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
    expect('program.build()').not.toThrow();
    expect('kernel = program.createKernel("dummy")').not.toThrow();
    expect('program.release()').not.toThrow();
    expect('kernel.release()').not.toThrow();
    expect('webcl.releaseAll()').not.toThrow();
  });

  // Known failures as of 2014-03-25:
  //  * Win7 / NVIDIA GPU driver (crashes)
  //
  it("must not crash or throw when releasing user events", function() {
    if (!preconditions) pending();
    var r = confirm("This test case may crash your browser on NVIDIA OpenCL. Run anyway?");
    if (r === false) pending();
    expect('userEvent = ctx.createUserEvent()').not.toThrow();
    expect('userEvent.release()').not.toThrow();
    expect('ctx.release()').not.toThrow();
  });

  // Known failures as of 2014-03-05:
  //  * Win7 / NVIDIA GPU driver (crashes)
  //  * Win7 / Intel CPU driver (crashes)
  //
  it("must not crash or throw on build(<callback>)", function() {
    if (!preconditions) pending();
    var r = confirm("This test case may crash your browser. Run anyway?");
    if (r === false) pending();
    buildCallback = function() {
      DEBUG("WebCLProgram.build() callback invoked!");
      expect('webcl.releaseAll()').not.toThrow();
    }
    src = loadSource('kernels/rng.cl');
    expect('program = ctx.createProgram(src)').not.toThrow();
    try {
      program.build(null, null, buildCallback);
    } catch (e) {
      expect('program.build(null, null, buildCallback)').not.toThrow();
      expect('webcl.releaseAll()').not.toThrow();
    }
  });

  // Known failures as of 2014-03-05:
  //  * Win7 / Firefox 32-bit / NVIDIA GPU driver (crashes)
  //  * Win7 / Firefox 64-bit / Intel CPU driver (crashes randomly)
  //  * Mac OSX 10.9 (crashes)
  //
  it("must not crash on setArg(<invalidArgument>)", function() {
    if (!preconditions) pending();
    var r = confirm("This test case may crash your browser. Run anyway?");
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
  //  * Win7 / NVIDIA GPU driver (crashes)
  //  * Win7 / Intel CPU driver (freezes)
  //
  it("must not crash compiling a kernel that allocates 6 GB of 'local' memory", function() {
    if (!preconditions) pending();
    var r = confirm("This test case may crash your browser. Run anyway?");
    if (r === false) pending();
    expect('kernels/largeArrayLocal.cl').not.toBuild();
    expect('kernels/largeArrayLocal.cl').not.toBuild();
    expect('webcl.releaseAll()').not.toThrow();
  });

  it("must throw when trying to use an object that has been released", function() {
    if (!preconditions) pending();
    program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
    expect('program.build()').not.toThrow();
    expect('kernel = program.createKernel("dummy")').not.toThrow();
    expect('webcl.releaseAll()').not.toThrow();
    expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES)').toThrow('WEBCL_IMPLEMENTATION_FAILURE');
    expect('kernel.getInfo(WebCL.PROGRAM_CONTEXT)').toThrow('WEBCL_IMPLEMENTATION_FAILURE');
    expect('webcl.releaseAll()').not.toThrow();
  });

  // Known failures as of 2014-02-12:
  //  * Mac OSX 10.9 / CPU driver (crashes)
  //
  it("must not throw on enqueueNDRangeKernel if workDim === 2", function() {
    ctx = createContext();
    queue = ctx.createCommandQueue();
    buffer = ctx.createBuffer(WebCL.MEM_READ_ONLY, 128);
    program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
    devices = ctx.getInfo(WebCL.CONTEXT_DEVICES);
    program.build(devices);
    kernel = program.createKernelsInProgram()[0];
    kernel.setArg(0, buffer);
    expect('queue.enqueueNDRangeKernel(kernel, 2, null, [8, 2   ]); queue.finish()').not.toThrow();
  });

  beforeEach(addCustomMatchers);
});
