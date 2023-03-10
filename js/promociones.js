const url = 'http://localhost:3000/'
let codigos = [];
$(function () {
  'use strict';
  ChangePanel(2)

  var bsStepper = document.querySelectorAll('.bs-stepper'),
    select = $('.select2'),
    verticalWizard = document.querySelector('.vertical-wizard-example');
  

  // Adds crossed class
  if (typeof bsStepper !== undefined && bsStepper !== null) {
    for (var el = 0; el < bsStepper.length; ++el) {
      bsStepper[el].addEventListener('show.bs-stepper', function (event) {
        var index = event.detail.indexStep;
        var numberOfSteps = $(event.target).find('.step').length - 1;
        var line = $(event.target).find('.step');

        // The first for loop is for increasing the steps,
        // the second is for turning them off when going back
        // and the third with the if statement because the last line
        // can't seem to turn off when I press the first item. ¯\_(ツ)_/¯

        for (var i = 0; i < index; i++) {
          line[i].classList.add('crossed');

          for (var j = index; j < numberOfSteps; j++) {
            line[j].classList.remove('crossed');
          }
        }
        if (event.detail.to == 0) {
          for (var k = index; k < numberOfSteps; k++) {
            line[k].classList.remove('crossed');
          }
          line[0].classList.remove('crossed');
        }
      });
    }
  }

  // select2
  select.each(function () {
    var $this = $(this);
    $this.wrap('<div class="position-relative"></div>');
    $this.select2({
      placeholder: 'Select value',
      dropdownParent: $this.parent()
    });
  });


  // Vertical Wizard
  // --------------------------------------------------------------------
  if (typeof verticalWizard !== undefined && verticalWizard !== null) {
    var verticalStepper = new Stepper(verticalWizard, {
      linear: false
    });
    $(verticalWizard)
      .find('.btn-next')
      .on('click', function () {
        verticalStepper.next();
      });
    $(verticalWizard)
      .find('.btn-prev')
      .on('click', function () {
        verticalStepper.previous();
      });

    $(verticalWizard)
      .find('.btn-submit')
      .on('click', function () {
        alert('Submitted..!!');
      });
  }



  //Inicializacion de Navs
  $('#NavsOpc button').on('click', function (event) {
    let data = $(this).attr("data-bs-target");
    event.preventDefault()
    $(this).tab('show');
    $('.opcLista').removeClass('show active')
    $(data).addClass('show active')
  })


  getAllPromociones();




  $('.BtnBottador').click(function () {
    var data = {
      "nemonico": $('#nemonico').val(),
      "nombre": $('#nombre').val(),
      "descripcion": $('#descripcion').val(),
      "mesajeExito": $('#successaMessage').val(),
      "mesajeFail": $('#failMessage').val(),
      "imgSuccess": "test.png",
      "imgFail": "test.png",
      "fechaInicio": $('#fechaInicio').val(),
      "fechaFin": $('#fechaFin').val(),
      "PremioXcampania": 0,
      "estado": 3,
      "codigos": codigos

    }
    saveData(data);
    Limpiar();
  });




  $('#btnGenerar').click(function () {
    const cantidad = $('#cantidad').val();
    const tamanio = $('#tamanio').val();
    const tipo = $('#tipogeneracion').val();
    codigos = [];
    for (let index = 0; index < cantidad; index++) {
      var newCode = 'TEMP' + generaCupon(tamanio, tipo);
      codigos.push({ cupon: newCode, estado: 1, esPremio: 0 });
    }
    $('#PreviewCodigo').html(null)

    var i = 1;
    codigos.forEach(element => {
      var tr = `<tr>
        <td>${i}</td>
        <td>${element.cupon}</td>
        </tr>`

      $('#PreviewCodigo').append(tr);
      i++;
    });

  })

});

const getAllPromociones = () => {


  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`${url}Promocion`, requestOptions)
    .then(response => response.json())
    .then(result => {
      table('tableTodas', result);
      $('#textTodas').text(result.length);

      let activas = result.filter(x => x.estado == 1);
      $('#textActivas').text(activas.length);
      table('tableActivas', activas);


      let pausadas = result.filter(x => x.estado == 2);
      $('#textPausadas').text(pausadas.length);
      table('tablePausada', pausadas);

      let borrador = result.filter(x => x.estado == 3);
      $('#textBorrador').text(borrador.length);
      table('tableBorrador', borrador);

    })
    .catch(error => console.log('error', error));

}


