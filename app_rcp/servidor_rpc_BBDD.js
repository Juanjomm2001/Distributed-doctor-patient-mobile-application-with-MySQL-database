var rpc = require("./rpc.js");
rpc.debug = true;

//let datos = require('../datos.js');
//http://localhost:3000/medico/
 
/*
var pacientes = datos.pacientes;
var listadomedicos = datos.listadomedicos;
var medicamentos = datos.medicamentos; 
var medicacion = datos.medicacion;
var tomas = datos.tomas;
*/


//CONEXION AL SERVIDOR DE BBDD
const mysql = require('mysql');
const basedatos = {
    host: 'localhost', 
    user: 'root', //?? 
    password: '', //??
    database: 'practica1'
}
var connection = mysql.createConnection(basedatos);
console.log("Conectando con la base de datos...");
connection.connect((err)=>{
    if(err){console.error('Error conectando a la bbdd: ', err);
        process.exit();
    }else{console.log('Conectado correctamente a servidor de bbdd 23 con rpc')}
});



function login(codAcc,callback){  //hecho
    var sql="SELECT * FROM pacientes WHERE codigo_acceso='"+codAcc+"'";
    connection.query(sql, function (error, paciente) {
        console.log('Secuencia ',sql)
        if (error) {
            callback(null); // error en la consulta
        }else {
            console.log('Paciente: ',paciente[0]);

            callback(paciente[0]);
        }
    });
}
function listadoMedicamentos(callback){
    connection.query("SELECT * FROM medicamentos ", function (error, medicamentos) {
        //console.log("paciente que me devuelve la bbdd:",paciente)
         // console.log("Medico para ese paciente",medico)
         if (error) {
            callback(null);
        }else {
            callback(medicamentos);       
        }
    });
}

function datosMedico(idMedico,callback){ //Hecho
    var sql="SELECT id, nombre,apellidos FROM listadomedicos WHERE id='"+idMedico+"'";
    connection.query(sql,function (error, medico) {
       // console.log("Medico para ese paciente",medico)
        if (error) {
            callback(null);
        }else {
            callback(medico[0]);       
        }
    });
}


function Fmedicacion(idPaciente,callback){ //nose si hecho
    var sql="SELECT * FROM medicacion WHERE paciente='"+idPaciente+"'";
    connection.query(sql,function (error, medicacion) {
        //console.log("muestras de ese pac:",medicacion)
        if (error) {
            callback(null);
        }else {
            callback(medicacion);       
        }
    });
}

function listadoTomas(idPaciente, idMedicamento,callback){ //hecho
    var sql="SELECT * FROM tomas WHERE (paciente='"+idPaciente+"' AND medicamento='"+idMedicamento+"')";
    connection.query(sql,function (error, tomas) {
        //console.log("Sentencia de TOMAS de ese pac para ese medicamento:",sql)
        if (error||tomas.length==0) {
            callback(null);

        }else {
            callback(tomas);       
        }
    });
}

function agregarToma(idPaciente, idMedicamento, fecha,callback){  //hecho
    if (!idPaciente || !idMedicamento || !fecha){ 
        callback(0); 
    }
    //console.log("Nuevas variables: ", idPaciente, idVariable,fecha,valor); VALUES ('NULL','"+req.body.nombre+"','"+req.body.apellidos+"','"+req.body.fecha_nacimiento+"','"+req.body.genero+"','"+idMedico+"','"+req.body.codigo_acceso+"','"+req.body.observaciones+"')";
    var sql="INSERT INTO tomas (id_tomas,medicamento,paciente,fecha) VALUES ('NULL','"+idMedicamento+"','"+idPaciente+"','"+fecha+"')";
    connection.query(sql,function (error,confirmacion) {
        //console.log(confirmacion.insertId);
        if(error){
            //Devuelvo 0 porque no se ha creado la muestra en la bbdd
            callback(0);
        }else {
            callback(confirmacion.insertId);       
        }
    });
}
 

function eliminarToma(idPaciente,idMedicamento, fechaToma,callback){ //hecho
    var sql = "DELETE FROM tomas WHERE (paciente='" + idPaciente + "' AND medicamento='"+idMedicamento+"' AND fecha='"+fechaToma+"')";
    connection.query(sql, (error, resultado)=>{
        if(error){
            callback(false);
        }else{
            resultado=true
            callback(resultado);
        }
    });
}


//P.3 todas la tomas

function todasTomas(idPaciente, callback){
    var sql= "SELECT * FROM tomas WHERE paciente='"+idPaciente+"'";
    connection.query(sql, function (error, tomas){
        if (error||tomas.length==0) {
            callback(null);

        }else {
            callback(tomas);       
        }
    });
}


var servidor = rpc.server(); // crear el servidor RPC
var app = servidor.createApp("gestion_pacientes"); // crear aplicación de RPC

//Registramos los procedimientos
app.registerAsync(login);
app.registerAsync(listadoMedicamentos);
app.registerAsync(datosMedico);
app.registerAsync(Fmedicacion);
app.registerAsync(listadoTomas);
app.registerAsync(agregarToma);
app.registerAsync(eliminarToma);
app.registerAsync(todasTomas);

