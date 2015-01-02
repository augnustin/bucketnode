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

var watchFolder = function(path) {
  console.log('Watching '+path);
  var rWatcher = fs.watchRecursive(path, {}, function (event, filename) {
    if (filename) {
      if (!fs.isFileHidden(filename)) {
        // var filepath = fs.join(path, filename);
        sync.syncFile(filename);
        console.log(filename + ' changed');
      }
    } else {
      console.log('unknown file changed');
    }
  });
};

var syncAll = function(path) {
  console.log('Syncing '+path);
};

var syncFile = function(filename) {
  console.log('Syncing File '+filename);
};

var syncLocalFromRemote = function(filename) {
  console.log('Syncing from Remote: '+filename);
};

var syncRemoteFromLocal = function(filename) {
  console.log('Syncing from Local: '+filename);
};

var start = function() {
  var path = '/home/augustin/Bucket';
  initConfit();
  syncAll(path);
  watchFolder(path);
  // console.log('S3 Bucket: ' + nconf.get('bucket'));
};

start();