const url = 'http://localhost:3000/'
let token = localStorage.getItem("token");
var actualStep = 0;
var saveDataParams = [];
// Arreglo para almacenar los datos guardados de la tabla
var datosTablaLocalidad = [];
var datosTablaPremio = [];
var datosTablaParametro = [];
var datosTablaParticipacion= [];
var permitidoUsuario =[];

//var datosBloqueados = [];
var TEMP =[];
var etapasData=[]
//variables de imagenes
let imgCampania = null;

var bloqueadosUsuarios =[];
var DataEtapa =[];
var nombresMunicipios = {};

//data edit
var dataMunicipiosView=[]
var dataDeptoView=[]
var dataPremioView=[]
var datatransaccionView=[]

let imgPush = null;
let imgAkisi = null;

let imgPushEdit = null;
let imgAkisiEdit = null;

let actualStepEdit = 0;
let previousStep = null;

//valor para poder editar etapas
var dataEditEtapa =[];

isDataLoaded = true;

$(function () {

  initStepper();
  initStepperEdit();
  getAllCampanias();
  getProjecs();
  getMunicipios();
  getDepartamento();
  const containerArchivo = document.getElementById('containerArchivo');
  if (containerArchivo) {
    containerArchivo.style.display = 'none';
  }

  // Ocultar el contenedor de bloqueo
  const containerBloqueo = document.querySelector('#Bloqueo');
  if (containerBloqueo) {
    containerBloqueo.style.display = 'none';
  }

  //Inicializacion de Navs
  $("#NavsOpc button").on("click", function(event) {
    let data = $(this).attr("data-bs-target");
    console.log(data,'data tab')
    event.preventDefault();
    $(this).tab("show");
    $(".opcLista").removeClass("show active");
    $(data).addClass("show active");
  });

  $('#btnSubmitEdit').click(function(event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del clic
  
    // Enviar el formulario
    $('#formEdit').submit();

  });

  $('#modalNew').on('show.bs.modal', function () {
    resetSteps();
    limpiarFormulario();
  });

  $('#modalNew').on('hidden.bs.modal', function () {
    limpiarFormulario();

  });

  $('#modalNew').find('[data-dismiss="modal"]').click(function () {
      limpiarFormulario();
      $("#btnSubmit").attr("disabled",false);
  });

  $('#modalNew').find('[data-dismiss="modal"]').click(function () {
      limpiarFormulario();
      $("#btnSubmit").attr("disabled",false);
  });

  $('#modalEdit').on('show.bs.modal', function() {
    resetStepsEdit()
    limpiarFormulario()
      // Verificar si los datos han sido cargados
      if (isDataLoaded) {
        // Mostrar el modal
        return true;
      } else {
        // Evitar que se muestre el modal
        return false;
      }
  });

  $('#modalEdit').on('hidden.bs.modal', function () {
      limpiarFormulario();
      $("#btnSubmitEdit").attr("disabled",false);
  });


  $('#modalEdit').find('[data-dismiss="modal"]').click(function () {
      limpiarFormulario();
      $("#btnSubmitEdit").attr("disabled",false);
  });

  $('#formNew').submit(function(){
    const valor = $('#tipoUsuarios').val();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);
    
    console.log('imagen 1', imgAkisi)
    console.log('imagen 1', imgPush)

    var raw = JSON.stringify({
      nombre: $('#campania').val(),
      descripcion: $('#descripcionCampania').val(),
      fechaCreacion: "2024-02-04",
      fechaRegistro: $("#fechaRegistro").val(),
      fechaInicio: $("#fechaInicial").val(),
      fechaFin: $("#fechaFinal").val(),
      edadInicial:parseInt($('#edadInicial').val()),
      edadFinal: parseInt($('#edadFinal').val()),
      sexo: parseInt($('#sexo').val()),
      tipoUsuario: valor,
      tituloNotificacion: $('#notificacion').val() ,
      descripcionNotificacion:  $('#descripcionNotificacion').val(),
      imgPush:  'valor.jpg',
      imgAkisi:  'valor.jpg',
      estado: 3,
      maximoParticipaciones:  parseInt($('#maximoParticipantes').val()),
      campaniaTerceros: parseInt($('#tercerosCampania').val()),
      terminosCondiciones: $('#terminosCondiciones').val(),
      observaciones: $('#Observaciones').val(),
      esArchivada: 0,
      restriccionUser: parseInt($('#restriccionUsuarios').val()),
      idProyecto: parseInt($('#proyecto').val()),
      etapas: getEtapasData(),
      bloqueados: bloqueadosUsuarios,
      participacion:permitidoUsuario

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
          actualStep = 0;
          initStepper();
          limpiarFormulario();
          getAllCampanias();
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

  $('#formEdit').submit(function () {
    console.log('entro a el form edit')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    $("#btnSubmitEdit").attr("disabled", true);

    const id = $('#idCampania').val();
    const valor = $('#tipoUsuariosEdit').val();
    console.log(id, 'idCampaña')

    var raw = JSON.stringify({
      id :$('#idCampania').val(),
      nombre: $('#campaniaEdit').val(),
      descripcion: $('#descripcionCampaniaEdit').val(),
      fechaCreacion: $('#fechaCreacion').val(),
      fechaRegistro: $("#fechaRegistroEdit").val(),
      fechaInicio: $("#fechaInicialEdit").val(),
      fechaFin: $("#fechaFinalEdit").val(),
      edadInicial:parseInt($('#edadInicialEdit').val()),
      edadFinal: parseInt($('#edadFinalEdit').val()),
      sexo: parseInt($('#sexoEdit').val()),
      tipoUsuario: valor,
      tituloNotificacion: $('#notificacionEdit').val() ,
      descripcionNotificacion:  $('#descripcionNotificacionEdit').val(),
      imgPush: 'valor.png',
      imgAkisi: 'valor.png',
      estado: parseInt($('#estadoCampania').val()),
      maximoParticipaciones:  parseInt($('#maximoParticipantesEdit').val()),
      campaniaTerceros: parseInt($('#tercerosCampaniaEdit').val()),
      terminosCondiciones: $('#terminosCondicionesEdit').val(),
      observaciones: $('#ObservacionesEdit').val(),
      esArchivada:  $('#esArchivadaEdit').is(':checked') ? 1 : 0, //verificar por lo del boton
      restriccionUser: parseInt($('#restriccionUsuariosEdit').val()),
      idProyecto: parseInt($('#proyectoEdit').val()),
      etapas: dataEditEtapa, 
      bloqueados: bloqueadosUsuarios, 
      participacion:permitidoUsuario 
    });

    console.log(raw, 'raw')

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${url}Campania/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.code == "ok") {
                $('#modalEdit').modal('toggle');
                getAllCampanias();
                limpiarFormulario();
                Alert(result.message, 'success')
            } else {

                Alert(result.message, 'error')
            }
        })
        .catch(error => { Alert(error.errors, 'error') });
    return false;
  });

  //eventos para la inhabilitacion de un proyecto
  $('#BtnDelete').click(function () {
    console.log('Entra a DELETE')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);


    const id = $('#idDelete').val();

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`${url}Campania/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.code == "ok") {
                limpiarFormulario();
                console.log('Elimino')
                getAllCampanias();
                $('#modalDelete').modal('toggle');
                Alert(result.message, 'success');
            } else {
                Alert(result.message, 'error');
            }

        })
        .catch(error => { Alert(error.errors, 'error') });            
  })
});


//Funcion del stepper
function initStepper() {
  // Reiniciar el estado al inicio de la función
  actualStep = 0;
  var steps = $('#stepper').children();
  steps.hide();
  DataEtapa = [];
  TEMP = [];
  datosTablaParametro = [];
  datosTablaLocalidad = [];
  datosTablaPremio = [];
  nombresMunicipios = {};
  // $('#stepper .step:not(:first)').remove();
  var totalSteps = steps.length;
  var visitedSteps = [];
  const containerBloqueo = document.querySelector('#Bloqueo');
  containerBloqueo.style.display = 'none';

  showStep(actualStep);

  $('.next-btn').click(function(e) {
    e.preventDefault();
    console.log(actualStep, 'antes');

    if (actualStep < totalSteps - 1) {
      // Validar el paso actual antes de avanzar
      if (validarCamposStep(actualStep)) {
        hideStep(actualStep);
        actualStep++;
        showStep(actualStep);
        updateButtonsState(actualStep);
        console.log(actualStep);
        return
      } else {
        console.log("Error en la validación del paso " + (actualStep + 1));
      }
    } else {
      console.log("Error");
    }
  });

  $('.prev-btn').click(function(e) {
    e.preventDefault();
    if (actualStep > 0) {
      hideStep(actualStep);
      actualStep--;
      showStep(actualStep);
      updateButtonsState(actualStep);
    }
  });

  function showStep(stepIndex) {
    steps.eq(stepIndex).show();

    // Cambiar el color del botón correspondiente al paso actual
    $('.step-progress').removeClass('active');
    $('.step-btn-' + (stepIndex + 1)).addClass('active');

    // Actualizar el estado de los botones
    updateButtonsState(stepIndex);

    // Agregar el paso actual al array de pasos visitados si no está presente
    if (!visitedSteps.includes(stepIndex)) {
      visitedSteps.push(stepIndex);
    }
  }

  function updateButtonsState(currentStep) {
    $('.step-progress').each(function(index) {
      if ($(this).attr('data-blocked') === 'true' || (index > currentStep && !visitedSteps.includes(index))) {
        $(this).addClass('disabled');
        $(this).prop('disabled', true);
      } else {
        $(this).removeClass('disabled');
        $(this).prop('disabled', false);
      }
    });
  }
  
  $('.step-btn-1').click(function(e) {
    e.preventDefault();
    if (actualStep !== 0) {
      hideStep(actualStep);
      actualStep = 0;
      showStep(actualStep);
    }
  });
  
  $('.step-btn-2').click(function(e) {
    e.preventDefault();
    if (actualStep !== 1) {
      hideStep(actualStep);
      actualStep = 1;
      showStep(actualStep);
    }
  });
  
  $('.step-btn-3').click(function(e) {
    e.preventDefault();
    if (actualStep !== 2) {
      hideStep(actualStep);
      actualStep = 2;
      showStep(actualStep);
    }
  });
  
  function hideStep(stepIndex) {
    steps.eq(stepIndex).hide();
  }

  $('#tipoParticipacion').change(function() {
    var tipoSeleccionado = $(this).val();

    // Ocultar todos los inputs
    $('#inputsContainer > div').hide();

    // Mostrar los inputs correspondientes al tipo seleccionado
     if (tipoSeleccionado === '2' || tipoSeleccionado === '3') {
      $('#inputsTipo0').show();
    } else if (tipoSeleccionado === '4') {
      $('#inputsTipo1').show();
    }
  });

    $(document).ready(function() {
      $('#RangoTiempo').change(function() {
          $('#intervaloDiarioDiv').hide();
          $('#intervaloSemanalDiv').hide();
          $('#intervaloMensualDiv').hide();
          $('#diasResultadoDiv').hide();

          var rangoTiempo = $(this).val();
          if (rangoTiempo === '0') {
              $('#intervaloDiarioDiv').show();
          } else if (rangoTiempo === '1') {
              $('#intervaloSemanalDiv').show();
          } else if (rangoTiempo === '2') {
              $('#intervaloMensualDiv').show();
          }
      });

      $('#intervaloSemanal').on('input', function() {
          var semanas = $(this).val();
          var dias = semanas * 7;
          console.log("Días semanales:", dias);
          $('#diasResultado').val(dias);
          $('#diasResultadoDiv').show();
          $('#intervalo').val(dias); // Actualiza el campo intervalo con días
      });

      $('#intervaloMensual').on('input', function() {
          var meses = $(this).val();
          var dias = meses * 30;
          console.log("Días mensuales:", dias);
          $('#diasResultado').val(dias);
          $('#diasResultadoDiv').show();
          $('#intervalo').val(dias); // Actualiza el campo intervalo con días
      });

      $('#RangoTiempo').trigger('change');

      $('#add-step-btn').click(function() {
          var NombreEtapa = $('#NombreEtapa').val();
          var orden = $('#orden').val();
          var descripcionEtapa = $('#descripcionEtapa').val();
          var tipoParticipacion = $('#tipoParticipacion').val();
          var intervalo = $('#intervalo').val();
          var intervaloSemanal = $('#intervaloSemanal').val();
          var intervaloMensual = $('#intervaloMensual').val();
          var rangoTiempo = $('#RangoTiempo').val();
          var minimoTransaccion = parseFloat($('#minimoTransaccion').val());
          var TotalMinimo = parseFloat($('#totalMinimo').val());
          

      if(validarCamposStep(actualStep)){
        getDepartamento();
        getTransaccion();
        getPremio();
        addStep(`<div class="form-step ">
        <div class="content-header mt-2 mb-1">
            <h4 class="mb-0">Configuración de Parametros de Etapa</h4>
            <small class="text-muted">Ingresa los datos basicos de la Campaña.</small>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label class="form-label" for="limiteParticipacion">Limite de Participaciones</label>
                <input type="number" id="limiteParticipacion" class="form-control" />
                <div id="limiteParticipacionError" class="invalid-feedback limiteParticipacion-error"></div>
            </div>
            <div class="form-group col-md-6">
                <label class="form-label" for="transaccion">Transacción</label>
                <select name="" id="transaccion" class="form-control">
                    <option disabled selected>Selecciona una opción</option>
                </select>
                <div id="transaccionError" class="invalid-feedback transaccion-error"></div>
            </div>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label class="form-label" for="valorMinimo">Valor Minimo</label>
                <input type="number" id="valorMinimo" class="form-control" />
                <div id="valorMinimoError" class="invalid-feedback valorMinimo-error"></div>
            </div>
            <div class="form-group col-md-6">
                <label class="form-label" for="valorMaximo">Valor Maximo</label>
                <input type="number" id="valorMaximo" class="form-control" />
                <div id="valorMaximoError" class="invalid-feedback valorMaximo-error"></div>
            </div>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
              <label class="form-label" for="limiteDiario">Límite Diario</label>
              <input type="number" id="limiteDiario" class="form-control" />
            </div>
            <div class="form-group col-md-6">
              <div class="btn-crear d-flex justify-content-end">
                <button type="button" class="btn btn-outline-primary" id="addParamas">Agregar</button>
              </div>
            </div>
        </div>
        <table class="datatables-basic table mb-3 mt-2 stepper-table" id="TablaParametros">
          <thead>
            <tr>
              <th>#</th>
              <th>Transaccion</th>
              <th>Valor Minimo</th>
              <th>Valor Maximo</th>
              <th>Accion</th>
            </tr>
          </thead>
        </table>
        <div class="content-header mt-2 mb-1">
            <h4 class="mb-0">Configuración de Presupuesto</h4>
            <small class="text-muted">Ingresa los datos basicos del presupuesto.</small>
        </div>
        <div class="row">
        <div class="form-group col-md-6">
            <label class="form-label" for="departamento">Departamento</label>
            <select name="" id="departamento" aria-describedby="departamentoError" required class="form-control">
                <option disabled selected>Selecciona una opción</option>
            </select>
            <div id="departamentoError" class="invalid-feedback departamento-error"></div>
        </div>
        <div class="form-group col-md-6">
            <label class="form-label" for="municipio">Municipio</label>
            <select name="municipio" id="municipio" aria-describedby="municipioError" required class="form-control">
                <option disabled selected>Selecciona una opción</option>
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
            </div>
        </div>
        <div class="row">
          <div class="form-group col-md-6">
              <label class="form-label" for="presupuestoDiario">Presupuesto Diario</label>
              <input type="text" id="presupuestoDiario" aria-describedby="presupuestoDiarioError" required class="form-control" />
              <div id="presupuestoDiarioError" class="invalid-feedback presupuestoDiario-error"></div>
          </div>
          <div class="form-group col-md-6">
            <div class="btn-crear d-flex justify-content-end mt-1" >
                <button type="button" class="btn btn-outline-primary" id="addLocalidad">Agregar</button>
            </div>
          </div>
        </div>
        <!--Tabla-->
        <table class="datatables-basic table mb-3 mt-2 stepper-table" id="tableLocalidad">
            <thead>
                <tr>
                    <th>#</th>
                    <th>DEPARTAMENTO</th>
                    <th>MUNICIPIO</th>
                    <th>LIMITE</th>
                    <th>PRESUPUESTO</th>
                    <th>Accion</th>
                </tr>
            </thead>
        </table>
        <div class="form-step ">
            <div class="content-header mt-2 mb-1">
                <h4 class="mb-0">Configuración de Premio</h4>
                <small class="text-muted">Ingresa los datos basicos de la Campaña.</small>
            </div>
            <div class="row">
                <div class="form-group col-md-6">
                    <label class="form-label" for="tipoPremio">Tipo de Premio</label>
                    <select name="tipoPremio" aria-describedby="tipoPremioError"  id="tipoPremio" class="form-control">
                        <option disabled selected>Selecciona una opción</option>
                        <option value="0">Unico Premio</option>
                        <option value="1">Premio Random</option>
                        <option value="2">Todos los Premios</option>
                    </select>
                    <div id="tipoPremioError" class="invalid-feedback tipoPremio-error"></div>
                </div>
                <div class="form-group col-md-6">
                    <label class="form-label" for="linkPremio">Links de Premio</label>
                    <select name="linkPremio" aria-describedby="linkPremioError"  id="linkPremio" class="form-control">
                        <option disabled selected>Selecciona una opción</option>
                        <option value="1">Sí</option>
                        <option value="0">No</option>
                    </select>
                    <div id="linkPremioError" class="invalid-feedback linkPremio-error"></div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-md-6">
                    <label class="form-label" for="premio">Premio</label>
                    <select name="premio" id="premio" aria-describedby="premioError"  class="form-control">
                        <option disabled selected>Selecciona una opción</option>
                    </select>
                    <div id="premioError" class="invalid-feedback premio-error"></div>
                </div>
                <div class="form-group col-md-6">
                    <label class="form-label" for="valor">Valor</label>
                    <input type="number" id="valor" aria-describedby="valorError"  class="form-control" />
                    <div id="valorError" class="invalid-feedback valor-error"></div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-md-6">
                    <label class="form-label" for="porcentajePremio">Porcentaje de Premio</label>
                    <input type="number" id="porcentajePremio" aria-describedby="porcentajePremioError"  class="form-control" />
                    <div id="porcentajePremioError" class="invalid-feedback porcentajePremio-error"></div>
                </div>
                <div class="form-group col-md-6">
                    <div class="btn-crear d-flex justify-content-end mt-2" >
                        <button type="button" class="btn btn-outline-primary" id="addPremio">Agregar</button>
                    </div>
                </div>
            </div>
            <!--Tabla-->
            <table class="datatables-basic table mb-3 mt-2 stepper-table" id="TablaPremio">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>PREMIO</th>
                        <th>VALOR</th>
                        <th>LINK</th>
                        <th>Accion</th>
                    </tr>
                </thead>
            </table>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" id="removeStepp" >Borrar</button>
                <button type="button" id="GuardarEtapa" class="btn btn-primary" >Guardar</button>
            </div>
          </div>`);

        var nuevo ={
          nombre: NombreEtapa,
          descripcion: descripcionEtapa,
          orden: orden,
          tipoParticipacion: tipoParticipacion,
          intervalo: intervalo,
          intervaloSemanal: intervaloSemanal,
          intervaloMensual: intervaloMensual,
          periodo: rangoTiempo,
          valorAcumulado: null,
          minimoTransaccion: minimoTransaccion,
          totalMinimo: TotalMinimo,
          estado: 1,
        }
        TEMP.push(nuevo);
        //muestraEtapa.push(TEMP)

        $('#NombreEtapa').val('');
        $('#orden').val('');
        $('#descripcionEtapa').val('');
        $('#tipoParticipacion').val('');
        $('#RangoTiempo').val('');
        $('#intervalo').val('');
        $('#intervaloSemanal').val('');
        $('#intervaloMensual').val('');
        $('#minimoTransaccion').val('');
        $('#TotalMinimo').val('');


      }else{
        Alert('No se pudo crear la etapa, por falta de datos', 'error');
      }
  });

});

  function addStep(content) {
    $('.step-progress').addClass('blocked');
    $('.step-buttons button').prop('disabled', true);
    var newStep = $(`<div class="step"></div>`).html(content);
    $('#stepper').append(newStep);
    // Bloquear la tecla "Enter" en los campos de entrada
    newStep.find('input').on('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });

    totalSteps++;
    var previousStep = actualStep; // Guardar el valor actual de actualStep
    hideStep(actualStep);
    actualStep = totalSteps - 1;
    showStep(actualStep);

    

    // // Deshabilitar y ocultar los botones de la barra
    // $('.step-button').prop('disabled', true);
    //     //borrar los arreglos para su reutilizacion
    //     datosTablaParametro = [];
    //     datosTablaLocalidad = [];
    //     datosTablaPremio = [];
    // Agregar evento de clic al botón "Borrar" del nuevo paso
    newStep.find('#removeStepp').click(function(e) {
      e.preventDefault();
      if (totalSteps > 1) {
        // Limpiar los datos de la etapa actual
        nombresMunicipios={}
        TEMP = [];
        datosTablaParametro = [];
        datosTablaLocalidad = [];
        datosTablaPremio = [];
        hideStep(actualStep);
        actualStep = previousStep; // Establecer actualStep al valor guardado
        showStep(actualStep);
        newStep.html('');
        stepData = null;
        $('.step-progress').removeClass('blocked');
      }
    });

    newStep.find('#transaccion').click(function(e){
      e.preventDefault();
      $(this).off(e);
    });

    newStep.find('#GuardarEtapa').click(function(e){
      e.preventDefault();
      var stepData = {
        etapa: [...TEMP],
        parametros: datosTablaParametro,
        presupuesto: datosTablaLocalidad,
        premio: datosTablaPremio
      };
      // Guardar los datos de la etapa en el objeto correspondiente
      if(datosTablaParametro.length !=0 && datosTablaLocalidad.length !=0 && datosTablaPremio.length !=0 && TEMP.length !=0){
        DataEtapa.push(stepData);
        getEtapasData()
        console.log(getEtapasData());
        mostrarDatosTabla('#TablaEtapa');
          // Limpiar los datos de la etapa actual
          nombresMunicipios={}
          TEMP = [];
          datosTablaParametro = [];
          datosTablaLocalidad = [];
          datosTablaPremio = [];
  
  
        //Funciones del stepp
        hideStep(actualStep);
        actualStep = previousStep; // Establecer actualStep al valor guardado
        showStep(actualStep);
        newStep.html('');
        stepData = null;
        Alert('Etapa creada con exito', 'success');
        $('.step-progress').removeClass('blocked');
      }else{
        Alert('No se pudo crear la etapa, por falta de datos', 'error');
      }

    });


    $('#addParamas').click(function(){
      var limiteParticipacion = parseInt($('#limiteParticipacion').val());
      var Transaccion = parseInt($('#transaccion').val());
      var limiteDiario = parseInt($('#limiteDiario').val());
      var ValorMinimo = parseFloat($('#valorMinimo').val());
      var ValorMaximo = parseFloat($('#valorMaximo').val());

      var fields = ['limiteParticipacion', 'transaccion', 'valorMinimo', 'valorMaximo'];
      var isValid = true;

      fields.forEach(function(field) {
        var value = $('#' + field).val();
        var errorDiv = $('#' + field + 'Error')
        if (!value) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede estar vacío.');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          errorDiv.text('');
        }

        // Agregar evento input para quitar el error cuando el usuario comience a escribir
        $('#' + field).on('input', function() {
          $(this).removeClass('is-invalid');
          errorDiv.text('');
        });
      });

      
      var errorValorMinimo = $('#valorMinimoError');
      var errorValorMaximo = $('#valorMaximoError');

      if (ValorMinimo > ValorMaximo) {
        $('#valorMinimo').addClass('is-invalid');
        $('#valorMaximo').addClass('is-invalid');
        errorValorMinimo.text('El valor mínimo debe ser menor al valor máximo.');
        errorValorMaximo.text('El valor máximo debe ser mayor al valor mínimo.');
        isValid = false;
      } else {
        $('#valorMinimo').removeClass('is-invalid');
        $('#valorMaximo').removeClass('is-invalid');
        errorValorMinimo.text('');
        errorValorMaximo.text('');
      }

      console.log(isValid)
      if( isValid === true ){

        var nuevoParametro= {
          limiteParticipacion: limiteParticipacion,
          idTransaccion: Transaccion,
          //tipo de transaccion Que es?
          tipoTransaccion: 0,
          ValorMinimo: ValorMinimo,
          limiteDiario: limiteDiario,
          ValorMaximo: ValorMaximo,
          valorAnterior: 0,
          //rangoDias: RangoDias
          estado: 1
        }

        datosTablaParametro.push(nuevoParametro);
        console.log(datosTablaParametro);
        $('#limiteParticipacion').val('');
        $('#totalMinimo').val('');
        $('#transaccion').val('');
        $('#limiteDiario').val('');
        $('#valorMinimo').val('');
        $('#valorMaximo').val('');
        $('#RangoDias').val('');

        mostrarDatosParametro('#TablaParametros');


      }

      return isValid;

    });

    $('#addLocalidad').click(function() {
      // Obtener los valores de los campos de entrada
      var departamento = parseInt($('#departamento').val());
      var municipio = parseInt($('#municipio').val());
      var limiteGanador = parseInt($('#limiteGanador').val());
      var presupuesto = parseFloat($('#presupuesto').val());
      var presupuestoDiario =  parseFloat($('#presupuestoDiario').val());

      var fields = ['departamento', 'municipio', 'limiteGanador', 'presupuesto'];
      var isValid = true;

      fields.forEach(function(field) {
        var value = $('#' + field).val();
        var errorDiv = $('#' + field + 'Error')
        if (!value) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede estar vacío.');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          errorDiv.text('');
        }

        // Agregar evento input para quitar el error cuando el usuario comience a escribir
        $('#' + field).on('input', function() {
          $(this).removeClass('is-invalid');
          errorDiv.text('');
        });
      });

      // Validar que los campos no estén vacíos
      if (departamento && municipio && limiteGanador && presupuesto) {
        // Crear un objeto con los datos
        var nuevoDato = {
          idDepartamento: departamento,
          idMunicipio: municipio,
          limiteGanadores: limiteGanador,
          presupuestoDiario:presupuestoDiario,
          valor: presupuesto,
          estado: 1
        };

        // Agregar el nuevo dato al arreglo
        datosTablaLocalidad.push(nuevoDato);
        console.log(datosTablaLocalidad)
        // Limpiar los campos de entrada
        $('#departamento').val('');
        $('#municipio').val('');
        $('#limiteGanador').val('');
        $('#presupuesto').val('');
        $('#presupuestoDiario').val('')

        // Mostrar los datos en la tabla
        mostrarDatosParametro('#tableLocalidad');

      }

      return isValid;
    });

    $('#addPremio').click(function(){
      var tipoPremio = $('#tipoPremio').val();
      var linkPremio = parseInt($('#linkPremio').val());
      var premio = parseInt($('#premio').val());
      var valor = parseFloat($('#valor').val());
      var porcentaje = $('#porcentajePremio').val();

      var fields = ['tipoPremio', 'linkPremio', 'premio', 'valor', 'porcentajePremio'];
      var isValid = true;

      fields.forEach(function(field) {
        var value = $('#' + field).val();
        var errorDiv = $('#' + field + 'Error')
        if (!value) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede estar vacío.');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          errorDiv.text('');
        }

        // Agregar evento input para quitar el error cuando el usuario comience a escribir
        $('#' + field).on('input', function() {
          $(this).removeClass('is-invalid');
          errorDiv.text('');
        });
      });

      if( isValid ){
        var nuevoPremio ={
          idPremio : premio,
          linkPremio: linkPremio,
          tipoPremio: tipoPremio,
          valor: valor,
          porcentajePremio : porcentaje,
          estado: 1
        }

        console.log(tipoPremio)
        datosTablaPremio.push(nuevoPremio);
        console.log(datosTablaPremio)
        $('#tipoPremio').val('');
        $('#linkPremio').val('');
        $('#premio').val('');
        $('#valor').val('');
        $('#porcentajePremio').val('');

        mostrarDatosParametro('#TablaPremio');

      }
      return isValid;
    });

    // Función para agregar un nombre de municipio al objeto
    function agregarNombreMunicipio(idMunicipio, nombreMunicipio) {
      nombresMunicipios[idMunicipio] = nombreMunicipio;
    }

    // Función para eliminar un nombre de municipio del objeto
    function eliminarNombreMunicipio(idMunicipio) {
      delete nombresMunicipios[idMunicipio];
    }

    function mostrarDatosParametro(tabla) {
      switch(tabla)
      {
        case '#tableLocalidad':
            // Limpiar la tabla antes de insertar nuevas filas
          $('#tableLocalidad').DataTable().clear().destroy();

          // Inicializar el DataTables con los datos de datosTablaLocalidad
          $('#tableLocalidad').DataTable({
            searching: false,
            paging: false,
            data: datosTablaLocalidad,
            columns: [
              {
                render: function(data, type, row, meta) {
                  return meta.row + 1;
                },
                width: '5%'
              },
              {
                data: 'idDepartamento',
                render: function (data) {
                  var departamento = $('#departamento option[value="' + data + '"]').text();
                  return departamento;
                },
                width: '25%'
              },
              {
                data: 'idMunicipio',
                render: function (data, type, row, meta) {
                  var municipio = $('#municipio option[value="' + data + '"]').text();
              
                  if (!municipio) {
                    // Si no se encuentra el nombre del municipio en el <select>, buscarlo en el objeto nombresMunicipios
                    municipio = nombresMunicipios[data];
                  } else {
                    // Si se encuentra el nombre del municipio en el <select>, agregarlo al objeto nombresMunicipios
                    agregarNombreMunicipio(data, municipio);
                  }
              
                  return municipio;
                },
                width: '25%'
              },
              {
                data: 'limiteGanadores',
                width: '15%'
              },
              {
                data: 'valor',
                width: '15%'
              },
              {
                render: function (data, type, row, meta) {
                  var opcDelete = `
                    <a href="#" class="dropdown-item btnEliminarLocalidad" data-index="${meta.row}">
                      ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })}
                    </a>
                  `;
                  return opcDelete;
                },
                width: '15%'    
              }
            ]
          });
        break;

        case'#TablaParametros':
          // Limpiar la tabla antes de insertar nuevas filas
          $('#TablaParametros').DataTable().clear().destroy();

          // Inicializar el DataTables con los datos de datosTablaParametro
          $('#TablaParametros').DataTable({
            data: datosTablaParametro,
            searching: false, // Deshabilitar la funcionalidad de búsqueda
            paging: false,
            columns: [
              {
                render: function(data, type, row, meta) {
                  // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
                  return meta.row + 1;
                },
                width: '5%'
              },
              {
                data: 'idTransaccion',
                render: function (data) {
                  var transaccion = $('#transaccion option[value="' + data + '"]').text();
                  return transaccion;
                },
                width: '30%'
              },
              { data: 'ValorMinimo', width: '20%' },
              { data: 'ValorMaximo', width: '20%' },
              {
                render: function (data, type, row, meta) {
                  var opcDelete = `
                    <a href="#" class="dropdown-item btnEliminarParametro" data-index="${meta.row}">
                      ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })}
                    </a>
                  `;
                  return opcDelete;
                },
                width: '25%'
              }
            ]
          });
        break;

        case '#TablaPremio':
           // Limpiar la tabla antes de insertar nuevas filas
           $('#TablaPremio').DataTable().clear().destroy();

           // Inicializar el DataTables con los datos de datosTablaLocalidad
           $('#TablaPremio').DataTable({
             searching: false, // Deshabilitar la funcionalidad de búsqueda
             paging: false,
             data: datosTablaPremio,
             columns: [
               {
                render: function(data, type, row, meta) {
                  // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
                  return meta.row + 1;
                },
                width: '5%'
              },
              {
                data: 'idPremio',
                render: function (data) {
                  var premio = $('#premio option[value="' + data + '"]').text();
                  return premio;
                },
                width: '30%'
              },
              { data: 'valor', width: '30%' },
              {
                data: 'linkPremio',
                render: function (data) {
                  return data === 1 ? 'Sí' : 'No';
                },
                width: '30%'
              },
              {
                render: function (data, type, row, meta) {
                  var opcDelete = `
                    <a href="#" class="dropdown-item btnEliminarPremio" data-index="${meta.row}">
                      ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })}
                    </a>
                  `;
                  return opcDelete;
                }
              }
             ]
           });
        break;

        default:
          break;
      }
      
    }

    $(document).on('click', '.btnEliminarLocalidad', function(e) {
      e.preventDefault();
      var index = $(this).data('index');
      eliminarDatoAddStep('#tableLocalidad', index);
    });
    
    $(document).on('click', '.btnEliminarParametro', function(e) {
      e.preventDefault();
      var index = $(this).data('index');
      eliminarDatoAddStep('#TablaParametros', index);
    });
    
    $(document).on('click', '.btnEliminarPremio', function(e) {
      e.preventDefault();
      var index = $(this).data('index');
      eliminarDatoAddStep('#TablaPremio', index);
    });

    // Función para eliminar un dato de las tablas
    function eliminarDatoAddStep(tabla, index) {
      console.log('Eliminar dato')
      switch (tabla) {
        case '#tableLocalidad':
          eliminarNombreMunicipio(datosTablaLocalidad[index].idMunicipio);
          datosTablaLocalidad.splice(index, 1);
          break;
        case '#TablaParametros':
          datosTablaParametro.splice(index, 1);
          break;
        case '#TablaPremio':
          datosTablaPremio.splice(index, 1);
          break;
        default:
          break;
      }
      mostrarDatosParametro(tabla);
    }
    

  }
  
}

//Función del stepper
function initStepperEdit() {
  // Reiniciar los stepps
  actualStepEdit = 0;
  var stepsEdits = $('#stepperEdit').children();
  stepsEdits.hide();
  
  // Inicializar los stepps
  var totalStepsEdits = stepsEdits.length;
  var previousStep
  var newStep
  
  showStep(actualStepEdit);
  $('.next-btn-edit').click(function(e) {
    e.preventDefault(); // Detener el comportamiento predeterminado
    if (actualStepEdit < totalStepsEdits - 1) {
      hideStep(actualStepEdit);
      actualStepEdit++;
      showStep(actualStepEdit);
      console.log(actualStepEdit);
    }
  });
  
  $('.prev-btn-edit').click(function(e) {
    e.preventDefault(); // Detener el comportamiento predeterminado
    if (actualStepEdit > 0) {
      hideStep(actualStepEdit);
      actualStepEdit--;
      showStep(actualStepEdit);
    }
  });
  
  function showStep(stepIndex) {
    stepsEdits.eq(stepIndex).show();
    // Cambiar el color del botón correspondiente al paso actual
    $('.step-progressEdit').removeClass('active');
    $('.step-btn-' + (stepIndex + 1)+ '-edit').addClass('active');
  }
  
  // Agregar evento de clic a los botones de la parte superior
  $('.step-btn-1-edit').click(function(e) {
    e.preventDefault();
    hideStep(actualStepEdit);
    actualStepEdit = 0;
    showStep(actualStepEdit);
  });
  
  $('.step-btn-2-edit').click(function(e) {
    e.preventDefault();
    hideStep(actualStepEdit);
    actualStepEdit = 1;
    showStep(actualStepEdit);
  });
  
  $('.step-btn-3-edit').click(function(e) {
    e.preventDefault();
    hideStep(actualStepEdit);
    actualStepEdit = 2;
    showStep(actualStepEdit);
  });
  
  function hideStep(stepIndex) {
    stepsEdits.eq(stepIndex).hide();
  }

  function handleTipoParticipacionChange(selectId, inputsContainerId) {
    const tipoSeleccionado = $(`#${selectId}`).val();
    const inputsContainer = $(`#${inputsContainerId}`);
  
    inputsContainer.find('#inputsTipo0').css('display', 'none');
    inputsContainer.find('#inputsTipo1').css('display', 'none');
  
    if (tipoSeleccionado === '2' || tipoSeleccionado === '3') {
      inputsContainer.find('#inputsTipo0').css('display', 'block');
    } else if (tipoSeleccionado === '4') {
      inputsContainer.find('#inputsTipo1').css('display', 'block');
    }
  }
  
  // Para el stepIniEdit
  $('#tipoParticipacionEdit').change(function() {
    handleTipoParticipacionChange('tipoParticipacionEdit', 'inputsContainerEdit');
  });

  function handleTipoParticipacionChange(selectId, inputsContainerId) {
    const tipoSeleccionado = $(`#${selectId}`).val();
    const inputsContainer = $(`#${inputsContainerId}`);
  
    inputsContainer.find('#inputsTipo0').css('display', 'none');
    inputsContainer.find('#inputsTipo1').css('display', 'none');
  
    if (tipoSeleccionado === '2' || tipoSeleccionado === '3') {
      inputsContainer.find('#inputsTipo0').css('display', 'block');
    } else if (tipoSeleccionado === '4') {
      inputsContainer.find('#inputsTipo1').css('display', 'block');
    }
  }

 $('#TablaEtapaEdit').on('click', '.btn_edit', function(event) {
   var id = $(this).data('id');
   console.log('entra aqui')
   getDepartamento();
   getTransaccion();

   getPremio();
   addStepEdit(`
   <div class="form-step">
     <div class="content-header mt-2 mb-1">
       <h4 class="mb-0">Configuración de Etapa</h4>
       <small class="text-muted">Ingresa los datos básicos de la Campaña.</small>
     </div>
     <div class="row">
       <div class="form-group col-md-6">
         <input id="idEtapa" type="hidden">
         <label class="form-label" for="NombreEtapaEdit">Nombre</label>
         <input type="text" id="NombreEtapaEdit" aria-describedby="NombreEtapaError" class="form-control" />
         <div id="NombreEtapaError" class="invalid-feedback NombreEtapa-error"></div>
       </div>
       <div class="form-group col-md-6">
         <label class="form-label" for="ordenEdit">Orden</label>
         <input type="number" id="ordenEdit" class="form-control" aria-describedby="ordenError" />
         <div id="ordenError" class="invalid-feedback orden-error"></div>
       </div>
     </div>
     <div class="row">
       <div class="form-group col-md-6">
         <label class="form-label" for="descripcionEtapaEdit">Descripción de las Etapas</label>
         <textarea type="text" id="descripcionEtapaEdit" aria-describedby="descripcionEtapaError" class="form-control" placeholder="Ingrese la descripción" rows="2"></textarea>
         <div id="descripcionEtapaError" class="invalid-feedback descripcionEtapa-error"></div>
       </div>
       <div class="form-group col-md-6">
         <label class="form-label" for="tipoParticipacionEdit">Tipo de Participación</label>
         <select name="tipoParticipacionEdit" aria-describedby="tipoParticipacionEditError" id="tipoParticipacionEdit" class="form-control">
           <option disabled selected>Selecciona una opción</option>
           <option value="0">Transacciones</option>
           <option value="1">Recurrentes</option>
           <option value="2">Acumular Transacciones</option>
           <option value="3">Acumular Transacciones Recurrentes</option>
           <option value="4">Acumular Valor</option>
           <option value="5">Combinar Transacciones</option>
         </select>
         <div id="tipoParticipacionEditError" class="invalid-feedback tipoParticipacionEdit-error"></div>
       </div>
     </div>
     <div class="row">
         <div class="form-group col-md-6">
            <label class="form-label" for="RangoTiempoEdit">Rango de tiempo</label>
            <select name="RangoTiempo" aria-describedby="RangoTiempoEditError" id="RangoTiempoEdit" class="form-control">
                <option disabled selected>Selecciona una opción</option>
                <option value="0">Diaria</option>
                <option value="1">Semanal</option>
                <option value="2">Anual</option>
            </select>
            <div id="RangoTiempoEditError" class="invalid-feedback RangoTiempoEdit-error"></div>
        </div>
        <div class="form-group col-md-6">
            <label class="form-label" for="intervaloEdit">Intervalo de Dias</label>
            <input type="number" id="intervaloEdit" class="form-control" aria-describedby="intervaloEditError" />
            <div id="intervaloEditError" class="invalid-feedback intervaloEdit-error"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div id="inputsContainer">
            <div id="inputsTipo0Edit" class="hidden">
              <!-- Inputs para Acumuladas -->
              <div class="row">
                <div class="form-group col-md-6">
                  <label class="form-label" for="minimoTransaccionEdit">Mínimo Transacción</label>
                  <input type="text" id="minimoTransaccion" class="form-control" />
                </div>
              </div>
            </div>
            <div id="inputsTipo1Edit" >
              <!-- Inputs para Acumuladas -->
              <div class="row">
                <div class="form-group col-md-6">
                  <label class="form-label" for="TotalMinimoEdit">Total Mínimo</label>
                  <input type="text" id="TotalMinimoEdit" class="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
     </div>
     <div class="form-step">
       <div class="content-header mt-2 mb-1">
         <h4 class="mb-0">Edición de Parámetros de Etapa</h4>
         <small class="text-muted">Ingresa los datos básicos de la Campaña.</small>
       </div>
       <div class="row">
         <div class="form-group col-md-6">
           <input id="idParametros" type="hidden">
           <label class="form-label" for="limiteParticipacionEdit">Límite de Participaciones</label>
           <input type="number" id="limiteParticipacionEdit" class="form-control" />
           <div id="limiteParticipacionEditError" class="invalid-feedback departamento-error"></div>
         </div>
         <div class="form-group col-md-6">
           <label class="form-label" for="transaccionEdit">Transacción</label>
           <select name="" id="transaccionEdit" class="form-control">
             <option disabled selected>Selecciona una opción</option>
           </select>
           <div id="transaccionEditError" class="invalid-feedback transaccionEdit-error"></div>
         </div>
       </div>
       <div class="row">
         <div class="form-group col-md-6">
           <label class="form-label" for="valorMinimoEdit">Valor Mínimo</label>
           <input type="number" id="valorMinimoEdit" class="form-control" />
           <div id="valorMinimoEditError" class="invalid-feedback valorMinimoEdit-error"></div>
         </div>
         <div class="form-group col-md-6">
           <label class="form-label" for="valorMaximoEdit">Valor Máximo</label>
           <input type="number" id="valorMaximoEdit" class="form-control" />
           <div id="valorMaximoEditError" class="invalid-feedback valorMaximoEdit-error"></div>
         </div>
       </div>
       <div class="row">
         <div class="form-group col-md-6">
           <label class="form-label" for="limiteDiarioEdit">Límite Diario</label>
           <input type="number" id="limiteDiarioEdit" class="form-control" />
           <div id="limiteDiarioEditError" class="invalid-feedback limiteDiarioEdit-error"></div>
         </div>
        <div class="form-group col-md-6">
          <div class="btn-crear d-flex justify-content-end mt-1" >
              <button type="button" class="btn btn-outline-primary" id="addParamasEdit">Agregar</button>
          </div>
        </div>
      </div>
       <table class="datatables-basic table mb-3 mt-2 stepper-table" id="TablaParametrosEdit">
         <thead>
           <tr>
             <th>#</th>
             <th>Transacción</th>
             <th>Valor Mínimo</th>
             <th>Valor Máximo</th>
             <th>Acción</th>
           </tr>
         </thead>
       </table>
     </div>
     <div class="form-step">
       <div class="content-header mt-2 mb-1">
         <h4 class="mb-0">Configuración de Presupuesto</h4>
         <small class="text-muted">Ingresa los datos básicos del presupuesto.</small>
       </div>
       <div class="row">
         <div class="form-group col-md-6">
           <input id="idPresupuesto" type="hidden">
           <label class="form-label" for="departamentoEdit">Departamento</label>
           <select name="" id="departamentoEdit" aria-describedby="departamentoError" required class="form-control">
             <option disabled selected>Selecciona una opción</option>
           </select>
           <div id="departamentoEditError" class="invalid-feedback departamento-error"></div>
         </div>
         <div class="form-group col-md-6">
           <label class="form-label" for="municipioEdit">Municipio</label>
           <select name="municipioEdit" id="municipioEdit" aria-describedby="municipioError" required class="form-control">
             <option disabled selected>Selecciona una opción</option>
           </select>
           <div id="municipioEditError" class="invalid-feedback municipio-error"></div>
         </div>
       </div>
       <div class="row">
         <div class="form-group col-md-6">
           <label class="form-label" for="limiteGanadorEdit">Límite de Ganadores</label>
           <input type="text" id="limiteGanadorEdit" aria-describedby="limiteGanadorError" required class="form-control" />
           <div id="limiteGanadorEditError" class="invalid-feedback limiteGanador-error"></div>
         </div>
         <div class="form-group col-md-6">
           <label class="form-label" for="presupuestoEdit">Presupuesto</label>
           <input type="text" id="presupuestoEdit" aria-describedby="presupuestoError" required class="form-control" />
           <div id="presupuestoEditError" class="invalid-feedback presupuesto-error"></div>
         </div>
      </div>
      <div class="row">
          <div class="form-group col-md-6">
           <label class="form-label" for="presupuestoDiarioEdit">Presupuesto Diario</label>
           <input type="text" id="presupuestoDiarioEdit" aria-describedby="presupuestoDiarioEditError" required class="form-control" />
           <div id="presupuestoDiarioEditError" class="invalid-feedback presupuestoDiarioEdit-error"></div>
          </div>
          <div  class="form-group col-md-6">
            <div class="btn-crear d-flex justify-content-end mt-1">
             <button type="button" class="btn btn-outline-primary" id="addLocalidadEdit">Agregar</button>
            </div>
          </div>
       </div>
       <!--Tabla-->
       <table class="datatables-basic table mb-3 mt-2 stepper-table" id="tableLocalidadEdit">
         <thead>
           <tr>
             <th>#</th>
             <th>DEPARTAMENTO</th>
             <th>MUNICIPIO</th>
             <th>LÍMITE</th>
             <th>PRESUPUESTO</th>
             <th>Acción</th>
           </tr>
         </thead>
       </table>
     </div>
     <div class="form-step">
       <div class="content-header mt-2 mb-1">
         <h4 class="mb-0">Configuración de Premio</h4>
         <small class="text-muted">Ingresa los datos básicos de la Campaña.</small>
       </div>
       <div class="row">
         <div class="form-group col-md-6">
           <input id="idPremio" type="hidden">
           <label class="form-label" for="tipoPremioEdit">Tipo de Premio</label>
           <select name="tipoPremioEdit" aria-describedby="tipoPremioEditError" id="tipoPremioEdit" class="form-control">
             <option disabled selected>Selecciona una opción</option>
             <option value="0">Único Premio</option>
             <option value="1">Premio Random</option>
             <option value="2">Todos los Premios</option>
           </select>
           <div id="tipoPremioEditError" class="invalid-feedback tipoPremio-error"></div>
         </div>
         <div class="form-group col-md-6">
           <label class="form-label" for="linkPremioEdit">Links de Premio</label>
           <select name="linkPremioEdit" aria-describedby="linkPremioError" id="linkPremioEdit" class="form-control">
             <option disabled selected>Selecciona una opción</option>
             <option value="1">Sí</option>
             <option value="0">No</option>
           </select>
           <div id="linkPremioEditError" class="invalid-feedback linkPremio-error"></div>
         </div>
       </div>
       <div class="row">
         <div class="form-group col-md-6">
           <label class="form-label" for="premio">Premio</label>
           <select name="premioEdit" id="premioEdit" aria-describedby="premioError" class="form-control">
             <option disabled selected>Selecciona una opción</option>
           </select>
           <div id="premioEditError" class="invalid-feedback premio-error"></div>
         </div>
         <div class="form-group col-md-6">
           <label class="form-label" for="valorEdit">Valor</label>
           <input type="number" id="valorEdit"
           aria-describedby="valorError" class="form-control" />
          <div id="valorEditError" class="invalid-feedback valor-error"></div>
        </div>
      </div>
      <div class="row">
        <div class="form-group col-md-6">
          <label class="form-label" for="porcentajePremioEdit">Porcentaje de Premio</label>
          <input type="number" id="porcentajePremioEdit" aria-describedby="porcentajePremioError" class="form-control" />
          <div id="porcentajePremioEditError" class="invalid-feedback porcentajePremio-error"></div>
        </div>
        <div class="form-group col-md-6">
          <div class="btn-crear d-flex justify-content-end mt-2">
            <button type="button" class="btn btn-outline-primary" id="addPremioEdit">Agregar</button>
          </div>
        </div>
      </div>
      <!--Tabla-->
      <table class="datatables-basic table mb-3 mt-2 stepper-table" id="TablaPremioEdit">
        <thead>
          <tr>
            <th>#</th>
            <th>PREMIO</th>
            <th>VALOR</th>
            <th>LINK</th>
            <th>Acción</th>
          </tr>
        </thead>
      </table>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" id="removeSteppEdit">Cancelar</button>
        <button type="button" id="GuardarEtapaEdit" class="btn btn-primary">Guardar</button>
      </div>
    </div>
    `);
   editarEtapa(id);
   event.stopPropagation();
 });

  function addStepEdit(content) {
   $('.step-progressEditedit').addClass('blocked');
    $('.step-buttonsEdit button').prop('disabled', true);
    console.log('id add')
      newStep = $(`<div class="step"></div>`).html(content);
    $('#stepperEdit').append(newStep);
    totalStepsEdits++;
    previousStep = actualStepEdit; // Guardar el valor actual de actualStepEdit
    hideStep(actualStepEdit);
    actualStepEdit = totalStepsEdits - 1;
    showStep(actualStepEdit);
  }

  // Función para editar una etapa
  function editarEtapa(id) {

    var etapa = dataEditEtapa.find(function(item) {
      return item.id === id;
    });

    if (etapa) {
      console.log(etapa, 'la etapa es')
      
      // Para el stepIniEdit
      $('#tipoParticipacionEdit').change(function() {
        handleTipoParticipacionChange('tipoParticipacionEdit', 'inputsContainerEdit');
      });

      $('#departamentoEdit').on('change', function() {
        var selectedId = $(this).val();
        getMunicipioByDepto(selectedId);
      });
   
      newStep.find('#removeSteppEdit').click(function(e) {
        e.preventDefault();
        hideStep(actualStepEdit);
        actualStepEdit = previousStep; // Establecer actualStep al valor guardado
        showStep(actualStepEdit);
        newStep.html('');
        stepData = null;
        
      });

      $('#GuardarEtapaEdit').off('click').on('click', function(e) {
        e.preventDefault();
  
        // Obtener los datos actualizados de la etapa desde los campos de entrada
        var nombre = $('#NombreEtapaEdit').val();
        var orden = $('#ordenEdit').val();
        var descripcion = $('#descripcionEtapaEdit').val();
        var tipoParticipacion = $('#tipoParticipacionEdit').val();
        var intervalo = $('#intervaloEdit').val();
        var intervaloSemanal = $('#intervaloEdit').val();
        var intervaloMensual = $('#intervaloEdit').val();
  
        // Actualizar los datos de la etapa
        etapa.nombre = nombre;
        etapa.orden = orden;
        etapa.descripcion = descripcion;
        etapa.tipoParticipacion = tipoParticipacion;
        etapa.intervalo = intervalo;
        etapa.intervaloSemanal = intervaloSemanal;
        etapa.intervaloMensual = intervaloMensual;
  
        // Buscar la etapa editada en el arreglo dataEditEtapa
        var etapaIndex = dataEditEtapa.findIndex(function(item) {
          return item.id === id;
        });
  
        if (etapaIndex !== -1) {
          // Actualizar la etapa editada en el arreglo dataEditEtapa
          dataEditEtapa[etapaIndex] = etapa;
  
          console.log(dataEditEtapa, 'data pasando');
          //Funciones del stepp
          hideStep(actualStepEdit);
          actualStepEdit = previousStep; // Establecer actualStep al valor guardado
          showStep(actualStepEdit);
          newStep.html('');
           stepData = null;
            $('.step-progress').removeClass('blocked');
          Alert('Etapa actualizada correctamente', 'success');
         
        } else {
          Alert('No se pudo encontrar la etapa editada', 'error');
        }
         
      });


      // Asignar los valores de la etapa a los campos de edición
      $('#idEtapa').val(etapa.id);
      $('#NombreEtapaEdit').val(etapa.nombre);
      $('#ordenEdit').val(etapa.orden);
      $('#descripcionEtapaEdit').val(etapa.descripcion);
      $('#tipoParticipacionEdit').val(etapa.tipoParticipacion);
      $('#intervaloEdit').val(etapa.intervalo);
      $('#RangoTiempoEdit').val(etapa.periodo)
      // $('#idParemetros').val(etapa.parametros.id);
        
      // Lógica para mostrar u ocultar los campos según el tipo de participación
      var tipoParticipacion = $('#tipoParticipacionEdit').val(); // Obtener el valor del campo de selección
      var inputsTipo0 = document.getElementById('inputsTipo0Edit');
      var inputsTipo1 = document.getElementById('inputsTipo1Edit');

      if (tipoParticipacion === '2' || tipoParticipacion === '3') {
        inputsTipo0.style.display = 'block';
        inputsTipo1.style.display = 'none';
        $('#minimoTransaccionEdit').val(etapa.minimoTransaccion);
      } else if (tipoParticipacion === '4') {
        inputsTipo0.style.display = 'none';
        inputsTipo1.style.display = 'block';
        $('#TotalMinimoEdit').val(etapa.totalMinimo);
      } else {
        inputsTipo0.style.display = 'none';
        inputsTipo1.style.display = 'none';
      }

      Promise.all([getDepartamento(), getTransaccion(), getPremio(), getMunicipios()])
      .then(() => {
        mostrarDatosEdit('#TablaParametrosEdit', etapa);
        mostrarDatosEdit('#tableLocalidadEdit', etapa);
        mostrarDatosEdit('#TablaPremioEdit', etapa);
      })
      .catch(error => {
        console.log('Error al cargar los datos:', error);
      });

      mostrarDatosEdit('#TablaParametrosEdit', etapa);
      mostrarDatosEdit('#tableLocalidadEdit', etapa);
      mostrarDatosEdit('#TablaPremioEdit', etapa);


      // Event listeners para los botones de editar y eliminar de la tabla de parámetros
      $('#TablaParametrosEdit tbody').off('click', '.btn_edit_parametro').on('click', '.btn_edit_parametro', function() {
        var id = $(this).data('id');
        editarParametro(id, etapa);
      });

      $('#TablaParametrosEdit tbody').off('click', '.btn_delete_parametro').on('click', '.btn_delete_parametro', function() {
        var id = $(this).data('id');
        eliminarParametro(id, etapa);
      });

      // Event listeners para los botones de editar y eliminar de la tabla de localidades
      $('#tableLocalidadEdit tbody').off('click', '.btn_edit_localidad').on('click', '.btn_edit_localidad', function() {
        var id = $(this).data('id');
        editarLocalidad(id);
      });

      $('#tableLocalidadEdit tbody').off('click', '.btn_delete_localidad').on('click', '.btn_delete_localidad', function() {
        var id = $(this).data('id');
        eliminarLocalidad(id, etapa);
      });

      // Event listeners para los botones de editar y eliminar de la tabla de premios
      $('#TablaPremioEdit tbody').off('click', '.btn_edit_premio').on('click', '.btn_edit_premio', function() {
        var id = $(this).data('id');
        editarPremio(id);
      });

      $('#TablaPremioEdit tbody').off('click', '.btn_delete_premio').on('click', '.btn_delete_premio', function() {
        var id = $(this).data('id');
        eliminarPremio(id, etapa);
      });
    }

    function editarParametro(id) {
      if (etapa) {
        var parametroIndex = etapa.parametros.findIndex(function(item) {
          return item.id === id;
        });
    
        if (parametroIndex !== -1) {
          var parametro = etapa.parametros[parametroIndex];
    
          // Eliminar el registro del arreglo etapa.parametros
          etapa.parametros.splice(parametroIndex, 1);
    
          // Mostrar los datos del registro seleccionado en los inputs
          $('#idParametros').val(parametro.id);
          $('#limiteParticipacionEdit').val(parametro.limiteParticipacion);
          $('#transaccionEdit').val(parametro.idTransaccion);
          $('#valorMinimoEdit').val(parametro.ValorMinimo);
          $('#valorMaximoEdit').val(parametro.ValorMaximo);
          $('#limiteDiarioEdit').val(parametro.limiteDiario);
    
          // Actualizar la tabla de parámetros
          mostrarDatosEdit('#TablaParametrosEdit', etapa);
        }
      }
    }
    
    // Event listener para el botón de guardar parámetro editado
    $('#addParamasEdit').click(function() {
      var id = $('#idParametros').val();
      var limiteParticipacion = $('#limiteParticipacionEdit').val();
      var idTransaccion = $('#transaccionEdit').val();
      var ValorMinimo = $('#valorMinimoEdit').val();
      var ValorMaximo = $('#valorMaximoEdit').val();
      var limiteDiario = $('#limiteDiarioEdit').val();
      var parametro = {}

      // Validar campos y aplicar clases y mensajes de error
      var fields = ['limiteParticipacionEdit', 'transaccionEdit', 'valorMinimoEdit', 'valorMaximoEdit'];
      var isValid = true;

      fields.forEach(function(field) {
        var value = $('#' + field).val();
        var errorDiv = $('#' + field + 'Error');
        if (!value) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede estar vacío.');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          errorDiv.text('');
        }

        // Agregar evento input para quitar el error cuando el usuario comience a escribir
        $('#' + field).on('input', function() {
          $(this).removeClass('is-invalid');
          errorDiv.text('');
        });
      });

      // // Validar ValorMinimo y ValorMaximo
      // var errorValorMinimo = $('#valorMinimoEditError');
      // var errorValorMaximo = $('#valorMaximoEditError');

      // if (ValorMinimo > ValorMaximo) {
      //   $('#valorMinimoEdit').addClass('is-invalid');
      //   $('#valorMaximoEdit').addClass('is-invalid');
      //   errorValorMinimo.text('El valor mínimo debe ser menor al valor máximo.');
      //   errorValorMaximo.text('El valor máximo debe ser mayor al valor mínimo.');
      //   isValid = false;
      // } else {
      //   $('#valorMinimoEdit').removeClass('is-invalid');
      //   $('#valorMaximoEdit').removeClass('is-invalid');
      //   errorValorMinimo.text('');
      //   errorValorMaximo.text('');
      // }

      
      if(isValid){
        if(id === null || id === ''){
          parametro = {
            limiteParticipacion: limiteParticipacion,
            idTransaccion: idTransaccion,
            tipoTransaccion: 0,
            ValorMinimo: ValorMinimo,
            ValorMaximo: ValorMaximo,
            valorAnterior: 0,
            limiteDiario: limiteDiario,
            estado:1
          };
        }else{
          parametro = {
            id: id,
            limiteParticipacion: limiteParticipacion,
            idTransaccion: idTransaccion,
            tipoTransaccion: 0,
            ValorMinimo: ValorMinimo,
            ValorMaximo: ValorMaximo,
            valorAnterior: 0,
            limiteDiario: limiteDiario,
            estado:1
          };
        }
        // Agregar el parámetro actualizado al arreglo datosTablaParametro
        etapa.parametros.push(parametro);
        // Actualizar la tabla de parámetros
        mostrarDatosEdit('#TablaParametrosEdit', etapa);
        // Limpiar los inputs después de guardar
        $('#idParemetros').val('');
        $('#limiteParticipacionEdit').val('');
        $('#transaccionEdit').val('');
        $('#valorMinimoEdit').val('');
        $('#valorMaximoEdit').val('');
        $('#limiteDiarioEdit').val('');
        parametro={}
      }
      

      
    });

    //Funcion asociada
    function editarLocalidad(id) {
      if (etapa) {
        var presupuestosIndex = etapa.presupuestos.findIndex(function(item) {
          return item.id === id;
        });
    
        if (presupuestosIndex !== -1) {
          var presupuesto = etapa.presupuestos[presupuestosIndex];
    
          // Eliminar el registro del arreglo etapa.presupuestos
          etapa.presupuestos.splice(presupuestosIndex, 1);
    
          // Mostrar los datos del registro seleccionado en los inputs
          $('#idPresupuesto').val(presupuesto.id);
          $('#departamentoEdit').val(presupuesto.idDepartamento);
          $('#municipioEdit').val(presupuesto.idMunicipio);
          getMunicipioByDepto(presupuesto.idDepartamento);
          $('#limiteGanadorEdit').val(presupuesto.limiteGanadores);
          $('#presupuestoEdit').val(presupuesto.valor);
          $('#presupuestoDiarioEdit').val(presupuesto.presupuestoDiario);
    
          // Actualizar la tabla de localidades
          mostrarDatosEdit('#tableLocalidadEdit', etapa);
        }
      }
    }

    $('#addLocalidadEdit').click(function() {
      var id = $('#idPresupuesto').val();
      var idDepartamento = $('#departamentoEdit').val();
      var idMunicipio = $('#municipioEdit').val();
      var limiteGanadores = $('#limiteGanadorEdit').val();
      var valor = $('#presupuestoEdit').val();
      var presupuestoDiario = $('#presupuestoDiarioEdit').val();
      var presupuestoActualizado = {};

      var fields = ['departamentoEdit', 'municipioEdit', 'limiteGanadorEdit', 'presupuestoDiarioEdit','presupuestoEdit'];
      var isValid = true;
      
      fields.forEach(function(field) {
        var value = $('#' + field).val();
        var errorDiv = $('#' + field + 'Error')
        if (!value) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede estar vacío.');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          errorDiv.text('');
        }

        // Agregar evento input para quitar el error cuando el usuario comience a escribir
        $('#' + field).on('input', function() {
          $(this).removeClass('is-invalid');
          errorDiv.text('');
        });
      });
    
      if(isValid){
        if (id === null || id === '') {
          presupuestoActualizado = {
            idDepartamento: idDepartamento,
            idMunicipio: idMunicipio,
            limiteGanadores: limiteGanadores,
            presupuestoDiario: presupuestoDiario,
            valor: valor,
            estado: 1
          };
        } else {
          presupuestoActualizado = {
            id:id,
            idDepartamento: idDepartamento,
            idMunicipio: idMunicipio,
            limiteGanadores: limiteGanadores,
            valor: valor,
            presupuestoDiario: presupuestoDiario,
            estado: 1
          };
        }
        // Agregar el presupuesto actualizado al arreglo etapa.presupuestos
        etapa.presupuestos.push(presupuestoActualizado);
        // Actualizar la tabla de parámetros
        mostrarDatosEdit('#tableLocalidadEdit', etapa);
      
        // Limpiar los inputs después de guardar
        $('#idPresupuesto').val('');
        $('#departamentoEdit').val('');
        $('#municipioEdit').val('');
        $('#limiteGanadorEdit').val('');
        $('#presupuestoEdit').val('');
        $('#presupuestoDiarioEdit').val('');
        presupuestoActualizado={}
      }
    });
    //Funcion asociada
    function editarPremio(id) {
      if (etapa) {
        var premioIndex = etapa.premiocampania.findIndex(function(item) {
          return item.id === id;
        });
    
        if (premioIndex !== -1) {
          var premio = etapa.premiocampania[premioIndex];
    
          // Eliminar el registro del arreglo etapa.premiocampania
          etapa.premiocampania.splice(premioIndex, 1);
    
          // Mostrar los datos del registro seleccionado en los inputs
          $('#idPremio').val(premio.id);
          $('#valorEdit').val(premio.valor);
          $('#linkPremioEdit').val(premio.linkPremio);
          $('#premioEdit').val(premio.idPremio);
          $('#porcentajePremioEdit').val(premio.porcentajePremio);
          $('#tipoPremioEdit').val(premio.tipoPremio);
    
          // Actualizar la tabla de premios
          mostrarDatosEdit('#TablaPremioEdit', etapa);
        }
      }
    }
    
    $('#addPremioEdit').click(function() {
      var id = $('#idPremio').val();
      var tipoPremio = $('#tipoPremioEdit').val();
      var linkPremio = parseInt($('#linkPremioEdit').val());
      var premio = parseInt($('#premioEdit').val());
      var valor = parseFloat($('#valorEdit').val());
      var porcentaje = $('#porcentajePremioEdit').val();
      var premioActualizado = {};

      var fields = ['tipoPremioEdit', 'linkPremioEdit', 'premioEdit', 'valorEdit', 'porcentajePremioEdit'];
      var isValid = true;

      fields.forEach(function(field) {
        var value = $('#' + field).val();
        var errorDiv = $('#' + field + 'Error')
        if (!value) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede estar vacío.');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          errorDiv.text('');
        }

        // Agregar evento input para quitar el error cuando el usuario comience a escribir
        $('#' + field).on('input', function() {
          $(this).removeClass('is-invalid');
          errorDiv.text('');
        });
      });
    
      if(isValid){
        if (id === null || id === '') {
          premioActualizado = {
            idPremio: premio,
            linkPremio: linkPremio,
            tipoPremio: tipoPremio,
            valor: valor,
            porcentajePremio: porcentaje,
            estado: 1
          };
        } else {
          premioActualizado = {
            id: id,
            idPremio: premio,
            linkPremio: linkPremio,
            tipoPremio: tipoPremio,
            valor: valor,
            porcentajePremio: porcentaje,
            estado: 1
          };
        }
        // Agregar el premio actualizado al arreglo etapa.premiocampania
        etapa.premiocampania.push(premioActualizado);
        console.log('premio actualizado', etapa.premiocampania)
        mostrarDatosEdit('#TablaPremioEdit', etapa);
        // Limpiar los inputs después de guardar
        $('#idPremio').val('');
        $('#valorEdit').val('');
        $('#linkPremioEdit').val('');
        $('#premioEdit').val('');
        $('#porcentajePremioEdit').val('');
        $('#tipoPremioEdit').val('')
        premioActualizado={}
      }
    });

    function eliminarParametro(id, etapa) {
      if (etapa) {
        const parametro = etapa.parametros.find(item => item.id === id);
    
        if (parametro) {
          parametro.estado = 0;
          mostrarDatosEdit('#TablaParametrosEdit', etapa);
        }
      }
    }
    
    function eliminarLocalidad(id, etapa) {
      if (etapa) {
        const presupuestoIndex = etapa.presupuestos.findIndex(item => item.id === id);
    
        if (presupuestoIndex !== -1) {
          etapa.presupuestos[presupuestoIndex].estado = 0;
          mostrarDatosEdit('#tableLocalidadEdit', etapa);
        }
      }
    }
    
    function eliminarPremio(id, etapa) {
      console.log('etapa premio', etapa)
      if (etapa) {
        const premioIndex = etapa.premiocampania.findIndex(item => item.id === id);
    
        if (premioIndex !== -1) {
          etapa.premiocampania[premioIndex].estado = 0;
          console.log(etapa.premiocampania, 'estado')
          mostrarDatosEdit('#TablaPremioEdit', etapa);
        }
      }
    }

    function mostrarDatosEdit(tabla, etapa) {

      switch (tabla) {
        case '#tableLocalidadEdit':
          // Filtro
          const presupuestosActivos = etapa.presupuestos.filter(item => item.estado === 1);

          console.log('Presupuestos activos:', presupuestosActivos);

          console.log('depto tabla', dataDeptoView)
          // Limpiar la tabla antes de insertar nuevas filas
          $('#tableLocalidadEdit').DataTable().clear().destroy();
    
          // Inicializar el DataTables con los datos de datosTablaLocalidad
          $('#tableLocalidadEdit').DataTable({
            searching: false,
            paging: false,
            data: presupuestosActivos,
            columns: [
              {
                render: function (data, type, row, meta) {
                  return meta.row + 1;
                },
                width: '5%'
              },
              {
                data: 'idDepartamento',
                render: function (data, type, row) {
                  console.log(dataDeptoView, 'antes del if');
                  if (dataDeptoView.length > 0) {
                    console.log(dataDeptoView,'despues del if')
                    const deptoActual = dataDeptoView.find(depto => depto.id == data);
                    if (deptoActual) {
                      console.log(deptoActual, 'depto')
                      return deptoActual.nombre;
                    }
                  }
                  return 'Departemento no encontrado';
                },
                width: '25%'
              },
              {
                data: 'idMunicipio',
                render: function (data, type, row) {
                  console.log('municipio', dataMunicipiosView)
                  if (dataMunicipiosView.length > 0) {
                    const municipioActual = dataMunicipiosView.find(municipio => municipio.id == data);
                    if (municipioActual) {
                      console.log('encontro id', municipioActual)
                      return municipioActual.nombre;
                    }
                  }
                  return 'Municipio no encontrado';
                },
                width: '25%'
              },
              {
                data: 'limiteGanadores',
                width: '15%'
              },
              {
                data: 'valor',
                width: '15%'
              },
              {
                data: "id",
                render: function (data) {
                  return `<div  style="display: flex; justify-content:space-around">
                    <a href="#" data-id="${data}" class="btn_edit_localidad dropdown-item">
                    ${feather.icons["edit"].toSvg({ class: "font-small-4 mr-50" })} 
                    </a>
                    <a href="#" data-id="${data}" class="btn_delete_localidad dropdown-item">
                      ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} 
                    </a> 
                  </div>`;
                },
                width: '20%'
              }
            ]
          });
          break;
    
        case '#TablaParametrosEdit':
        console.log('entra')
          const parametro = etapa.parametros.filter(item => item.estado == 1);
          // Limpiar la tabla antes de insertar nuevas filas
          $('#TablaParametrosEdit').DataTable().clear().destroy();
    
          // Inicializar el DataTables con los datos de datosTablaParametro
          $('#TablaParametrosEdit').DataTable({
            data: parametro,
            searching: false, // Deshabilitar la funcionalidad de búsqueda
            paging: false,
            columns: [
              {
                render: function (data, type, row, meta) {
                  // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
                  return meta.row + 1;
                },
                width: '5%'
              },
              {
                data: 'idTransaccion',
                render: function (data, type, row) {
                  console.log('transaccion antes de if', datatransaccionView)
                  if (datatransaccionView.length > 0) {
                    console.log('transaccion despues de if', datatransaccionView)
                    const transaccionActual = datatransaccionView.find(transaccion => transaccion.id == data);
                    if (transaccionActual) {
                      return transaccionActual.descripcion;
                    }
                  }
                  return 'Transaccion no encontrado';
                },
                width: '25%'
              },
              { data: 'ValorMinimo', width: '20%' },
              { data: 'ValorMaximo', width: '20%' },
              {
                data: "id",
                render: function (data) {
                  return `<div  style="display: flex; justify-content:space-around">
                    <a href="#" data-id="${data}" class="btn_edit_parametro dropdown-item">
                    ${feather.icons["edit"].toSvg({ class: "font-small-4 mr-50" })} 
                    </a>
                    <a href="#" data-id="${data}" class="btn_delete_parametro dropdown-item">
                      ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} 
                    </a> 
                  </div>`;
                },
                width: '20%'
              }
            ]
          });
          break;
    
        case '#TablaPremioEdit':
          const premiosActivos = etapa.premiocampania.filter(item => item.estado == 1);
          // Limpiar la tabla antes de insertar nuevas filas
          $('#TablaPremioEdit').DataTable().clear().destroy();
    
          // Inicializar el DataTables con los datos de datosTablaLocalidad
          $('#TablaPremioEdit').DataTable({
            searching: false, // Deshabilitar la funcionalidad de búsqueda
            paging: false,
            data: premiosActivos,
            columns: [
              {
                render: function (data, type, row, meta) {
                  // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
                  return meta.row + 1;
                },
                width: '5%'
              },
              {
                data: 'idPremio',
                render: function (data) {
                  var premio = $('#premioEdit option[value="' + data + '"]').text();
                  return premio;
                },
                width: '30%'
              },
              { data: 'valor', width: '30%' },
              {
                data: 'linkPremio',
                render: function (data) {
                  return data === 1 ? 'Sí' : 'No';
                },
                width: '20%'
              },
              {
                data: "id",
                render: function (data) {
                  return `<div style="display: flex; justify-content:space-around">
                    <a href="#" data-id="${data}" class="btn_edit_premio dropdown-item">
                      ${feather.icons["edit"].toSvg({ class: "font-small-4 mr-50" })} 
                    </a>
                    <a href="#" data-id="${data}" class="btn_delete_premio dropdown-item">
                      ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} 
                    </a> 
                  </div>`;
                },
                width: '20%'
              }
            ]
          });
          break;
    
        default:
          break;
      }
    }
  }
 
}


