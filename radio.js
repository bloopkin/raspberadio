const       PORT = 1111;

const       util = require('util');
const       http = require('http');
const fileSystem = require('fs');
const      spawn = require('child_process').spawn;
const       exec = require('child_process').exec;

const   stations = [{"path":"/rcan","caption":"Radio-Canaada Premiere","url":"http://2qmtl0.akacast.akamaistream.net/7/953/177387/v1/rc.akacast.akamaistream.net/2QMTL0"},
                    {"path":"/npr", "caption":"Vermont Public Radio Classic","url":"http://vprclassical.streamguys.net/vprclassical64.aac"}];

var proc = null;
var omxplayer_output = null;
var volume = 100;

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
    exec("killall omxplayer.bin");
  }

  if (request.url == "/stop") {
    returnJson('{}', response);
    return;
  }

  if (request.url == "/up") {
    if (volume < 100) {
      volume += 10; 
      if (proc != null)
        proc.stdin.write("+");
    }
    var toReturn = {'volume': volume};
    returnJson(toReturn, response);
    return;
  }

  if (request.url == "/down") {
    if (volume > 0) {
      volume -= 10; 
      if (proc != null)
        proc.stdin.write("-");
    }
    var toReturn = {'volume': volume};
    returnJson(toReturn, response);
    return;
  }

  if (station != null) {
    console.log(station.url);
    proc = spawn('omxplayer', [station.url]);
    proc.stdout.on('stdout', function (data) {
      omxplayer_output = data;
      console.log('stdout: '+data);
    });

    proc.stderr.on('data', function(data) {
      console.log('stderr: '+data);
    });

    proc.on('close', function(code) {
      console.log('child process exited');
    });

    // set initial volume
    var volumeNotches = (100 - volume) / 10;
    for (var i = 0 ; i < volumeNotches ; i++)
      proc.stdin.write("-");
    var toReturn = {'volume': volume};
    returnJson(toReturn, response);
    return;
  }

  if (request.url == "/radio-ui.js") {
    response.end(fileSystem.readFileSync('radio-ui.js'));
    return;
  }

  response.end(fileSystem.readFileSync('index.html'));
}

function returnJson (json, response) {
 if (!(typeof json === "string" || json instanceof String))
   json = JSON.stringify(json);
 console.log (json); // todo logging
 response.writeHead (200, {'Content-Type':'application/json', 'Content-Lenght':json.length});
 response.end (json);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT);
console.log('server is listening on '+PORT);
