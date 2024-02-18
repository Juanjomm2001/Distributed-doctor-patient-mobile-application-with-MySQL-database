var express = require("express");
var app = express();
app.use("/medico", express.static("./app_rest/cliente_rest")); /* proporciona los contenidos estáticos de la carpeta cliente bajo la url apiCliente */
app.use(express.json());
var jwt = require('jwt-simple');
var clave = 'miSecreto'; // clave para codificar / decodificar el token


/*

PARA USAR LOS DATOS 
let datos = require('../datos.js');

var pacientes = datos.pacientes;
var listadomedicos = datos.listadomedicos;
var medicamentos = datos.medicamentos; 
var idNuevoPac = 5;
var medicacion = datos.medicacion;
var tomas = datos.tomas;
var proximoIdPaciente = pacientes.length + 1;
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
    }else{console.log('Conectado correctamente a servidor de bbdd 23')}
});



//////////////////////////////////////////////////////////

//EJERCICIO 4 

//Funcion exec, requiere node
const { exec } = require('child_process');

app.use(express.json()); 

//Funcion para abrir una pagina web aparte de la del medico durante el login
function abrirAEMPS() {
    const url = 'https://www.aemps.gob.es/';
    const comando = `start ${url}`; // Comando para Windows
  
    exec(comando, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al abrir la página web: ${error}`);
        return;
      }
      console.log('Página web abierta con éxito en una nueva pestaña.');
    });
  }

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var conexion = mysql.createConnection(basedatos); //aqui intenta conectar con esa bd y para ello le pasa los datos de databse anteriores
console.log("Conectando con la base de datos...");
conexion.connect(function(err){ //el rsultado de ese intento de conexion, a partir de ahi como se almacena en una variable llamada conexion puedes utilizar los metodos que deuvelvan esa repsuesta y uno de los metodos es connect
    if(err){ //con esta sintaxis podemos manejar si algo va mal. Como no hay nada suponemos que es true.
        console.log("Se ha producido un error al conectar a la base de datos",err);
        process.exit();
    }else{
        console.log("Base de datos conectada correctamente!!!");
    }
});



//////////////////////////////////


//1. GET. Obtiene un array con todos los medicamentos HECHO
app.get("/api/medicamento", function (req, res) { /*Toda la informacion que el cliente mande el cliente envia se guarda en req para el servidos, y con toda esa información se crea una respuesta.  */
var sql = 'SELECT * FROM medicamentos';
connection.query(sql, (err, medicamentos) => {
    if(err){
        console.log('Error en la obtencion de medicamentos: ', err);
    }else{console.log('Medicamentos registrados: ', medicamentos);
    res.json(medicamentos);}   
});

});









//2. POST. Login para médico  HECHO
app.post("/api/medico/login", function (req, res) { // req de petición y res de respuesta. Toda la info que el cliente envía se guarda en req, a partir de la cual enviará información res
    var medicoActual = { 
        login: req.body.login, //lee el nombre de usuario del médico introducido por pantalla
        password: req.body.password //lee la contra del médico introducido por pantalla
    };console.log(medicoActual);
    
    var sql = "SELECT id, nombre, apellidos FROM listadomedicos WHERE user='"+medicoActual.login+"' AND password='"+medicoActual.password+"'";
    connection.query(sql,  function(err, medico)  {
        if(err){
            console.log('Error en la obtencion de medicos: ', err);
            res.status(403).json("Validacion incorrecta");
        } else{
            if (medico.length > 0) {
                // Imprime el ID del médico en la consola
                console.log("Este es el ID del médico:", medico[0].id);
                console.log('med:', medico);
                //res.status(200).json(med[0].id);//envía el id del medico
                var contenido = { // contenido del token (se puede incluir la información que necesitemos)
                    usuario: medico[0].id, //id
                    expira: Date.now() + 60 * 60 * 1000 // expira dentro de 1 hora (en ms)
                };
                var token = jwt.encode(contenido, clave); //codifica token
                console.log(token);
                console.log()
                res.status(200).json({id : medico[0].id, token :token});
            } else {
                // Si no se encuentra un médico, responde con un mensaje de error
                res.status(403).json("Usuario o contraseña incorrecta");
            }
        }
    });    
    // 
  abrirAEMPS();

});
 
