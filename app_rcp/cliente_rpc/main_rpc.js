
//Vinculamos cliente - servidor. Obtener una referencia a la app RPC (instancia de la aplicación gestion pacientes del servidor localhost)
var app = rpc("localhost", "gestion_pacientes"); //vinculacion del cliente rpc con el servidor rpc

//Obtener referencias a los procedimientos remotos registrados por el servidor.
var login = app.procedure("login"); //obtenerPacientes es una funcion. Ahora se puede invocar a una función definida en el servidor, se trae desde el servidor y se guarda en la variable obtenerPacientes
var listadoMedicamentos = app.procedure("listadoMedicamentos");//se obtiene una referencia a lo que hay en el servidor para poder usarlo en el cliente (para las 3 variables)
var datosMedico = app.procedure("datosMedico"); 
var Fmedicacion = app.procedure("Fmedicacion");
var listadoTomas = app.procedure("listadoTomas");//se obtiene una referencia a lo que hay en el servidor para poder usarlo en el cliente (para las 3 variables)
var agregarToma = app.procedure("agregarToma"); 
var eliminarToma = app.procedure("eliminarToma");
var todasTomas= app.procedure("todasTomas");
//PAceinte GlOBAL
var PacienteGlobal=null;
var ListadoGlobal=null;

var idPaciente = null; 
var nombrePaciente = null;
var apellidoPaciente = null;
var fecha_nacimientoPaciente = null;
var generoPaciente = null;
var idMedicoPaciente = null;
var codigo_accesoPaciente = null;
var observacionesPaciente = null;
var fechaActual = new Date();
var idMedicamento = null;

function cambiarSeccion(seccionActual,seccion) {
    console.log(seccionActual);
    actual = document.getElementById(seccionActual).classList.remove("activa");
    nueva = document.getElementById(seccion).classList.add("activa");
    seccionActual = seccion;
}

function salirSistema() {
    document.getElementById("codigo_accesoP").value = "";
}

function tomaspordia(idPaciente, idMedicamento){
    listadoTomas(idPaciente, idMedicamento, function(listado_tomas){
        var tomasactuales = 0;
        for(var i = 0; i < listado_tomas.length; i++){
            if(listado_tomas[i].fecha == fechaActual){
                tomasactuales = tomasactuales + 1;
            }
        }
        console.log(tomasactuales);
    });
    return(tomasactuales);    
}

//fecha última toma
function ultimatoma(listado_tomas){
    var idMedicamento = idMedicamento;

    var ultima_toma = listado_tomas[listado_tomas.length-1];
    var fecha_toma_reciente = ultima_toma.fecha;
    var ultima_fecha = new Date(fecha_toma_reciente);
    console.log(fecha_toma_reciente);
    return(ultima_fecha);
}

    
// servicio 1

function loginPacientes(){
    var codigoAcceso = document.getElementById("codigo_accesoP").value;
    login(codigoAcceso, function(paciente){
        if(paciente != null){
            PacienteGlobal=paciente;   
            idPaciente = paciente.id;  
            console.log("Paciente con código de acceso: " + codigoAcceso + " entró al sistema.");
            nombrePaciente = paciente.nombre;
            apellidoPaciente = paciente.apellidos;
            fecha_nacimientoPaciente = paciente.fecha_nacimiento;
            generoPaciente = paciente.genero;
            idMedicoPaciente = paciente.medico;
            codigo_accesoPaciente = codigoAcceso;
            observacionesPaciente = paciente.observaciones;
            datosMedico(idMedicoPaciente, function(datosm){
                var bienvenida = document.getElementById("mensaje_bienvenida");
                bienvenida.innerHTML = "";
                bienvenida.innerHTML = "¡Bienvenido/a " + nombrePaciente + " " + apellidoPaciente + "! Su médico es: " + datosm.nombre + " " + datosm.apellidos +  "<br>" + " Sus observaciones son: " + observacionesPaciente;
                cambiarSeccion('login_paciente', 'menu_principal');  //cuando encuentra el id mensaje_bienvenida en el main cambia de sección
                mostrarMedicacion(idPaciente);
                mostrarTomas(idPaciente); 

            });
        
        }
        else{
            alert("No se ha encontrado el paciente");
            salirSistema();
        }
    });

}

// servicio 2
function listarMedicamentos(){
    listadoMedicamentos(function(medicamentos){
        console.log(medicamentos);

        console.log("medicamentos: ", medicamentos);
        mostrarTomas(idPaciente)
    });
} 
 