// Modificar la función getEtapasData para recorrer el objeto de etapas
function getEtapasData() {
    const etapas = DataEtapa.map((stepData) => {
    return {
      ...stepData.etapa[0],
      parametros: stepData.parametros || [],
      presupuesto: stepData.presupuesto || [],
      premio: stepData.premio || []
    };
  });

  return etapas;
}


function previewImageEdit(event, textImg, textContent) {
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

      // Leer el archivo y convertirlo a base64
      const file = input.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      const reader2 = new FileReader();
      reader2.onload = event => {
        if (textImg === 'previewImgEdit') {
          imgPushEdit = `data:image/${fileExtension};base64,${btoa(event.target.result)}`;
        } else if (textImg === 'previewNotificacionEdit') {
          imgAkisiEdit = `data:image/${fileExtension};base64,${btoa(event.target.result)}`;
        }
      };
      reader2.readAsBinaryString(file);
    } else {
      preview.src = '#';
      preview.style.display = 'none';
      imgCampania.style.display = 'block';
    }

    // Agregar evento de clic al preview
    preview.parentElement.addEventListener('click', function() {
      input.click();
    });
  } else {
    console.error('Elemento con ID ' + textContent + ' no encontrado en el documento.');
  }
}


// Función para agregar datos a la tabla y al arreglo
$('#addBloqueo').click(function(){
  var usuarioBloqueo = $('#usuarioBloqueo').val();

  if(usuarioBloqueo){
    var block ={
      numero: usuarioBloqueo
    }

    bloqueadosUsuarios.push(block);
    $('#usuarioBloqueo').val("");
  }
});