app.use("/api", function (req, res, next) { //ESTO COMPRUEBA SI EXISTE EL TOKEN, SINO SE ENCUENTRA LO DICE
    var token = req.query.token; // obtengo el token de una query de la URL: http://MI_SERVIDOR/MI_RUTA?token=XXXXXXXX
   
    if (!token) { // no se ha pasado un token
        res.status(301).json("No se ha encontrado token");
        return;
    }

    // Decodificar el token
    try { // capturamos el error por si el token no es correcto
        var contenidoToken = jwt.decode(token, clave); // decodificamos el token para obtener su contenido con la misma clave que se codificó
    } catch (error) {
        res.status(301).json("El token es incorrecto");
        return;
    }
    console.log("El contenido del token es:", contenidoToken);

    // Validar el token
    if (!contenidoToken || !contenidoToken.expira || !contenidoToken.usuario) { // validamos el formato del token
        res.status(301).json("El formato del token no es adecuado")
        return;
    }

    // Comprobar la fecha de expiración
    if (contenidoToken.expira < Date.now()) {
        res.status(301).json("El token ha expirado");
        return
    }
    // Todo ha ido bien. con next hago que express continue con el procesado
    next();
});




/////////////////////////////////////////

//3. GET. Obtiene los datos del paciente DUDA
app.get("/api/paciente/:id", function (req, res){
  //recojo el id de la url 
  //  var sql= "SELECT id, nombre, medico, observaciones from pacientes WHERE medico = '"+req.params.id+"'";
  var sql= "SELECT id,nombre,apellidos, fecha_nacimiento, genero , medico, observaciones from pacientes WHERE id = '"+req.params.id+"'";
  console.log("SQL 1: ", sql);
  connection.query(sql, (err, paciente) => {
      if(err){
          console.log('Error en la obtencion de pacientes: ', err);
          res.status(404).json("No existe paciente con ese id.");
      }else{
          console.log("este es el pac: ", paciente)
          res.status(200).json(paciente);
      }   
  })
});

//EXAMEEEEENNNNNN
/*
app.get("/api/hospital/:id", function (req, res){
    //recojo el id de la url 
    //  var sql= "SELECT id, nombre, medico, observaciones from pacientes WHERE medico = '"+req.params.id+"'";
    var sql= "SELECT * from pa WHERE hospital = '"+req.params.id+"'";
    console.log("SQL 0: ", sql);
    connection.query(sql, (err, hospital) => {
        if(err){
            res.status(404).json("No existe hospital con ese nombre.");
        }else{
            console.log("Hospital: ", hospital);
            var sql1= "SELECT nombre,apellidos from listadomedicos WHERE hospital = '"+hospital[0].id+"'";
            console.log("SQL 1: ", sql1);
            connection.query(sql1, (err, medicos) => {
                if(err){
                    res.status(404).json("error");
                }else{
                    console.log("Aqui estan los medicos para ese hospital: ", medicos)
                    res.status(200).json(medicos);
                }   
            })
        }   
    })
  });
  */

//4.GET. Obtiene los datos del médico  HECHO pero DUDA
app.get("/api/medico/:id", function(req,res){
    //recojo el id de la url 
    console.log("Este es el idx: ", req.params.id)

    var sql= "SELECT id, nombre,apellidos, user from listadomedicos WHERE id='"+req.params.id+"'";
    connection.query(sql, (err, medico) => {
        if(err){
            console.log('Error en la obtencion del medico: ', err);
            res.status(404).json("No existe medico con ese id.");
        }else{
            console.log("Este es el medicox: ", medico[0])
            res.status(200).json(medico);
        }   
    })
});

//5. GET. Obtiene un array con los datos de sus pacientes  HECHO
app.get("/api/medico/:id/pacientes", function(req,res){
    var sql= "SELECT * FROM pacientes WHERE medico = '"+req.params.id+"'";
    connection.query(sql, (err, pacientes) => {
        if(err){
            console.log('Error en la obtencion de pacientes: ', err);
        }else{
            res.status(200).json(pacientes);
            console.log("PACIENTES",pacientes);
            return;        
        }   
    });
});

