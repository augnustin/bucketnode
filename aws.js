var AWS = require('aws-sdk');
var nconf = require('nconf');

nconf.argv()
     .env()
     .file({ file: './config.json' });

AWS.config.update({
  accessKeyId: nconf.get('accessKeyId'), 
  secretAccessKey: nconf.get('secretAccessKey'),
  region: nconf.get('region')
});

AWS.s3 = new AWS.S3({ params: {Bucket: nconf.get('bucket')} }); 

module.exports = AWS;