$('#addBloqueoEdit').click(function() {
  var usuarioBloqueo = $('#usuarioBloqueoEdit').val();

  if (usuarioBloqueo) {
    var usuarioBloqueadoExistente = bloqueadosUsuarios.find(item => item.numero === usuarioBloqueo);

    if (usuarioBloqueadoExistente) {
      usuarioBloqueadoExistente.estado = 1; // Actualizar el estado a 1 si el usuario ya existe
    } else {
      var nuevoBloqueo = {
        numero: usuarioBloqueo,
        estado: 1 // Asignar estado 1 a los nuevos usuarios bloqueados
      };
      bloqueadosUsuarios.push(nuevoBloqueo);
    }

    $('#usuarioBloqueoEdit').val("");
    mostrarDatosTabla("#tablaBloqueoEdit");
  }
});

// Función para cargar usuarios bloqueados desde un archivo XLSX
$('#Archivo').change(function(e) {
  var inputFile = e.target;
  var extPermitidas = /(.xlsx)$/;
  var restriccion = $('#restriccionUsuarios').val();

  if (!extPermitidas.exec(inputFile.value)) {
    Alert("El archivo debe ser un excel", "error");
    inputFile.value = "";
  } else {

    if(restriccion === 1 || restriccion === '1'){

      readXlsxFile(inputFile.files[0]).then(function(data) {
        data.map((row, indexP) => {
          var permitido = {
            numero: row[0],
            estado: 1
          };

          permitidoUsuario.push(permitido);
        });
        console.log(permitidoUsuario);
      });
    }else if(restriccion === 2 || restriccion === '2'){

      readXlsxFile(inputFile.files[0]).then(function(data) {
        data.map((row, indexP) => {
          var block = {
            numero: row[0],
            estado: 1
          };

          bloqueadosUsuarios.push(block);
        });

      });
    }else{
      bloqueadosUsuarios=[];
      permitidoUsuario =[];
    }
  }
});

