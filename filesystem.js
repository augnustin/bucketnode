var fs = require('fs');
var path = require('path');

// TODO: Use native method instead
// fs.join = function(path, file) {
//   return path+'/'+file;
// }

// TODO: Look for native method instead
fs.isFileHidden = function(filename) {
  var array = filename.split('/');
  return array[array.length - 1][0] == '.'
}

fs.watchRecursive = function(foldername, options, listener, fileHandler) {
  var watcher = fs.watch(foldername, options);

  watcher.on('change', listener);
  watcher.on('rename', listener);

  fs.readdir(foldername, function(err, files){
    files.forEach(function(file){
      var subpath = path.join(foldername, file); 
      fs.stat(subpath, function (err, stats) {
        if (stats.isDirectory()) {
          fs.watchRecursive(subpath, options, function(event, filename){
            var filesubpath = path.join(file, filename);
            watcher.emit(event, event, filesubpath);
          }, fileHandler);
        } else {
          fileHandler(subpath);
        }
      });
    });
  });
  return watcher;
}

module.exports = fs;