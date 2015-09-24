var stream = require('stream');
var expect = require('chai').expect;
var Reader = require('../');

describe('Reader', function () {
  var reader;
  beforeEach(function () {
    reader = Reader();
  })
  describe('for an anonymous event', function () {
    it('triggers the "event" event', function (done) {
      var events = eventsOn(reader).expect('event', "hello world", undefined, undefined);
      fromString('data:hello world\r\n\r\n').pipe(reader).on('finish', function() {
        events.verify();
        done()
      });
    })
  })
  describe('for an named event', function () {
    var namedEvent = 'event: greeting \r\ndata:hello world\r\n\r\n';
    it('triggers the "event" event', function (done) {
      var events = eventsOn(reader).expect('event', "hello world", "greeting", undefined);
      fromString(namedEvent).pipe(reader).on('finish', function() {
        events.verify();
        done()
      });
    })
    it('triggers an event of the same name', function (done) {
      var events = eventsOn(reader).expect('event:greeting', "hello world");
      fromString(namedEvent).pipe(reader).on('finish', function() {
        events.verify();
        done()
      });
    });
  })

  describe('for an event with ID', function () {
    var idEvent = 'id: 8000\r\nevent:greeting\r\ndata: hello world\r\n\r\n';
    it('triggers the "event" event', function (done) {
      var events = eventsOn(reader).expect('event', "hello world", "greeting", '8000');
      fromString(idEvent).pipe(reader).on('finish', function() {
        events.verify();
        done()
      });
    })

    it('triggers an "id" event', function (done) {
      var events = eventsOn(reader).expect('id', '8000');
      fromString(idEvent).pipe(reader).on('finish', function() {
        events.verify();
        done();
      });
    });
  });

  describe('.lastEventId()', function () {
    var reader;
    beforeEach(function () {
      reader = Reader();
    })
    describe('when no events', function () {
      it('returns null', function () {
        expect(reader.lastEventId()).to.be.null;
      });
    })

    describe('when an event without id', function () {
      beforeEach(function (done) {
        reader.write('data:coucou\r\n\r\n', done);
      });
      it('returns null', function () {
        expect(reader.lastEventId()).to.be.null;
      })
    })

    describe('with a single event with an id', function () {
      beforeEach(function (done) {
        reader.write('id:8\r\ndata:hey\r\n\r\n', done);
      })
      it('returns that id', function () {
        expect(reader.lastEventId()).to.equal('8');
      })
    })
    describe('with a two events with an id', function () {
      beforeEach(function (done) {
        reader.write('id:8\r\ndata:hey\r\n\r\nid:10\r\ndata:oh\r\n\r\n', done);
      })
      it('returns that id', function () {
        expect(reader.lastEventId()).to.equal('10');
      })
    })
  });
})

function eventsOn (emitter) {
  var actual = [];
  var expected = [];
  var listening = {};
  var expecter = {
    expect: expectEvent,
    verify: verify
  };
  return expecter;

  function verify () {
    expect(actual).to.deep.equal(expected);
    return expecter;
  }

  function expectEvent (name) {
    expected.push([].slice.call(arguments));
    if (!listening[name]) {
      listening[name] = true;
      emitter.on(name, listener(name));
    }
    return expecter;
  }

  function listener (name) {
    return function () {
      actual.push([name].concat([].slice.call(arguments)));
    }
  }
}

function fromString (str) {
  var result = new stream.PassThrough;
  result.end(str);
  return result
}
