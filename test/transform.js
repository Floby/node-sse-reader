var stream = require('stream');
var expect = require('chai').expect
var Reader = require('../')
var sink = require('stream-sink');

describe('Reader', function () {
  describe('when writing a stream', function () {
    describe('empty', function () {
      compare('results in an empty event stream', "", []);
    });

    describe('with a single comment', function () {
      compare('results in an empty event stream', ": comment", []);
    })

    describe('with a single anonymous event', function () {
      compare('results in a single event in the stream',
        "data: my data\r\n\r\n",
        [{data: 'my data'}])
    })

    describe('with a single named event', function () {
      compare('results in a single event in the stream',
        "event: event-name\r\ndata : my data\r\n\r\n",
        [{name: 'event-name', data: 'my data'}]
      );
    });

    describe('with two anonymous events', function () {
      compare('results in 2 events in the stream', 
        "data:coucou\r\n\r\ndata  :    salut \r\n\r\n",
        [{data: 'coucou'}, {data: 'salut'}])
    });

    describe('with a single multiline event', function () {
      compare('results in a single event in the stream', 
        "data: hello les\r\ndata: amis\r\n\r\n",
        [{data: "hello les\namis"}])
    })

    describe('with a comment in the middle of a named event', function () {
      compare('returns a single named event',
        "event:name\r\n:comment\r\ndata: my data\r\n\r\n",
        [{name: 'name', data: 'my data'}])

    });

    describe('with a anonymous event with an id', function () {
      compare('returns a single named event',
        "id: my-id\r\ndata: my data  \r\n\r\n",
        [{id: "my-id", data: 'my data'}])
    });

    describe('with a named event with an id', function () {
      compare('returns a single named event',
        "id: my-id\r\nevent: name\r\ndata: my data  \r\n\r\n",
        [{id: "my-id", name: 'name', data: 'my data'}])
    });

    function compare (name, source, expected) {
      it(name, function (done) {
        fromString(source).pipe(Reader()).pipe(sink({objectMode: true})).on('data', function(events) {
          try {
            expect(events).to.deep.equal(expected);
            done()
          } catch(e) {
            done(e);
          }
        });
      })
    }
  })
})

function fromString (str) {
  var result = new stream.PassThrough;
  result.end(str);
  return result
}
