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

  beforeEach(function() {
    self = self || {};
    try {
      if (self.preconditions !== false) {
        ctx = createContext();
        if (self.preconditions === undefined) {
          DEBUG("Asserting preconditions for the current describe() block...");
          mustBuild = ctx.createProgram("kernel void dummy(global uint* buf) { buf[0]=0xdeadbeef; }");
          mustBuild.build();
        }
        self.preconditions = true;
      }
    } catch (e) {
      ERROR("Kernel language -> beforeEach: Caught exception " + e);
      ERROR("Kernel language -> beforeEach: Preconditions of the describe() block failed: Skipping all tests.");
      self.preconditions = false;
    }
  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Kernel language -> Validator
  // 
  describe("Validator", function() {

    it("must not allow 'goto'", function() {
      if (!self.preconditions) pending();
      expect('kernels/goto.cl').not.toBuild();
    });

    it("must not allow 'printf'", function() {
      if (!self.preconditions) pending();
      expect('kernels/printf.cl').not.toBuild();
    });

    it("must not allow kernel-to-kernel calls", function() {
      if (!self.preconditions) pending();
      expect('kernels/kernel-to-kernel.cl').not.toBuild();
    });

    it("must not allow CLK_ADDRESS_NONE", function() {
      if (!self.preconditions) pending();
      expect('kernels/illegalSampler1.cl').not.toBuild();
    });

    it("must not allow CLK_NORMALIZED_COORDS_FALSE | CLK_ADDRESS_MODE_REPEAT", function() {
      if (!self.preconditions) pending();
      expect('kernels/illegalSampler2.cl').not.toBuild();
    });

    // Performs an out-of-bounds write to an int variable through a long
    // pointer. The WebCL validator should catch the illegal pointer cast
    // from int* to long*.
    //
    it("must not allow casting an int* to long*", function() {
      if (!self.preconditions) pending();
      expect('kernels/pointerSizeCast.cl').not.toBuild();
    });

  });

  //////////////////////////////////////////////////////////////////////////////
  //
  // Kernel language -> Compiler
  // 
  describe("Compiler (OpenCL 1.1)", function() {

    it("must not allow obviously invalid kernel source", function() {
      if (!self.preconditions) pending();
      expect('program = ctx.createProgram("obviously invalid")').not.toThrow();
      expect('program.build()').toThrow('BUILD_PROGRAM_FAILURE');
      expect('program.build(null, "-w")').toThrow('BUILD_PROGRAM_FAILURE');
    });

    it("must not allow slightly invalid kernel source", function() {
      if (!self.preconditions) pending();
      src = "kernel int dummy(global uint* buf) { buf[0]=0xdeadbeef; }";
      expect('program = ctx.createProgram(src)').not.toThrow();
      expect('program.build()').toThrow('BUILD_PROGRAM_FAILURE');
      expect('program.build(null, "-w")').toThrow('BUILD_PROGRAM_FAILURE');
    });

    // Known failures as of 2014-02-12:
    //  * <none>
    //
    it("must not allow 'memcpy'", function() {
      if (!self.preconditions) pending();
      expect('kernels/memcpy.cl').not.toBuild();
    });

    // Known failures as of 2014-02-12:
    //  * Win7 / NVIDIA GPU driver
    //  * Win7 / Intel CPU driver
    //
    it("must not allow 'extern'", function() {
      if (!self.preconditions) pending();
      expect('kernels/extern.cl').not.toBuild();
    });

    // Known failures as of 2014-02-05:
    //  * Win7 / NVIDIA GPU driver
    //  * Win7 / Intel CPU driver
    //
    it("must not allow pointer casts between address spaces", function() {
      if (!self.preconditions) pending();
      expect('kernels/pointerAddressSpaceCast.cl').not.toBuild();
    });

    // Known failures as of 2014-02-05:
    //  * Win7 / NVIDIA GPU driver
    //  * Win7 / Intel CPU driver
    //
    it("must not allow the 'extern' keyword", function() {
      if (!self.preconditions) pending();
      expect('kernels/externQualifier.cl').not.toBuild();
    });

    // Known failures as of 2014-02-05:
    //  * <none>
    //
    it("must not allow initializing 'local' variables", function() {
      if (!self.preconditions) pending();
      expect('kernels/localMemInit.cl').not.toBuild();
    });

    // Known failures as of 2014-02-05:
    //  * Win7 / NVIDIA GPU driver
    //  * Win7 / Intel CPU driver
    //
    it("must not allow declaring 'local' variables in inner scope", function() {
      if (!self.preconditions) pending();
      expect('kernels/localMemAlloc.cl').not.toBuild();
    });

    // Known failures as of 2014-02-05:
    //  * <none>
    //
    it("must not allow dynamic memory allocation", function() {
      if (!self.preconditions) pending();
      expect('kernels/dynamicArray.cl').not.toBuild();
    });

    // Known failures as of 2014-02-05:
    //  * Win7 / NVIDIA GPU driver
    //  * Win7 / Intel CPU driver
    //
    it("must not allow local memory pointer as return value", function() {
      if (!self.preconditions) pending();
      expect('kernels/localMemReturn.cl').not.toBuild();
    });

    // Known failures as of 2014-02-05:
    //  * <none>
    //
    it("must not allow writing to 'constant' address space", function() {
      if (!self.preconditions) pending();
      expect('kernels/constantWrite.cl').not.toBuild();
    });

    // Known failures as of 2014-02-05:
    //  * Win7 / NVIDIA GPU driver
    //  * Win7 / Intel CPU driver
    //
    it("must not allow allocating 6 GB of 'private' memory", function() {
      if (!self.preconditions) pending();
      expect('kernels/largeArrayPrivate.cl').not.toBuild();
    });

    // Known failures as of 2014-02-12:
    //  * Win7 / NVIDIA GPU driver (crashes on second run)
    //  * Win7 / Intel CPU driver (freezes on first run)
    //
    xit("must not allow allocating 6 GB of 'local' memory", function() {
      if (!self.preconditions) pending();
      expect('kernels/largeArrayLocal.cl').not.toBuild();
    });

    // Known failures as of 2014-02-12:
    //  * <none>
    //
    it("must not allow allocating 6 GB of 'global' memory", function() {
      if (!self.preconditions) pending();
      expect('kernels/largeArrayGlobal.cl').not.toBuild();
    });

  });

  //////////////////////////////////////////////////////////////////////////////

  beforeEach(addCustomMatchers);
  afterEach(releaseAll);

});