$('#CrearEtapaBtn').click(function(e){
  e.preventDefault();
  const containerEtapa = document.getElementById('CrearEtapa');
  containerEtapa.style.display = 'block';
})

$('#mostrar').click(function(){
  mostrarDatosTabla('#tablaBloqueo');
});

$('#mostrarEdit').click(function(){
  mostrarDatosTabla('#tablaBloqueoEdit');
})

function mostrarDatosTabla(tabla) {

  switch(tabla)
  {
    case '#TablaEtapa':
        // Limpiar la tabla antes de insertar nuevas filas
      $('#TablaEtapa').DataTable().clear().destroy();
      var row =-1;
      // Inicializar el DataTables con los datos de datosTablaLocalidad
      $('#TablaEtapa').DataTable({
        searching: false, // Deshabilitar la funcionalidad de búsqueda
        paging: false,
        data: DataEtapa,
        columns: [
          {
            render: function(data, type, row, meta) {
            // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
            return meta.row + 1;
            }
          },
          {  
            data: null,
            render: function(data, type, row, meta) {
              if (data.etapa && data.etapa.length > 0) {
                var nombres = data.etapa.map(function(etapa) {
                  return etapa.nombre;
                });
                return nombres.join(', ');
              }
              return '';
            }
          },
          {  
            data: null,
            render: function(data, type, row, meta) {
              if (data.etapa && data.etapa.length > 0) {
                var descripciones = data.etapa.map(function(etapa) {
                  return etapa.descripcion;
                });
                return descripciones.join(', ');
              }
              return '';
            }
          },
          {
            render: function(data, type, row, meta) {
              var opcDelete = `
                <a href="#" class="dropdown-item" onclick="eliminarDato('${tabla}', ${meta.row})">
                  ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })} Eliminar
                </a>
              `;
              return opcDelete;
            }
          }
        ]
    });


    case '#tablaBloqueo':
        // Limpiar la tabla antes de insertar nuevas filas
        $('#tablaBloqueo').DataTable().clear().destroy();

        // Inicializar el DataTables con los datos de datosTablaLocalidad
        $('#tablaBloqueo').DataTable({
          searching: false, // Deshabilitar la funcionalidad de búsqueda
          paging: false,
          data: bloqueadosUsuarios,
          columns: [
            {
              render: function(data, type, row, meta) {
                // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
                return meta.row + 1;
              }
            },
            { data: 'numero' },
            {
              render: function(data, type, row, meta) {
                var opcDelete = `
                  <a href="#" class="dropdown-item" onclick="eliminarDato('${tabla}', ${meta.row}, event)">
                    ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })} Eliminar
                  </a>
                `;
                return opcDelete;
              }
            }
          ]
        });
    break;

    case '#TablaEtapaEdit':
      // Limpiar la tabla antes de insertar nuevas filas
      $('#TablaEtapaEdit').DataTable().clear().destroy();
        console.log('esta aqui')
      // Inicializar el DataTables con los datos de dataEditEtapa
      $('#TablaEtapaEdit').DataTable({
        searching: false,
        paging: false,
        data: dataEditEtapa,
        columns: [
          {
            render: function (data, type, row, meta) {
              return meta.row + 1;
            }
          },
          { data: 'nombre' },
          { data: 'descripcion' },
          {
            data: "id",
            render: function (data) {
              return '<div class="btn-group">' +
                '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                '</a>' +
                '<div class="dropdown-menu dropdown-menu-right">' +
                '<a href="#" data-id="' + data + '" class="btn_edit dropdown-item">' +
                feather.icons['edit'].toSvg({ class: 'font-small-4 mr-50' }) + ' Actualizar' +
                '</a>' +
                '<a href="#" onclick="OpenDelete(' + data + ')" class="btn_delete dropdown-item">' +
                feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) + ' Inhabilitar' +
                '</a>' +
                '</div>' +
                '</div>';
            }
          }
        ]
      });
    break;


    case '#tablaBloqueoEdit':
    // Limpiar la tabla antes de insertar nuevas filas
    $('#tablaBloqueoEdit').DataTable().clear().destroy();

     // Filtrar los usuarios bloqueados con estado 1
     const usuariosBloqueadosActivos = bloqueadosUsuarios.filter(item => item.estado === 1);

    // Inicializar el DataTables con los datos de datosTablaLocalidad
    $('#tablaBloqueoEdit').DataTable({
      searching: false, // Deshabilitar la funcionalidad de búsqueda
      paging: false,
      data: usuariosBloqueadosActivos,
      columns: [
        {
          render: function(data, type, row, meta) {
            // Aquí puedes usar `meta.row` para obtener el índice de la fila actual
            return meta.row + 1;
          }
        },
        { data: 'numero' },
        {
          render: function(data, type, row, meta) {
            var opcDelete = `
              <a href="#" class="dropdown-item" onclick="eliminarBloqueoEdit(${meta.row}, event)">
                ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })} Eliminar
              </a>
            `;
            return opcDelete;
          }
        }
      ]
    });
    break;


      default:
      break;
  }


}

