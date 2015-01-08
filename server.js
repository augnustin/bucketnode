var util = require('util');

var fs = require('./filesystem');
var sync = require('./synchronizer');
var AWS = require('./aws');

// var Datastore = require('nedb'), db = new Datastore({ filename: './data/storage.db', autoload: true });
// db.loadDatabase(function (err) {    // Callback is optional
//   // Now commands will be executed
// });


var initConfit = function() {
 
}

var watchFolder = function(folder) {
  console.log('Watching '+folder);
  var recWatcher = fs.watchRecursive(folder, {}, function (event, filename) {
    console.log(filename);
    if (filename) {
      if (!fs.isFileHidden(filename)) {
        // var filepath = fs.join(folder, filename);
        sync.syncFile(filename);
        console.log(filename + ' changed');
      }
    } else {
      console.log('unknown file changed');
    }
  }, function(filename) {
    sync.syncFile(filename);
  });
};

var start = function() {
  var path = '/home/augustin/Bucket';
  initConfit();
  watchFolder(path);
  // console.log('S3 Bucket: ' + nconf.get('bucket'));
};

start();