[![Build Status][travis-image]][travis-url] [![Coverage][coveralls-image]][coveralls-url]

node-sse-reader
==================

> reads a text/event-stream stream as specified by the WD-eventsource W3C recommendation

Installation
------------

    npm install --save sse-reader

Usage
-----

```javascript
var SSE = require('sse-reader');
var sse = SSE();
```

The following stream

```
: comment this!
data: Hello

event: add
data: Floby

id: 8000
event: remove
data: Floby

```

Test
----

You can run the tests with `npm test`. You will need to know [mocha][mocha-url]

Contributing
------------

Anyone is welcome to submit issues and pull requests


License
-------

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Florent Jaby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[travis-image]: http://img.shields.io/travis/Floby/node-sse-reader/master.svg?style=flat
[travis-url]: https://travis-ci.org/Floby/node-sse-reader
[coveralls-image]: http://img.shields.io/coveralls/Floby/node-sse-reader/master.svg?style=flat
[coveralls-url]: https://coveralls.io/r/Floby/node-sse-reader
[mocha-url]: https://github.com/visionmedia/mocha


