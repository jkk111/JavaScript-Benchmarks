var Test = require("../test.js");
var testTitle = "Repeated Array.isArray v Cached Result";

function array() {
  var arr = [];
  for(var i = 0; i < 10000; i++) {
    if(Array.isArray(arr)) {

    }
  }
}

function cached() {
  var arr = [];
  var result = Array.isArray(arr);
  for(var i = 0; i < 10000; i++) {
    if(result) {

    }
  }
}

var methods = {
  "Array.isArray": array,
  Cached: cached
}

var test = new Test(methods, testTitle, 1000000).run();
