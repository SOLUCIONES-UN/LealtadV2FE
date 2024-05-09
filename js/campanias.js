const url = 'http://localhost:3000/'
let token = localStorage.getItem("token");
var actualStep = 0;
var saveDataParams = [];
// Arreglo para almacenar los datos guardados de la tabla
var datosTablaLocalidad = [];
var datosTablaPremio = [];
var datosTablaParametro = [];
var indexLocalidad = 0;
var datosTablaParticipacion= [];
var datosBloqueados = [];
var TEMP =[];
//variables de imagenes
let imgCampania = null;

//vacios de para ver si pasan a db
var etapa= [
  {
    nombre: '',
    descripcion: '',
    orden: 1,
    idCampania: 1,
    tipoParticipacion: 52,
    intervalo: 5,
    periodo: 5,
    valorAcumulado: 5,
    estado: 1
  },
];

var Participacion = [
  {
    numero: 52,
    idCampania: 1,
    estado: 1
  },
];

var Participacion = [
  {
    numero: 266,
    idCampania: 522,
    estado: 1
  },
];

var bloqueadosUsuarios =[];


$(function () {

  initStepper();
  getAllCampanias();
  //select
  getProjecs();
  getDepartamento();
  getMunicipio();
  getTransaccion();
  getPremio();

  Calendar();
  const containerArchivo = document.getElementById('containerArchivo');
  if (containerArchivo) {
    containerArchivo.style.display = 'none';
  }

  // Ocultar el contenedor del total mínimo
  const containerTotal = document.getElementById('totalMinimo-container');
  if (containerTotal) {
    containerTotal.style.display = 'none';
  }

  // Ocultar el contenedor de bloqueo
  const containerBloqueo = document.querySelector('#Bloqueo');
  if (containerBloqueo) {
    containerBloqueo.style.display = 'none';
  }
  //Inicializacion de Navs
  $("#NavsOpc button").on("click", function(event) {
    let data = $(this).attr("data-bs-target");
    event.preventDefault();
    $(this).tab("show");
    $(".opcLista").removeClass("show active");
    $(data).addClass("show active");
  });


  $('#modalNew').on('show.bs.modal', function () {
    
  });

  $('#modalNew').on('hidden.bs.modal', function () {
    
  });

  $('#modalNew').find('[data-dismiss="modal"]').click(function () {
    
  });

  $('#formNew').submit(function(){
    var imgPushFile = $('#imgCampania')[0].files[0];
    var imgAkisiFile = $('#imgNotificacion')[0].files[0];
    const valor = $('#tipoUsuarios').val();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({
      nombre: $('#campania').val(),
      descripcion: $('#descripcionCampania').val(),
      fechaCreacion: "2024-12-02",
      fechaRegistro: $("#fechaRegistro").val(),
      fechaInicio: $("#fechaInicial").val(),
      fechaFin: $("#fechaFinal").val(),
      diaReporte: 3,
      horaReporte: $('#HoraRecordatorio').val(),
      emails: $('#correo').val(),
      edadInicial:parseInt($('#edadInicial').val()),
      edadFinal: parseInt($('#edadFinal').val()),
      sexo: parseInt($('#sexo').val()),
      tipoUsuario: valor,
      tituloNotificacion: $('#notificacion').val() ,
      descripcionNotificacion:  $('#descripcionNotificacion').val(),
      imgPush:  imgPushFile ? imgPushFile.name : null, 
      imgAkisi:  imgAkisiFile ? imgAkisiFile.name : null,
      estado: 1,
      maximoParticipaciones:  15
      //verificar el paso de datos de maximoParticipantes
    });

    console.log(raw);
    

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${url}Campania`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.code == "ok") {
                limpiarForm();
                //tabla._fnAjaxUpdate();
                $('#modalNew').modal('toggle');
                Alert(result.message, 'success');
                console.log(result);
            } else {
              console.log("Verifica datos");
                Alert(result.message, 'error');
            }

        })
        .catch(error => { Alert(error.errors, 'error') });
      return false;
  });
});


//Funcion del stepper
function initStepper() {
  actualStep=0;
  var steps = $('#stepper').children(); // Obtener todos los elementos hijos del contenedor #stepper
  var totalSteps = steps.length;
  getTransaccion();

  //provisional
  const containerBloqueo = document.querySelector('#Bloqueo');
  containerBloqueo.style.display = 'none';

  showStep(actualStep);
  console.log(steps);

  $('.next-btn').click(function(e) {
    e.preventDefault(); // Detener el comportamiento predeterminado

    if (actualStep < totalSteps - 1) {
      
      //if(validarCamposStep(actualStep)){
        hideStep(actualStep);
        actualStep++;
        showStep(actualStep);  
      //}else{
        console.log("Error")
      //}
    }
  });

  $('.prev-btn').click(function(e) {
    e.preventDefault(); // Detener el comportamiento predeterminado
    
    if (actualStep > 0) {
      hideStep(actualStep);
      actualStep--;
      showStep(actualStep);
    }
  });

  function showStep(stepIndex) {
    steps.eq(stepIndex).show();
  }

  function hideStep(stepIndex) {
    steps.eq(stepIndex).hide();
  }


  // Stepp de los parametros de la campaña segun esta una etapa
  $('#add-step-btn').click(function() {
    addStep(`<div class="form-step ">
    <div class="content-header mt-2 mb-1">
        <h4 class="mb-0">Configuración de Parametros de Etapa</h4>
        <small class="text-muted">Ingresa los datos basicos de la Campaña.</small>
    </div>
    <div class="row">
        <div class="form-group col-md-6">
            <label class="form-label" for="maximoParticipantes">Maximo de Participaciones</label>
            <input type="number" id="maximoParticipantes" class="form-control" />
        </div>
        <div class="form-group col-md-6" id="totalMinimo-container">
            <label class="form-label" for="totalMinimo">Total Minimo</label>
            <input type="number" id="totalMinimo" class="form-control"/>
        </div>
    </div>
    <div class="row">
        <div class="form-group col-md-6">
            <label class="form-label" for="transaccion">Transacción</label>
            <select name="" id="transaccion" class="form-control">
                <option disabled selected>Selecciona una opción</option>
            </select>
        </div>
        <div class="form-group col-md-6">
            <label class="form-label" for="limiteDia">Limite Diario</label>
            <input type="number" id="limiteDia" class="form-control" />
        </div>
    </div>
    <div class="row">
        <div class="form-group col-md-6">
            <label class="form-label" for="valorMinimo">Valor Minimo</label>
            <input type="number" id="valorMinimo" class="form-control" />
        </div>
        <div class="form-group col-md-6">
            <label class="form-label" for="valorMaximo">Valor Maximo</label>
            <input type="number" id="valorMaximo" class="form-control" />
        </div>
    </div>
    <div class="row">
        <div class="form-group col-md-6">
            <label class="form-label" for="RangoDias">Rango de Días</label>
            <input type="number" id="RangoDias" class="form-control" />
        </div>
        <div class="form-group col-md-6">
          <div class="btn-crear d-flex justify-content-end mt-2" >
            <button type="button" class="btn btn-outline-primary" id="addParamas">Agregar</button>
          </div>
        </div>
    </div>
    <table class="datatables-basic table mb-3 mt-2" id="TablaParametros">
      <thead>
        <tr>
          <th>Etapa</th>
          <th>Transaccion</th>
          <th>Valor Minimo</th>
          <th>Valor Maximo</th>
        </tr>
      </thead>
    </table>
    <div class="row">
    <div class="form-group col-md-6">
        <label class="form-label" for="departamento">Departamento</label>
        <select name="" id="departamento" aria-describedby="departamentoError" required class="form-control">
            <option disabled selected>Selecciona una opción</option>
            <option value="0">Capital</option>
            <option value="1">Santa Rosa</option>
        </select>
        <div id="departamentoError" class="invalid-feedback departamento-error"></div>
    </div>
    <div class="form-group col-md-6">
        <label class="form-label" for="municipio">Municipio</label>
        <select name="municipio" id="municipio" aria-describedby="municipioError" required class="form-control">
            <option disabled selected>Selecciona una opción</option>
            <option value="0">Santa Catarina Pinula</option>
            <option value="1">Cuilapa</option>
        </select>
        <div id="municipioError" class="invalid-feedback municipio-error"></div>
    </div>
    </div>
    <div class="row">
        <div class="form-group col-md-6">
            <label class="form-label" for="limiteGanador">Limite de Ganadores</label>
            <input type="text" id="limiteGanador" aria-describedby="limiteGanadorError" required class="form-control" />
            <div id="limiteGanadorError" class="invalid-feedback limiteGanador-error"></div>
        </div>
        <div class="form-group col-md-6">
            <label class="form-label" for="presupuesto">Presupuesto</label>
            <input type="text" id="presupuesto" aria-describedby="presupuestoError" required class="form-control" />
            <div id="presupuestoError" class="invalid-feedback presupuesto-error"></div>

            <div class="btn-crear d-flex justify-content-end mt-1" >
                <button type="button" class="btn btn-outline-primary" id="addLocalidad">Agregar</button>
            </div>
        </div>
    </div>
    <!--Tabla-->
    <table class="datatables-basic table mb-3 mt-2" id="tableLocalidad">
        <thead>
            <tr>
                <th>#</th>
                <th>DEPARTAMENTO</th>
                <th>MUNICIPIO</th>
                <th>LIMITE</th>
                <th>PRESUPUESTO</th>
            </tr>
        </thead>
    </table>    
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" id="removeStepp" >Borrar</button>
            <button type="button" id="GuardarEtapa" class="btn btn-primary" >Guardar</button>
        </div>
      </div>`);

      var index =0;
      var NombreEtapa = $('#NombreEtapa').val();
      var orden = $('#orden').val();
      var descripcionEtapa = $('#descripcionEtapa').val();
      var tipoParticipacion = $('#tipoParticipacion').val();
    
      if( NombreEtapa && orden  && descripcionEtapa && tipoParticipacion){
        index++;
        var nuevo ={
          id: index,
          NombreEtapa: NombreEtapa,
          orden: orden,
          descripcionEtapa: descripcionEtapa,
          tipoParticipacion: tipoParticipacion
        }
        TEMP.push(nuevo);
    
        $('#NombreEtapa').val('');
        $('#orden').val('');
        $('#descripcionEtapa').val('');
        $('#tipoParticipacion').val('');
    
        mostrarDatosTabla('#TablaEtapa');
        console.log(nuevoPremio);
        
      }else{
        //Colocar una alerta 
      }
  });

  function addStep(content) {
    var newStep = $(`<div class="step"></div>`).html(content);
    $('#stepper').append(newStep);
    totalSteps++;
    hideStep(actualStep);
    actualStep = totalSteps - 1;
    showStep(actualStep);

    // Agregar evento de clic al botón "Borrar" del nuevo paso
    newStep.find('#removeStepp').click(function(e) {
      e.preventDefault();
      if (totalSteps > 1) {
        hideStep(actualStep);
        actualStep = actualStep-3;
        showStep(actualStep);
        newStep.html('');
        stepData = null;
      }
    });

    newStep.find('#transaccion').click(function(e){
      e.preventDefault();
      $(this).off(e);  
    });

    newStep.find('#GuardarEtapa').click(function(e){
      e.preventDefault();
      var stepData ={
          MaxParticipantes: $('#maximoParticipantes').val(), 
          TotalMin: $('#totalMinimo').val(),
          Transaccion: $('#transaccion').val(),
          LimiteDiario: $('#limiteDia').val(),
          ValMinimo: $('#valorMinimo').val(),
          ValMaximo: $('#valorMaximo').val(),
          RangoDias: $('#RangoDias').val()
      };
      console.log(stepData);
      saveDataParams.push(stepData);
    
      hideStep(actualStep);
      actualStep = actualStep-3;
      showStep(actualStep);
      newStep.html('');
      stepData = null;
    });

    $('#addParamas').click(function(){
      var index = 0;
      var MaximoParticipaciones = $('#maximoParticipantes').val();
      var totalMinimo = $('#totalMinimo').val();
      var Transaccion = $('#transaccion').val();
      var limiteDiario = $('#limiteDia').val();
      var valorMinimo = $('#valorMinimo').val();
      var valorMaximo = $('#valorMaximo').val();
      var RangoDias = $('#RangoDias').val();
    
      if(MaximoParticipaciones && totalMinimo  && limiteDiario && valorMinimo && valorMaximo && RangoDias){
        index++;
        var nuevoParametro= {
          id: index,
          MaximoParticipaciones: MaximoParticipaciones,
          totalMinimo: totalMinimo,
          transaccion: Transaccion,
          limiteDiario: limiteDiario,
          valorMaximo: valorMaximo,
          valorMinimo: valorMinimo,
          rangoDias: RangoDias 
        }
    
        datosTablaParametro.push(nuevoParametro);
        console.log(nuevoParametro);
        $('#maximoParticipantes').val('');
        $('#totalMinimo').val('');
        $('#transaccion').val('');
        $('#limiteDia').val('');
        $('#valorMinimo').val('');
        $('#valorMaximo').val('');
        $('#RangoDias').val('');
        
        mostrarDatosParametro();
      }else{
    
      }
      
      function mostrarDatosParametro() {
        // Limpiar la tabla antes de insertar nuevas filas
        $('#TablaParametros').DataTable().clear().destroy();
      
        // Inicializar el DataTables con los datos de datosTablaParametro
        $('#TablaParametros').DataTable({
          data: datosTablaParametro,
          searching: false, // Deshabilitar la funcionalidad de búsqueda
          paging: false,
          columns: [
            { data: 'id' },
            { data: 'transaccion' },
            { data: 'valorMinimo' },
            { data: 'valorMaximo' }
          ]
        });
      }
    });
  }

}

// Función para agregar datos a la tabla y al arreglo
$('#addLocalidad').click(function() {
  // Obtener los valores de los campos de entrada
  var departamento = $('#departamento').val();
  var municipio = $('#municipio').val();
  var limiteGanador = $('#limiteGanador').val();
  var presupuesto = $('#presupuesto').val();

  // Validar que los campos no estén vacíos
  if (departamento && municipio && limiteGanador && presupuesto) {
    // Crear un objeto con los datos
    var nuevoDato = {
      id: indexLocalidad,
      departamento: departamento,
      municipio: municipio,
      limiteGanador: limiteGanador,
      presupuesto: presupuesto
    };

    // Agregar el nuevo dato al arreglo
    datosTablaLocalidad.push(nuevoDato);

    // Limpiar los campos de entrada
    $('#departamento').val('');
    $('#municipio').val('');
    $('#limiteGanador').val('');
    $('#presupuesto').val('');

    // Mostrar los datos en la tabla
    mostrarDatosTabla('#tableLocalidad');

    // Incrementar el índice
    indexLocalidad++;
  } else {
    alert('Por favor complete todos los campos.');
  }
});

$('#addPremio').click(function(){
  var index =0;
  var tipoPremio = $('#tipoPremio').val();
  var linkPremio = $('#linkPremio').val();
  var premio = $('#premio').val();
  var valor = $('#valor').val();
  var porcentaje = $('#porcentajePremio').val();

  if( tipoPremio && linkPremio  && valor && porcentaje){
    index++;
    var nuevoPremio ={
      id: index,
      tipoPremio: tipoPremio,
      linkPremio: linkPremio,
      premio: premio,
      valor: valor,
      porcentajePremio : porcentaje
    }
    datosTablaPremio.push(nuevoPremio);

    $('#tipoPremio').val('');
    $('#linkPremio').val('');
    $('#premio').val('');
    $('#valor').val('');
    $('#porcentajePremio').val('');

    mostrarDatosTabla('#TablaPremio');
    console.log(nuevoPremio);
    
  }else{
    //Colocar una alerta 
  }
});

$('#addBloqueo').click(function(){
  var usuarioBloqueo = $('#usuarioBloqueo').val();
  var index = 0;

  if(usuarioBloqueo){
    var block ={
      id: index,
      usuarioBloqueo: usuarioBloqueo
    }

    bloqueadosUsuarios.push(block);
    $('#usuarioBloqueo').val("");

    mostrarDatosTabla('#tablaBloqueo');
  }
});

function mostrarDatosTabla(tabla) {

  switch(tabla)
  {
    case '#tableLocalidad':
        // Limpiar la tabla antes de insertar nuevas filas
      $('#tableLocalidad').DataTable().clear().destroy();

      // Inicializar el DataTables con los datos de datosTablaLocalidad
      $('#tableLocalidad').DataTable({
        searching: false, // Deshabilitar la funcionalidad de búsqueda
        paging: false,
        data: datosTablaLocalidad,
        columns: [
          { data: 'id' },
          { data: 'departamento' },
          { data: 'municipio' },
          { data: 'limiteGanador' },
          { data: 'presupuesto' }
        ]
      });
    break;
  
    case '#TablaEtapa':
        // Limpiar la tabla antes de insertar nuevas filas
      $('#TablaEtapa').DataTable().clear().destroy();

      // Inicializar el DataTables con los datos de datosTablaLocalidad
      $('#TablaEtapa').DataTable({
        searching: false, // Deshabilitar la funcionalidad de búsqueda
        paging: false,
        data: datosTablaLocalidad,
        columns: [
          { data: 'id' },
          { data: 'NombreEtapa' },
          { data: '' },
          {  }
        ]
      });

    case '#TablaPremio':
       // Limpiar la tabla antes de insertar nuevas filas
       $('#TablaPremio').DataTable().clear().destroy();

       // Inicializar el DataTables con los datos de datosTablaLocalidad
       $('#TablaPremio').DataTable({
         searching: false, // Deshabilitar la funcionalidad de búsqueda
         paging: false,
         data: datosTablaPremio,
         columns: [
           { data: 'id' },
           { data: 'premio' },
           { data: 'valor' },
           { data: 'porcentajePremio' }
         ]
       });
    break;

    case '#tablaBloqueo':
      // Limpiar la tabla antes de insertar nuevas filas
      $('#tablaBloqueo').DataTable().clear().destroy();

      // Inicializar el DataTables con los datos de datosTablaLocalidad
      $('#tablaBloqueo').DataTable({
        searching: false, // Deshabilitar la funcionalidad de búsqueda
        paging: false,
        data: bloqueadosUsuarios,
        columns: [
          { data: 'id' },
          { data: 'usuarioBloqueo' },
          {
            data: "id",
            render: function(data) {
              var opcAdd = `
                <a href="#" class=" dropdown-item">
                  ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })} Eliminar
                </a>
              `;
              return opcAdd;
            }
          }
        ]
      });
   break;

    default:
      break;
  }

}

//funcion para la visualizacion previa de las imagenes (VER FUNCIONALIDAD) Error en reutilizar variable img
function previewImage(event, textImg, textContent) {
  const input = event.target;
  const preview = document.getElementById(textImg);
  let imgCampania = document.getElementById(textContent);
  
  if (imgCampania) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        imgCampania.style.display = 'none'; 
      }
    
      reader.readAsDataURL(input.files[0]);
      
    } else {
      preview.src = '#';
      preview.style.display = 'none';
    }
  } else {
    console.error('Elemento con ID ' + textContent + ' no encontrado en el documento.');
  }
}


//Funcion para validar la restriccion de usuarios (Primeros cambios)
function userValidator(event, container) {
  const input = event.target;
  const containerArchivo = document.getElementById(container);
  const containerBloqueo = document.getElementById('Bloqueo');

  const regexNumerico = /^[2-4]$/;
  
  switch(container){
    case 'containerArchivo':

      if (input.value === '0' || input.value === 0 || input.value === null) {
        containerArchivo.style.display = 'none';
        containerBloqueo.style.display = 'none';
      } else {
        containerArchivo.style.display = 'block';
        if(input.value === 2 || input.value === '2'){
          containerBloqueo.style.display = 'flex';
        } 
      }
    break;
    
    case 'totalMinimo-container':
      if (regexNumerico.test(input.value)) {
        containerArchivo.style.display = 'block';
      } else {
        containerArchivo.style.display = 'none';
      }
    break;

    default:
      containerArchivo.style.display = 'none';
    break;
      
  }
}

/*FUNCIONES PARA TRAER DATOS A LOS SELECT*/

//Funcion para traer los proyectos
const getProjecs = () =>{
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}projects`, requestOptions)
    .then(response => response.json())
    .then(result =>{
      result.forEach(element => {
        var opc  = `<option value="${element.id}">${element.descripcion}</option>`;
        $('#proyecto').append(opc);
      });
    })
}

