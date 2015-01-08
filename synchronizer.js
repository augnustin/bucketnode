var fs = require('fs');
var AWS = require('./aws');
var path = require('path');
var watchRepo = '/home/augustin/Bucket';


var sync = {
  stack: [],
  syncAll: function(path) {
    console.log('Syncing '+path);
  },
  syncFile: function(filepath) {
    // TODO Use deferred to parallelize s3 query & fs stat 
    AWS.s3.headObject({Key: path.relative(watchRepo, filepath)}, function(err, s3Info){ 
      if (err) {
        console.log('File missing, creating ', filepath);
        sync.overrideRemoteFromLocal(filepath);
      } else {
        console.log('Syncing File '+filepath);
        fs.stat(filepath, function (err, stats) {
          var localChangeTS = stats.mtime.getTime(); 
          var remoteChangeTS = s3Info.LastModified.valueOf();
          if (localChangeTS > remoteChangeTS) {
            sync.overrideRemoteFromLocal(filepath);
          }
          else if (localChangeTS < remoteChangeTS) {
            sync.overrideLocalFromRemote(filepath);
          } 
          else {
            console.log(filepath, ' synchronized');
          }
        });
      }
        // console.log('Stats', filepath, stats);
    });
  },
  overrideLocalFromRemote: function(filepath) {
    console.log('Overriding Local From Remote: '+filepath);
    console.log(path.relative(watchRepo, filepath));
    var params = {Key: path.relative(watchRepo, filepath)};
    var file = fs.createWriteStream(filepath);
    AWS.s3.getObject(params).createReadStream().pipe(file);
  },
  overrideRemoteFromLocal: function(filepath) {
    console.log('Overriding Remote From Local: '+filepath);
    console.log(path.relative(watchRepo, filepath));
    var stream = fs.createReadStream(filepath);

    var params = {Key: path.relative(watchRepo, filepath), Body: stream};
    var options = {}; // {partSize: 10 * 1024 * 1024, queueSize: 1};
    AWS.s3.putObject(params, function(err, data) {
    // AWS.s3.upload(params, options, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('successfully uploaded', filepath);
        console.log(err, data);
      }
    });
  }
}

module.exports = sync;