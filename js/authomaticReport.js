const url = "http://localhost:3000/";
let tokenReportA = localStorage.getItem("token");
let datosObtenidos = null;
let archivadas = 0;
$(function () {
  getCampanias();
  getCampaniasForEditModal();
  $("#btnDescargarExcel, #PantallaInfo").hide();
  $("#selecCampania").multipleSelect({
    filter: true,
    selectAll: false,
    // single: true,
    placeholder: "Elige una campaña",
  });
  $("#selecCampaniaEdit").multipleSelect({
    filter: true,
    selectAll: false,
    // single: true,
    placeholder: "Elige una campaña",
  });

  $("#modalEdit").on("show.bs.modal", function () {
    limpiarFormulario();
    mostrarOcultarSelectDiaEdit();
    mostrarOcultarSelectDiaMesEdit();
    $("#btnSubmEdit").attr("disabled", false);
  });

  $("#modalEdit").on("hidden.bs.modal", function () {
    limpiarFormulario();
    mostrarOcultarSelectDiaEdit();
    mostrarOcultarSelectDiaMesEdit();
    $("#btnSubmEdit").attr("disabled", false);
  });

  $("#modalEdit")
    .find('[data-dismiss="modal"]')
    .click(function () {
      limpiarFormulario();
      mostrarOcultarSelectDiaEdit();
      mostrarOcultarSelectDiaMesEdit();
      $("#btnSubmEdit").attr("disabled", false);
    });

  //create

  $("#formNew").on("show.bs.modal", function () {
    limpiarFormulario();
    mostrarOcultarSelectDia();
    mostrarOcultarSelectDiaMes();
    $("#btnSubmit").attr("disabled", false);
  });

  $("#formNew").on("hidden.bs.modal", function () {
    limpiarFormulario();
    mostrarOcultarSelectDia();
    mostrarOcultarSelectDiaMes();
    $("#btnSubmit").attr("disabled", false);
  });

  $("#formNew")
    .find('[data-dismiss="modal"]')
    .click(function () {
      limpiarFormulario();
      mostrarOcultarSelectDia();
      mostrarOcultarSelectDiaMes();
      $("#btnSubmit").attr("disabled", false);
    });

  $("#btnSubmit").attr("disabled", false);

  $("#formNew").submit(function (event) {
    event.preventDefault();
    $("#btnSubmit").attr("disabled", true);
    var formData = {
      diasemana: $("#diasemana").val(),
      diames: $("#diames").val(),
      campanias: $("#selecCampania").val(),
      frecuencia: $("#frecuencia").val(),
      tiporeporte: $("#tiporeporte").val(),
      emails: $("#emails").val(),
    };
    fetch(`${url}authomatic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenReportA,
      },
      body: JSON.stringify(formData), // Enviar el array como JSON
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.code == "ok") {
          limpiarFormulario();
          $("#modalNew").modal("toggle");
          limpiarFormulario();
          Alert(result.message, "success");
          getReport();
        } else {
          Alert(result.message, "error");
        }
        $("#btnSubmit").prop("disabled", false);
      })
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
        $("#btnSubmit").prop("disabled", false);
      });
  });

  function limpiarFormulario() {
    $("#diasemana").val("");
    $("#diames").val("");
    $("#selecCampania").val([]).trigger("change"); // Asegúrate de refrescar los selects múltiples
    $("#emails").val("");
    $("#frecuencia").val("").trigger("change"); // Restablecer y refrescar select de frecuencia
    $("#tiporeporte").val("").trigger("change"); // Restablecer y refrescar select de tipo de reporte
    $("#selecCampania").multipleSelect("refresh");

    // Resetear select de día y mes
    $("#diasemana").prop("selectedIndex", 0).trigger("change");
    $("#diames").prop("selectedIndex", 0).trigger("change");

    // Ocultar contenedores de día y mes
    $("#selectDiaContainer").hide();
    $("#selectDiaMesContainer").hide();
  }

  $("#ConsultarPromo").on("click", function () {
    if ($("#reporte").val() !== null) {
      getReport();
    } else {
      Alert("Debe llenar todos los campos", "error");
    }
  });

  $("#PantallaInfo").on("click", function () {
    if (datosObtenidos) {
      mostrarDatosEnTabla(datosObtenidos);
    } else {
      Alert("Primero debes obtener los datos", "error");
    }
  });

  $("#formEdit").submit(function (event) {
    event.preventDefault();
    console.log("Enviando datos de edición...");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", tokenReportA);

    const id = $("#id").val();
    const frecuencia = $("#frecuenciaeddit").val() || "";
    const campanias = $("#selecCampaniaEdit").val() || "";
    const tiporeporte = $("#tiporeporteeddit").val() || "";
    const emails = $("#emailseddit").val() || "";
    const diasemanaEdit = $("#diasemanaeddit").val() || "";
    const diamesEdit = $("#diameseddit").val() || "";

    console.log("Datos a enviar:", {
      diasemanaeddit: diasemanaEdit,
      diameseddit: diamesEdit,
      selecCampaniaEdit: campanias,
      frecuenciaeddit: frecuencia,
      tiporeporteeddit: tiporeporte,
      emailseddit: emails,
    });

    var raw = JSON.stringify({
      frecuencia: $("#frecuenciaeddit").val(),
      diasemana: $("#diasemanaeddit").val(),
      diames: $("#diameseddit").val(),
      tiporeporte: $("#tiporeporteeddit").val(),
      campanias: $("#selecCampaniaEdit").val(),
      emails: $("#emailseddit").val(),
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}authomatic/update/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          limpiarFormulario();
          $("#modalEdit").modal("toggle");
          Alert(result.message, "success");
          getReport();
        } else {
          Alert(result.message, "error");
        }
      })
      .catch((error) => {
        alert(error.errors, "error");
      });

    return false;
  });

  $("#BtnDelete").click(function () {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", tokenReportA);

    const id = $("#idDelete").val();
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${url}authomatic/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          limpiarFormulario();

          $("#modalDelete").modal("toggle");
          Alert(result.message, "success");
          getReport();
        } else {
          console.log("Result", result);

          Alert(result.message, "error");
        }
      })
      .catch((error) => {
        console.log("Error", error);
        Alert(error.errors, "error");
      });
  });
});

const getCampanias = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: tokenReportA },
  };

  fetch(`${url}Campania`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Campania obtenidas:", result);

      $("#selecCampania").empty();

      result.forEach((element) => {
        $("#selecCampania").append(
          `<option value="${element.id}">[${element.fechaInicio} - ${element.fechaFin}] ${element.nombre}</option>`
        );
      });
      $("#selecCampania").multipleSelect("refresh");
    })
    .catch((error) => {
      console.error("Error al obtener Campania:", error);
      alert(error, "error");
    });
};

const getCampaniasForEditModal = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: tokenReportA },
  };
  $("#selecCampaniaEdit").empty();

  fetch(`${url}Campania`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Campanias obtenidas para modal de edición:", result);

      result.forEach((element) => {
        $("#selecCampaniaEdit").append(
          `<option value="${element.id}">[${element.fechaInicio} - ${element.fechaFin}] ${element.nombre}</option>`
        );
      });
      $("#selecCampaniaEdit").multipleSelect("refresh");
    })
    .catch((error) => {
      console.error("Error al obtener Campanias para modal de edición:", error);
      alert(error, "error");
    });
};

function mostrarOcultarSelectDia() {
  var selectConfiguracion = document.getElementById("frecuencia");
  var selectDiaContainer = document.getElementById("selectDiaContainer");

  if (selectConfiguracion.value === "semana") {
    selectDiaContainer.style.display = "block";
  } else {
    selectDiaContainer.style.display = "none";
  }
}

function mostrarOcultarSelectDiaMes() {
  var selectConfiguracion = document.getElementById("frecuencia");
  var selectDiaMesContainer = document.getElementById("selectDiaMesContainer");
  var selectDiaSemanaContainer = document.getElementById("selectDiaContainer");
  var selectDiaMes = document.getElementById("diames");
  var selectDiaSemana = document.getElementById("diasemana");

  if (selectConfiguracion.value === "mes") {
    selectDiaMesContainer.style.display = "block";
    selectDiaSemanaContainer.style.display = "none";

    selectDiaSemana.value = "";

    selectDiaMes.innerHTML = "";
    for (var i = 1; i <= 30; i++) {
      var option = document.createElement("option");
      option.value = i;
      option.text = i;
      selectDiaMes.appendChild(option);
    }
  } else if (selectConfiguracion.value === "semana") {
    selectDiaMesContainer.style.display = "none";
    selectDiaSemanaContainer.style.display = "block";

    selectDiaMes.value = "";
  } else {
    selectDiaMesContainer.style.display = "none";
    selectDiaSemanaContainer.style.display = "none";

    selectDiaMes.value = "";
    selectDiaSemana.value = "";
  }
}

$(function () {
  $("#frecuencia").change(function () {
    mostrarOcultarSelectDiaMes();
  });
});

function mostrarOcultarSelectDiaEdit() {
  var selectConfiguracion = document.getElementById("frecuenciaeddit");
  var selectDiaContainer = document.getElementById("selectDiaContainerEdit");

  if (selectConfiguracion.value === "semana") {
    selectDiaContainer.style.display = "block";
  } else {
    selectDiaContainer.style.display = "none";
  }
}

$(function () {
  $("#frecuenciaeddit").change(function () {
    mostrarOcultarSelectDiaMesEdit();
  });
});

function mostrarOcultarSelectDiaMesEdit() {
  var selectConfiguracion = document.getElementById("frecuenciaeddit");
  var selectDiaMesContainer = document.getElementById(
    "selectDiaMesContainerEdit"
  );
  var selectDiaSemanaContainer = document.getElementById(
    "selectDiaContainerEdit"
  );
  var selectDiaMes = document.getElementById("diameseddit");
  var selectDiaSemana = document.getElementById("diasemanaeddit");

  if (selectConfiguracion.value === "mes") {
    selectDiaMesContainer.style.display = "block";
    selectDiaSemanaContainer.style.display = "none";

    selectDiaSemana.value = "";

    selectDiaMes.innerHTML = "";
    for (var i = 1; i <= 30; i++) {
      var option = document.createElement("option");
      option.value = i;
      option.text = i;
      selectDiaMes.appendChild(option);
    }
  } else if (selectConfiguracion.value === "semana") {
    selectDiaMesContainer.style.display = "none";
    selectDiaSemanaContainer.style.display = "block";

    selectDiaMes.value = "";
  } else {
    selectDiaMesContainer.style.display = "none";
    selectDiaSemanaContainer.style.display = "none";

    selectDiaMes.value = "";
    selectDiaSemana.value = "";
  }
}

const getReport = () => {
  const tipoReporte = $("#reporte").val();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`${url}authomatic/${tipoReporte}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.statusText);
      }
      return response.json();
    })
    .then((result) => {
      console.log("Datos del informe de oferCraft:", result);
      datosObtenidos = result;
      mostrarDatosEnTabla(datosObtenidos);
      $("#btnDescargarExcel, #PantallaInfo").show();
    })
    .catch((error) => {
      console.error("Error al obtener el informe de oferCraft:", error);
      alert(error, "error");
    });
};