//Funcion para traer los departamentos 
const getDepartamento = () =>{
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Departamento`, requestOptions)
    .then(response => response.json())
    .then(result =>{
      result.forEach(element => {
        var opc  = `<option value="${element.id}">${element.nombre}</option>`;
        $('#departamento').append(opc);
      });
    })
}

//Funcion para traer los municipios
const getMunicipio = () =>{
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Municipio`, requestOptions)
    .then(response => response.json())
    .then(result =>{
      result.forEach(element => {
        var opc  = `<option value="${element.id}">${element.nombre}</option>`;
        $('#municipio').append(opc);
      });
    })
}

//Funcion para traer los Transacciones
const getTransaccion = () =>{
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Transaccion`, requestOptions)
    .then(response => response.json())
    .then(result =>{
      result.forEach(element => {
        var opc  = `<option value="${element.id}">${element.nombre}</option>`;
        $('#transaccion').append(opc);
      });
    })
}

//Funcion para traer los Transacciones
const getPremio = () =>{
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Premio`, requestOptions)
    .then(response => response.json())
    .then(result =>{
      result.forEach(element => {
        var opc  = `<option value="${element.id}">${element.descripcion}</option>`;
        $('#premio').append(opc);
      });
    })
}

//ver funcionalidad 
function Calendar () {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth();
  var selectedDateBegin = null;
  var selectedDateEnd = null;
  //var selectDateMiddle = null;

  function generateCalendar(year, month) {
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var firstDayOfMonth = new Date(year, month, 1).getDay();
    var calendar = '';

    $('#current-month-year').text(getMonthName(month) + ' ' + year);

    for (var i = 0; i < firstDayOfMonth; i++) {
      calendar += '<div class="calendar-day"></div>';
    }
    for (var i = 1; i <= daysInMonth; i++) {
      var date = new Date(year, month, i);
      var dateString = date.toISOString().slice(0, 10);
      //var isSelectedMiddle = selectDateMiddle == dateString;
      var isSelected = selectedDateBegin === dateString;
      isSelected += selectedDateEnd === dateString;
      calendar += '<div class="calendar-day' + (isSelected  ? ' selected' : '') + '" data-date="' + dateString + '">' + i + '</div>';
      
    }

    $('#calendar-days').html(calendar);
    $('.calendar-day').click(function() {
      var date = $(this).data('date');
  
      // Si el input de fecha de inicio está vacío
      if ($('#FechaIniRecordatorio').val() === '') {
        $('#FechaIniRecordatorio').val(date);
        selectedDateBegin = date;
  
        // Limpiar el input de fecha de fin
        $('#FechaFinRecordatorio').val('');
        selectedDateEnd = null;
      }
      // Si el input de fecha de inicio no está vacío
      else {
        // Si la fecha seleccionada es menor o igual a la fecha de inicio
        if (date <= $('#FechaIniRecordatorio').val()) {
          $('#FechaIniRecordatorio').val(date);
          selectedDateBegin = date;
  
          // Limpiar el input de fecha de fin
          $('#FechaFinRecordatorio').val('');
          selectedDateEnd = null;
        }
        // Si la fecha seleccionada es mayor a la fecha de inicio
        else {
          $('#FechaFinRecordatorio').val(date);
          selectedDateEnd = date;
        }
      }
  
      generateCalendar(currentYear, currentMonth);
      console.log(date, 'Fecha');
    });
  
    $('#FechaIniRecordatorio, #FechaFinRecordatorio').change(function() {
      selectedDateBegin = $('#FechaIniRecordatorio').val();
      selectedDateEnd = $('#FechaFinRecordatorio').val();
      generateCalendar(currentYear, currentMonth);
      console.log($(this).val(), 'Fecha');
    });
  }

  function getMonthName(month) {
    var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[month];
  }

  $('#prev-month').click(function(e) {
    e.preventDefault();
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
  });

  $('#next-month').click(function(e) {
    e.preventDefault();
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
  });

  generateCalendar(currentYear, currentMonth);
};

