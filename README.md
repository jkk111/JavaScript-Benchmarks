# JavaScript Benchmarks.

Small NodeJs module that automates benchmarking of synchronous methods in JavaScript.

Outputs simple readmes with stats on test completion.

Will mostly contain tests written anytime I need to find the most efficient way of doing something.

## How To Use

While npm would make more sense, I'm assuming the directory structure.

Create a directory and add your benchmark script there.

Add the Test.js module to your script
```
  var Test = require("../Test.js");
```

To create a new test pass an object of methods, a name, and an optional number of times to run the benchmark, defaults to 10000.

```
  var methods = {
    first: function() { console.log("hello world"); },
    second: function() { console.log("hello", "world"); },
    third: function() { return true; }
  }
  var title = "Example Test";
  var loops = 100;
  var test = new Test(methods, title, loops);
  test.run();
```

Test can also take an optional fourth variable, silent, if true it will only print on start and finish.

Thats all thats needed to get started, if your methods need global variables, ensure you add the above to the end of your file.

## Tests

[String Concatenation v Array.join](https://github.com/jkk111/JavaScript-Benchmarks/tree/master/String Concatenation v Array.join)

[String Concatenation V Template Strings](https://github.com/jkk111/JavaScript-Benchmarks/tree/master/String Concatenation V Template Strings)

Auto-Generated on: Thu Jun 23 2016 20:41:11