var pac;
var idPac;
var nombrePac;
var apellidoPac;
var idMedicoIniciado;
var nombreMedico;
var apellidoMedico;
var medicacionesCambiadas;
var fechaActual = new Date();



// Connection opened


function obtenerMedicamentos() { // obtiene la lista de medicamentos
    rest.get("/api/medicamentos"+"?token="+token, function (estado, medicamentos) { /*El estado que se envia con el .status se guanda el 200 en `estado` y la respuesta (el array de hospitales) se guarda en hospitales*/
        console.log("Estado:", estado, "Medicamentos:", medicamentos);
        if (estado != 200) {/*si el estado es diferente a 200 ha habido algún tipo de error*/
            alert("Error cargando la lista de medicamentos");
            return;
        } 
        var lista = document.getElementById("medicamentos");
        lista.innerHTML = "";
        for (var i = 0; i < medicamentos.length; i++) { /*recorro el array de medicamentos y voy sacando para construir el primer elemento de la lista. Mezcla javaScript con html*/
            lista.innerHTML += "<li>" + medicamentos[i].id + " - " + medicamentos[i].nombre + " - " + medicamentos[i].descripcion +" - "  +  medicamentos[i].num_dosis +" - "  +  medicamentos[i].importe + " - "  + medicamentos[i].importe_subvencionado + " - " ; // esto estaba antes no se que significa + " <button onclick='eliminarHospital(" + hospitales[i].id + ")'>Borrar</button></li>";
        }
    }); 
}
 

function actualizarPaciente(idPaciente){
    var pacienteMod = {
        id: document.getElementById("idPMod").value, 
        nombre: document.getElementById("nombrePMod").value, 
        fecha_nacimiento: document.getElementById("fecha_nacimientoPMod").value, 
        genero: document.getElementById("generoPMod").value, 
        medico: document.getElementById("medicoPMod").value, 
        codigo_acceso: document.getElementById("codigo_accesoPMod").value,
        observaciones: document.getElementById("observacionesPMod").value
    }
    console.log(pacienteMod);
    rest.put("/api/paciente/" + idPaciente+"?token="+token, pacienteMod, function(estado, pacientes){
        if (estado != 200){
            alert("Error al modificar el paciente");
        }else{
            console.log(pacientes);
            pacientesMedico(idMedicoIniciado);
            alert("Paciente modificado con éxito");
        }
    });
}

function vaciarCamposNuevoPaciente() {
    document.getElementById("nombreP").value = "";
    document.getElementById("fecha_nacimientoP").value = "";
    document.getElementById("generoP").value = "";
    document.getElementById("codigo_accesoP").value = "";
    document.getElementById("observacionesP").value = "";
}

function vaciarCamposNuevaMedicacion() {
    document.getElementById("medicamento").value = "";
    document.getElementById("pacienteMed").value = "";
    document.getElementById("fecha_asignacionMed").value = "";
    document.getElementById("dosisMed").value = "";
    document.getElementById("tomasMed").value = "";
    document.getElementById("frecuenciaMed").value = "";
    document.getElementById("observacionesMed").value = "";
}

//F CAMBIAR SECCIÓN, se pasa por parametro la sección acrual y la sección a la que se quiere cambiar
function cambiarSeccion(seccionActual, seccion){
    
    actual = document.getElementById(seccionActual).classList.remove("activa");
    nueva = document.getElementById(seccion).classList.add("activa");
    seccionActual = seccion;
    //console.log(seccionActual);
}

//F LOGIN
function login() {
    var medico = {
        login: document.getElementById("login").value,
        password: document.getElementById("password").value
    };
    console.log(medico);
    rest.post("/api/medico/login", medico, function (estado, respuesta) { //post para pedir al servidor que compruebe si los datos pasados por pantalla concuerdan con algún médico y contraseña
        if (estado != 200) { //si no es correcto
            alert("Usuario o contraseña incorrectos");
            salirSistema();
        } else { //si el estado = 200
            token = respuesta.token;
            idMedicoIniciado = respuesta.id;
            console.log("el token es: " + token);

            rest.get("/api/medico/"+ respuesta.id+"?token="+token, function (estado, datosMedico){ //get para pedir al servidor los datos del Médico
                console.log('DATITOS ',respuesta.id )
                if (estado !=200){
                    console.log('DATITOS estado',estado )
                    alert("No hay datos del médico")
                }else{  
                    
                    idMedicoIniciado = datosMedico[0].id;
                    nombreMedico = datosMedico[0].nombre; //se asigna a nombreMedico el nombre de datosMedico que ha pasado el servidor
                    apellidoMedico = datosMedico[0].apellidos;
                    var bienvenida = document.getElementById("mensaje_bienvenida");
            
                    bienvenida.innerHTML = ""; 
           

            bienvenida.innerHTML = "¡Bienvenido/a " + nombreMedico + " " + apellidoMedico + "!" ;
            pacientesMedico(respuesta.id); // se muestran los pacientes de ese medico
            idMedicoIniciado = respuesta.id;
            cambiarSeccion("S_login","S_menu");

            return respuesta.id; 
                }  
        }) 
       
    }});
}
var pacienteglobal;