/*
//Validacion de form
function validarCamposStep(stepIndex) {
  var config = `step${stepIndex+1}`;
  console.log(config)

  switch(config){
    case 'step1':{
      var fields = ['imgCampania', 'imgNotificacion', 'restriccionUsuarios', 'proyecto', 'tercerosCampania'];
      var isValid = true;
      
      fields.forEach(function(field) {
        var value = $('#' + field).val();
        if (!value) {
          $('#' + field).addClass('is-invalid');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          isValid = true;
        }
      });
      
      return isValid;
    }

    case 'step2':{
      var fields = [
        'campania', 
        'notificacion', 
        'descripcionCampania', 
        'descripcionNotificacion',
        'terminosCondiciones',
        'fechaRegistro',
        'usuarioPermitido',
        'fechaInicial',
        'fechaFinal',
        'edadInicial',
        'edadFinal',
        'tipoUsuarios',
        'sexo'
      ];

      var isValid = true;

      fields.forEach(function(field) {
        var value = $('#' + field).val();
        if (!value) {
          $('#' + field).addClass('is-invalid');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          isValid = true;
        }


      });
      return isValid;
    }

    case 'step3':{
      var fields = [
        'departamento', 
        'municipio', 
        'limiteGanador', 
        'presupuesto'
      ];

      var isValid = true;
      if(datosTablaLocalidad.length === 0){
        fields.forEach(function(field) {
          var value = $('#' + field).val();
          if (!value) {
            $('#' + field).addClass('is-invalid');
            isValid = false;
          } else {
            $('#' + field).removeClass('is-invalid');
            isValid = true;
          }
  
  
        });
        isValid = false;
      }else{
        isValid=  true;
      }
      return isValid;
    }
      

    case 'step4':
      {
        var fields = [
          'NombreEtapa',
          'orden',
          'descripcionEtapa',
          'tipoParticipacion'
        ];

        var isValid = true;

        fields.forEach(function(field) {
          var value = $('#' + field).val();
          if (!value) {
            $('#' + field).addClass('is-invalid');
            isValid = false;
          } else {
            $('#' + field).removeClass('is-invalid');
          }
        });

        return isValid;
  
      }



    case 'step5':
      {
        var isValid = true;
        if(datosTablaLocalidad.length === 0){
          isValid = false;
        }else{
          isValid=  true;
        }
        return isValid;
      }

    case 'step6':{
      var isValid = true;
      return isValid;
    }
  }
  

}
*/
//Funcion Para limpiar el form
const limpiarForm = ()=>{
  actualStep = 0;
}

