const       PORT = 1111;

const       util = require('util');
const       http = require('http');
const fileSystem = require('fs');
const      spawn = require('child_process').spawn;
const       exec = require('child_process').exec;

const   stations = [{"path":"/rcan","caption":"Radio-Canaada Premiere","url":"http://2qmtl0.akacast.akamaistream.net/7/953/177387/v1/rc.akacast.akamaistream.net/2QMTL0"},
                    {"path":"/npr", "caption":"Vermont Public Radio Classic","url":"http://vprclassical.streamguys.net/vprclassical64.aac"}];

var proc = null;

function handleRequest(request, response) {

  var station = null;

  var arrayLength = stations.length;
  for (var i = 0; i < arrayLength; i++) {
    if (request.url == stations[i].path) {
      console.log(stations[i].path);
      station = stations[i];
      break;
    }
  }

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
    console.log(station.url);
    proc = spawn('omxplayer', [station.url]);
    proc.stdout.on('data', function (data) {
      console.log('stdout: ${data}');
    });

    proc.stderr.on('data', function(data) {
      console.log('stderr: ${data}');
    });

    proc.on('close', function(code) {
      console.log('child process exited');
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
