const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

$(function () {
  GetProjects();
  let tabla = GetProfecion();
  Usuario();
  function validarDescripcion(descripcion) {
    const descripcionValida = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(
      descripcion.trim()
    );

    if (!descripcionValida) {
      $(".descripcion").addClass("is-invalid");
      $(".descripcion-error")
        .text(
          "La descripción no admite caracteres especiales ni espacios en blanco"
        )
        .addClass("text-danger");
      return false;
    }
    return true;
  }

  $("#modalNew").on("show.bs.modal", function () {
    limpiarFormulario();
  });

  $("#modalEdit").on("show.bs.modal", function () {
    limpiarFormulario();
  });

  $("#modalNew").on("hidden.bs.modal", function () {
    limpiarFormulario();
  });

  $("#modalEdit").on("hidden.bs.modal", function () {
    limpiarFormulario();
  });

  $("#modalNew")
    .find('[data-dismiss="modal"]')
    .click(function () {
      limpiarFormulario();
    });

  $("#modalEdit")
    .find('[data-dismiss="modal"]')
    .click(function () {
      limpiarFormulario();
    });

  //evento submit del formulario
  $("#formNew").submit(function () {
    $("#btnSubmit").prop("disabled", true);
    const descripcion = $("#descripcion").val();

    if (!validarDescripcion(descripcion)) {
      $("#btnSubmit").prop("disabled", false);
      return false;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({
      descripcion: $("#descripcion").val(),
      proyecto: $("#proyecto").val(),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Profecion`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        $("#btnSubmit").prop("disabled", false);

        if (result.code == "ok") {
          limpiarFormulario();
          tabla._fnAjaxUpdate();
          $("#modalNew").modal("toggle");
          Alert(result.message, "success");
        } else {
          Alert(result.message, "error");
        }
      })
      .catch((error) => {
        $("#btnSubmit").prop("disabled", false);

        Alert(error.errors, "error");
      });
    return false;
  });

  //eventos de edicion para un menu
  $("#formEdit").submit(function () {
    $("#btnSubmitEdit").prop("disabled", true);

    const descripcion = $("#descripcionEdit").val();

    if (!validarDescripcion(descripcion)) {
      $("#btnSubmitEdit").prop("disabled", false);

      return false;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    const id = $("#id").val();

    console.log("ID del menú:", id);

    var raw = JSON.stringify({
      descripcion: $("#descripcionEdit").val(),
      proyecto: $("#proyectoEdit").val(),
    });

    console.log(raw);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Profecion/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        $("#btnSubmitEdit").prop("disabled", false);

        if (result.code == "ok") {
          limpiarFormulario();
          tabla._fnAjaxUpdate();
          $("#modalEdit").modal("toggle");
          Alert(result.message, "success");
        } else {
          Alert(result.message, "error");
        }
      })

      .catch((error) => {
        $("#btnSubmitEdit").prop("disabled", false);

        Alert(error.errors, "error");
      });
    return false;
  });

  //eventos para la inhabilitacion de un menu
  $("#BtnDelete").click(function () {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const id = $("#idDelete").val();
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${url}Profecion/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          limpiarFormulario();
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

const GetProfecion = () => {
  return $("#tableData").dataTable({
    ajax: {
      url: `${url}Profecion`,
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
      // { data: "proyecto" },

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

function limpiarFormulario() {
  $("#descripcion").val("");
  $("#proyecto").val("");
  $(".descripcion").removeClass("is-invalid");
  $(".proyecto").removeClass("is-invalid");
  $(".descripcion-error").empty().removeClass("text-danger");
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
    redirect: "follow",
  };

  fetch(`${url}Profecion/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      $("#id").val(id);
      $("#descripcionEdit").val(result.descripcion);
      $("#proyectoEdit").val(result.proyecto);
      $("#modalEdit").modal("toggle");
    })
    .catch((error) => console.log("error", error));
};

const OpenDelete = (id) => {
  $("#idDelete").val(id);
  $("#modalDelete").modal("toggle");
};

const GetProjects = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  $("#proyecto").html(
    '<option value="0" selected disabled>Selecciona una Opcion</option>'
  );
  $("#proyectoEdit").html(
    '<option value="0" selected disabled>Selecciona una Opcion</option>'
  );
  fetch(`${url}projects`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        var opc = `<option value="${element.id}">${element.descripcion}</option>`;
        $("#proyecto").append(opc);
        $("#proyectoEdit").append(opc);
      });
    })
    .catch((error) => console.log("error", error));
};