const table = (table, data) => {
  $('#' + table).dataTable({
    destroy: true,
    data,
    columns: [
      { data: "id" },
      { data: "descripcion" },
      { data: "nemonico" },
      {
        data: "estado", render: function (data) {
          switch (data) {
            case 1:
              return `Activa`
            case 2:
              return `Pausada`
            case 3:
              return `Borrador`
            default:
              return ``;
          }
        }
      },
      {
        data: "fechaInicio", render: function (data) {
          let fecha = data.split("-");
          return fecha[2] + '/' + fecha[1] + '/' + fecha[0]
        }
      },
      {
        data: "fechaFin", render: function (data) {
          let fecha = data.split("-");
          return fecha[2] + '/' + fecha[1] + '/' + fecha[0]
        }
      },
      {
        data: "id", render: function (data) {
          return `
          <div class="btn-group">
            <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                ${feather.icons['more-vertical'].toSvg({ class: 'font-small-4' })}
            </a>
            <div class="dropdown-menu dropdown-menu-right">
                <a href="#" onclick="OpenEdit(${data})" class="btn_edit dropdown-item">
                    ${feather.icons['archive'].toSvg({ class: 'font-small-4 mr-50' })} Actualizar
                </a>
            
            <div class="dropdown-menu dropdown-menu-right">
                <a href="#" onclick="OpenDelete(${data})" class="btn_delete dropdown-item">
                  ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} Inhabilitar
                </a>
            </div>
            </div>
          </div> 
        `;
        }
      }
    ],
    // order: [[1, 'asc']],
    dom:
      '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
      '<"col-lg-12 col-xl-6" l>' +
      '<"col-lg-12 col-xl-6 pl-xl-75 pl-0"<"dt-action-buttons text-xl-right text-lg-left text-md-right text-left d-flex align-items-center justify-content-lg-end align-items-center flex-sm-nowrap flex-wrap mr-1"<"mr-1"f>B>>' +
      '>t' +
      '<"d-flex justify-content-between mx-2 row mb-1"' +
      '<"col-sm-12 col-md-6"i>' +
      '<"col-sm-12 col-md-6"p>' +
      '>',
    language: {
      sLengthMenu: 'Show _MENU_',
      search: 'Buscar',
      searchPlaceholder: 'Buscar...',
    },
    // Buttons with Dropdown
    buttons: [
      {
        text: 'Nuevo',
        className: 'btn btn-primary mt-50',
        action: function (e, dt, node, config) {
          ChangePanel(2)
        },
        init: function (api, node, config) {
          $(node).removeClass('btn-secondary');
          //Metodo para agregar un nuevo usuario
        },
      },
    ],
  });
}

const ChangePanel = (estado) => {
  if (estado === 1) {
    $('#panelCreacion').hide();
    $('#panelListado').show();
  } else {
    $('#panelListado').hide();
    $('#panelCreacion').show();
  }
}

const saveData = (data) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(`${url}Promocion`, requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.code == "ok") {
        getAllPromociones();
        Alert(result.message, 'warning')
      } else {
        Alert(result.message, 'error')
      }
    })
    .catch(error => {
      console.log(error)
      Alert(error, 'error')
    });
}

const Alert = function (message, status) // si se proceso correctamente la solicitud
{
  toastr[`${status}`](message, `${status}`, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: 'toast-top-right',
    rtl: false
  });
}

const generaCupon = (num, optionCharacters) => {
  let characters = ""; // abcdefghijklmnopqrstuvwxyz
  if (optionCharacters == 1) // letras y numeros
  {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  else if (optionCharacters == 2) // solo numeros
  {
    characters = '0123456789';
  }
  else if (optionCharacters == 3) // solo letras
  {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const Limpiar = () => {
  $('#nemonico').val(null);
  $('#nombre').val(null);
  $('#descripcion').val(null);
  $('#successaMessage').val(null);
  $('#failMessage').val(null);
  $('#fechaInicio').val(null);
  $('#fechaFin').val(null);
  $('#cantidad').val(null);
  $('#tamanio').val(null);
  $('#tipogeneracion').val(1);
  ChangePanel(1)
}