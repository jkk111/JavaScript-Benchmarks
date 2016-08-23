var Test = require("../test.js");
var testTitle = "Array Length v Cached Length";
var data = buildArray();

function buildArray() {
  var arr = [];
  for(var i = 0; i < 5000; i++) {
    arr.push({});
  }
  return arr;
}

function length() {
  for(var i = 0; i < data.length; i++) {

  }
}

function cached() {
  var len = data.length
  for(var i = 0; i < len; i++) {

  }
}

var methods = {
  length: length,
  cached: cached
}

var test = new Test(methods, testTitle, 1000000).run();
