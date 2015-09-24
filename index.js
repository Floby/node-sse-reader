var util = require('util');
var stream = require('stream');


module.exports = Reader;
util.inherits(Reader, stream.Transform);
function Reader () {
  if(!(this instanceof Reader)) return new Reader();
  stream.Transform.call(this);
  this._readableState.objectMode = true;
  var self = this;
  var lastEventId = null;
  var currentEvent = new Event();

  this.on('id', function(id) {
    lastEventId = id;
  });
  this.lastEventId = function () {
    return lastEventId;
  }

  this._transform = function (chunk, encoding, callback) {
    chunk = chunk.toString();
    var lines = chunk.toString().split('\r\n');
    try {
      processLines(lines);
      callback();
    } catch(e) {
      callback(e);
    }
  }

  function processLines (lines) {
    lines.forEach(function (line) {
      if (line.trim() === '') {
        return eventComplete();
      }
      line = splitLine(line);
      switch(line.left) {
        case 'id':
          currentEvent.setId(line.right);
          break;
        case 'data':
          currentEvent.appendContent(line.right);
          break;
        case 'event':
          currentEvent.setName(line.right);
          break;
        case '':
        default:
          break;
      }
    });
  }

  function eventComplete () {
    if (currentEvent.isEmpty()) return;
    var json = currentEvent.toJSON();
    triggerEvents(json);
    self.push(json);
    currentEvent = new Event();
  }

  function triggerEvents (json) {
    self.emit('event', json.data, json.name, json.id);
    if (json.name) {
      self.emit('event:' + json.name, json.data);
    }
    if (json.id) {
      self.emit('id', json.id);
    }
  }
}

function splitLine (chunk) {
  var splitIndex = chunk.indexOf(':');
  var left = chunk.substr(0, splitIndex);
  var right = chunk.substr(splitIndex + 1);
  return {
    left: left.trim(),
    right: right.trim()
  }
}

function Event () {
  var name = null;
  var content = null;
  var id = null;

  this.setName = function (str) {
    name = str;
  }
  this.setId = function (n) {
    id = n;
  }
  this.appendContent = function (str) {
    if (content === null) {
      content = str;
    } else {
      content = content + '\n' + str;
    }
  }

  this.isEmpty = function () {
    return content === null;
  }

  this.toJSON = function () {
    var json = {};
    if (content) json.data = content;
    if (name) json.name = name;
    if (id) json.id = id;
    return json;
  }
}

