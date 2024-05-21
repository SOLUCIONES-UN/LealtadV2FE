const url = "http://localhost:3000/";
let token = localStorage.getItem("token");
$(function () {
  let tabla = getPaginas();
  getMenu();
  Usuario();
  function validarDescripcion(descripcion) {
    const descripcionValida = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s()]+$/.test(
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

  $("#modalNew, #modalEdit").on("show.bs.modal", function () {
    $(".descripcion").removeClass("is-invalid");
    $(".descripcion-error").empty().removeClass("text-danger");
  });

  $("#modalNew, #modalEdit").on("hidden.bs.modal", function () {
    limpiarForm();
  });

  $("#modalNew, #modalEdit")
    .find('[data-dismiss="modal"]')
    .click(function () {
      limpiarForm();
    });
  $("#formNew").submit(function () {
    $("#btnSubmit").prop("disabled", true);
    const descripcion = $("#descripcion").val();
    const idMenu = $("#idMenu").val();

    if (!validarDescripcion(descripcion)) {
      return false;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({
      descripcion: descripcion,
      idMenu: idMenu,
      path: $("#path").val(),
      icono: $("#Icono").val(),
    });

    console.log("Datos a guardar:", JSON.parse(raw));
    console.log("ID del Menú seleccionado:", idMenu);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Pagina`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        $("#btnSubmit").prop("disabled", false);
        console.log("Resultado de la creación de la página:", result);
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
        Alert(error, "error");
      });
    return false;
  });

  $("#formEdit").submit(function () {
    const descripcion = $("#descripcionEdit").val();

    if (!validarDescripcion(descripcion)) {
      return false;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    const id = $("#id").val();

    var raw = JSON.stringify({
      descripcion: $("#descripcionEdit").val(),

      idMenu: $("#MenuEdith").val(),
    });

    console.log(raw);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Pagina/${id}`, requestOptions)
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
    };

    fetch(`${url}Pagina/${id}`, requestOptions)
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

const getPaginas = () => {
  return $("#tableData").dataTable({
    ajax: {
      url: `${url}Pagina`,
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
      { data: "menu.descripcion" },
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
};

const getMenu = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  fetch(`${url}Menu`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      $("#idMenu").empty();
      $("#MenuEdith").empty();
      result.forEach((element) => {
        var opc = `<option value="${element.id}">${element.descripcion}</option>`;
        $("#idMenu").append(opc);
        $("#MenuEdith").append(opc);
        console.log("Opción agregada al menú:", element);
      });
    })
    .catch((error) => console.log("error", error));
};

$(document).ready(function () {
  getMenu();
});

const limpiarForm = () => {
  $("#formNew").trigger("reset");
  $("#descripcion").removeClass("is-invalid");
  $("#descripcionError").empty().removeClass("text-danger");
  $("#idMenu").val("");
};

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
    headers: { Authorization: token },
  };
  fetch(`${url}Pagina/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      $("#id").val(id);
      $("#descripcionEdit").val(result.descripcion);
      $("#MenuEdith").val(result.idMenu);
      $("#PathEdit").val(result.path);
      $("#IconoEdith").val(result.icono);
      $("#modalEdit").modal("toggle");
    })
    .catch((error) => console.log("error", error));
};

const OpenDelete = (id) => {
  $("#idDelete").val(id);
  $("#modalDelete").modal("toggle");
};