function eliminarBloqueoEdit(index, event){
  event.preventDefault();
  bloqueadosUsuarios[index].estado = 0; 
  mostrarDatosTabla('#tablaBloqueoEdit'); 
}

function eliminarDato(tabla, index, event) {
  event.preventDefault();
  console.log('tabla:', tabla, 'row', index)
  switch (tabla) {
    case '#tablaBloqueo':
      bloqueadosUsuarios.splice(index, 1);
      break;
    case '#TablaEtapa':
      TEMP.splice(index, 1);
      break;
    case '#TablaEtapaEdit':
      dataEditEtapa.splice(index, 1);
      mostrarDatosTabla(tabla);
      break;
    default:
      break;
  }

  // Retrasar la llamada a mostrarDatosTabla para que ocurra después de que se complete la operación de eliminación
  setTimeout(function() {
    mostrarDatosTabla(tabla);
  }, 0);
}

function previewImage(event, previewId, requerimientosId) {
  const input = event.target;
  const preview = document.getElementById(previewId);
  const requerimientos = document.getElementById(requerimientosId);

  if (preview && requerimientos) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        requerimientos.style.display = 'none';
      }

      reader.readAsDataURL(input.files[0]);

      // Leer el archivo y convertirlo a base64
      const file = input.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      const reader2 = new FileReader();
      reader2.onload = event => {
        if (previewId === 'previewImg') {
          imgPush = `data:image/${fileExtension};base64,${btoa(event.target.result)}`;
        } else if (previewId === 'previewNotificacion') {
          imgAkisi = `data:image/${fileExtension};base64,${btoa(event.target.result)}`;
        }
      };
      reader2.readAsBinaryString(file);
    } else {
      preview.src = '#';
      preview.style.display = 'none';
      requerimientos.style.display = 'block';
    }

    // Agregar evento de clic al contenedor del preview
    preview.parentElement.addEventListener('click', function() {
      input.click();
    });
  } else {
    console.error('Elemento con ID ' + previewId + ' o ' + requerimientosId + ' no encontrado en el documento.');
  }
}

