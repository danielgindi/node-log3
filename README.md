# log3

[![npm Version](https://badge.fury.io/js/log3.png)](https://npmjs.org/package/log3)

Easy logging for node.js, with automatic file/line output.

This module was inspired by _log2_ by _Andrew Chilton_.

## Installation:

```
npm install --save log3
```
 
## Usage example:

```javascript

const log = require('log3')({ out: 'server.log' });

log.debug('A log used for debugging');
// 2016-06-28T03:14:20.000Z | DEBUG | testDebug (/test.js:1:1) | A log used for debugging

log.info('This is just a nice-to-know');
// 2016-06-28T03:14:20.000Z | DEBUG | testDebug (/test.js:2:1) | This is just a nice-to-know

log.warn('Something went wrong, but we can keep on going.');
// 2016-06-28T03:14:20.000Z | DEBUG | testDebug (/test.js:3:1) | Something went wrong, but we can keep on going.

log.error('An error occured... Some explanation here');
// 2016-06-28T03:14:20.000Z | DEBUG | testDebug (/test.js:4:1) | An error occured... Some explanation here

log.fatal('A fatal error occurred, cannot proceed.');
// 2016-06-28T03:14:20.000Z | DEBUG | testDebug (/test.js:5:1) | A fatal error occurred, cannot proceed.

log.debug('A log used for debugging, specifying a custom origin', 'server.js, start()');
// 2016-06-28T03:14:20.000Z | DEBUG | server.js, start() | A log used for debugging, specifying a custom origin

log('A log with a custom level', 'hey', 'server.js, test()');
// 2016-06-28T03:14:20.000Z | HEY   | server.js, test() | A log with a custom level

```

The options you can pass are:

Name | Type | Default | Explanation
---- | ---- | ------- | -----------
  `timestamp` | `boolean` | `true` | Log the timestamp
  `out` | `Stream|String|?` | `process.stdout` | A stream or a filename to output to
  `title` | `boolean` | `false` | Log current process title
  `pid` | `boolean` | `false` | Log current process id
  `hostname` | `boolean` | `false` | Log current machine name
  `console` | `Array.<String>` | `['fatal']` | Array of levels that are outputted to console too
  `autoorigin` | `boolean` | `true` | Will try to autodetect origin of log call
  `origin` | `String` | `null` | Predefined origin to log, when `autoorigin` is disabled
  
## Contributing

If you have anything to contribute, or functionality that you lack - you are more than welcome to participate in this!
If anyone wishes to contribute unit tests - that also would be great :-)

## Me
* Hi! I am Daniel Cohen Gindi. Or in short- Daniel.
* danielgindi@gmail.com is my email address.
* That's all you need to know.

## Help

If you want to buy me a beer, you are very welcome to
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=G6CELS3E997ZE)
 Thanks :-)

## License

All the code here is under MIT license. Which means you could do virtually anything with the code.
I will appreciate it very much if you keep an attribution where appropriate.

    The MIT License (MIT)

    Copyright (c) 2013 Daniel Cohen Gindi (danielgindi@gmail.com)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
