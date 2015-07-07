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
            
            if ((tests instanceof Array || typeof tests == 'number') && typeof action == 'function') {
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
                
                // overload tests is an array, each argument must pass its matching test
                if (tests instanceof Array) {
                    var ok = true;
                    
                    // keep going if number of tests does not match number of arguments used, does not match number of arguments given
                    if (tests.length != args.length || action.length != args.length)
                        continue;
                    
                    // special case: if there are no tests, action takes no arguments, and no arguments are given
                    if (tests.length == 0 && action.length == 0 && args.length == 0)
                        return action.apply(inner, args);
                    
                    // test each argument
                    for (var j = 0; j < tests.length; j++) {
                        var test = tests[j];
                        var value = args[j];
                        
                        // test is string value '*', any value type can be used
                        if (test == '*')
                            continue;
                        
                        // test is a function, function must return true
                        else if (typeof test == 'function' && test(value) === true)
                            continue;
                        
                        // test is an object, value must be same type of object
                        else if (typeof test == 'object' && test.constructor == value.constructor)
                            continue;
                        
                        // test failed on argument, move onto next overload
                        ok = false;
                        break;
                    }
                    
                    // if each argument passed test, trigger action
                    if (ok)
                        return action.apply(inner, args);
                }
                
                // overload test is a number, number of arguments must match test number
                if (typeof tests == 'number' && args.length == tests && action.length == tests)
                    return action.apply(inner, args);
                
                // no overload test, trigger the action
                if (typeof tests == 'undefined')
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
