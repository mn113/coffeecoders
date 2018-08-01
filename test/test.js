//var assert = require('assert');
//var assert = require('chai').assert;    // TDD
//var should = require('chai').should();  // BDD

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe('Screen class', function() {

    var s = new Screen({x:1, y:0});

    before(function() {
        s = new Screen({x:0, y:0});
        console.log('before');
    });
  
    after(function() {
      // runs after all tests in this block
    });
  
    beforeEach(function() {
      // runs before each test in this block
      s = new Screen({x:0, y:0});
      console.log('beforeEach');
    });
  
    afterEach(function() {
      // runs after each test in this block
    });
  
    // test cases
    describe('#constructor', function() {
        it('should have correct attributes', function() {
            assert.equal(s.x, 0);
            s.y.should.equal(0);
            assert.instanceOf(s.greenCode, Konva.Text);
            s.should.have.property('bug');
        });
    });

    describe('#writeCode', function() {
        s.writeCode();
        it('should increase offsetY', function() {
            assert(s.greenCode.offsetY !== 0)
        });
    });

});