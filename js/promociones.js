const url = "http://localhost:3000/";
let codigos = [];
let premios = [];
let token = localStorage.getItem("token");

const headers = {
  'Authorization': token,
  'Content-Type': 'application/json'
};

let imagen = "";
let newImagen = "";
let newImagen1 = "";
const inputFile = document.getElementById("formFile");

$('#modalNew').on('show.bs.modal', function () {
  console.log("Modal nuevo abierto");
});

// Función para cargar imágenes
function Uploaded(input) {
  var file = document.getElementById(input).files[0];
  if(file.size > 307200) {
    alert("La imagen no puede ser mayor a 300kb", "error")
    $('#newImagen').val('');
    return;
  }

  var reader = new FileReader();
  reader.onload = function () {
    if(input === "newImagen") {
      newImagen = reader.result.replace("data:", "").replace(/^.+,/, "");
    } else {
      newImagen1 = reader.result.replace("data:", "").replace(/^.+,/, "");
    }
  }
  reader.readAsDataURL(file);
}

// Función para verificar si el nemonico ya existe
const checkNemonico = async (nemonico) => {
  try {
    const response = await fetch(`${url}api/check-nemonico`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ nemonico })
    });
    const result = await response.json();
    return result.exists;
  } catch (error) {
    console.error('Error checking nemonico:', error);
    return false;
  }
}

