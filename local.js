var fs = require('graceful-fs');
var thunkify = require("thunkify");
var prompt = require('co-prompt');
var colors = require('colors');
var consoler = require('component-consoler');
var resolve = require('path').resolve;
var exec = require('child_process').exec;
var util = require('./util');

function findRepos() {
  if (!fs.existsSync('components')) {
    consoler.fatal('components folder not exists');
  }
  var res = [];
  var names = fs.readdirSync('components');
  names.forEach(function(n) {
    var dirs = fs.readdirSync('components/' + n);
    dirs.forEach(function(d) {
      var versions = fs.readdirSync('components/' + n + '/' + d);
      if (versions.length > 1) {
        res.push(n + '/' + d);
      }
    })
  })
  return res;
}

function* choose(name, arr) {
  arr.forEach(function(v, i){
    var place = util.pad(i + '.', 4).blue;
    console.log('         ' + place + v.bold);
  })
  var n = yield prompt('select ' + name + ': ');
  var res = arr[Number(n)];
  while (!res) {
    console.log('wrong selection, choose again'.red);
    n = yield prompt('select ' + name + ': ');
    res = arr[Number(n)];
  }
  return res;
}

function diff(repo, one, two) {
  return function (done) {
    exec('colordiff -Naur ' + one + ' ' + two, {
      cwd: resolve(process.cwd(), 'components/' + repo)
    }, function (err ,data) {
      done(null, data);
    })
  }
}

function* start(repo) {
  if (!repo) {
    var repos = findRepos();
    repo = yield choose('repo'.yellow, repos);
  }
  var versions = fs.readdirSync('components/' + repo);
  var v0 = yield choose('first version'.yellow, versions);
  versions = versions.filter(function(v) {
    return v !== v0;
  })
  var v1 = yield choose('second version'.yellow, versions);
  process.stdin.pause();
  var res = yield diff(repo, v0, v1);
  console.log(res);
  yield start();
}

module.exports = start;
