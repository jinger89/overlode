# Overlode

Javascript function ~~overloading~~ overloding utility. This utility's peculiar interface will make overloding functions easier for you.

## Quick Start

Installing with npm.

```bash
> npm install overlode
```

Or download the source file [overlode.js](#file) from above.

Write your first overloded function. Here we are using [rubric.js](https://github.com/jinger89/rubric) to help with checks.

```javascript
var overlode = require('overlode');
var rubric = require('rubric');

var createUser = overlode(

    // create a user using data passed in as an object, and a callback function
    [ rubric.obj, rubric.fn ],
    function (data, callback) {

    },

    // create a user using data passed in as arguments, and a callback function
    [ rubric.str.range(1, 50), rubric.str.range(1, 50), rubric.fn ],
    function (firstName, lastName, callback) {

    },

    // default action, if no overlode is satisfied
    function () {
        throw new Error('Oops, incorrect usage of createUser()!');
    }
);

createUser({ first: 'Joe', last: 'Doe' }, function () { }); // triggers the 1st overlode
createUser('Joe', 'Doe', function () {}); // triggers the 2nd overlode
createUser(function () {}, 'Joe', 'Doe'); // triggers the 3rd (default) overlode
```

## Design Pattern

### How It Should Be Used

```javascript
overlode(
    [ test, test, test ],
    function action (arg, arg, arg) {},

    [ test, test ],
    function action (arg, arg) {}
);
```

Function overlodes should always come in pairs in this order: array and function. The array should contain the tests for the arguments of the overlode, and the function is the function to use if the tests are satisfied.

### Don't Do This

```javascript
overlode(
    [ test, test, test ], // useless
    [ test, test ],
    function action (arg, arg) {}
);
```

Overlodes will be tested in the order they are written, from the top to the bottom. Whenever an array of tests pass it will try to run the function immediately afterwards. If it can't (not a funtion) it will reset and look for another test, and then another function.

### Don't Do This Either

```javascript
overlode(
    [ test, test, test ],
    function action (arg, arg, arg) {},
    function action (arg, arg, arg) {}, // useless

    [ test, test ],
    function action (arg, arg) {},

    function defaultAction () {} // default action
);
```

If 2 functions are right after each other, the second function will be ignored as there are no tests preceding it. Unless, the function is the last argument in the overlode, in which case it is considered the default action and will be run if no other overlodes are run.
