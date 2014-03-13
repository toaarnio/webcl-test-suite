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

  var self = {};

  beforeEach(function() {
    try {
      aPlatform = webcl.getPlatforms()[0];
      aDevice = aPlatform.getDevices()[0];
      self.preconditions = true;
    } catch (e) {
      ERROR("Robustness -> beforeEach: Caught exception " + e);
      ERROR("Robustness -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
      self.preconditions = false;
    }
  });

  it("must not crash or throw when calling release() more than once", function()  {
    if (!self.preconditions) pending();
    ctx = createContext();
    ctx.release();
    expect('ctx.release()').not.toThrow();
  });

  it("must throw when trying to use an object that has been released", function() {
    if (!self.preconditions) pending();
    ctx = createContext();
    ctx.release();
    expect('ctx.getInfo(WebCL.CONTEXT_NUM_DEVICES)').toThrow('WEBCL_IMPLEMENTATION_FAILURE');
  });

  // Known failures as of 2014-02-12:
  //  * Win7 / NVIDIA GPU driver (crashes on second run)
  //  * Win7 / Intel CPU driver (freezes on first run)
  //
  xit("must not allow allocating 6 GB of 'local' memory", function() {
    if (!self.preconditions) pending();
    expect('kernels/largeArrayLocal.cl').not.toBuild();
    webcl.releaseAll();
  });

  // Known failures as of 2014-03-05:
  //  * Mac OSX Mavericks (crashes)
  //
  it("createKernelsInProgram() must not crash", function() {
    if (!self.preconditions) pending();
    ctx = createContext();
    src = loadSource('kernels/rng.cl');
    program = ctx.createProgram(src);
    expect('program.build()').not.toThrow();
    expect('program.createKernelsInProgram()').not.toThrow();
    DEBUG("Build log: " + program.getBuildInfo(ctx.getInfo(WebCL.CONTEXT_DEVICES)[0], WebCL.PROGRAM_BUILD_LOG));
    webcl.releaseAll();
  });

  // Known failures as of 2014-03-05:
  //  * Win7 / Firefox 32-bit / NVIDIA GPU driver (crashes)
  //  * Win7 / Firefox 64-bit / Intel CPU driver (crashes randomly)
  //
  xit("setArg(<invalidArgument>) must not crash", function() {
    if (!self.preconditions) pending();
    ctx = createContext();
    src = loadSource('kernels/rng.cl');
    expect('program = ctx.createProgram(src)').not.toThrow();
    expect('program.build()').not.toThrow();
    expect('kernel = program.createKernelsInProgram()[0]').not.toThrow();
    expect('kernel.setArg(0, new Uint32Array([10]))').toThrow();
    webcl.releaseAll();
  });

  // Known failures as of 2014-03-05:
  //  * Win7 / NVIDIA GPU driver (crashes)
  //  * Win7 / Intel CPU driver (crashes)
  //
  it("build(<callback>) must not crash", function() {
    if (!self.preconditions) pending();
    buildCallback = function() {
      DEBUG("Callback invoked!");
    }
    ctx = createContext();
    src = loadSource('kernels/rng.cl');
    expect('program = ctx.createProgram(src)').not.toThrow();
    expect('program.build(null, null, buildCallback)').not.toThrow();
    webcl.releaseAll();
  });

  it("createKernel(<validName>) must not crash", function() {
    ctx = createContext();
    program = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
    expect('program.build()').not.toThrow();
    expect('kernel = program.createKernel("dummy")').not.toThrow();
    kernel.release();
    program.release();
    ctx.release();
    webcl.releaseAll();
  });

  beforeEach(addCustomMatchers);
});
