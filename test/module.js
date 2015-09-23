var expect = require('chai').expect
var stream = require('stream');
var Reader = require('../')

describe('the module', function () {
  it('exports a function', function () {
    expect(Reader).to.be.a('function')
  })
  describe('the exported function', function () {
    it('constructs a writable stream', function () {
      var o = Reader();
      expect(o).to.be.an.instanceof(Reader);
      expect(o).to.have.property('write');
      expect(o.write).to.be.a('function');
    });
    it('constructs a readable stream', function () {
      var o = Reader();
      expect(o).to.be.an.instanceof(stream.Readable);
    })
  });
})
