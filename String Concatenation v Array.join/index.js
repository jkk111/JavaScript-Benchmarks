var Test = require("../test.js");
var testTitle = "String Concatenation v Array.join";
var a = "test";
var b = "testing";
var c = "hello";

function concat() {
  var str = a + "," + b + "," + c;
}

function arrayJoin() {
  var str = [a,b,c].join(",");
}

var methods = {
  concat: concat,
  arrayJoin: arrayJoin
}

var test = new Test(methods, testTitle, 1000000).run();
