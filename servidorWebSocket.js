var datos = require("./datos");
var pacientes = datos.pacientes;
var listadomedicos = datos.listadomedicos;
var fechaActual = new Date();
// Crear un servidor HTTP
var http = require("http");
var httpServer = http.createServer();

// Crear servidor WS
var WebSocketServer = require("websocket").server; // instalar previamente: npm install websocket
var wsServer = new WebSocketServer({
	httpServer: httpServer
});

// Iniciar el servidor HTTP en un puerto
var puerto = 4444;
httpServer.listen(puerto, function () {
	console.log("Servidor de WebSocket iniciado en puerto:", puerto);
});


var mensajesPac = [];
var mensajesMed = [];
var clientes = []; //clientes conectados



wsServer.on("request", function (request) { // este callback se ejecuta cuando llega una nueva conexión de un cliente
	var connection = request.accept("pacientes", request.origin); // aceptar conexión 
	var cliente = {connection: connection};
	clientes.push(cliente);
	

	console.log("Cliente conectado. Ahora hay " + clientes.length);

	connection.on("message", function (message) { // mensaje recibido del cliente
		if (message.type == "utf8") {
			console.log("Mensaje recibido de cliente: " + message.utf8Data);
			var msg = JSON.parse(message.utf8Data); // cogemos objeto
			cliente.idCliente = msg.idCliente;
			cliente.destino = msg.destino;
			cliente.origen = msg.origen;
			// paciente envia mensaje a medico
			if(cliente.origen ==  "paciente"){
				for(var i = 0; i < clientes.length; i++){
					if(msg.destino == clientes[i].idCliente && clientes[i].origen == "medico"){
						clientes[i].connection.sendUTF(JSON.stringify(msg));
					}
				}
			}
			// medico envia mensaje a paciente
			else{
				for(var i = 0; i < clientes.length; i++){
					if(msg.destino == clientes[i].idCliente && clientes[i].origen == "paciente"){
						clientes[i].connection.sendUTF(JSON.stringify(msg));
					}
				}

			}
		}
		
		
	});
	connection.on("close", function (reasonCode, description) { // conexión cerrada
		clientes.splice(clientes.indexOf(connection), 1);
		console.log("Cliente desconectado. Ahora hay", clientes.length);
	});
});