function userValidator(event, container) {
  const input = event.target;
  const containerArchivo = document.getElementById(container);
  let containerBloqueo;

  if (container === 'containerArchivo') {
    containerBloqueo = document.getElementById('Bloqueo');
  } else if (container === 'containerArchivoEdit') {
    containerBloqueo = document.getElementById('BloqueoEdit');
  }

  if (containerArchivo && containerBloqueo) {
    if (input.value === '0' || input.value === 0 || input.value === null) {
      containerArchivo.style.display = 'none';
      containerBloqueo.style.display = 'none';
      
      if (container === 'containerArchivo') {
        $('#Archivo').val('');
      } else if (container === 'containerArchivoEdit') {
        $('#ArchivoEdit').val('');
      }
    } else {
      containerArchivo.style.display = 'block';
      
      if (input.value === 2 || input.value === '2') {
        containerBloqueo.style.display = 'block';
      } else {
        containerBloqueo.style.display = 'none';
      }
      
      if (container === 'containerArchivo') {
        $('#Archivo').val('');
      } else if (container === 'containerArchivoEdit') {
        $('#ArchivoEdit').val('');
      }
    }
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

  $('#proyecto').html('<option value="0" selected disabled>Selecciona una Opcion</option>');
  fetch(`${url}projects`, requestOptions)
    .then(response => response.json())
    .then(result =>{
      result.forEach(element => {
        var opc  = `<option value="${element.id}">${element.descripcion}</option>`;
        $('#proyecto').append(opc);
        $('#proyectoEdit').append(opc);
      });
    })
}

const getDepartamento = () => {
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: { "Authorization": token }
    };

    fetch(`${url}Departamento`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        return response.json();
      })
      .then(result => {
        // Vaciar el select antes de agregar las nuevas opciones
        $('#departamento').empty();
        $('#departamentoEdit').empty();

        // Agregar la opción por defecto
        $('#departamento').append('<option value="" selected disabled>Selecciona una opción</option>');
        $('#departamentoEdit').append('<option value="" selected disabled>Selecciona una opción</option>');

        // Agregar las opciones de los departamentos
        result.forEach(element => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $('#departamento').append(opc);
          $('#departamentoEdit').append(opc);
        });

        dataDeptoView = result;
               
        console.log('Departamentos obtenidos:', dataDeptoView);

        // Verificar si los elementos existen antes de asignar los event listeners
        var selectDepartamento = document.getElementById('departamento');
        var selectDepartamentoEdit = document.getElementById('departamentoEdit');

        if (selectDepartamento) {
          selectDepartamento.addEventListener('change', function() {
            var selectedId = this.value;
            getMunicipioByDepto(selectedId);
          });
        }

        if (selectDepartamentoEdit) {
          selectDepartamentoEdit.addEventListener('change', function() {
            var selectedId = this.value;
            getMunicipioByDepto(selectedId);
          });
        }

        // Resolver la promesa
        resolve();
      })
      .catch(error => {
        console.error('Error al obtener los departamentos:', error);
        reject(error);
      });
  });
};

