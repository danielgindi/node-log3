var Util = require('util');
var Fs = require('fs');
var Os = require('os');

var defaults = {
    timestamp           : true
    , out               : process.stdout
    , title             : false
    , pid               : false
    , hostname          : false
    , console           : [ 'debug', 'fatal' ]
    , autoorigin        : true
    , origin            : null
};

var padRight = function (val, length, char) {
    while (val.length < length) {
        val += char;
    }
    return val;
};

/**
 * @typedef {Function} LoggerInstance
 * @param {String} message
 * @param {String?} level='info'
 * @param {String?} origin
 * @param {{Function(err: ?, message: String)}} callback
 */

/** @memberof LoggerInstance */
var debug = function (message, origin) { };

/** @memberof LoggerInstance */
var info = function (message, origin) { };

/** @memberof LoggerInstance */
var warn = function (message, origin) { };

/** @memberof LoggerInstance */
var error = function (message, origin) { };

/** @memberof LoggerInstance */
var fatal = function (message, origin) { };

/**
 *
 * @param {Object?} options
 * @param {boolean=true} options.timestamp - Log the timestamp
 * @param {Stream|String|?} options.out - A stream or a filename to output to
 * @param {boolean=false} options.title - Log current process title
 * @param {boolean=false} options.pid - Log current process id
 * @param {boolean=false} options.hostname - Log current machine name
 * @param {Array.<String>?} options.console=['error','warn'] - Array of levels that are outputted to console too
 * @param {boolean=true} options.autoorigin - Will try to autodetect origin of log call
 * @param {String?} options.origin - Predefined origin to log, when `autoorigin` is disabled
 * @returns {LoggerInstance}
 */
var Log3 = function Log3 (options) {

    var opts = {};

    for (var key in defaults) {
        if (!defaults.hasOwnProperty(key)) continue;
        opts[key] = defaults[key];
    }
    for (key in options) {
        if (!options.hasOwnProperty(key)) continue;
        opts[key] = options[key];
    }

    var out = opts.out;

    // Prepare fast lookup hashmap for console output
    var consoleMap = {};
    if (opts.console) {
        for (var i = 0; i < opts.console.length; i++) {
            consoleMap[opts.console[i]] = true;
        }
    }

    // Open stream if necessary
    if (typeof out === 'string') {
        out = Fs.createWriteStream(out, { encoding: 'utf8', flags: 'a' });
    }

    // Helper to output to console
    var outputToConsole = function __logger_console (message, level) {
        if (level === 'error' || level === 'warn' || level === 'fatal') {
            process.stderr.write(message + '\n');
        } else {
            process.stdout.write(message + '\n');
        }
    };

    var logger = function __logger (message, level, origin, callback) {

        level = level || 'info';
        callback = callback || function() {};

        if (typeof level === 'function') {
            callback = level;
            level = 'info';
            origin = null;
        } else if (typeof origin === 'function') {
            callback = origin;
            origin = null;
        }

        var program = '';
        if (opts.title) {
            program += process.title;
        }
        if (opts.pid) {
            program += (program ? '/' : '') + process.pid;
        }
        if (opts.hostname) {
            program += '@' + Os.hostname();
        }

        // Try to find origin in passed options
        if (origin == null) {
            origin = opts.origin;
        }

        // Try to find origin from stack
        if (origin == null && opts.autoorigin) {
            var stackLines = new Error().stack.split('\n');
            for (var ie = 1; ie < stackLines.length; ie++) {
                if (stackLines[ie].indexOf('at __logger') > -1 ||
                    stackLines[ie].indexOf('at logger ') > -1 ||
                    stackLines[ie].indexOf('at Function.__logger') > -1)
                    continue;
                origin = stackLines[ie].trim();
                origin = origin.substr(origin.indexOf(' ') + 1);
                break;
            }
        }

        // origin is unknown
        if (origin == null) {
            origin = '';
        }

        var messageParts = [];

        if (opts.timestamp) {
            messageParts.push((new Date()).toISOString());
        }
        messageParts.push(padRight(level.toUpperCase(), 5, ' '));

        if (program) {
            messageParts.push(program);
        }

        messageParts.push(origin);

        if (typeof message === 'string') {
            messageParts.push(message);
        }
        else {
            messageParts.push(Util.inspect(message, { showHidden: false, depth: null, colors: false }));
        }

        var preparedMessage = messageParts.join(' | ');

        if (out) {
            out.write(preparedMessage + '\n', function (err) {
                if (callback) {
                    if (err) return callback(err);
                    callback(null, preparedMessage);
                }
            });
        } else {
            outputToConsole(preparedMessage, level);
            if (callback) {
                callback(null, preparedMessage);
            }
        }

        if (out !== process.stdout && consoleMap.hasOwnProperty(level)) {
            outputToConsole(preparedMessage, level);
        }
    };

    logger.debug = function __logger_debug (message, location) {
        logger(message, 'debug', location);
    };

    logger.info  = function __logger_info (message, location) {
        logger(message, 'info', location);
    };

    logger.warn  = function __logger_warn (message, location) {
        logger(message, 'warn', location);
    };

    logger.error = function __logger_error (message, location) {
        logger(message, 'error', location);
    };

    logger.fatal = function __logger_fatal (message, location) {
        logger(message, 'fatal', location);
    };

    /**
     * @type LoggerInstance
     */
    return logger;
};

module.exports = Log3;