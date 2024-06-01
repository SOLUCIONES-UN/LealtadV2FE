const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

$(function () {
  getColumnas();
  GetProjects();
  getTablaDB();
  let tabla = getTransaccions();
  Usuario();

  function validarNombreYDescripcion(descripcion) {
    const descripcionValida = /^[a-zA-Z0-9\s]+$/.test(descripcion.trim());

    if (!descripcionValida) {
      $(".descripcion").addClass("is-invalid");
      $(".descripcion-error")
        .text(
          "La descripción no admite caracteres especiales ni espacios en blanco"
        )
        .addClass("text-danger");
      return false;
    } else {
      $(".descripcion").removeClass("is-invalid");
      $(".descripcion-error").empty().removeClass("text-danger");
    }

    return true;
  }

  // Eventos para limpiar el formulario
  $("#modalNew, #modalEdit").on("show.bs.modal", function () {
    limpiarForm();
  });

  $("#modalNew, #modalEdit").on("hidden.bs.modal", function () {
    limpiarForm();
  });

  $("#modalNew, #modalEdit")
    .find('[data-dismiss="modal"]')
    .click(function () {
      limpiarForm();
    });

  //evento submit del formulario
  $("#formNew").submit(function () {
    const descripcion = $("#descripcion").val();

    if (!validarNombreYDescripcion(descripcion)) {
      return false;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({
      descripcion: descripcion,
      puntos: $("#puntos").val(),
      columna: $("#columna").val(),
      proyecto: $("#proyecto").val(),
      botton: $("#botton").val(),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Transaccion`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          limpiarForm();
          tabla._fnAjaxUpdate();
          $("#modalNew").modal("toggle");
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

  $("#formEdit").submit(function () {
    const descripcion = $("#descripcionEdit").val();

    if (!validarNombreYDescripcion(descripcion)) {
      return false;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    const id = $("#id").val();

    var raw = JSON.stringify({
      descripcion: $("#descripcionEdit").val(),
      puntos: $("#puntosEdit").val(),
      columna: $("#columnaEdit").val(),
      proyecto: $("#proyectoEdit").val(),
      botton: $("#bottonEdit").val(),
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Transaccion/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          limpiarForm();
          tabla._fnAjaxUpdate();
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

  $("#BtnDelete").click(function () {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    const id = $("#idDelete").val();
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
      headers: { Authorization: token },
    };

    fetch(`${url}Transaccion/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          limpiarForm();
          tabla._fnAjaxUpdate();
          $("#modalDelete").modal("toggle");
          Alert(result.message, "success");
        } else {
          Alert(result.message, "error");
        }
      })
      .catch((error) => {
        Alert(error.errors, "error");
      });
  });
});

// const Usuario = () => {

//     let usuario = JSON.parse(localStorage.getItem('infoUsuario'));
//     console.log(usuario.nombre)
//     $('.user-name').text(usuario.nombre);
//     $('.user-status').text(usuario.rol.descripcion);
// }

