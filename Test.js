var fs = require("fs");
function Test(methods, name, loops) {
  this.loops = loops || 10000;
  this.methods = methods;
  this.testTitle = name;
  this.times = {};
}

Test.prototype.run = function() {
  for(method in this.methods) {
    var start = process.hrtime();
    console.info("Starting test of %s", method);
    var lastPercent = -1;
    for(var i = 0; i < this.loops; i++) {
      var percent = Math.floor((i / this.loops) * 100);
      if(percent > lastPercent) {
        console.info(`${method}) ${percent}%`);
        lastPercent = percent;
      }
      this.methods[method]();
    }
    console.info(`${method}) 100%`);
    var end = process.hrtime(start);
    console.info("Completed test of %s", method);
    console.info("Time: %ds %sns", end[0], end[1]);
    this.times[method] = (end[0]*1e9) + end[1];
  }
  this.writeResults();
  return this;
}



Test.prototype.writeResults = function() {
  var header = "# " + this.testTitle;
  var subtitle = "\n## Test Results";
  header += subtitle
  var tableHeader = "Method Name | Run Time \n" +
                    "----------- | :------: ";
  var tableBody = "";
  var first = true;
  for(method in this.times) {
    if(!first) tableBody += "\n";
    first = false;
    tableBody += `${method} | ${formatTime(this.times[method])}`
  }
  var body = header + "\n" + tableHeader + "\n" + tableBody;
  fs.writeFileSync("README.md", body);
}

// This could definitely be done better
function formatTime(time) {
  var NANO = 1;
  var MILLI = NANO * 1000000;
  var SECOND = MILLI * 1000;
  var MINUTE = SECOND * 60;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;
  var times = {};
  times.days = Math.floor(time / DAY);
  times.hours = Math.floor(time / HOUR);
  time -= times.hours * HOUR;
  times.minutes = Math.floor(time / MINUTE);
  time -= times.minutes * MINUTE;
  times.seconds = Math.floor(time / SECOND);
  time -= times.seconds * SECOND;
  times.millis = Math.floor(time / MILLI);
  time -= times.millis * MILLI;
  times.nanos = time;
  var units = ["days", "hours", "minutes", "seconds", "millis", "nanos"];
  var symbols = {
    days: "d",
    hours: "h",
    seconds: "s",
    millis: "ms",
    nanos: "ns"
  };
  var minumum;
  for(var i = 0; i < units.length; i++) {
    var unit = units[i];
    if(times[unit] > 0) {
      minumum = i;
      break;
    }
  }
  var timestr = "";
  for(var i = minumum; i < units.length; i++) {
    if(i > minumum) timestr += " ";
    timestr += `${times[units[i]]}${symbols[units[i]]}`;
  }
  if(timestr == "") {
    return "0/Unmeasurable";
  }
  return timestr;
}


module.exports = Test;