//Funcion para traer municipios segun el departamento
const getMunicipioByDepto = (idDepartamento) => {
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: { "Authorization": token }
    };

    // Eliminar todas las opciones del select #municipio y #municipioEdit excepto la opción seleccionada por defecto
    $('#municipio option:not(:disabled)').remove();
    $('#municipioEdit option:not(:disabled)').remove();

    fetch(`${url}Municipio/by/${idDepartamento}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        // Agregar las nuevas opciones de municipios
        result.forEach(element => {
          var opc = `<option value="${element.id}">${element.nombre}</option>`;
          $('#municipio').append(opc);
          $('#municipioEdit').append(opc);
        });
        resolve();
      })
      .catch(err => {
        console.log('error', err);
        reject(err);
      });
  });
};

const getTransaccion = () => {
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: {"Authorization": token}
    };

    fetch(`${url}Transaccion`, requestOptions)
      .then(response => response.json())
      .then(result => {
        datatransaccionView = result;
        // Verificar si result es un array antes de iterar
        if (Array.isArray(result)) {
          result.forEach(element => {
            var opc = `<option value="${element.id}">${element.descripcion}</option>`;
            $('#transaccion').append(opc);
            $('#transaccionEdit').append(opc);
          });
        } else {
          console.warn('La respuesta no es un array:', result);
        }
        resolve(); // Resuelve la promesa cuando los datos se hayan cargado
      })
      .catch(error => {
        console.log('error', error);
        reject(error); // Rechaza la promesa en caso de error
      });
  });
};

//Funcion para traer los Premios
const getPremio = () => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Premio`, requestOptions)
    .then(response => response.json())
    .then(result => {
      dataPremioView = result;
      // Verificar si result es un array antes de iterar
      if (Array.isArray(result)) {
        result.forEach(element => {
          var opc = `<option value="${element.id}">${element.descripcion}</option>`;
          $('#premio').append(opc);
          $('#premioEdit').append(opc);
        });
      } else {
        console.warn('La respuesta no es un array:', result);
      }
    })
    .catch(error => console.log('error', error));
};

//Funcion para traer municipios
const getMunicipios = () => {
  var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: {"Authorization": token}
  };

  //$('#').html('<option value="0" selected disabled>Selecciona una Opcion</option>');
  fetch(`${url}Municipio`, requestOptions)
      .then(response => response.json())
      .then(result => {
        dataMunicipiosView = result;
        console.log('municipios', dataMunicipiosView)
      })
      .catch(error => console.log('error', error));

}

//validacion de inputs
function validarCamposStep(stepIndex) {
  var config = `step${stepIndex+1}`;
  console.log(config,'vuelta', stepIndex)

  switch(config){
    case 'step1':{
      var fields = ['imgCampania', 'imgNotificacion', 'restriccionUsuarios', 'proyecto', 'tercerosCampania'];
      var isValid = true;
      
      fields.forEach(function(field) {
        var value = $('#' + field).val();
        var errorDiv = $('#' + field + 'Error');
        if (!value) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede estar vacío.');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          errorDiv.text('');
        }
        
        // Agregar evento input para quitar el error cuando el usuario comience a escribir
        $('#' + field).on('input', function() {
          $(this).removeClass('is-invalid');
          errorDiv.text('');
        });
      });
      
      var restriccion = $('#restriccionUsuarios').val();
      var Archivo = $('#Archivo')[0].files;
      var errorArchivo = $('#ArchivoError');
      var errorRestriccion = $('#restriccionUsuariosError');
      
      if (restriccion === '2' && Archivo.length === 0) {
        $('#restriccionUsuarios').addClass('is-invalid');
        $('#Archivo').addClass('is-invalid');
        errorArchivo.text('Ingrese los numeros a bloquear para esta campaña.');
        errorRestriccion.text('Ingrese los numeros a bloquear para esta campaña.');
        isValid = false;
      } else if (restriccion === '1' && Archivo.length === 0) {
        $('#restriccionUsuarios').addClass('is-invalid');
        $('#Archivo').addClass('is-invalid');
        errorArchivo.text('Ingrese los numeros que participaran para esta campaña.');
        errorRestriccion.text('Ingrese los numeros que participaran para esta campaña.');
        isValid = false;
      } 
      
      return isValid;
    }

    case 'step2':{
      var fields = [
        'campania',
        'notificacion',
        'descripcionCampania',
        'descripcionNotificacion',
        'Observaciones',
        'terminosCondiciones',
        'fechaRegistro',
        'usuarioPermitido',
        'fechaInicial',
        'fechaFinal',
        'edadInicial',
        'edadFinal',
        'tipoUsuarios',
        'sexo',
        'maximoParticipantes'
      ];

      var isValid = true;

      fields.forEach(function(field) {
        var value = $('#' + field).val();
        var errorDiv = $('#' + field + 'Error');

        // Validar que no haya números negativos
        if (/^-\d+/.test(value)) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede contener números negativos.');
          isValid = false;
        }
        // Validar que no haya espacios en blanco al inicio o que solo sean espacios en blanco
        else if (/^(\s+|\s+$)/.test(value)) {
          if ($('#' + field).attr('type') !== 'textarea') {
            $('#' + field).addClass('is-invalid');
            errorDiv.text('Este campo no puede comenzar o contener solo espacios en blanco.');
            isValid = false;
          }
        }
        // Validar que no haya caracteres especiales (excepto para fechas, texto y "_", ".", ",")
        else if (/[^a-zA-ZñÑ0-9\/\-\:\s\n\r_.,]/g.test(value)) {
          if ($('#' + field).attr('type') !== 'date' && $('#' + field).attr('type') !== 'textarea') {
            $('#' + field).addClass('is-invalid');
            errorDiv.text('Este campo no puede contener caracteres especiales.');
            isValid = false;
          }
        }
        else if (!value) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede estar vacío.');
          isValid = false;
        } else {
          $('#' + field).removeClass('is-invalid');
          errorDiv.text('');
        }

        // Agregar evento input para quitar el error cuando el usuario comience a escribir
        $('#' + field).on('input', function() {
          $(this).removeClass('is-invalid');
          errorDiv.text('');
        });
      });

      //Validar que la edad inicial no sea menor a la edad final
      var edadInicial = parseInt($('#edadInicial').val());
      var edadFinal = parseInt($('#edadFinal').val());
      var errorEdadIni = $('#edadInicialError');
      var errorEdadFin = $('#edadFinalError');

      if (edadInicial > edadFinal) {
        $('#edadInicial').addClass('is-invalid');
        $('#edadFinal').addClass('is-invalid');
        errorEdadIni.text('La edad inicial debe ser menor a la edad final.');
        errorEdadFin.text('La edad inicial debe ser menor a la edad final.');

        isValid = false;
      }
      
      if(edadInicial >= 100){
        $('#edadInicial').addClass('is-invalid');
        errorEdadIni.text('La edad inicial no puede ser mayor a 100 años.');
        isValid = false;
      }else if(edadInicial < 18){
        $('#edadInicial').addClass('is-invalid');
        errorEdadIni.text('La edad inicial no puede ser menor a 18 años.');
        isValid = false;
      }
      
      if(edadFinal >= 100){
        $('#edadFinal').addClass('is-invalid');
        errorEdadFin.text('La edad final no puede ser mayor a 100 años.');
        isValid = false;
      }else if(edadFinal < 18){
        $('#edadFinal').addClass('is-invalid');
        errorEdadFin.text('La edad final no puede ser menor a 18 años.');
        isValid = false;
      }

      // Validar que la fecha inicial no sea mayor que la fecha fin
      var fechaInicial = new Date($('#fechaInicial').val());
      var fechaFinal = new Date($('#fechaFinal').val());
      var errorfechaIni = $('#fechaInicialError');
      var errorfechaFinal = $('#fechaFinalError');
      if (fechaInicial > fechaFinal) {
        $('#fechaInicial').addClass('is-invalid');
        $('#fechaFinal').addClass('is-invalid');
        errorfechaIni.text('Fecha inicial debe ser menor a fecha fin.');
        errorfechaFinal.text('Fecha inicial debe ser menor a fecha fin.');

        isValid = false;
      }

      return isValid;
    }
    case 'step3':{
      var fields = [
        'NombreEtapa',
        'orden',
        'descripcionEtapa',
        'tipoParticipacion',
        'intervalo',
        'intervaloSemanal',
        'intervaloMensual',
      ];
      var isValid = true;
    
      // No se realiza ninguna validación si DataEtapa está vacío
      if(DataEtapa.length == 0){
        isValid = true;
      }
    
      fields.forEach(function(field) {
        var value = $('#' + field).val();
        var errorDiv = $('#' + field + 'Error');
    
        // Console log para verificar que se está ejecutando la validación
        console.log("Validando campo:", field, "con valor:", value);
    
        // Validar que no haya números negativos
        if (/^-\d+/.test(value)) {
          $('#' + field).addClass('is-invalid');
          errorDiv.text('Este campo no puede contener números negativos.');
          isValid = false;
        }
        // Validar que no haya espacios en blanco al inicio o que solo sean espacios en blanco
        else if (/^(\s+|\s+$)/.test(value)) {
          if ($('#' + field).attr('type') !== 'textarea') {
            $('#' + field).addClass('is-invalid');
            errorDiv.text('Este campo no puede comenzar o contener solo espacios en blanco.');
            isValid = false;
          }
        }
        // Validar que no haya caracteres especiales (excepto para fechas, texto y "_", ".", ",")
        else if (/[^a-zA-ZñÑ0-9\/\-\:\s\n\r_.,]/g.test(value)) {
          if ($('#' + field).attr('type') !== 'date' && $('#' + field).attr('type') !== 'textarea') {
            $('#' + field).addClass('is-invalid');
            errorDiv.text('Este campo no puede contener caracteres especiales.');
            isValid = false;
          }
        } else {
          $('#' + field).removeClass('is-invalid');
          errorDiv.text('');
        }
    
        // Agregar evento input para quitar el error cuando el usuario comience a escribir
        $('#' + field).on('input', function() {
          $(this).removeClass('is-invalid');
          errorDiv.text('');
        });
      });
    
      return isValid;
    }
  }


}

function limpiarFormulario() {
 
  // Limpiar los steps y reiniciar los datos relacionados
  resetSteps();
  resetStepsEdit();
  $('#campania').val('');
  $('#descripcionCampania').val('');
  $('#fechaRegistro').val('');
  $('#fechaInicial').val('');
  $('#fechaFinal').val('');
  $('#HoraRecordatorio').val('');
  $('#correo').val('');
  $('#edadInicial').val('');
  $('#edadFinal').val('');
  $('#sexo').val('');
  $('#tipoUsuarios').val('');
  $('#notificacion').val('');
  $('#descripcionNotificacion').val('');
  $('#imgCampania').val('');
  $('#imgNotificacion').val('');
  $('#maximoParticipantes').val('');
  $('#tercerosCampania').val('');
  $('#allday').prop('checked', false);
  $('#repeat').prop('checked', false);
  $('#FechaIniRecordatorio').val('');
  $('#FechaFinRecordatorio').val('');
  $('#terminosCondiciones').val('');
  $('#Observaciones').val('');
  $('#proyecto').val('');
  $('#restriccionUsuarios').val('');
  $('#Archivo').val('');
  $('#usuarioBloqueo').val('');

  // Limpiar las imágenes
  imgPush = null;
  imgAkisi = null;
  imgPushEdit = null;
  imgAkisiEdit = null;

  // Limpiar las previews de las imágenes
  $('#previewImg').attr('src', '').hide();
  $('#requerimientos').show();
  $('#previewNotificacion').attr('src', '').hide();
  $('#requerimientosNotificacion').show();
  $('#previewImgEdit').attr('src', '').hide();
  $('#requerimientosEdit').show();
  $('#previewNotificacionEdit').attr('src', '').hide();
  $('#requerimientosNotificacionEdit').show();
  

  // Limpiar las tablas
  $('#TablaEtapa').DataTable().clear().destroy();
  $('#tablaBloqueo').DataTable().clear().destroy();
  $('#formNew').trigger("reset");

  $('#campaniaEdit').val('');
  $('#descripcionCampaniaEdit').val('');
  $('#fechaRegistroEdit').val('');
  $('#fechaInicialEdit').val('');
  $('#fechaFinalEdit').val('');
  $('#HoraRecordatorioEdit').val('');
  $('#correoEdit').val('');
  $('#edadInicialEdit').val('');
  $('#edadFinalEdit').val('');
  $('#sexoEdit').val('');
  $('#tipoUsuariosEdit').val('');
  $('#notificacionEdit').val('');
  $('#descripcionNotificacionEdit').val('');
  $('#imgCampaniaEdit').val('');
  $('#imgNotificacionEdit').val('');
  $('#maximoParticipantesEdit').val('');
  $('#tercerosCampaniaEdit').val('');
  $('#alldayEdit').prop('checked', false);
  $('#repeatEdit').prop('checked', false);
  $('#FechaIniRecordatorioEdit').val('');
  $('#FechaFinRecordatorioEdit').val('');
  $('#terminosCondicionesEdit').val('');
  $('#ObservacionesEdit').val('');
  $('#proyectoEdit').val('');
  $('#restriccionUsuariosEdit').val('');
  $('#ArchivoEdit').val('');
  $('#usuarioBloqueoEdit').val('');

  // Limpiar las tablas
  $('#TablaEtapaEdit').DataTable().clear().destroy();
  $('#tablaBloqueoEdit').DataTable().clear().destroy();

  // Limpiar los arreglos
  // TEMP = [];
  // DataEtapa = [];
  // bloqueadosUsuarios = [];
  // dataEditEtapa=[]

    saveDataParams = [];
    // Arreglo para almacenar los datos guardados de la tabla
    // datosTablaLocalidad = [];
    // datosTablaPremio = [];
    // datosTablaParametro = [];
    // datosTablaParticipacion= [];
    //permitidoUsuario =[];

    // datosBloqueados = [];
    TEMP =[];
    etapasData=[]
    //variables de imagenes
    //bloqueadosUsuarios =[];
    DataEtapa =[];
    nombresMunicipios = {};

    //data edit
    dataMunicipiosView=[]
    dataDeptoView=[]
    dataPremioView=[]
    datatransaccionView=[]

}


