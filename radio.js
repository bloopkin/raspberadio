const       PORT = 1111;

const       util = require('util'),
const       http = require('http');
const fileSystem = require('fs'),
const      spawn = require('child_process').spawn,
const       exec = require('child_process').exec;

var proc = null;

function handleRequest(request, response) {

  var station = null;

  if (request.url == "/npr") 
    station = "http://vprclassical.streamguys.net/vprclassical128.mp3";
  if (request.url == "/rcan") 
    station = "http://2qmtl0.akacast.akamaistream.net/7/953/177387/v1/rc.akacast.akamaistream.net/2QMTL0";

  if (request.url == "/stop" || station != null) {
    if (proc != null) {
       console.log('killing '+proc.pid);
       exec("killall omxplayer.bin");
       proc = null;
    }
  }
  if (request.url == "/stop") {
    response.writeHead(302, {Location: '/'});
    response.end();
    return;
  }

  if (station != null) {
    proc = spawn('omxplayer', [station]);
    proc.stdout.on('data', function (data) {
      console.log('stdout: ${data}');
    });

    proc.stderr.on('data', function(data) {
      console.log('stderr: ${data}');
    });

    proc.on('close', function(code) {
      console.log('child process exited with code ${code}');
    });
    response.writeHead(302, {Location: '/'});
    response.end();
    return;
  }
  response.end(fileSystem.readFileSync('index.html'));
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT);
console.log('server is listening on '+PORT);