function mostrarDatosEnTabla(datos) {
  console.log("Datos para mostrar en la tabla:", datos);
  $("#TablaReportePromo").empty();
  if ($.fn.dataTable.isDataTable(".datatables-basic")) {
    $(".datatables-basic").DataTable().destroy();
  }
  let tabla = "";
  if (Array.isArray(datos)) {
    datos.forEach((element, index) => {
      let estadoText = "";
      if (element.estado === 1) {
        estadoText = "Activada";
      } else if (element.estado === 2) {
        estadoText = "Pausada";
      } else {
        estadoText = "No aplica";
      }
      tabla += `
                <tr> 
                <td>${index + 1}</td>
                    <td>${
                      element.configuraciones[0]
                        ? element.configuraciones[0].campanium.nombre
                        : "No disponible"
                    }</td>
                    <td>${element.frecuencia}</td>
                    <td>${element.diaSemana || "No aplica"}</td>
                    <td>${element.diaMes || "No aplica"}</td>
                    <td>${estadoText}</td>
                    <td>
                        <div class="btn-group">
                            <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                                ${feather.icons["more-vertical"].toSvg({
                                  class: "font-small-4",
                                })}
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a href="#" onclick="OpenEdit(${
                                  element.id
                                })" class="dropdown-item">
                                    ${feather.icons["edit"].toSvg({
                                      class: "font-small-4 mr-50",
                                    })} Editar
                                </a>
                                <a href="#"  onclick="OpenDelete(${
                                  element.id
                                })" class="dropdown-item">
                                    ${feather.icons["trash-2"].toSvg({
                                      class: "font-small-4 mr-50",
                                    })} Eliminar
                                </a>
                                ${getEstadoButton(element)}
                            </div>
                        </div>
                    </td>
                </tr>
            `;
    });
  } else {
    console.error("Los datos no son un array:", datos);
  }
  $(".datatables-basic tbody").html(tabla);
  $(".datatables-basic").DataTable({
    order: [[0, "asc"]],
    ordering: true,
    dom:
      '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
      '<"col-lg-6" l>' +
      '<"col-lg-6 pl-0"<"dt-action-buttons text-right text-md-left text-lg-right text-left d-flex align-items-center justify-content-lg-end align-items-center flex-sm-nowrap flex-wrap mr-1"<"mr-1"f>B>>' +
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
        className: "add-new btn btn-primary mt-50",
        attr: {
          "data-toggle": "modal",
          "data-target": "#modalNew",
        },
        init: function (api, node, config) {
          $(node).removeClass("btn-secondary");
        },
      },
    ],
  });
}