function resetSteps() {
  // Reiniciar los stepps
  actualStep = 0;
  var steps = $('#stepper .step');
  steps.hide();
  
  // Limpiar los arreglos y datos relacionados con los steps
  TEMP = [];
  DataEtapa = [];
  bloqueadosUsuarios = [];
  permitidoUsuario = [];
  datosTablaLocalidad = [];
  datosTablaPremio = [];
  datosTablaParametro = [];
  nombresMunicipios = {};

  // Limpiar las tablas relacionadas con los steps
  $('#TablaEtapa').DataTable().clear().destroy();
  $('#tablaBloqueo').DataTable().clear().destroy();

  // Mostrar el primer step después de una pequeña pausa
  setTimeout(function() {
    steps.first().show();
    $('.step-progress').removeClass('active');
    $('.step-btn-1').addClass('active');
    $('.step-progress').removeClass('disabled').prop('disabled', false);
  }, 100);
}

function resetStepsEdit() {
  // Reiniciar los stepps
  actualStepEdit = 0;
  var stepsEdits = $('#stepperEdit .step');
  stepsEdits.hide();

  // Limpiar los arreglos y datos relacionados con los steps de edición
  dataEditEtapa = [];


  // Reiniciar las variables relacionadas con los pasos
  totalStepsEdits = 0; // Inicializar totalStepsEdits a 0
  previousStep = null; // Reiniciar previousStep a null

  // Limpiar las tablas relacionadas con los steps de edición
  $('#TablaEtapaEdit').DataTable().clear().destroy();
  $('#tablaBloqueoEdit').DataTable().clear().destroy();

  // Eliminar los steps adicionales
  $('#stepperEdit .step:not(:first)').remove();

  // Mostrar el primer step
  stepsEdits.first().show();
  $('.step-progressEdit').removeClass('active');
  $('.step-btn-1-edit').addClass('active');
  $('.step-progressEdit').removeClass('disabled').prop('disabled', false);
}


//limpiar el form
function limpiarFormulario() {
 
  // Limpiar los steps y reiniciar los datos relacionados
  resetSteps();
  resetStepsEdit();
  $('#campania').val('');
  $('#descripcionCampania').val('');
  $('#fechaRegistro').val('');
  $('#fechaInicial').val('');
  $('#fechaFinal').val('');
  $('#HoraRecordatorio').val('');
  $('#correo').val('');
  $('#edadInicial').val('');
  $('#edadFinal').val('');
  $('#sexo').val('');
  $('#tipoUsuarios').val('');
  $('#notificacion').val('');
  $('#descripcionNotificacion').val('');
  $('#imgCampania').val('');
  $('#imgNotificacion').val('');
  $('#maximoParticipantes').val('');
  $('#tercerosCampania').val('');
  $('#allday').prop('checked', false);
  $('#repeat').prop('checked', false);
  $('#FechaIniRecordatorio').val('');
  $('#FechaFinRecordatorio').val('');
  $('#terminosCondiciones').val('');
  $('#Observaciones').val('');
  $('#proyecto').val('');
  $('#restriccionUsuarios').val('');
  $('#Archivo').val('');
  $('#usuarioBloqueo').val('');

  // Limpiar las imágenes
  imgPush = null;
  imgAkisi = null;
  imgPushEdit = null;
  imgAkisiEdit = null;

  // Limpiar las previews de las imágenes
  $('#previewImg').attr('src', '').hide();
  $('#requerimientos').show();
  $('#previewNotificacion').attr('src', '').hide();
  $('#requerimientosNotificacion').show();
  $('#previewImgEdit').attr('src', '').hide();
  $('#requerimientosEdit').show();
  $('#previewNotificacionEdit').attr('src', '').hide();
  $('#requerimientosNotificacionEdit').show();
  $('#requerimientosNotificacionEdit').show();
  

  // Limpiar las tablas
  $('#TablaEtapa').DataTable().clear().destroy();
  $('#tablaBloqueo').DataTable().clear().destroy();
  $('#formNew').trigger("reset");

  $('#campaniaEdit').val('');
  $('#descripcionCampaniaEdit').val('');
  $('#fechaRegistroEdit').val('');
  $('#fechaInicialEdit').val('');
  $('#fechaFinalEdit').val('');
  $('#HoraRecordatorioEdit').val('');
  $('#correoEdit').val('');
  $('#edadInicialEdit').val('');
  $('#edadFinalEdit').val('');
  $('#sexoEdit').val('');
  $('#tipoUsuariosEdit').val('');
  $('#notificacionEdit').val('');
  $('#descripcionNotificacionEdit').val('');
  $('#imgCampaniaEdit').val('');
  $('#imgNotificacionEdit').val('');
  $('#maximoParticipantesEdit').val('');
  $('#tercerosCampaniaEdit').val('');
  $('#alldayEdit').prop('checked', false);
  $('#repeatEdit').prop('checked', false);
  $('#FechaIniRecordatorioEdit').val('');
  $('#FechaFinRecordatorioEdit').val('');
  $('#terminosCondicionesEdit').val('');
  $('#ObservacionesEdit').val('');
  $('#proyectoEdit').val('');
  $('#restriccionUsuariosEdit').val('');
  $('#ArchivoEdit').val('');
  $('#usuarioBloqueoEdit').val('');

  // Limpiar las tablas
  $('#TablaEtapaEdit').DataTable().clear().destroy();
  $('#tablaBloqueoEdit').DataTable().clear().destroy();

  // Limpiar los arreglos
  // TEMP = [];
  // DataEtapa = [];
  // bloqueadosUsuarios = [];
  // dataEditEtapa=[]

    saveDataParams = [];
    // Arreglo para almacenar los datos guardados de la tabla
    // datosTablaLocalidad = [];
    // datosTablaPremio = [];
    // datosTablaParametro = [];
    // datosTablaParticipacion= [];
    permitidoUsuario =[];

    // datosBloqueados = [];
    TEMP =[];
    etapasData=[]
    //variables de imagenes
    bloqueadosUsuarios =[];
    DataEtapa =[];
    nombresMunicipios = {};

    //data edit
    dataMunicipiosView=[]
    dataDeptoView=[]
    dataPremioView=[]
    datatransaccionView=[]

}

const OpenEdit = (id) => {
  bloqueadosUsuarios = [];
  permitidoUsuario = [];
  dataEditEtapa = [];
  limpiarFormulario();
  resetStepsEdit(); // Agregar esta línea para reiniciar los pasos correctamente

  // Ocultar el contenido del modal y mostrar el spinner
  $('#modalEdit .modal-body').css('opacity', '0.5');
  $('#modalEdit .spinner-container').show();

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {"Authorization": token}
  };

  fetch(`${url}Campania/${id}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      // Mostrar manualmente el primer paso
      var stepsEdits = $('#stepperEdit').children();
      stepsEdits.hide();
      stepsEdits.eq(0).show();

      // Ocultar el spinner y mostrar el contenido del modal
      $('#modalEdit .modal-body').css('opacity', '1');
      $('#modalEdit .spinner-container').hide();

      // Mostrar el modal solo si los datos han sido cargados
      if (isDataLoaded) {
        $('#modalEdit').modal('show');
      }

      // Asignar los datos del registro a los campos del formulario
      $('#idCampania').val(id);
      $('#campaniaEdit').val(result.nombre);
      $('#descripcionCampaniaEdit').val(result.descripcion);
      $('#fechaRegistroEdit').val(result.fechaRegistro);
      $('#fechaInicialEdit').val(result.fechaInicio);
      $('#fechaFinalEdit').val(result.fechaFin);
      $('#fechaCreacion').val(result.fechaCreacion);
      $('#edadInicialEdit').val(result.edadInicial);
      $('#edadFinalEdit').val(result.edadFinal);
      $('#sexoEdit').val(result.sexo);
      $('#tipoUsuariosEdit').val(result.tipoUsuario);
      $('#notificacionEdit').val(result.tituloNotificacion);
      $('#descripcionNotificacionEdit').val(result.descripcionNotificacion);
      $('#estadoCampania').val(result.estado);

      // Llamar a la función userValidator con el valor de restriccionUsuarios
      const event = {
        target: document.getElementById('restriccionUsuariosEdit')
      };
      userValidator(event, 'containerArchivoEdit');

      $('#maximoParticipantesEdit').val(result.maximoParticipaciones);
      $('#tercerosCampaniaEdit').val(result.campaniaTerceros);
      $('#esArchivadaEdit').prop('checked', result.esArchivada === 1);
      $('#terminosCondicionesEdit').val(result.terminosCondiciones);
      $('#ObservacionesEdit').val(result.observaciones);
      $('#proyectoEdit').val(result.idProyecto);
      $('#restriccionUsuariosEdit').val(result.restriccionUser);

      bloqueadosUsuarios = result.bloqueados;
      permitidoUsuario = result.participantes;
      dataEditEtapa = result.etapas;
      console.log(dataEditEtapa, "asignacion");

      // Mostrar las etapas en la tabla
      mostrarDatosTabla("#TablaEtapaEdit");
      console.log('Resultados', result);
    })
    .catch(error => {
      console.log('error', error);
      $('#modalEdit .modal-body').css('opacity', '1');
      $('#modalEdit .spinner-container').hide();
    });
};

const OpenDelete = (id) =>{
  limpiarFormulario();
  console.log(id, 'idDelete')
  $('#idDelete').val(id);
  $('#modalDelete').modal('toggle');
}

//actualiza y pausa una campaña
const pausarActualizarCampania = (id, type) => {
  console.log('type', type)
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(
    `${url}Campania/${type == 1 ? "activar" : "pausar"}/${id}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        getAllCampanias();
        Alert(result.message, "success");
      } else {
        Alert(result.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
      Alert(error, "error");
    });
};

//obtiene todas las campañas
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

      let activas = result.filter((x) => x.estado == 1 && x.esArchivada === 0);
      $("#textActivas").text(activas.length);
      table("tableActivas", activas);

      let pausadas = result.filter((x) => x.estado == 2 && x.esArchivada === 0);
      $("#textPausadas").text(pausadas.length);
      table("tablePausada", pausadas);

      let borrador = result.filter((x) => x.estado == 3 && x.esArchivada === 0);
      $("#textBorrador").text(borrador.length);
      table("tableBorrador", borrador);

      let archivo = result.filter((x) => x.esArchivada === 1); 
      $("#textArchivo").text(archivo.length);
      table("tableArchivo", archivo);
    })
    .catch((error) => console.log("error", error));
};


//tablas de campaña
const table = (table, data) => {
  $("#" + table).dataTable({
    destroy: true,
    data,
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          if (type === 'display') {
            return meta.row + 1;
          }
          return meta.row + 1;
        }
      },
      { data: "nombre" },
      {
        data: "esArchivada",
        render: function(data, type, row) {
          if (data === 1) {
            return "Archivada";
          } else {
            return renderEstado(row.estado);
          }
        }
      },
      { data: "fechaInicio" },
      { data: "fechaFin" },
      { data: "id",
        render: function (data, type, row) {
          var opcAdd = ``;
          
          if (row.estado === 3) {
            // Si el estado es borrador (3), mostrar las opciones de activar, editar, archivar y eliminar
            opcAdd += `
              <a href="#" onclick="pausarActualizarCampania(${data}, 1)" class="btn_activar dropdown-item">
                ${feather.icons["play"].toSvg({ class: "font-small-4 mr-50" })} Activar
              </a>
              <a href="#" class="btn_edit dropdown-item" onclick="OpenEdit(${data})" data-toggle="modal" data-target="#modalEdit">
                ${feather.icons["edit"].toSvg({ class: "font-small-4 mr-50" })} Editar
              </a>
              <a href="#" onclick="OpenDelete(${data})" class="btn_delete dropdown-item">
                ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })} Eliminar
              </a>
            `;
          } else {
            // Si el estado no es borrador, mostrar las opciones según el estado actual
            switch (row.estado) {
              case 1:
                opcAdd += `
                  <a href="#" onclick="pausarActualizarCampania(${data}, 2)" class="btn_pausar dropdown-item">
                    ${feather.icons["pause-circle"].toSvg({ class: "font-small-4 mr-50" })} Pausar
                  </a>
                `;
                break;
              case 2:
                opcAdd += `
                  <a href="#" onclick="pausarActualizarCampania(${data}, 1)" class="btn_activar dropdown-item">
                    ${feather.icons["play"].toSvg({ class: "font-small-4 mr-50" })} Activar
                  </a>
                `;
                break;
            }
            
            opcAdd += `
              <a href="#" class="btn_edit dropdown-item" onclick="OpenEdit(${data})" data-toggle="modal" data-target="#modalEdit">
                ${feather.icons["edit"].toSvg({ class: "font-small-4 mr-50" })} Actualizar
              </a>
              <a href="#" onclick="OpenDelete(${data})" class="btn_delete dropdown-item">
                ${feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" })} Inhabilitar
              </a>
            `;
          }
          
          return `
            <div class="btn-group">
              <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                ${feather.icons["more-vertical"].toSvg({ class: "font-small-4" })}
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                ${opcAdd}
              </div>
            </div>
          `;
        }
      },
    ],
    // order: [[1, 'asc']],
    dom: '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
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
        }
      },
    ],
  });
};

//render para el estado de la campaña 
function renderEstado(estado) {
  switch (estado) {
    case 1: return `Activa`;
    case 2: return `Pausada`;
    case 3: return `Borrador`;
    default: return ``;
  }
}
