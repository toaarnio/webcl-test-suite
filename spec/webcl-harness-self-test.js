/*
 * This file is part of WebCL - Web Computing Language.
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
// Self-tests
//

xdescribe("Test framework", function() {

  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1500;
  });

  describe("extended forms of 'it'", function() {
    
    customBeforeEach(this);

    oit("'oit'", function() {
      expect(true).toEqual(true);
    });
    
    it("'it'", function() {
      expect(true).toEqual(true);
      expect(false).toEqual(false);
    });

    wait("'wait' that does not fail", function(done) {
      setTimeout(function() { suite.done = true; }, 100);
    });

    wait("'wait' that fails an expectation [MUST FAIL]", function(done) {
      expect(true).toEqual(false);
      setTimeout(function() { suite.done = true; }, 100);
    });

    wait("'wait' that fails an expectation in a callback [MUST FAIL]", function(done) {
      setTimeout(function() { 
        expect(true).toEqual(false); 
        suite.done = true; 
      }, 100);
    });

    wait("'wait' that doesn't complete in 1000 ms  [MUST FAIL]", function(done) {
      setTimeout(function() { 
        try {
          expect(true).toEqual(false); 
          suite.done = true; 
        } catch(e) {}
      }, 2000);
    });

  });


  describe("beforeEach", function() {

    describe("setup.bind(this, null)", function() {
      
      customBeforeEach(this);

      oit("must define the global 'suite' namespace", function() {
        expect(window.suite).toBeDefined();
      });
      
      oit("must set suite.preconditions === true", function() {
        expect(window.suite && suite.preconditions).toEqual(true);
      });

      it("must work with 'it'", function() {
        expect(window.suite && suite.preconditions).toEqual(true);
      });

      wait("must work with 'wait'", function(done) {
        expect(window.suite && suite.preconditions).toEqual(true);
        setTimeout(function() { suite.done = true; }, 100);
      });

    });

    describe("setup.bind(this, setupFunc)", function() {
      
      customBeforeEach(this, function() { 
        suite.foo = 'bar'; 
      });

      oit("must define the global 'suite' namespace", function() {
        expect(window.suite).toBeDefined();
      });
      
      oit("must set suite.preconditions === true", function() {
        expect(window.suite && window.suite.preconditions).toEqual(true);
      });
      
      oit("must execute the given setup function", function() {
        expect(window.suite.foo).toEqual('bar');
      });

      it("must work with 'it'", function() {
        expect(window.suite.foo).toEqual('bar');
      });

      wait("must work with 'wait'", function(done) {
        expect(window.suite.foo).toEqual('bar');
        setTimeout(function() { suite.done = true; }, 100);
      });

    });

    describe("setupWithSource.bind(this, uri, setupFunc)", function() {
      
      beforeEach(setupWithSource.bind(this, 'kernels/argtypes.cl', function(src) { 
        suite.source = src;
      }));

      oit("must define the global 'suite' namespace", function() {
        expect(window.suite).toBeDefined();
      });
      
      oit("must set suite.preconditions === true", function() {
        expect(window.suite && window.suite.preconditions).toEqual(true);
      });
      
      oit("must pass the loaded URI to setupFunc", function() {
        expect(typeof suite.source).toEqual('string');
      });
      
      it("must work with 'it'", function() {
        expect(typeof suite.source).toEqual('string');
      });

      wait("must work with 'wait'", function(done) {
        setTimeout(function() {
          expect(typeof suite.source).toEqual('string');
          suite.done = true;
        }, 100);
      });

    });

    describe("setup.bind(this, functionThatThrows)", function() {

      customBeforeEach(this, function() { 
        invalidStatement; 
      });

      oit("must define the global 'suite' namespace", function() {
        expect(window.suite).toBeDefined();
      });
      
      oit("must set suite.preconditions === false", function() {
        expect(window.suite.preconditions).toEqual(false);
      });

      it("must set this 'it' test as 'pending'", function() {
        expect(true).toEqual(false);
      });

      wait("must set this 'wait' test as 'pending'", function(done) {
        expect(true).toEqual(false);
        setTimeout(function() { suite.done = true; }, 100);
      });

    });

    describe("setupWithSource.bind(this, uri, functionThatThrows)", function() {
      
      beforeEach(setupWithSource.bind(this, 'kernels/argtypes.cl', function(src) { invalidStatement; }));

      oit("must define the global 'suite' namespace", function() {
        expect(window.suite).toBeDefined();
      });
      
      oit("must set suite.preconditions === false", function() {
        expect(window.suite.preconditions).toEqual(false);
      });
      
      it("must set this 'it' test as 'pending'", function() {
        expect(true).toEqual(false);
      });

      wait("must set this 'wait' test as 'pending'", function(done) {
        expect(true).toEqual(false);
        setTimeout(function() { suite.done = true; }, 100);
      });

    });

    describe("setupWithSource.bind(this, invalidURI, setupFunc)", function() {
      
      beforeEach(setupWithSource.bind(this, 'kernels/argtypes.c', function(src) { suite.source = src; }));

      oit("must define the global 'suite' namespace", function() {
        expect(window.suite).toBeDefined();
      });
      
      oit("must set suite.preconditions === false", function() {
        expect(window.suite.preconditions).toEqual(false);
      });
      
      it("must set this 'it' test as 'pending'", function() {
        expect(true).toEqual(false);
      });

      wait("must set this 'wait' test as 'pending'", function(done) {
        expect(true).toEqual(false);
        setTimeout(function() { suite.done = true; }, 100);
      });

    });

  });
    

  describe("Custom matchers", function() {

    beforeEach(addCustomMatchers);

    customBeforeEach(this);

    oit(".toThrow()", function() {
      expect('illegalStatement').toThrow();
      expect(function() { illegalStatement; }).toThrow();
    });

    oit(".not.toThrow()", function() {
      expect('var validStatement').not.toThrow();
      expect(function() { var validStatement; }).not.toThrow();
    });

    oit(".toThrow('EXCEPTION_NAME')", function() {
      customException = { name: 'CUSTOM_EXCEPTION', message: 'Unknown exception' };
      expect('illegalStatement').toThrow('ReferenceError');
      expect('throw customException').toThrow('CUSTOM_EXCEPTION');
      expect(function() { illegalStatement; }).toThrow('ReferenceError');
      expect(function() { throw customException; }).toThrow('CUSTOM_EXCEPTION');
    });

    oit(".not.toThrow('EXCEPTION_NAME')", function() {
      customException = { name: 'CUSTOM_EXCEPTION', message: 'Unknown exception' };
      expect('var validStatement').not.toThrow('ReferenceError');
      expect('throw customException').not.toThrow('ReferenceError');
      expect(function() { var validStatement; }).not.toThrow('ReferenceError');
      expect(function() { throw customException; }).not.toThrow('ReferenceError');
    });

    oit(".toThrow() [MUST FAIL]", function() {
      expect('var validStatement').toThrow();
      expect(function() { var validStatement; }).toThrow();
    });

    oit(".not.toThrow() [MUST FAIL]", function() {
      expect('illegalStatement').not.toThrow();
      expect(function() { illegalStatement; }).not.toThrow();
    });

    oit(".toThrow('EXCEPTION_NAME') [MUST FAIL]", function() {
      customException = { name: 'CUSTOM_EXCEPTION', message: 'Unknown exception' };
      expect('var validStatement').toThrow('ReferenceError');
      expect('throw customException').toThrow('ReferenceError');
      expect(function() { var validStatement; }).toThrow('ReferenceError');
      expect(function() { throw customException; }).toThrow('ReferenceError');
    });

    oit(".toThrow('EXCEPTION_WITHOUT_MESSAGE') [MUST FAIL]", function() {
      customException = { name: 'EXCEPTION_WITHOUT_MESSAGE' };
      expect('throw customException').toThrow('EXCEPTION_WITHOUT_MESSAGE');
      customException = { name: 'EXCEPTION_WITHOUT_MESSAGE', message: '' };
      expect('throw customException').toThrow('EXCEPTION_WITHOUT_MESSAGE');
      customException = { name: 'EXCEPTION_WITHOUT_MESSAGE', message: 'EXCEPTION_WITHOUT_MESSAGE' };
      expect(function() { throw customException; }).toThrow('EXCEPTION_WITHOUT_MESSAGE');
    });

    oit(".not.toThrow('EXCEPTION_NAME') [MUST FAIL]", function() {
      customException = { name: 'CUSTOM_EXCEPTION', message: 'Unknown exception' };
      expect('illegalStatement').not.toThrow('ReferenceError');
      expect('throw customException').not.toThrow('CUSTOM_EXCEPTION');
      expect(function() { illegalStatement; }).not.toThrow('ReferenceError');
      expect(function() { throw customException; }).not.toThrow('CUSTOM_EXCEPTION');
    });

  });

  describe("argc", function() {

    beforeEach(addCustomMatchers);

    customBeforeEach(this, function() {
      suite.argc0 = argc0;
      suite.argc1 = argc1;
      suite.argc2 = argc2;
      suite.noNumArgCheck = noNumArgCheck;
    });

    function DummyException(name, msg) {
      this.name = name;
      this.message = msg;
    };

    function argc0() {
      if (arguments.length !== 0) 
        throw new DummyException('WEBCL_SYNTAX_ERROR' , 'Invalid number of arguments: ' + arguments.length);
    };
    
    function argc1(arg) {
      if (arguments.length !== 1) 
        throw new DummyException('WEBCL_SYNTAX_ERROR' , 'Invalid number of arguments: ' + arguments.length);
    };

    function argc2(arg, optionalArg, optionalArg2) {
      if (arguments.length < 1 || arguments.length > 3) 
        throw new DummyException('WEBCL_SYNTAX_ERROR' , 'Invalid number of arguments: ' + arguments.length);
    };

    function noNumArgCheck() {
      return true;
    };

    oit("must work with functions that take zero arguments", function() {
      argc('suite.argc0', []);
    });

    oit("must work with functions that take at least one argument", function() {
      argc('suite.argc1', ['0xdeadbeef']);
    });

    oit("must work with functions that take optional arguments", function() {
      argc('suite.argc2', ['0xdeadbeef', 'undefined', 'undefined']);
    });

    oit("must fail if the target function does not check the number of arguments [MUST FAIL]", function() {
      argc('suite.noNumArgCheck', ['0xdeadbeef', '0xdeadbeef']);
    });

    oit("must fail if the target function throws the wrong kind of exception [MUST FAIL]", function() {
      argc('suite.argc0', [], 'EXPECTED_ERROR');
    });

  });

});