// servicio 3
function mostrarMedico(idMedico){
    datosMedico(idMedico, function(datosm){
        console.log(datosm);
        mostrarTomas(idPaciente)
    });
}

//servicio 4
function mostrarMedicacion(idPaciente) {
    //ListadoGlobal=todasTomas();
    console.log("Total de tomas del paciente"+ListadoGlobal)
    var hoy = new Date();
    Fmedicacion(idPaciente, function (medicacionPac) {
        var listado_medicacion = document.getElementById("listado_medicacion");
        listado_medicacion.innerHTML = ""; // Limpia el contenido anterior

        // Crea un solo <ol> para todas las medicaciones
        var ol = document.createElement("ol");

        for (var i = 0; i < medicacionPac.length; i++) {
            (function (medicacion1) { // Utilizamos una función anónima para crear un cierre
                var idMedicamento = medicacion1.medicamento;
                var frecuenciaM = medicacion1.frecuencia;
                var claseMedicacion = '';

                listadoTomas(idPaciente, idMedicamento, function (listado_tomas) {
                    var fecha_ultimatoma = ultimatoma(listado_tomas);
                    var tiempoPasado = hoy - fecha_ultimatoma;
                    var diasPasados = tiempoPasado / (24 * 60 * 60 * 1000); // en días
                    if (diasPasados > frecuenciaM) {
                        claseMedicacion = "medicacionAlDia";
                    } else {
                        claseMedicacion = 'medicacionRetraso';
                    }

                    // Crea un nuevo elemento <li> para cada medicación
                    var li = document.createElement("li");
                    li.className = claseMedicacion;
                    li.innerHTML =
                        "ID medicamento : " +
                        medicacion1.medicamento +
                        ". Fecha de asignación: " +
                        medicacion1.fecha_asignacion +
                        ". Dosis: " +
                        medicacion1.dosis +
                        ". Tomas: " +
                        medicacion1.tomas +
                        ". Frecuencia: " +
                        medicacion1.frecuencia +
                        ". Observaciones: " +
                        medicacion1.observaciones +
                        " " +
                        "<button class='botonP' onclick='listarTomas(" +
                        idPaciente +
                        ", " +
                        medicacion1.medicamento +
                        ")'>Mostrar tomas</button>" +
                        "<button class='botonP' onclick='noMasMedicacionB()'>No tengo más medicación</button>" +
                        "<button class='botonP' onclick='sentarMalB()'>Me sienta mal</button><br><br>";

                    ol.appendChild(li);
                    mostrarTomas(idPaciente)
                });
            })(medicacionPac[i]); // Pasamos medicacionPac[i] como argumento a la función anónima
        }

        // Agrega el <ol> completo al elemento con id "listado_medicacion"
        listado_medicacion.appendChild(ol);
    });
}


//servicio 5
function listarTomas(idPaciente, idMedicamento){
    listadoTomas(idPaciente, idMedicamento, function(listado_tomas){
        //ListadoGlobal=listado_tomas;
        console.log(listado_tomas);
        cambiarSeccion('menu_principal', 's_tomas');
        var ol = document.createElement("ol");
        var lista = document.getElementById("listaTomas");
        lista.innerHTML = "";
        for( var i = 0; i < listado_tomas.length; i++){
            lista.innerHTML += "<li class = 'tomas' > Medicamento : " + idMedicamento + ", Paciente: " + idPaciente + ", fecha: "  + listado_tomas[i].fecha + " " + "<button class = 'buttonP' onClick = 'deleteToma(" + idPaciente + "," + idMedicamento + "," + "\""+ listado_tomas[i].fecha + "\"" + ")'> Eliminar toma </button></li>";
        }
        lista.innerHTML += "<button class = 'boton' onclick = 'anyadirToma(" + idPaciente + "," + idMedicamento + "," + "\"" + fechaActual + "\"" + ")'> Agregar toma </button><br><br>";
        mostrarTomas(idPaciente)

    });

}

//servicio 6
function anyadirToma(idPaciente, idMedicamento, fecha){
    agregarToma(idPaciente, idMedicamento, fecha, function(toma){
        console.log(toma);
        listarTomas(idPaciente, idMedicamento);
    }); 

}

function deleteToma(idPaciente, idMedicamento, fecha){
    eliminarToma(idPaciente, idMedicamento, fecha, function(eliminada){
        console.log(eliminada);
        if (eliminada == true){
            alert("La toma ha sido eliminada");
            // Después de eliminar la toma, actualiza la lista de tomas
            listarTomas(idPaciente, idMedicamento);
        }
        else{
            alert("La toma no existe");
        }
    });
}


