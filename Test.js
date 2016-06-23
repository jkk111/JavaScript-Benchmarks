var BANNED_FOLDER_NAMES = ["node_modules", ".git"];
var fs = require("fs");
var path = require("path");
var childProcess = require("child_process");
function Test(methods, name, loops, silent) {
  this.loops = loops || 10000;
  this.methods = methods;
  this.testTitle = name;
  this.times = {};
  this.silent = silent || process.env.SILENT_JS_TEST;
}

Test.prototype.run = function() {
  console.info("Starting test:", this.testTitle);
  for(method in this.methods) {
    var start = process.hrtime();
    if(!this.silent) {
      console.info("Starting test of %s", method);
    }
    var lastPercent = -1;
    for(var i = 0; i < this.loops; i++) {
      var percent = Math.floor((i / this.loops) * 100);
      if(percent > lastPercent) {
        if(!this.silent) {
          console.info(`${method}) ${percent}%`);
        }
        lastPercent = percent;
      }
      this.methods[method]();
    }
    if(!this.silent) {
      console.info(`${method}) 100%`);
    }
    var end = process.hrtime(start);
    if(!this.silent) {
      console.info("Completed test of %s", method);
      console.info("Time: %ds %sns", end[0], end[1]);
    }
    this.times[method] = (end[0]*1e9) + end[1];
  }
  console.info("Test Completed:", this.testTitle);
  this.writeResults();
  return this;
}

Test.prototype.writeResults = function() {
  var header = "# " + this.testTitle;
  var subtitle = `\n## Test Results - ${this.loops} runs`;
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
  var body = header + "\n" + tableHeader + "\n" + tableBody + "\n\n";
  body += "<p align='center'><b>Auto-Generated on: " + new Date().toString().substring(0, 24) +"</b></p>";
  fs.writeFileSync(process.env.PROCESS_README_PATH || "README.md", body);
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

if (require.main === module) {
  var tested = [];
  console.info("Re-Running all tests");
  var folderContents = fs.readdirSync("./");
  for(var i = 0; i < folderContents.length; i++) {
    var name = folderContents[i];
    if(BANNED_FOLDER_NAMES.indexOf(name) == -1) {
      var stats = fs.statSync(name);
      if(stats.isDirectory()) {
        try {
          var resolved = path.resolve(__dirname, name, "./index.js");
          fs.accessSync(resolved, fs.R_OK);
          var env = process.env;
          env.SILENT_JS_TEST = true;
          env.PROCESS_README_PATH = path.resolve(__dirname, name, "./README.md");
          childProcess.fork(resolved, {env: env});
          tested.push(name);
        } catch(e) {
          // Folder doesn't have an index.js script or other error occured
        }
      }
    }
  }
  updateReadme(tested);
}

function updateReadme(tested) {
  var readmeBase = fs.readFileSync("README.base.md").toString();
  var gitBase = getGitBase();
  var readme = readmeBase.trim() + "\n\n";
  readme += "## Tests\n\n"
  tested.forEach(function(item) {
    readme += `[${item}](${genPath(gitBase, item)})\n\n`;
  });
  readme += "<p align='center'><b>Auto-Generated on: " + new Date().toString().substring(0, 24) +"</b></p>";
  readme = readme.trim();
  fs.writeFileSync("README.md", readme);
}

function getGitBase() {
  var regex = /(https:\/\/.*)\.git/;
  var config = fs.readFileSync(".git/config").toString();
  var matched = regex.exec(config);
  if(matched) return matched[1];
  else return "";
}

function genPath(gitBase, dirName) {
  if(gitBase.charAt(gitBase.length - 1) != "/")
    gitBase += "/";
  return gitBase + "tree/master/" + dirName;
}

module.exports = Test;