//3. GET /api/paciente/:id
function cargarPaciente(idPaciente){
    rest.get("/api/paciente/" + idPaciente +"?token="+token, function(estado,infoPaciente){
        if(estado != 200){
            alert("No se ha encontrado el paciente")
        }
        else{
            var pacienteglobal=infoPaciente;
            pac = infoPaciente[0]; 
            idPac = pac.id;
            cambiarSeccion('S_menu', 'S_vistaPaciente');
            var lista = document.getElementById("lista_paciente"); 
            lista.innerHTML = "";
            lista.innerHTML += "<li class = " + 'datosPac' + "> " + "Paciente: " + pac.id + "<br> Nombre: " + pac.nombre + "<br> Fecha de nacimiento: " + pac.fecha_nacimiento + " <br> Género:  " + pac.genero + " <br> Médico: " + pac.medico + " <br> Observaciones: " + pac.observaciones + "<br></li>";
            obtenerMedicacionPac(pac.id);
            console.log(pac.id);
          


        }
    })
}

//4. GET /api/medico/:id Obtiene los datos del médico 
function cargarMedico(idMedico){
    rest.get("/api/medico/" + idMedico+"?token="+token, function(estado,datosMedico){
        console.log("Estado:", estado, "datos Medico:", datosMedico);
        if(estado != 200){
            alert("No se ha encontrado el paciente");
            return;
        }
        else{
            datosMedico.id = idPaciente; 
            cambiarSeccion('S_login', 'S_menu'); 
            var lista = document.getElementById("datos");
            lista.innerHTML = "";
            lista.innerHTML += "<li class = " + 'datosMedico' + "> " + idMedico + " - " + datosMedico.nombre + " - " + datosMedico.apellidos + " - " + datosMedico.usuario +"</li>";
           
        }
    })
}

// 5. GET /api/medico/:id/pacientes
function pacientesMedico(idMedico) {
    rest.get("/api/medico/" + idMedico + "/pacientes"+"?token="+token, function(estado, pacientes_medico) { 
        if (estado != 200) {
            alert("Medico sin pacientes");
        }
        else {
            var ol = document.createElement("ol");
            console.log(pacientes_medico);
            var lista = document.getElementById("lista_pacientes");//aparece la lista de pacientes y da la opción de cargarlos
            lista.innerHTML = "";
            for (var i = 0; i < pacientes_medico.length; i++)  {
                lista.innerHTML += "<li class = " + 'pacientes' + "> " + pacientes_medico[i].id + " - " + pacientes_medico[i].nombre + " "  + pacientes_medico[i].apellidos + " - "+ " <button class = " + 'botonP' + " onclick='cargarPaciente(" + pacientes_medico[i].id + ")'>Consultar expediente</button> <br> <br> </li>"
              
            }

        } 
    });
}


// 6. POST /api/medico/:id/pacientes 
function crearPaciente(){ 
    var pac = { 
        nombre: document.getElementById("nombreP").value,
        apellidos: document.getElementById("apellidosP").value,
        fecha_nacimiento: document.getElementById("fecha_nacimientoP").value,
        genero: document.getElementById("generoP").value,
        codigo_acceso: document.getElementById("codigo_accesoP").value,
        observaciones: document.getElementById("observacionesP").value
    };
 
    console.log(pac); 
    rest.post("/api/medico/" + idMedicoIniciado + "/pacientes"+"?token="+token, pac, function (estado, pacientes_medico){
        if(estado != 201){  
            alert("Error al crear nuevo paciente");
        } else {
            pacientesMedico(idMedicoIniciado);
            vaciarCamposNuevoPaciente();
            alert("Paciente creado con éxito");
        }
    });
}
function salirSistema(seccionActual){
    var login = document.getElementById("login").value = "";
    var password = document.getElementById("password").value = "";
}