//PRACTICA 3 EJER 2A

function mostrarTomas(idPaciente){
    todasTomas(idPaciente, function(datost){
        ListadoGlobal=datost;
        console.log("Las tomas: "+datost);
    });
}

function agregarTomaAEMPS(){ 
    //LLAMADA 
    console.log("Las tomasaaa: "+ListadoGlobal);
    //ESTO ES PARA AÑADIR LA FECHA DE SUBIDA AL AEMPS
    var fecha = new Date(); //fecha actual 
    var año = fecha.getFullYear().toString(); 
    var mes = (fecha.getMonth()+1).toString(); // le sumamos 1 pq enero es 0
    var dia = fecha.getDate().toString();
    var horas = fecha.getHours().toString();
    var minutos = fecha.getMinutes().toString();
    var segundos = fecha.getSeconds().toString();
    if(mes.length == 1){
            mes = "0"+mes; 
        }
    if(dia.length == 1){
            dia = "0"+dia;
        }
        /*
    if(horas.length == 1){
            horas = "0"+horas;
        }
    if(minutos.length == 1){
            minutos = "0"+minutos;
        }
    if(segundos.length == 1){
            segundos = "0"+segundos;
        }*/

    var fecha_mod = año+"-"+mes+"-"+dia; //+ " "+horas+":"+minutos+":"+segundos;
    console.log(fecha_mod, "fecha_mod");
    
    //A CONTINUACION LE VAMOS A AÑADIR EL ID_AREA 9 de barcelona
  
    var nuevaTomaAEMPS = {
  
        id_area: 9,
        fecha:fecha_mod,
        datos: []
    };
    
    for (var i = 0; i < ListadoGlobal.length; i++) {
        var nuevaToma = {
            paciente: PacienteGlobal.nombre,
            medicamento: ListadoGlobal[i].medicamento,
            fecha: ListadoGlobal[i].fecha
        };
        nuevaTomaAEMPS.datos.push(nuevaToma);
    }
    console.log(typeof(nuevaTomaAEMPS))
    console.log('ahora',nuevaTomaAEMPS.datos.length);
    //console.log('antes'+tomasAEMPS);
    var url="https://undefined.ua.es/telemedicina/api/datos";
    rest.post(url, nuevaTomaAEMPS, function (estado) { 
        console.log("traza0",nuevaTomaAEMPS)
        if(estado!=201){ 
            alert("Error, no se han podido añadir todas las tomas.");

        }else{
            alert('Se han agregado ' + ListadoGlobal.length + ' tomas.');
            return;
}
})
}



//WEBSOCKET 
var conexion = "";

// Connection opened
conexion = new WebSocket('ws://localhost:4444', "pacientes");
conexion.addEventListener("open", function (event) {
    console.log("Paciente conectado!!!");
    conexion.send(JSON.stringify({categoria: "paciente", idCliente: idPaciente})); // le digo al servidor quien soy yo (mi primer mensaje)
});

// Listen for messages 
conexion.addEventListener('message', function (event) {
    console.log("Mensaje del servidor:", event.data);
    var mensaje  = JSON.parse(event.data);
    document.getElementById("mensajesMed").innerHTML += "<li class = 'mensajeMed'>Fecha: " + mensaje.fecha + ", mensaje: " + mensaje.mensaje + "</li>";

});

function noMasMedicacionB(){
    conexion.send(JSON.stringify({ categoria: "mensaje", fecha: fechaActual, destino: idMedicoPaciente,  origen: "paciente", nombreCliente: nombrePaciente, apellidosCliente: apellidoPaciente, idCliente: idPaciente, mensaje: "No tengo más medicación" }));
    console.log("Mensaje mandado");
}

function sentarMalB(){
    conexion.send(JSON.stringify({ categoria: "mensaje", fecha: fechaActual, destino: idMedicoPaciente, origen: "paciente", nombreCliente: nombrePaciente, apellidosCliente: apellidoPaciente, idCliente: idPaciente, mensaje: "La medicación me sienta mal" }));
    console.log("Mensaje mandado");
}

function pedirCita() {
    var fechaCita = document.getElementById("fechaCita");
    conexion.send(JSON.stringify({ categoria: "pedirCita", fecha: fechaActual, destino: idMedicoPaciente, origen: "paciente", nombreCliente: nombrePaciente, apellidosCliente: apellidoPaciente, idCliente: idPaciente, mensaje: "Quiero pedir cita para el día " + fechaCita }));
}
