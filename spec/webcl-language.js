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
// Kernel language
// 
describe("Kernel language", function() {

  beforeEach(setup.bind(this, function() {
    ctx = createContext();
    mustBuild = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
    mustBuild.build();
  }));

  //////////////////////////////////////////////////////////////////////////////
  //
  // Kernel language -> Compiler
  // 
  describe("Compiler (OpenCL 1.1 conformance)", function() {

    // Status as of 2014-04-29:
    //  [PASS] Win7 / NVIDIA GPU driver (332.21)
    //  [FAIL] Win7 / Intel CPU driver (3.0.1.15216)
    //  
    it("-D options must not be sticky", function() {
      program = mustBuild;
      expect('program.build(null, "-D kernel=foo")').toThrow('BUILD_PROGRAM_FAILURE');
      expect('program.build()').not.toThrow();
    });

    it("must support read_imagef() and write_imagef()", function() {
      expect('kernels/copyImage.cl').toBuild();
    });

    it("must not allow obviously invalid kernel source", function() {
      expect('program = ctx.createProgram("obviously invalid")').not.toThrow();
      expect('program.build()').toThrow('BUILD_PROGRAM_FAILURE');
    });

    it("must not allow slightly invalid kernel source", function() {
      src = "kernel int dummy(global uint* buf) { buf[0]=0xdeadbeef; }";
      expect('program = ctx.createProgram(src)').not.toThrow();
      expect('program.build()').toThrow('BUILD_PROGRAM_FAILURE');
    });

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
    it("must not allow 'extern' variables", function() {
      expect('kernels/externVariable.cl').not.toBuild();
    });

    // Known failures as of 2014-02-05:
    //  * Win7 / NVIDIA GPU driver
    //  * Win7 / Intel CPU driver
    //
    it("must not allow 'extern' functions", function() {
      expect('kernels/externFunction.cl').not.toBuild();
    });

    // Known failures as of 2014-02-05:
    //  * Win7 / NVIDIA GPU driver
    //  * Win7 / Intel CPU driver
    //
    it("must not allow pointer casts between address spaces", function() {
      expect('kernels/pointerAddressSpaceCast.cl').not.toBuild();
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

    // Known failures as of 2014-05-06:
    //  * <none>
    //
    it("must not allow the 'long long' datatype", function() {
      expect('kernels/longlong.cl').not.toBuild();
    });

    // Known failures as of 2014-04-14:
    //  * Win7 / NVIDIA GPU driver
    //
    it("must not allow uninitialized variables in 'constant' address space", function() {
      expect('kernels/uninitializedConstant.cl').not.toBuild();
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

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Kernel language -> Validator
  // 
  describe("Validator (WebCL C conformance)", function() {

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

  beforeEach(addCustomMatchers);
  afterEach(function() { webcl.releaseAll(); });

});