//8. "/api/paciente/:id/medicacion"
function obtenerMedicacionPac(idPac){
    console.log(idPac)
    rest.get("/api/paciente/" + idPac + "/medicacion"+"?token="+token, function(estado, medicacionPac) { 
        if(idPac > 0){
            var lista = document.getElementById("medicacion_pac");
            lista.innerHTML = "";
            var listaTomas = document.getElementById("tomas_pac"); //para limpiar las tomas, dado que no entraria en obtenerTomas si no hay medicacion
            listaTomas.innerHTML = "";
            if (estado != 200) {
                alert("Sin medicación asignada");
            }
            else {
                var ol = document.createElement("ol"); 
                console.log(medicacionPac);
                
                lista.innerHTML = "";
                for (var i = 0; i < medicacionPac.length; i++)  { 
                    console.log(medicacionPac[i].observaciones);
                    lista.innerHTML += "<li class = " + 'medicacion' + "> ID medicamento: " + medicacionPac[i].medicamento + " , fecha de asignación:  " + medicacionPac[i].fecha_asignacion + " , dosis: "  + medicacionPac[i].dosis + " , número de tomas:  " + medicacionPac[i].tomas + " , frecuencia de las tomas: " + medicacionPac[i].frecuencia + " , observaciones:  " + medicacionPac[i].observaciones + "   " +  " <button class = " + 'botonP' + " onclick='consultarTomas(" + idPac + ","+ medicacionPac[i].medicamento + ")'>Consultar listado de tomas</button> <br><br></li>"; 
                }
            } 
        }
        else{
            if(estado != 200){
                alert("Error en la medicacion");
            }
        }
    });
    
}
// post("/api/paciente/:id/medicacion/")
function crearMedicacion(){
    var med = { 
        medicamento: document.getElementById("medicamento").value,
        paciente: document.getElementById("pacienteMed").value,
        fecha_asignacion: document.getElementById("fecha_asignacionMed").value,
        dosis: document.getElementById("dosisMed").value,
        frecuencia: document.getElementById("frecuenciaMed").value,
        tomas: document.getElementById("tomasMedP").value,
        observaciones: document.getElementById("observacionesMed").value
    };

    console.log(med);
    rest.post("/api/paciente/" + med.paciente + "/medicacion"+"?token="+token, med, function (estado, medicacion){
        if(estado !== 201){  
            alert("Error al crear nueva medicación");

        } else {
            cargarPaciente(med.paciente);
            vaciarCamposNuevaMedicacion();
            alert("Medicacion creado con éxito");
        }
    });
}


//9. "/api/paciente/:id/medicacion/:idm"
function consultarTomas(idPac, idMedicamento){
    rest.get("/api/paciente/" + idPac + "/medicacion/" + idMedicamento+"?token="+token, function(estado, tomasPac) { 
        var listaTomas = document.getElementById("tomas_pac");
        listaTomas.innerHTML = "";
        if (estado != 200) {
            alert("No existen tomas para este paciente con ese medicamento");
        }
        else {
            var ol = document.createElement("ol"); 
            console.log(tomasPac);
            listaTomas.innerHTML = "";
            listaTomas.innerHTML +="<h3> Listado de tomas para el medicamento </h3><br>"; 
            for (var i = 0; i < tomasPac.length; i++)  { 
                listaTomas.innerHTML += "<li class = " + 'tomas' + "> ID tomas " + i + ". Fecha toma: " +  tomasPac[i].fecha + "<br><br></li>"; 
            }

        } 
    });
    
}




app.get("/api/paises/:nombre"+"?token="+token, function (req, res) { 
    // le paso el nombre del pais que quiero 
    var nombre_pais = req.params.nombre;
    // LE PIDO EL ID DEL PAIS QUE HE RECIBIDO EL NOMBRE
    var sql ="SELECT * FROM paises WHERE nombre = '" + nombre_pais + "'";
    conexion.query(sql, function(err, idPais){
        if (err){
            console.log("Error al realizar la conexión")
        }else{
            // ahora vamos a bucar la referencia
            console.log(idPais)
            var sql_medicospais = "SELECT * FROM medicos WHERE pais = '" + idPais[0].id + "'";
            conexion.query(sql_medicospais, function(err, listamedicos){
                if(err){
                    console.log("no se ha hecho la segunda conexion")
                }else{
                    console.log(listamedicos)
                }
            })
        }
    })
});








//WEBSOCKET


// Connection opened
var conexion = new WebSocket('ws://localhost:4444', "pacientes");
conexion.addEventListener("open", function (event) {
    console.log("Médico conectado!!!");
    conexion.send(JSON.stringify({categoria: "medico", idCliente: idMedicoIniciado})); // le digo al servidor quien soy yo (mi primer mensaje)
});


// Listen for messages
conexion.addEventListener('message', function (event) {
    console.log("Mensaje del servidor:", event.data);
    var mensaje  = JSON.parse(event.data);
    document.getElementById("mensajesPac").innerHTML += "<li class = 'mensajePac'>Fecha: " + mensaje.fecha + ", paciente: " + mensaje.nombreCliente + " "+ mensaje.apellidosCliente +  ", solicitud: " + mensaje.mensaje + "</li>";

});