function getEstadoButton(row) {
  let opcAdd = "";
  switch (row.estado) {
    case 1:
      opcAdd += `
                <a href="#" onclick="cambiarEstado(${
                  row.id
                }, 2)" class="dropdown-item">
                    ${feather.icons["pause-circle"].toSvg({
                      class: "font-small-4 mr-50",
                    })}
                    Pausar
                </a>`;
      break;
    case 2:
      opcAdd += `
                <a href="#" onclick="cambiarEstado(${
                  row.id
                }, 1)" class="dropdown-item">
                    ${feather.icons["play"].toSvg({
                      class: "font-small-4 mr-50",
                    })}
                    Activar
                </a>`;
      break;
  }
  return opcAdd;
}

function cambiarEstado(id, estate) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", tokenReportA);

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify({ estado: estate }),
    redirect: "follow",
  };

  fetch(`${url}authomatic/state/${id}/${estate}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        console.log("Estado cambiado con éxito.");
        getReport();
      } else {
        console.error("Error al cambiar el estado:", result.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Alert("Ha ocurrido un error al intentar cambiar el estado.", "error");
    });
}

const Alert = function (message, status) {
  toastr[`${status}`](message, `${status}`, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: "toast-top-right",
    rtl: false,
  });
};

const OpenEdit = (id) => {
  var requestOptions = {
    method: "GET",
    headers: {
      Authorization: tokenReportA,
    },
    redirect: "follow",
  };

  fetch(`${url}authomatic/config/${id}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Error de autenticación: Token no válido o expirado.");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((resultArray) => {
      if (resultArray.length > 0) {
        const result = resultArray[0];
        console.log("Esto es lo que viene:", result);
        if (result.configreporte) {
          $("#id").val(id);
          $("#frecuenciaeddit").val(result.configreporte.frecuencia);
          $("#tiporeporteeddit").val(result.configreporte.tiporeporte);
          $("#diasemanaeddit").val(result.configreporte.diaSemana);
          $("#diameseddit").val(result.configreporte.diaMes);
          $("#emailseddit").val(result.configreporte.emails);
          $("#selecCampaniaEdit").val(result.campanium.nombre);

          $("#modalEdit").modal("toggle");
        } else {
          console.error(
            "Error: El objeto result no tiene la propiedad 'configreporte' definida."
          );
          alert("Error al obtener datos del proyecto", "error");
        }
      } else {
        console.error(
          "Error: No se recibieron resultados para el ID proporcionado."
        );
        alert("Error al obtener datos del proyecto", "error");
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud GET:", error);
      alert("Error al obtener datos del proyecto", "error");
    });
};

const OpenDelete = (id) => {
  $("#idDelete").val(id);
  $("#modalDelete").modal("toggle");
};