//Alertas
/*
const Alert = function (message, status) {
  toastr[`${status}`](message, `${status}`, {
      closeButton: true,
      tapToDismiss: false,
      positionClass: 'toast-top-right',
      rtl: false
  });
}*/


const getAllCampanias = () => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: { "Authorization": token }
  };

  fetch(`${url}Campania`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      table("tableTodas", result);
      $("#textTodas").text(result.length);

      let activas = result.filter((x) => x.estado == 1);
      $("#textActivas").text(activas.length);
      table("tableActivas", activas);

      let pausadas = result.filter((x) => x.estado == 2);
      $("#textPausadas").text(pausadas.length);
      table("tablePausada", pausadas);

      let borrador = result.filter((x) => x.estado == 3);
      $("#textBorrador").text(borrador.length);
      table("tableBorrador", borrador);

      let archivo = result.filter((x) => x.estado == 4);
      $("#textArchivo").text(archivo.length);
      table("tableArchivo", archivo);
    })
    .catch((error) => console.log("error", error));
};


//Funcion para la visualizacion de las tablas (Ver funcionalidad de Archivadas)
const table = (table, data) => {

  $("#" + table).dataTable({
    destroy: true,
    data,
    columns: [
      {
        data: null, render: function (data, type, row, meta) {

          if (type === 'display') {
            return meta.row + 1;
          }
          return meta.row + 1;
        }
      },

      { data: "nombre" },
      {
        data: "estado",
        render: function (data) {
          switch (data) {
            case 1:
              return `Activa`;
            case 2:
              return `Pausada`;
            case 3:
              return `Borrador`;
              case 4:
                return `Archivadas`;
            default:
              return ``;
          }
        },
      },
      {
        data: "fechaInicio",
      },
      {
        data: "fechaFin",
      },
      {
        data: "id",
        render: function (data, type, row) {
          var opcAdd = ``;

          switch (row.estado) {
            case 1:
              opcAdd += `<a href="#" onclick="pausarActualizarCampania(${data},2)" class="btn_pausar dropdown-item">
              ${feather.icons["pause-circle"].toSvg({
                class: "font-small-4 mr-50",
              })} Pausar
            </a>`;
              break;
            case 2:
              opcAdd += `<a href="#" onclick="pausarActualizarCampania(${data},1)" class="btn_activar dropdown-item">
                ${feather.icons["play"].toSvg({
                class: "font-small-4 mr-50",
              })} Activar
              </a>`;
              break;
          }

          //console.log(`row_id: ${data} estado: ${row.estado}`)

          if (row.estado != 0) {
            opcAdd += `<a href="#" onclick="OpenEdit(${data})" class="btn_edit dropdown-item">
            ${feather.icons["archive"].toSvg({
              class: "font-small-4 mr-50",
            })} Actualizar
            </a><a href="#" onclick="eliminarFila(${data})" class="btn_delete dropdown-item">
                ${feather.icons["trash-2"].toSvg({
              class: "font-small-4 mr-50",
            })} Inhabilitar
                    </a>`;
          }

          return `
          <div class="btn-group">
            <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                ${feather.icons["more-vertical"].toSvg({
            class: "font-small-4",
          })}
            </a>
            <div class="dropdown-menu dropdown-menu-right">
               ${opcAdd}
            </div>
          </div> 
        `;
        },
      },
    ],
    // order: [[1, 'asc']],
    dom:
      '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
      '<"col-lg-12 col-xl-6" l>' +
      '<"col-lg-12 col-xl-6 pl-xl-75 pl-0"<"dt-action-buttons text-xl-right text-lg-left text-md-right text-left d-flex align-items-center justify-content-lg-end align-items-center flex-sm-nowrap flex-wrap mr-1"<"mr-1"f>B>>' +
      ">t" +
      '<"d-flex justify-content-between mx-2 row mb-1"' +
      '<"col-sm-12 col-md-6"i>' +
      '<"col-sm-12 col-md-6"p>' +
      ">",
    language: {
      sLengthMenu: "Show _MENU_",
      search: "Buscar",
      searchPlaceholder: "Buscar...",
    },
    // Buttons with Dropdown
    buttons: [
      {
        text: 'Nuevo',
        className: 'add-new btn btn-primary mt-50',
        attr: {
            'data-toggle': 'modal',
            'data-target': '#modalNew',
        },
        init: function (api, node, config) {
            $(node).removeClass('btn-secondary');
            //Metodo para agregar un nuevo usuario
        },
        /*
        text: "Nuevo",
        className: "btn btn-primary mt-50",
        action: function (e, dt, node, config) {
         // ChangePanel(2);
        },
        init: function (api, node, config) {
          $(node).removeClass("btn-secondary");
          //Metodo para agregar un nuevo usuario
        },*/
      },
    ],
  });
};