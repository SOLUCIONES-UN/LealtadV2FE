const url = "http://localhost:3000/";
let tokenMenu = localStorage.getItem("token");

$(function () {
  const tabla = getMenus();
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
    myHeaders.append("Authorization", tokenMenu);

    var raw = JSON.stringify({
      descripcion: $("#descripcion").val(),
      icono: $("#icono").val(),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Menu`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        $("#btnSubmit").prop("disabled", false);
        if (result.code == "ok") {
          limpiarFormulario();
          $("#tableData").dataTable()._fnAjaxUpdate();
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

  //eventos de edicion para un menu
  $("#formEdit").submit(function (event) {
    // event.preventDefault();
    // $('#btnSubmitEdit').prop('disabled', true);
    const descripcion = $("#descripcionEdit").val();

    if (!validarDescripcion(descripcion)) {
      return false;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", tokenMenu);

    const id = $("#id").val();

    console.log("ID del menú:", id);

    var raw = JSON.stringify({
      descripcion: $("#descripcionEdit").val(),
      icono: $("#iconoEdit").val(),
    });

    console.log(raw);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Menu/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.code);
        if (result.code === "ok") {
          limpiarFormulario();
          $("#tableData").dataTable()._fnAjaxUpdate();
          Alert(result.message, "success");
          $("#modalEdit").modal("toggle");
        } else {
          Alert(result.message, "error");
        }
      })
      .catch((error) => {
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

    fetch(`${url}Menu/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          limpiarFormulario();
          $("#tableData").dataTable()._fnAjaxUpdate();
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

const getMenus = () => {
  return $("#tableData").DataTable({
    ajax: {
      url: `${url}Menu`,
      type: "GET",
      datatype: "json",
      dataSrc: function (json) {
        json.forEach((row) => {
          console.log(row.descripcion);
        });
        return json;
      },
      headers: { Authorization: tokenMenu },
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
            '<button class="btn btn-sm dropdown-toggle hide-arrow" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
            feather.icons["more-vertical"].toSvg({ class: "font-small-4" }) +
            "</button>" +
            '<div class="dropdown-menu dropdown-menu-right">' +
            '<a href="#" onclick="OpenEdit(' +
            data +
            ')" class="btn_edit dropdown-item">' +
            feather.icons["edit"].toSvg({ class: "font-small-4 mr-50" }) +
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
  $("#formNew").trigger("reset");
  $(".descripcion").removeClass("is-invalid");
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

  fetch(`${url}Menu/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      $("#id").val(id);
      $("#descripcionEdit").val(result.descripcion);
      $("#iconoEdit").val(result.icono);
      $("#modalEdit").modal("toggle");
    })
    .catch((error) => console.log("error", error));
};

const OpenDelete = (id) => {
  $("#idDelete").val(id);
  $("#modalDelete").modal("toggle");
};