//6.POST Crea un nuevo Paciente  HECHO
app.post("/api/medico/:id/pacientes", function(req,res){
    var idMedico = req.params.id;
    if (idMedico < 0) {
        res.status(404).json("No existe el médico");
    }
    else {
        var sql= "INSERT INTO pacientes (id, nombre,apellidos, fecha_nacimiento, genero,medico, codigo_acceso,observaciones) VALUES ('NULL','"+req.body.nombre+"','"+req.body.apellidos+"','"+req.body.fecha_nacimiento+"','"+req.body.genero+"','"+idMedico+"','"+req.body.codigo_acceso+"','"+req.body.observaciones+"')";
        connection.query(sql, (err, paciente) => {
        if(err){
            console.log("No es posible crear el paciente.", err);
            res.status(404).json("No es posible crear el paciente.");
        }else{  
            console.log("este es el paciente nuevo: ", paciente)
            res.status(201).json("paciente creado");
        }   
        });
    }    
});

//7. PUT. Actualiza el paciente pasado por parámetro
app.put("/api/paciente/:id", function(req, res){
    var sql= "UPDATE pacientes SET nombre= '"+req.body.nombreNuevoPaciente+"', apellidos='"+req.body.apellidos+"', fecha_nacimiento='"+req.body.fecha_nacimiento+"', genero ='"+req.body.genero+"', medico='"+req.body.medico+"' WHERE id = '"+req.params.id+"'";
    connection.query(sql, (err, paciente) => {
        if(err){
            console.log("No es posible actualizar el paciente.", err);
            res.status(204).json("Paciente no actualizado");
        }else{  
            //console.log("este es el paciente nuevo: ", paciente)
            res.status(201).json("paciente actualizado");
        }   
    });

})

//8. GET Obtiene la medicación de ese paciente (array de medicaciones) HECHO
app.get("/api/paciente/:id/medicacion",function(req,res){
    var sql= "SELECT * from medicacion WHERE paciente = '"+req.params.id+"'";
    connection.query(sql, (err, medicacionpac) => {
        if(err){
            console.log('Error en la obtencion de pacientes: ', err);
        }else{
            console.log("EEstas son las medicinas: ", medicacionpac)
            res.status(200).json(medicacionpac);
            
        }   
    })
    
});

//9. GET HECHO
app.get("/api/paciente/:id/medicacion/:idm",function(req,res){

    var id= req.params.id;
    var idm= req.params.idm; 
    var tomasPac = []; 

    if (id<0 ){ //si el id del paciente pasado por url no existe, manda error como que el paciente no existe
        res.status(404).json("Error en las tomas")
        return
    }
    var sql="SELECT * FROM tomas WHERE paciente='"+req.params.id+"' AND medicamento ='"+req.params.idm+"' ";
    connection.query(sql, (err, tomas) => {
        if(err|| tomas.length==0){
            console.log("No es posible encontrar las tomas", err);
            res.status(204).json("No existen tomas para este paciente con ese medicamento");
        }
        else{  
            console.log("Estas son las Tomas: ", tomas)
            res.status(200).json(tomas);
        }   
    });
});

//10 POST. Agrega una nueva medicación HECHO
app.post("/api/paciente/:id/medicacion",function(req,res){
    var idPac = req.params.id;
    var sql = "INSERT INTO medicacion (id,medicamento, paciente, fecha_asignacion, dosis,tomas, frecuencia, observaciones) VALUES ('NULL','"+req.body.medicamento+"','"+idPac+"','"+req.body.fecha_asignacion+"','"+req.body.dosis+"','"+req.body.tomas+"','"+req.body.frecuencia+"','"+req.body.observaciones+"')";
    connection.query(sql, (err, medicacionnueva) => {
        if(err){
            console.log("No es posible crear la medicacion.", err);
            res.status(404).json("No es posible crear la medicacion.");
        }else{  
            console.log("Medicacion nueva: ", medicacionnueva)
            res.status(201).json("Medicación creado");
        }   
    });
});




//servidor
app.listen(3000);

