var util = require('util');
var stream = require('stream');

module.exports = stream.Transform;

util.inherits(Reader, stream.Transform);
function Reader () {
  stream.Transform.call(this);
}
