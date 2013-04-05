var express = require('express')
	, app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , d3 = require('d3')
  , five = require('johnny-five');

server.listen(4000);
board = new five.Board();

app.use(express.static(__dirname + '/js'));

app.get('/', function(request, response){
  response.sendfile(__dirname + "/index.html");
});
 
var activeClients = 0;
var value = 0;
io.sockets.on('connection', function(socket){clientConnect(socket)});
 
function clientConnect(socket){
 
  board.on('r', function(val){
      io.sockets.emit('right', {val: val});
  });
  socket.on('disconnect', function(){clientDisconnect()});
}
 

board.on("ready", function() {
  
   r = new five.Sensor({
    pin: "A3",
    freq: 250,
    range: [920, 1023]
  });
  r.scale([0, 5]).on("read", function() {
    value = this.scaled;
    board.emit('r', value)
  });
});