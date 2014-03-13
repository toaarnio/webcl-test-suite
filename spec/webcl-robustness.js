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

  it("must not crash or throw when calling release() more than once", function()  {
    if (!preconditions) pending();
    ctx.release();
    expect('ctx.release()').not.toThrow();
  });

  // Known failures as of 2014-03-13:
  //  * Mac OSX Mavericks (crashes)
  //
  it("must not crash or throw when releasing objects in 'wrong' order", function() {
    if (!preconditions) pending();
    program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
    expect('program.build()').not.toThrow();
    expect('kernel = program.createKernel("dummy")').not.toThrow();
    expect('program.release()').not.toThrow();
    expect('kernel.release()').not.toThrow();
    expect('webcl.releaseAll()').not.toThrow();
  });

  // Known failures as of 2014-03-05:
  //  * Win7 / NVIDIA GPU driver (crashes)
  //  * Win7 / Intel CPU driver (crashes)
  //
  it("must not crash or throw on build(<callback>)", function() {
    if (!preconditions) pending();
    buildCallback = function() {
      DEBUG("Callback invoked!");
    }
    src = loadSource('kernels/rng.cl');
    expect('program = ctx.createProgram(src)').not.toThrow();
    expect('program.build(null, null, buildCallback)').not.toThrow();
    webcl.releaseAll();
  });

  // Known failures as of 2014-03-05:
  //  * Win7 / Firefox 32-bit / NVIDIA GPU driver (crashes)
  //  * Win7 / Firefox 64-bit / Intel CPU driver (crashes randomly)
  //
  xit("must not crash on setArg(<invalidArgument>)", function() {
    if (!preconditions) pending();
    src = loadSource('kernels/rng.cl');
    expect('program = ctx.createProgram(src)').not.toThrow();
    expect('program.build()').not.toThrow();
    expect('kernel = program.createKernelsInProgram()[0]').not.toThrow();
    expect('kernel.setArg(0, new Uint32Array([10]))').toThrow();
    expect('kernel.setArg(0, new Uint32Array([10]))').toThrow();
    webcl.releaseAll();
  });

  // Known failures as of 2014-02-12:
  //  * Win7 / NVIDIA GPU driver (crashes)
  //  * Win7 / Intel CPU driver (freezes)
  //
  xit("must not crash compiling a kernel that allocates 6 GB of 'local' memory", function() {
    if (!preconditions) pending();
    expect('kernels/largeArrayLocal.cl').not.toBuild();
    expect('kernels/largeArrayLocal.cl').not.toBuild();
    webcl.releaseAll();
  });

  it("must throw when trying to use an object that has been released", function() {
    if (!preconditions) pending();
    ctx.release();
    expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES)').toThrow('WEBCL_IMPLEMENTATION_FAILURE');
  });

  beforeEach(addCustomMatchers);
});
