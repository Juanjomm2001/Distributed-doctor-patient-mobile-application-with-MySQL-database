var listadomedicos = [
    { id: 1, nombre:"Ana", apellidos: "Campos", user: "anacampos100", password: "123456" },
    { id: 2, nombre: "Aina", apellidos: "Rodrigo", user: "ainarodrigo200", password: "123456" }
];
 var medicamentos = [
    { id: 1, nombre: "Nolotil", descripcion: "Analgésico", num_dosis:"3 al día", importe:"20", importe_subencionado:"2" },
    { id: 2, nombre: "Adiro100", descripcion: "Prevención trombos", num_dosis:"3 al día", importe:"30", importe_subencionado:"3" },
    { id: 3, nombre: "Paracetamol", descripcion: "Analgésico", num_dosis:"3 al día", importe:"10", importe_subencionado:"1" },
    { id: 4, nombre: "Sintrom", descripcion: "Anticoagulante", num_dosis:"1 al día", importe:"50", importe_subencionado:"5" },
    { id: 5, nombre: "Eutirox", descripcion: "Hormona tinoidea", num_dosis:"1 al día", importe:"40", importe_subencionado:"4" }
 ]; 
 var pacientes = [ 
    { id:1, nombre:"Carla", apellidos: "Perez", fecha_nacimiento:"09-03-01/12:30", genero:"M", medico: 1, codigo_acceso:"123", observaciones:""},
    { id:2, nombre:"Lucia", apellidos: "Rodriguez",fecha_nacimiento:"10-03-01/14:00", genero:"M", medico: 2, codigo_acceso:"234", observaciones:""},
    { id:3, nombre:"Marta", apellidos: "Arnau", fecha_nacimiento:"07-03-01/02:35", genero:"M", medico: 1, codigo_acceso:"345", observaciones:""},
    { id:4, nombre:"Alfredo", apellidos: "Vidal",fecha_nacimiento:"07-03-01/09:15", genero:"H", medico: 2, codigo_acceso:"456", observaciones:""}
]; 

var medicacion = [
    {medicamento:2,paciente:1,fecha_asignacion:"23-11-2022/17:45",dosis:"3",tomas:"1",frecuencia:0,observaciones:""},
    {medicamento:1,paciente:2,fecha_asignacion:"23-12-2022/12:23",dosis:"1",tomas:"3",frecuencia:2,observaciones:""},
    {medicamento:3,paciente:1,fecha_asignacion:"23-10-2022/03:15",dosis:"2",tomas:"4",frecuencia:0.25,observaciones:""},
    {medicamento:3,paciente:3,fecha_asignacion:"23-11-2020/14:36",dosis:"2",tomas:"1",frecuencia:0,observaciones:""},
    {medicamento:2,paciente:1,fecha_asignacion:"23-11-2022/19:45",dosis:"3",tomas:"1",frecuencia:0,observaciones:""},


];
var tomas = [
   {medicamento:1, paciente: 2, fecha: "2023-04-01/09:22"},
   {medicamento:1, paciente: 2, fecha: "2023-04-03/13:45"},
   {medicamento:1, paciente: 2, fecha: "2023-04-05/23:35"},
   {medicamento:2, paciente: 1, fecha: "2023-05-21/9:23"},
   {medicamento:5, paciente: 1, fecha: "2023-05-20/14:22"},
   {medicamento:5, paciente: 1, fecha: "2023-05-20/20:23"},
   {medicamento:5, paciente: 1, fecha: "2023-05-21/03:23"},
   {medicamento:3, paciente: 3, fecha: "2023-04-02/22:23"},

];

module.exports.listadomedicos = listadomedicos;
module.exports.medicamentos = medicamentos;
module.exports.pacientes = pacientes;
module.exports.medicacion = medicacion;
module.exports.tomas = tomas;

