var open = require('open');
var util = require('./util');
var consoler = require('component-consoler');
var prompt = require('co-prompt');
var Remotes = require('remotes');
var netrc = require('netrc');
var semver = require('semver');

function getAuth() {
  var github = netrc()['github.com'];
  if (github) return github.login + ':' + github.password;
  var name = process.env.GITHUB_USERNAME;
  var pass = process.env.GITHUB_PASSWORD;
  return name + ':' + pass;
}

var github = new Remotes.github({
  auth: getAuth()
})

function* chooseVersions(versions) {
  versions.forEach(function(v, i){
    var place = util.pad(i + '.', 4).blue;
    console.log('         ' + place + v.bold);
  })
  var str = yield prompt('select versions join by ' + ','.cyan + ': ');
  var vs = str.split(',');
  var arr = vs.map(function(v) {
    return versions[Number(v)];
  })
  arr = arr.sort(function(a, b) {
    return semver.lte(a, b) ? -1 : 1;
  })
  return arr;
}

function* browser(repo) {
  if (!repo) {
    repo = yield prompt('repo <name/repo>'.yellow + ': ');
    if (!/\//.test(repo)) {
      return consoler.fatal('invalid repo');
    }
  }
  var versions = yield github._versions(repo);
  var vs = yield chooseVersions(versions);
  open('https://github.com/' + repo + '/compare/' + vs[0] + '...' + vs[1]);
  process.stdin.pause();
}


module.exports = browser;
