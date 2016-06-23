var Test = require("../test.js");
var testTitle = "String Concatenation V Template Strings";
var methods = {
  concat: concat,
  template: template,
  templateWStatic: templateWStatic
}
var test = new Test(methods, testTitle, 1000000).run();
var a = "test";
var b = "testing";
var c = "hello";

function concat() {
  var str = "test" + "testing" + "hello";
}

function template() {
  var str = `${a}${b}${c}`;
}

function templateWStatic() {
  var str = `test${b}hello`;
}

// var loops = 1000000;
// console.info("Running test %d times", loops);
// var times = {

// };

// var slowest;
// var fastest;
// // for(time in times) {
// //   if(!slowest || times[time] > times[slowest]) slowest = time;
// //   if(!fastest || times[time] < times[fastest]) fastest = time;
// // }

// // console.info("Slowest: %s", slowest);
// // console.info("Fastest: %s", fastest);
// writeResults();