//obtiene las Transaccions
const getTransaccions = () => {
  return $("#tableData").dataTable({
    ajax: {
      url: `${url}Transaccion`,
      type: "GET",
      datatype: "json",
      dataSrc: "",
      headers: { Authorization: token },
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          if (type === "display") {
            return meta.row + 1;
          }
          return meta.row + 1;
        },
      },
      { data: "descripcion" },

      {
        data: "id",
        render: function (data) {
          return (
            '<div class="btn-group">' +
            '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
            feather.icons["more-vertical"].toSvg({ class: "font-small-4" }) +
            "</a>" +
            '<div class="dropdown-menu dropdown-menu-right">' +
            '<a href="#" onclick="OpenEdit(' +
            data +
            ')" class="btn_edit dropdown-item">' +
            feather.icons["archive"].toSvg({ class: "font-small-4 mr-50" }) +
            " Actualizar" +
            "</a>" +
            '<a href="#" onclick="OpenDelete(' +
            data +
            ')" class="btn_delete dropdown-item">' +
            feather.icons["trash-2"].toSvg({ class: "font-small-4 mr-50" }) +
            " Inhabilitar" +
            "</a>" +
            "</div>" +
            "</div>"
          );
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
  initComplete: function (settings, json) {
    // Añadir estilos CSS después de que la tabla esté completa
    $("<style>")
      .prop("type", "text/css")
      .html(
        `
        .dropdown-menu {    
          position: absolute !important;
          top: 100%;
          left: 5 !important;
          margin-left:  50px !important;
          z-index: 1051 !important; /* Incrementa z-index para superar la paginación */
          display: none;
          white-space: nowrap;
        }
        .btn-group.show .dropdown-menu {
          display: block; 
        }
        #tableData {
          position: relative !important;
          z-index: 0 !important;
        }
        #tableData_wrapper .row:last-child {
          margin-top: 50px; /* Ajusta este valor según sea necesario */
        }
      `
      )
      .appendTo("head");
  },
});
};
const limpiarForm = () => {
  $("#formNew").trigger("reset");

  $(".descripcion-error").empty().removeClass("text-danger");

  $("#descripcionEdit").removeClass("is-invalid");
};

const Alert = function (
  message,
  status // si se proceso correctamente la solicitud
) {
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
    redirect: "follow",
    headers: { Authorization: token },
  };

  fetch(`${url}Transaccion/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      $("#id").val(id);
      $("#descripcionEdit").val(result.descripcion);
      $("#proyectoEdit").val(result.columna.idProyectos);
      $("#tablaEdit").val(result.columna.idTablas);
      $("#columnaEdit").val(result.idColumna);

      // Llamar a GetProjects y getTablaDB con la bandera de edición
      GetProjects(true);
      getTablaDB(result.columna.idTablas, true);

      $("#modalEdit").modal("toggle");
    })
    .catch((error) => console.log("error", error));
};

const OpenDelete = (id) => {
  $("#idDelete").val(id);
  $("#modalDelete").modal("toggle");
};

const GetProjects = (isEdit = false) => {
  $("#proyecto").html(null);
  $("#proyectoEdit").html(null);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  $("#proyecto").html(
    '<option value="0" selected disabled>Selecciona una Opcion</option>'
  );
  fetch(`${url}projects`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        var option = `<option value="${element.id}">${element.descripcion}</option>`;
        $("#proyecto").append(option);
        $("#proyectoEdit").append(option);
      });
      var selectProyecto = document.getElementById("proyecto");
      var selectProyectoEdit = document.getElementById("proyectoEdit");

      if (isEdit) {
        // Si estamos en modo de edición, seleccionamos el proyecto actual
        var currentProjectId = $("#proyectoEdit").val();
        getTablaDB(currentProjectId, true);
      } else {
        // Si no estamos en modo de edición, configuramos los eventos de cambio
        selectProyecto.addEventListener("change", function () {
          var selectedId = this.value;
          getTablaDB(selectedId);
        });

        selectProyectoEdit.addEventListener("change", function () {
          var selectedId = this.value;
          getTablaDB(selectedId);
        });
      }
    })
    .catch((err) => console.log("error", err));
};
const getTablaDB = (id, isEdith = false) => {
  $("#tabla").html(null);
  $("#tablaEdit").html(null);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  // Limpiar completamente los selectores de tablas
  $("#tabla").empty();
  $("#tabla").append(
    '<option value="0" selected disabled>Selecciona una Opción</option>'
  );

  fetch(`${url}tabla/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        var opc = `<option value="${element.id}">${element.nombre_tabla}</option>`;
        $("#tabla").append(opc);
        $("#tablaEdit").append(opc);
      });
      var selectTablaDb = document.getElementById("tabla");
      var selectTablaDbEdit = document.getElementById("tablaEdit");

      if (isEdith) getColumnas(selectTablaDbEdit.value);

      selectProyecto.addEventListener("change", function () {
        var selectedId = this.value;
        getColumnas(selectedId);
      });

      selectProyectoEdit.addEventListener("change", function () {
        var selectedId = this.value;
        getColumnas(selectedId);
      });
    })
    .catch((err) => console.log("error", err));
};

const getColumnas = (id_tabla) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  $("#columna").html(
    '<option value="0" selected disabled>Selecciona una Opción</option>'
  );
  $("#columnaEdit").html(
    '<option value="0" selected disabled>Selecciona una Opción</option>'
  );

  fetch(`${url}Columnabytablas/${id_tabla}`, requestOptions) // Filter by id_tabla=1
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      result.forEach((element) => {
        var opc = `<option value="${element.id}">${element.nombre}</option>`;
        $("#columna").append(opc);
        $("#columnaEdit").append(opc);
      });

      // Handle case where no columns found with idTablas=1
    })
    .catch((err) => console.log("error", err));
  return false;
};

// Evento de cambio del selector de tablas
$("#tabla").on("change", function () {
  var selectedId2 = $(this).val();
  getColumnas(selectedId2);
});

$("#tablaEdit").on("change", function () {
  var selectedId2 = $(this).val();
  getColumnas(selectedId2);
});