$(function () {
  "use strict";
  ChangePanel(1);
  Usuario();
  getPremios();
  $(".autoGenerar").hide();
  $(".cargarExcel").hide();

  var bsStepper = document.querySelectorAll(".bs-stepper"),
      select = $(".select2"),
      verticalWizard = document.querySelector(".vertical-wizard-example");

  // Adds crossed class
  if (typeof bsStepper !== undefined && bsStepper !== null) {
    for (var el = 0; el < bsStepper.length; ++el) {
      bsStepper[el].addEventListener("show.bs-stepper", function (event) {
        var index = event.detail.indexStep;
        var numberOfSteps = $(event.target).find(".step").length - 1;
        var line = $(event.target).find(".step");

        for (var i = 0; i < index; i++) {
          line[i].classList.add("crossed");

          for (var j = index; j < numberOfSteps; j++) {
            line[j].classList.remove("crossed");
          }
        }
        if (event.detail.to == 0) {
          for (var k = index; k < numberOfSteps; k++) {
            line[k].classList.remove("crossed");
          }
          line[0].classList.remove("crossed");
        }
      });
    }
  }

  select.each(function () {
    var $this = $(this);
    $this.wrap('<div class="position-relative"></div>');
    $this.select2({
      placeholder: "Select value",
      dropdownParent: $this.parent(),
    });
  });

  if (typeof verticalWizard !== undefined && verticalWizard !== null) {
    var verticalStepper = new Stepper(verticalWizard, {
      linear: false,
    });

    $(verticalWizard)
      .find(".btn-next")
      .on("click", function () {
        $("#text-nemonico").text($("#nemonico").val());
        $("#text-nombre").text($("#nombre").val());
        $("#text-descripcion").text($("#descripcion").val());
        $("#text-mensajeExito").text($("#mensajeExito").val());
        $("#text-fail").text($("#failMessage").val());
        $("#text-fechaInicio").text($("#fechaInicio").val());
        $("#text-fechaFin").text($("#fechaFin").val());
        verticalStepper.next();
      });

    $(verticalWizard)
      .find(".btn-prev")
      .on("click", function () {
        verticalStepper.previous();
      });

    $(verticalWizard).find("#btnGuardar").on("click", function () {
      console.log("Codigos antes de enviar:", codigos);
      console.log("Premios antes de enviar:", premios);
      var data = {
        nemonico: $("#nemonico").val(),
        nombre: $("#nombre").val(),
        descripcion: $("#descripcion").val(),
        mesajeExito: $("#mensajeExito").val(),
        mesajeFail: $("#failMessage").val(),
        imgSuccess: newImagen,
        imgFail: newImagen1,
        fechaInicio: $("#fechaInicio").val(),
        fechaFin: $("#fechaFin").val(),
        PremioXcampania: 1,
        estado: 1,
        codigos: codigos.map((codigo, index) => ({
          codigo: `CODE${index + 1}`,
          esPremio: 0,
          cupon: codigo.cupon
        })),
        premios: premios.map(premio => ({
          nombre: premio.premioDescripcion,
          cantidad: parseInt(premio.cantidad, 10),
          valor: parseInt(premio.valor, 10),
          porcentaje: parseInt(premio.porcentaje, 10),
          cupon: parseInt(premio.cupon, 10)
        }))
      };
      console.log(data);
      saveData(data);
      Limpiar();
    });
  }

  $("#nemonico").on("input", async function () {
    const nemonico = $(this).val();
    const btnNext = $(".btn-next");

    if (nemonico) {
      const exists = await checkNemonico(nemonico);
      if (exists) {
        Alert('El nemonico ya existe en la base de datos.', 'error');
        btnNext.prop("disabled", true);
      } else {
        btnNext.prop("disabled", false);
      }
    } else {
      btnNext.prop("disabled", true);
    }
  });

  // Resto del código...
  //Inicializacion de Navs
  $("#NavsOpc button").on("click", function (event) {
    let data = $(this).attr("data-bs-target");
    event.preventDefault();
    $(this).tab("show");
    $(".opcLista").removeClass("show active");
    $(data).addClass("show active");
  });

  getAllPromociones();

  $('#newImagen').change(function (file) {
    console.log(file);
    Uploaded('newImagen');
    console.log("HOlaaaa");
  });

  $('#newImagen1').change(function () {
    Uploaded('newImagen1');
    console.log("HOlaaaa");
  });

  $('#edit').change(function () {
    Uploaded('editLogo');
  });

  $(".BtnBottador").click(function () {
    var data = {
      nemonico: $("#nemonico").val(),
      nombre: $("#nombre").val(),
      descripcion: $("#descripcion").val(),
      mesajeExito: $("#mensajeExito").val(),
      mesajeFail: $("#failMessage").val(),
      imgSuccess: newImage,
      imgFail: newImagen1,
      fechaInicio: $("#fechaInicio").val(),
      fechaFin: $("#fechaFin").val(),
      PremioXcampania: 0,
      estado: 3,
      codigos: codigos,
      premios: premios,
    };
    saveData(data);
    Limpiar();
  });

  $("#btnGenerar").click(function () {
    const cantidad = $("#cantidad").val();
    const tamanio = $("#tamanio").val();
    const tipo = $("#tipogeneracion").val();
    const nemonico = $("#nemonico").val();
    codigos = [];
    for (let index = 0; index < cantidad; index++) {
      var newCode = nemonico + generaCupon(tamanio, tipo);
      codigos.push({ cupon: newCode });
    }
    console.log("Codigos generados:", codigos);
    DrawCodigos();
    $("#cantidad").val(null);
    $("#tamanio").val(null);
    $("#tipogeneracion").val(1);
  });






  document.getElementById('cupon').addEventListener('input', function () {
    const cantidadCupones = parseInt(this.value, 10);
    if (!isNaN(cantidadCupones) && cantidadCupones > 0 && cantidadCupones <= codigos.length) {
      const selectedCupones = codigos.slice(0, cantidadCupones);
      DrawPremios(selectedCupones);
    } else {
      // Si la cantidad es inválida o fuera de rango, limpiar la tabla
      DrawPremios([]);
    }
  });
  







  $("#formNew").submit(async function (event) {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado en localStorage");
      Alert("Token no encontrado. Inicie sesión nuevamente.", "error");
      return;
    }
    myHeaders.append("Authorization", token);

    const nemonico = $("#nemonico").val();

    // Verifica si el nemonico ya existe
    try {
        const response = await fetch(`${url}api/check-nemonico`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ nemonico })
        });
        const result = await response.json();
        if (result.exists) {
            Alert('El nemonico ya existe en la base de datos.', 'error');
            return false;
        }
    } catch (error) {
        console.error('Error checking nemonico:', error);
        Alert('Error al verificar el nemonico. Por favor, intente nuevamente.', 'error');
        return false;
    }

    // Continuar con el envío del formulario si el nemonico no existe

  

    if (codigos.length === 0) {
      Alert("Debe generar al menos un código.", "error");
      return;
    }

    if (premios.length === 0) {
      Alert("Debe agregar al menos un premio.", "error");
      return;
    }

    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    const imgSuccessFile = document.getElementById("newImagen").files[0];
    const imgFailFile = document.getElementById("newImagen1").files[0];

    Promise.all([getBase64(imgSuccessFile), getBase64(imgFailFile)])
      .then(([imgSuccessBase64, imgFailBase64]) => {
        const data = {
          nemonico,
          nombre: $("#nombre").val(),
          descripcion: $("#descripcion").val(),
          mesajeExito: $("#mensajeExito").val() || "Mensaje de éxito",
          mesajeFail: $("#failMessage").val() || "Mensaje de fallo",
          fechaInicio: $("#fechaInicio").val(),
          fechaFin: $("#fechaFin").val(),
          imgSuccess: imgSuccessBase64,
          imgFail: imgFailBase64,
          PremioXcampania: 1,
          estado: 1,
          codigos: codigos.map((codigo, index) => ({
            codigo: `CODE${index + 1}`,
            cupon: codigo.cupon,
            esPremio: 0
          })),
          premios: premios.map(premio => ({
            nombre: premio.premioDescripcion,
            cantidad: parseInt(premio.cantidad, 10),
            valor: parseInt(premio.valor, 10),
            porcentaje: parseInt(premio.porcentaje, 10),
            cupon: parseInt(premio.cupon, 10)
          }))
        };

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(data),
          redirect: "follow"
        };

        fetch(`${url}Promocion`, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log("Respuesta del servidor:", result);
            if (result.code === "ok") {
              getAllPromociones();
              $("#modalNew").modal("toggle");
              Alert(result.message, "success");
            } else {
              Alert(result.message, "error");
            }
          })
          .catch(error => {
            console.error("Error en la solicitud:", error);
            Alert("Error en la solicitud. Verifique los campos y el token.", "error");
          });
      })
      .catch(error => {
        console.error("Error al procesar las imágenes", error);
        Alert("Error al procesar las imágenes", "error");
      });

    return false;
  });

  $("#formEdit").submit(function () {
    const id = $("#id").val();

    var raw = JSON.stringify({
      nemonico: $("#nemonicoEdit").val(),
      nombre: $("#nombreEdit").val(),
      descripcion: $("#descripcionEdit").val(),
      mesajeExito: $("#successaMessageEdit").val(),
      mesajeFail: $("#failMessageEdit").val(),
      fechaInicio: $("#fechaInicioEdit").val(),
      fechaFin: $("#fechaFinEdit").val(),
    });

    var requestOptions = {
      method: "PUT",
      headers: headers,
      body: raw,
      redirect: "follow"
    };

    fetch(`${url}Promocion/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          getAllPromociones();
          $("#modalEdit").modal("toggle");
          Alert(result.message, "success");
        } else {
          Alert(result.message, "error");
        }
      })
      .catch((error) => {
        Alert(error.errors, "error");
      });
    return false;
  });

  $("#formTestear").submit(function () {
    var raw = JSON.stringify({
      cupon: $("#codigoTest").val(),
    });

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow"
    };

    fetch(`${url}cangePromocion/Test`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const {data} = result;
        $("#Response-Test").html(null);
        if (data.code == "01") {
          $("#Response-Test").html(`
          <div class='text-center'> 
          <h1> ¡Felicitaciones! </h1>
          <h4> ¡Tu cupón posee premio! </h4>
          <p>${data.descripcion}</p>
          <p class='text-success'>${data.message} </p>
          </div>
          <img  class="img-fluid" src="${data.img}" alt="Tupremio">
          `);
          Alert(data.message, "success");
        } else if (data.code == "02") {
          Alert(data.message, "warning");
          $("#Response-Test").html(`
          <div class='text-center'> 
          <h1> ¡Lo Sentimos! </h1>
          <h4> ¡El cupón no posee premio! </h4>
          <p>${data.descripcion}</p>
          <p class='text-danger'>${data.message} </p>
          </div>
          <img  class="img-fluid" src="${data.img}" alt="Tupremio">
          `);
        } else {
          Alert(data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Alert(error, "error");
      });

    return false;
  });

  $("#btnCancelarTest").click(function () { 
    $("#Response-Test").html(null);
    $("#codigoTest").val('');
  });

  $("#btnCancelarPromo").click(function () { 
    $("#Response-Promo").html(null);
    $("#participarCodigo").val('');
    $("#participarTelefono").val('');
  });

  $("#formParticipar").submit(function () {
    const telefono = $("#participarTelefono").val();
    const codigo = $("#participarCodigo").val();

    var raw = JSON.stringify({
      cupon: codigo,
      numero: telefono,
    });

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow"
    };

    fetch(`${url}cangePromocion`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const {data} = result;
        $("#Response-Promo").html(null);
        if (data.code == "01") {
          $("#Response-Promo").html(`
          <div class='text-center'> 
          <h1> ¡Felicitaciones! </h1>
          <h4> ¡Tu cupón posee premio! </h4>
          <p>${data.descripcion}</p>
          <p class='text-success'>${data.message} </p>
          </div>
          <img  class="img-fluid" src="${data.img}" alt="Tupremio">
          `);
          Alert(data.message, "success");
        } else if (data.code == "02") {
          Alert(data.message, "warning");
          $("#Response-Promo").html(`
          <div class='text-center'> 
          <h1> ¡Lo Sentimos! </h1>
          <h4> ¡El cupón no posee premio! </h4>
          <p>${data.descripcion}</p>
          <p class='text-danger'>${data.message} </p>
          </div>
          <img  class="img-fluid" src="${data.img}" alt="Tupremio">
          `);
        } else {
          Alert(data.message, "error");
        }
      })
      .catch((error) => {Alert(error, "error");
    console.log('errro')});

    return false;
  });

  //Para eliminar una promocion
  $("#BtnDelete").click(function () {
    const id = $("#idDelete").val();
    var requestOptions = {
      method: "DELETE",
      headers: headers,
      redirect: "follow"
    };

    fetch(`${url}Promocion/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          getAllPromociones();
          $("#modalDelete").modal("toggle");
          Alert(result.message, "success");
        } else {
          Alert(result.message, "error");
        }
      })
      .catch((error) => {
        Alert(error.errors, "error");
      });
    return false;
  });
});