function enviarMensaje(){

    var mensaje = document.getElementById("mensaje").value;
    conexion.send(JSON.stringify({ categoria: "mensaje", fecha: fechaActual, destino: idPac,  origen: "medico", nombreCliente: nombreMedico, apellidosCliente: apellidoMedico, idCliente: idMedicoIniciado, mensaje: mensaje }));
}






//PRACTICA 3

//EJERCICIO 1
function medicamentoAEMPS(){
    var nombre_medic= document.getElementById("nombre_med").value;
    console.log("Nombre:", nombre_medic);
    rest.get("https://cima.aemps.es/cima/rest/medicamentos?nombre=" + nombre_medic, function(estado,datos_Medicamento){
        console.log("Estado:", estado, "Datos medicamentos:", datos_Medicamento);
        if(estado != 200){
            alert("No se ha encontrado el medicamento");
            return;
        }
        else{
            var lista = document.getElementById("listaMedicamentos");
            lista.innerHTML = "";

            // Utilizar un bucle for para mostrar los nombres de los primeros 10 resultados
            for (var i = 0; i < 10; i++) {
                lista.innerHTML += "<li>" + datos_Medicamento.resultados[i].nombre + "</li>";
            }
        }
    });
}

//EJERCICIO 2 A   EN EL PACIENTE RPC

//EJERCICIO 2 B


function contabilizarTomasAEMPS(){
    rest.get("https://undefined.ua.es/telemedicina/api/datos" ,function(estado,resultado){
    var tomasGenerales = 0;
    var tomasTotales = 0;
    if (estado != 200) {
        console.log("Error al cargar las tomas");
        //return;
    }else{
        for(var i =0; i<resultado.length; i++){
            tomasTotales = resultado[i].datos.length;
            //console.log(tomasTotales);
            tomasGenerales=tomasGenerales+tomasTotales;
            //console.log("El numero de tomas totales es: " + tomasTotales);
        }
        console.log(tomasGenerales);
        var total=document.getElementById("Total_tomas_ul");
        total.innerHTML = "";
        total.innerHTML+="El numero total de tomas en la base de datos es de: "+tomasGenerales;

        }        
})
}









//Examen realg
/*

function contabilizarTomasAEMPS_examen() {
    rest.get("https://undefined.ua.es/telemedicina/api/datos", function (estado, resultado) {
        var tomasGenerales = 0;
        //var tomasTotales = 0;

        if (estado != 200) {
            console.log("Error al cargar las tomas");
        } else {
            for (var i = 0; i < resultado.length; i++) {
                if (resultado[i].id_area == 7) { 
                    console.log("Id " + resultado[i].id_area);
                    for (var f = 0; f < resultado[i].datos.length; f++) {
                        if (resultado[i].datos[f].medicamento == "ibuprofeno") { 
                            tomasGenerales++; 
                        }
                    }
                }
            }
            console.log(tomasGenerales);
            var total = document.getElementById("Total_tomas_ul_EXAMEN");
            total.innerHTML = "";
            total.innerHTML += "El número total de tomas en la base de datos es de: " + tomasGenerales;
        }
    })
}

*/

//funcion duplicarPaciente. ANA
/*

function duplicarPaciente(idPac){
    rest.post("/api/paciente/" + idPac+ "/duplicar", function(status, duplicado){
        if(status ==200){
            alert("duplicado con exito");
            pacientesMedico(idMedicoIniciado);
        }
        else {
            alert("paciente NO duplicado");
        }
        return; 
    })
}*/

//funcion eliminarPaciente. ANA
/*
function eliminarPaciente(idPac){
    rest.delete("/api/paciente/" + idPac, function (estado, eliminado){
        if(estado!=200){
            alert("No eliminado correcatamnte");
        }
        else{ 
            alert("Se ha eliminado al paciente correctamente");
            console.log(pacientesMedico(idMedicoIniciado));
        }
        return;
    })
}*/


//funcion TraspasarPacientes ANA
/*
function traspasarPacientes(){

    var medicoAceptor = document.getElementById("medicoAceptor").value;
    console.log(medicoAceptor); //bien

    rest.post("/api/medico/"+ idMedico+ "/traspaso/", function(estado, madicoAcep){
        if(estado!=201){
            alert("Traslado no realizado");
        }
        else{
                console.log(pacientesMedico(madicoAcep));
        }
        return madicoAcep;
    })
}*/



/*
function traspasarPacientes(){
    var idMedico2 = document.getElementById("idMedico2").value;
    rest.post("api/medico/" + idMedico2 + "/traspaso", idMedico2, function(estado, idMedico2) {
        if(estado != 201){  
            alert("Error al traspasar pacientes");
        } else {
            console.log("Pacientes traspasados: " + pacientes);
        }
    });
    pacientesMedico(idMedico2);
}*/

