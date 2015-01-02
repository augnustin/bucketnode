var fs = require('fs');
var AWS = require('./aws');
var path = '/home/augustin/Bucket';

var sync = {
  stack: [],
  syncAll: function(path) {
    console.log('Syncing '+path);
  },
  syncFile: function(filename) {
    // TODO Use deferred to parallelize s3 query & fs stat 
    AWS.s3.headObject({Key: filename}, function(err, s3Info){ 
      if (err) {
        console.log('File missing, creating ', filename);
        sync.overrideRemoteFromLocal(filename);
      } else {
        console.log('Syncing File '+filename);
        fs.stat(fs.join(path, filename), function (err, stats) {
          // console.log(stats.mtime);
          // console.log(s3Info.LastModified);
          // console.log(stats.mtime == s3Info.LastModified);
          // console.log(stats.mtime > s3Info.LastModified);
          // console.log(stats.mtime < s3Info.LastModified);
          // if (stats.mtime == s3Info.LastModified) {
          //   console.log(filename, ' synchronized');
          // }
          // if (!s3Info || stats.mtime > s3Info.LastModified) {
            // sync.overrideRemoteFromLocal(filename);
          // }
          // if (stats.mtime < s3Info.LastModified) {
            sync.overrideLocalFromRemote(filename);
          // } 
        });
      }
        // console.log('Stats', filename, stats);
    });
  },
  overrideLocalFromRemote: function(filename) {
    console.log('Overriding Remote From Local: '+filename);
    var params = {Key: filename};
    var file = fs.createWriteStream(fs.join(path, filename));
    AWS.s3.getObject(params).createReadStream().pipe(file);
  },
  overrideRemoteFromLocal: function(filename) {
    console.log('Overriding Local From Remote: '+filename);
    var stream = fs.createReadStream(fs.join(path, filename));

    var params = {Key: filename, Body: stream};
    var options = {}; // {partSize: 10 * 1024 * 1024, queueSize: 1};
    AWS.s3.putObject(params, function(err, data) {
    // AWS.s3.upload(params, options, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('successfully uploaded', filename);
        console.log(err, data);
      }
    });
  }
}

module.exports = sync;