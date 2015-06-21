( function () {
    function even (value) {
        return value % 2 == 0;
    }

    function odd (value) {
        return Math.abs(value) % 2 == 1;
    }
    
    function overlode () {
        var args = Array.prototype.slice.apply(arguments);
        var lodes = [];
        
        for (var i = 0; i < args.length; i++) {
            var tests = args[i];
            var action = args[i + 1];
            
            if (tests instanceof Array && typeof action == 'function') {
                lodes.push({
                    tests: tests,
                    action: action
                });
                
                i++;
            } else if (typeof tests == 'function' && args.length == i + 1) {
                lodes.push({
                    action: tests
                });
            }
        }
        
        return function () {
            var inner = this;
            var args = Array.prototype.slice.apply(arguments);

            for (var i = 0; i < lodes.length; i++) {
                var lode = lodes[i];
                var tests = lode.tests;
                var action = lode.action;
                var ok = true;
                
                if (tests instanceof Array) {
                    for (var j = 0; j < tests.length; j++) {
                        var test = tests[j];
                        var value = args[j];
                        
                        if (typeof test == 'function') {
                            if (!test(value)) {
                                ok = false;
                            }
                        } else if (test instanceof Array) {
                            for (var k = 0; k < test.length; k++) {
                                if (typeof test[k] != 'function' || (typeof test[k] == 'function' && !test[k](value))) {
                                    ok = false;
                                    break;
                                }
                            }
                        } else {
                            ok = false;
                        }
                        
                        if (!ok)
                            break;
                    }
                }
                
                if (ok)
                    return action.apply(inner, args);
            }
        };
    }

    // global on the server, window in the browser
    var root, noconf;

    if (typeof window == 'object' && this === window)
        root = window;
    else if (typeof global == 'object' && this === global)
        root = global;
    else
        root = this;

    if (root != null)
        noconf = root.overlode;

    overlode.noConflict = function () {
        root.overlode = noconf;
        return overlode;
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports = overlode;

    // AMD / RequireJS
    } else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return overlode;
        });

    // included directly via <script> tag
    } else {
        root.overlode = overlode;
    }
}());
