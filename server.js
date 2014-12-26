var fs = require('fs');
var util = require('util');
// var _ = require('underscore');

var path = '/home/augustin/Bucket';

// fs.stat(path, function (err, stats) {
//   if (err) throw err;
//   console.log('stats: ' + JSON.stringify(stats));
// });

// TODO: Use native method instead
fs.join = function(path, file) {
  return path+'/'+file;
}

// TODO: Look for native method instead
fs.isFileHidden = function(filename) {
  var array = filename.split('/');
  return array[array.length - 1][0] == '.'
}

fs.watchRecursive = function(foldername, options, listener) {
  // console.log('Watching ' + foldername);
  var watcher = fs.watch(foldername, options);

  watcher.on('change', listener);
  watcher.on('rename', listener);

  fs.readdir(foldername, function(err, files){
    files.forEach(function(file){
      var subpath = fs.join(foldername, file); 
      fs.stat(subpath, function (err, stats) {
        if (stats.isDirectory()) {
          fs.watchRecursive(subpath, options, function(event, filename){
            var filesubpath = fs.join(file, filename);
            watcher.emit(event, event, filesubpath);
          });
        }
      });
    });
  });
  return watcher;
}

var rWatcher = fs.watchRecursive(path, {}, function (event, filename) {
  if (filename) {
    if (!fs.isFileHidden(filename)) {
      var filepath = fs.join(path, filename);
      console.log(filepath + ' changed');
    }
  } else {
    console.log('unknown file changed');
  }
});