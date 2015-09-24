var path = require('path');
var stream = require('stream');
var fs = require('fs');
var stream = require('stream');
var expect = require('chai').expect
var Reader = require('../')
var sink = require('stream-sink');

describe('Reader', function () {
  var lines = [
    ':some comment',
    'id:my-id',
    'event: some-complex-name',
    'data: this data purposefully long and',
    'data: on several lines, in order to make it fail',
    '\r\n'
  ];
  var reader;

  beforeEach(function () {
    fs.writeFileSync(path.join(__dirname, 'tmp'), lines.join('\r\n'), 'utf8');
    reader = Reader();
  });
  afterEach(function (done) {
    fs.unlink(path.join(__dirname, 'tmp'), done);
  })

  describe('when getting chunks separating a line', function () {
    it('still parses correctly', function (done) {
      fs.createReadStream(path.join(__dirname, 'tmp'), { highWaterMark: 8 })
        .pipe(SlowStream(5))
        .pipe(reader)
        .pipe(sink({objectMode: true}))
        .on('data', function(events) {
          expect(events).to.deep.equal([{id: 'my-id', name: 'some-complex-name', data: 'this data purposefully long and\non several lines, in order to make it fail'}])
          done();
        });
    });
  });
})

function SlowStream (ms) {
  var slow = new stream.Transform({highWaterMark: 8});
  slow._transform = function (chunk, encoding, callback) {
    setTimeout(function () {
      slow.push(chunk);
      callback();
    }, ms);
  };
  return slow;
}