const limpiarForm = () => {
  $("New#form").trigger("reset");
};

const getAllPromociones = () => {
  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  };

  fetch(`${url}Promocion`, requestOptions)
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
    })
    .catch((error) => console.log("error", error));
};

const table = (table, data) => {
  $("#" + table).dataTable({
    destroy: true,
    data,
    columns: [
      { data: "id" },
      { data: "nombre" },
      { data: "nemonico" },
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
            default:
              return ``;
          }
        },
      },
      {
        data: "fechaInicio",
        render: function (data) {
          let fecha = data.split("-");
          return fecha[2] + "/" + fecha[1] + "/" + fecha[0];
        },
      },
      {
        data: "fechaFin",
        render: function (data) {
          let fecha = data.split("-");
          return fecha[2] + "/" + fecha[1] + "/" + fecha[0];
        },
      },
      {
        data: "id",
        render: function (data, type, row) {
          var opcAdd = ``;

          switch (row.estado) {
            case 1:
              opcAdd += `<a href="#" onclick="UpdatePromocion(${data},2)" class="btn_pausar dropdown-item">
              ${feather.icons["pause-circle"].toSvg({
                class: "font-small-4 mr-50",
              })} Pausar
            </a>`;
              break;
            case 2:
              opcAdd += `<a href="#" onclick="UpdatePromocion(${data},1)" class="btn_activar dropdown-item">
                ${feather.icons["play"].toSvg({
                  class: "font-small-4 mr-50",
                })} Activar
              </a>`;
              break;
          }

          if (row.estado != 0) {
            opcAdd += `<a href="#" onclick="OpenEdit(${data})" class="btn_edit dropdown-item">
            ${feather.icons["archive"].toSvg({
              class: "font-small-4 mr-50",
            })} Actualizar
            </a>
            <a href="#" onclick="OpenDelete(${data})" class="btn_delete dropdown-item">
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
    buttons: [
      {
        text: "Nuevo",
        className: "btn btn-primary mt-50",
        attr: {
          'data-toggle': 'modal',
          'data-target': '#modalNew',
      },
        action: function (e, dt, node, config) {
          ChangePanel(2);
        },
        init: function (api, node, config) {
          $(node).removeClass("btn-secondary");
        },
      },
    ],
  });
};

const OpenDelete = (id) => {
  $("#idDelete").val(id);
  $("#modalDelete").modal("toggle");
};

const ChangePanel = (estado) => {
  if (estado === 1) {
    $("#panelCreacion").show();
    $("#panelListado").show();
  } else {
    $("#panelCreacion").show();
  }
};

const saveData = (data) => {
  console.log(data);

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
    redirect: "follow"
  };

  fetch(`${url}Promocion`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        getAllPromociones();
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

const Alert = function (
  message,
  status
) {
  toastr[`${status}`](message, `${status}`, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: "toast-top-right",
    rtl: false,
  });
};

const generaCupon = (num, optionCharacters) => {
  let characters = "";
  if (optionCharacters == 1) {
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  } else if (optionCharacters == 2) {
    characters = "0123456789";
  } else if (optionCharacters == 3) {
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const Limpiar = () => {
  $("#nemonico").val(null);
  $("#nombre").val(null);
  $("#descripcion").val(null);
  $("#successaMessage").val(null);
  $("#failMessage").val(null);
  $("#fechaInicio").val(null);
  $("#fechaFin").val(null);
  $("#cantidad").val(null);
  $("#tamanio").val(null);
  $("#tipogeneracion").val(1);
  premios = [];
  codigos = [];
  DrawPremios();
  DrawCodigos();
  ChangePanel(1);
};

const DrawCodigos = () => {
  $("#PreviewCodigo").html(null);

  codigos.forEach((element, index) => {
    var tr = `<tr>
        <td>${index + 1}</td>
        <td>${element.cupon}</td>
        </tr>`;

    $("#PreviewCodigo").append(tr);
  });
};

// const DrawPremios = () => {
//   $("#detallePremios").html(null);
//   $("#detallePremioRes").html(null);
//   premios.forEach((element, index) => {
//       var tr = `<tr>
//           <td>${element.cantidad}</td>
//           <td>${element.premioDescripcion}</td>
//           <td>${element.valor}</td>
//           <td>${element.porcentaje}</td>
//           <td><span class="btn-sm btn btn-outline-danger" onclick="removePremio(${index})">Eliminar</span></td>
//       </tr>`;
//       var tr2 = `<tr>
//           <td>${element.cantidad}</td>
//           <td>${element.premioDescripcion}</td>
//           <td>${element.valor}</td>
//           <td>${element.porcentaje}</td>
//       </tr>`;
//       $("#detallePremios").append(tr);
//       $("#detallePremioRes").append(tr2);
//   });
// };


const DrawPremios = (selectedCupones = premios) => {
  $("#detallePremios").html(null);
  $("#detallePremioRes").html(null);

  selectedCupones.forEach((element, index) => {
    var tr = `<tr>
        <td>${index + 1}</td>
        <td>${element.cupon}</td>
        <td>${element.cantidad}</td>
        <td>${element.premioDescripcion}</td>
        <td>${element.valor || ''}</td>
        <td>${element.porcentaje || ''}</td>
        <td><span class="btn-sm btn btn-outline-danger" onclick="removePremio(${index})">Eliminar</span></td>
    </tr>`;
    var tr2 = `<tr>
        <td>${index + 1}</td>
        <td>${element.cupon}</td>
        <td>${element.cantidad}</td>
        <td>${element.premioDescripcion}</td>
        <td>${element.valor || ''}</td>
        <td>${element.porcentaje || ''}</td>
    </tr>`;
    $("#detallePremios").append(tr);
    $("#detallePremioRes").append(tr2);
  });
};


  // $("#BtnPremios").click(function () {
  //   var cantidad = $("#cantidaPremio").val();
  //   var premio = $("#premio").val();
  //   var valor = $("#valorPremio").val();
  //   var premioDescripcion = $("#premio option:selected").text();
  //   var data = { cantidad, idPremio: premio, valor, premioDescripcion };
  //   premios = [...premios, data];
  //   DrawPremios();

  //   $("#cantidaPremio").val(null);
  //   $("#premio").val(0);
  //   $("#valorPremio").val(null);
  // });

$("#BtnPremios").click(function () {
  var cantidad = $("#cantidaPremio").val();
  var premio = $("#premio option:selected").val();
  var premioDescripcion = $("#premio option:selected").text();
  var valor = $("#valorPremio").val();
  var porcentaje = $("#porcentaje").val();
  var cupon = $("#cupon").val();

  if (cantidad && premio !== "0" && valor && porcentaje && cupon) {
    var data = { cantidad, premio, premioDescripcion, valor, porcentaje, cupon };
    premios.push(data);
    console.log("Premios agregados:", premios);
    DrawPremios();
    $("#cantidaPremio").val('');
    $("#premio").val("0");
    $("#valorPremio").val('');
    $("#porcentaje").val('');
    $("#cupon").val('');
  } else {
    alert("Todos los campos deben ser llenados");
  }
});


const getPremios = () => {
  var requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow"
  };

  $("#premio").html('<option value="0" selected>Seleccione Un Premio</option>');
  fetch(`${url}Premio`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
          console.log("Datos de premios recibidos:", result);
          result.forEach((element) => {
              var opc = `<option value="${element.id}">${element.descripcion}</option>`;
              $("#premio").append(opc);
          });
      })
      .catch((error) => console.log("error", error));
};

const removePremio = (index) => {
  premios.splice(index, 1);
  DrawPremios();
};

const loadMenuEdit = () => {
  var bsStepper = document.querySelectorAll(".bs-stepper"),
    select = $(".select2"),
    verticalWizard = document.querySelector(".vertical-wizard-example-Edit");

  if (typeof bsStepper !== undefined && bsStepper !== null) {
    for (var el = 0; el < bsStepper.length; ++el) {
      bsStepper[el].addEventListener("show.bs-stepper", function (event) {
        var index = event.detail.indexStep;
        var numberOfSteps = $(event.target).find(".step").length - 1;
        var line = $(event.target).find(".step");

        for (var i = 0; i < index; i++) {
          line[i].classList.add("crossed");

          for (var j = index; j < numberOfSteps; j++) {
            line[j].classList.remove("crossed");
          }
        }
        if (event.detail.to == 0) {
          for (var k = index; k < numberOfSteps; k++) {
            line[k].classList.remove("crossed");
          }
          line[0].classList.remove("crossed");
        }
      });
    }
  }

  select.each(function () {
    var $this = $(this);
    $this.wrap('<div class="position-relative"></div>');
    $this.select2({
      placeholder: "Select value",
      dropdownParent: $this.parent(),
    });
  });

  if (typeof verticalWizard !== undefined && verticalWizard !== null) {
    var verticalStepper = new Stepper(verticalWizard, {
      linear: false,
    });
    $(verticalWizard).find(".btn-next").on("click", function () {
      $("#text-nemonico").text($("#nemonico").val());
      $("#text-nombre").text($("#nombre").val());
      $("#text-descripcion").text($("#descripcion").val());
      $("#text-mensajeExito").text($("#mensajeExito").val());
      $("#text-fail").text($("#failMessage").val());
      $("#text-fechaInicio").text($("#fechaInicio").val());
      $("#text-fechaFin").text($("#fechaFin").val());
      verticalStepper.next();
    });
    $(verticalWizard)
      .find(".btn-prev")
      .on("click", function () {
        verticalStepper.previous();
      });
  }
};

const OpenEdit = (id) => {
  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  fetch(`${url}Promocion/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      $("#id").val(id);
      $("#nemonicoEdit").val(result.nemonico);
      $("#nombreEdit").val(result.nombre);
      $("#descripcionEdit").val(result.descripcion);
      $("#successaMessageEdit").val(result.mesajeExito);
      $("#failMessageEdit").val(result.mesajeFail);
      $("#fechaInicioEdit").val(result.fechaInicio);
      $("#fechaFinEdit").val(result.fechaFin);

      result.detallePromocions.forEach((element) => {
        var opcTableCodigos = `<tr>
              <td>${element.id}</td>
              <td>${element.cupon}</td>
              </tr>`;

        $("#PreviewCodigoEdit").append(opcTableCodigos);
      });

      result.premioPromocions.forEach((elementx) => {
        var opcTableCodigos = `<tr>
              <td>${elementx.cantidad}</td>
              <td>${elementx.premio.nombre}</td>
              <td>${elementx.id}</td>
              <td>${elementx.valor}</td>
              </tr>`;

        $("#detallePremiosEdit").append(opcTableCodigos);
      });

      $("#modalEdit").modal("toggle");
    })
    .catch((error) => console.log("error", error));
  loadMenuEdit();
};

function tipoConfigCodigos() {
  var tipo = $("#tipo").val();

  if (tipo == 1) {
    $(".autoGenerar").show();
    $(".cargarExcel").hide();
    $("#formFile").val("");
  } else if (tipo == 2) {
    $(".autoGenerar").hide();
    $(".cargarExcel").show();
    $("#tamanio").val("");
    $("#cantidad").val("");
  }
}

inputFile.addEventListener("change", function () {
  const extPermitidas = /(.xlsx)$/;

  if (!extPermitidas.exec($("#formFile").val())) {
    Alert("El archivo debe ser un excel", "error");
    $("#formFile").val("");
  } else {
    readXlsxFile(inputFile.files[0]).then(function (data) {
      data.map((row, index) => {
        codigos.push({ cupon: row[0], estado: 1, esPremio: 0 });
        var tr = `<tr id="fila${index}">
        <td >${index + 1}</td>
        <td>${row[0]}</td>
        </tr>`;

        $("#PreviewCodigo").append(tr);
      });
      console.log(codigos);
    });
  }
});

function activateStep(element) {
  document.querySelectorAll('.step-trigger').forEach(btn => {
    btn.classList.remove('active');
  });

  element.classList.add('active');
}

const UpdatePromocion = (id, type) => {
  var requestOptions = {
    method: "PUT",
    headers: headers,
    redirect: "follow"
  };

  fetch(`${url}Promocion/${type == 1 ? "Act" : "Pau"}/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        getAllPromociones();
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

//para utilizar el checkbox 
document.getElementById('esArchivadaEdit').addEventListener('change', function () {
  const premiosForm = document.getElementById('premiosForm');
  if (this.checked) {
    premiosForm.classList.add('hidden-element');
  } else {
    premiosForm.classList.remove('hidden-element');
  }
});
