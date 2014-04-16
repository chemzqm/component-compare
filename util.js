function pad(str, n) {
  var res = str;
  if (str.length > n) return str.slice(0, n);
  while(res.length != n) res = res + ' ';
  return res;
}

exports.pad = pad;
