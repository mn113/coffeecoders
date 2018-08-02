// For Node only:
//var assert = require('assert');
//var assert = require('chai').assert;    // TDD
//var should = require('chai').should();  // BDD

describe('Screen class', function() {

    var s;

    describe('#constructor', function() {
        before(function() {
            s = new Screen({x:0, y:0});
        });
        it('should be on the screensLayer', function() {
            screensLayer.children.should.have.length.above(0);
        });
        it('should have correct position', function() {
            s.x.should.equal(-10);
            s.y.should.equal(-4);
        });
        it('should have correct elements', function() {
            assert.instanceOf(s.greenCode, Konva.Text);
            s.should.have.property('bug');
        });
    });

    describe('#writeCode', function() {
        before(function() {
            s = new Screen({x:0, y:0});
            s.writeCode();
        });
        it('should increase offsetY', function() {
            s.greenCode.offsetY.should.not.equal(0);
        });
    });

    describe('#writeBug', function() {
        before(function() {
            s = new Screen({x:0, y:0});
            s.writeBug();
        });
        it('should have a visible bug', function() {
            expect(s.bug.attrs.visible).to.be.true;
        });
    });

    describe('#fixBug', function() {
        before(function() {
            s = new Screen({x:0, y:0});
            s.fixBug();
        });
        it('should not have a visible bug', function() {
            expect(s.bug.attrs.visible).to.be.false;
        });
        it('should show the code', function() {
            expect(s.greenCode.attrs.visible).to.be.true;
        });
        it('should have a filter', function() {
            s.greenCode.attrs.filters.should.have.length(1);
        });
    });

});