const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

let isPageOpen = true;

$(function () {
  let tabla = getColumnas();
  getSelect();
  // funcion para validar el nombre
  function validarNombre(nombre) {
    const nombreValido = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(nombre.trim());
  


    if (!nombreValido) {
      $(".nombre").addClass("is-invalid");
      $(".nombre-error")
        .text("El nombre no admite caracteres especiales ni espacios en blanco")
        .addClass("text-danger");
      return false;
    }
    return true;
  }

  // Eventos para el modal New
  $("#modalNew").on("hidden.bs.modal", function () {
    limpiarFormulario();
    $("#btnSubmit").attr("disabled", false);
  });

  // Eventos para el modal Edit
  $("#modalEdit").on("hidden.bs.modal", function () {
    limpiarFormulario();
    $("#btnSubmitEdit").attr("disabled", false);
  });

  // Evento para el botón de cerrar el modal New
  $("#modalNew")
    .find('[data-dismiss="modal"]')
    .click(function () {
      limpiarFormulario();
      $("#btnSubmit").attr("disabled", false);
    });

  // Evento para el botón de cerrar el modal Edit
  $("#modalEdit")
    .find('[data-dismiss="modal"]')
    .click(function () {
      limpiarFormulario();
      $("#btnSubmitEdit").attr("disabled", false);
    });

  //evento submit del formulario
  $("#formNew").submit(function () {
    const nombre = $("#nombre").val();

    if (!validarNombre(nombre)) {
      return false;
    }

    $("#btnSubmit").attr("disabled", true);

    $("#fInsertada").val($("#fInsertada").prop("checked") ? 1 : 0);
    $("#fActualizada").val($("#fActualizada").prop("checked") ? 1 : 0);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({
      nombre: $("#nombre").val(),
      fila_insertada: $("#fInsertada").val(),
      fila_actualizada: $("#fActualizada").val(),
      idProyectos: $("#proyecto").val(),
      idTabla: $("#tabla").val(),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Columna`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
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
        Alert(error.errors, "error");
      });

    return false;
  });

  $("#formEdit").submit(function () {
    const nombre = $("#nombreEdit").val();

    if (!validarNombre(nombre)) {
      return false;
    }

    $("#fInsertadaEdit").val($("#fInsertadaEdit").prop("checked") ? 1 : 0);
    $("#fActualizadaEdit").val($("#fActualizadaEdit").prop("checked") ? 1 : 0);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    const id = $("#id").val();

    var raw = JSON.stringify({
      nombre: $("#nombreEdit").val(),
      fila_insertada: $("#fInsertadaEdit").val(),
      fila_actualizada: $("#fActualizadaEdit").val(),
      idTabla: $("#tablaEdit").val(),
      idProyectos: $("#proyectoEdit").val(),
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Columna/${id}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result); 
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

    fetch(`${url}Columna/${id}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
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
    return false;
  });
});

//obtiene las Columnas
const getColumnas = () => {
  return $("#tableData").dataTable({
    ajax: {
      url: `${url}Columna`,
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
      { data: "tabladb.nombre_tabla" },
      { data: "nombre" },
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
      sLengthMenu: "Mostrar _MENU_",
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
          //Metodo para agregar un nuevo usuario
        },
      },
    ],
  });
};



function limpiarFormulario() {
  $("#formNew").trigger("reset");
  $("#proyecto").val("");
  $("#tabla").empty();
  $(".tabla").removeClass("is-invalid");
  $(".proyecto").removeClass("is-invalid");
  $(".nombre").removeClass("is-invalid");
  $(".nombre-error").empty().removeClass("text-danger");
}

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

window.addEventListener("beforeunload", () => {
  isPageOpen = false;
});

const OpenEdit = (id) => {
  if (!isPageOpen) return;
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  fetch(`${url}Columna/${id}`, requestOptions)
    .then((response) => {
      if (!isPageOpen) return; // Salir de la promesa si la página está cerrada
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      if (!isPageOpen) return;
      $("#id").val(id);
      $("#proyectoEdit").val(result.idProyectos);
      $("#tablaEdit").val(result.idTablas);
      $("#nombreEdit").val(result.nombre);
      getTablaDB(result.idProyectos);

      if (result.fila_insertada === 1) {
        $("#fInsertadaEdit").prop("checked", true);
      } else {
        $("#fInsertadaEdit").prop("checked", false);
      }

      if (result.fila_actualizada === 1) {
        $("#fActualizadaEdit").prop("checked", true);
      } else {
        $("#fActualizadaEdit").prop("checked", false);
      }

      $("#modalEdit").modal("toggle");
    })
    .catch((error) => console.log("error", error));
  return false;
};

const OpenDelete = (id) => {
  $("#idDelete").val(id);
  $("#modalDelete").modal("toggle");
};

const getSelect = () => {
  limpiarFormulario();
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };
  $("#proyecto").html(
    '<option value="0" selected disabled>Selecciona una opción</option>'
  );
  fetch(`${url}projects`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      result.forEach((element) => {
        var option = `<option value="${element.id}">${element.descripcion}</option>`;
        $("#proyecto").append(option);
        $("#proyectoEdit").append(option);
      });

      var selectProyecto = document.getElementById("proyecto");
      var selectProyectoEdit = document.getElementById("proyectoEdit");

      selectProyecto.addEventListener("change", function () {
        var selectedId = this.value;
        getTablaDB(selectedId);
      });

      selectProyectoEdit.addEventListener("change", function () {
        var selectedId = this.value;
        getTablaDB(selectedId);
      });
    })
    .catch((err) => console.log("error", err));
  return false;
};

const getTablaDB = (id) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  // Limpiar completamente los selectores de tablas
  $("#tabla").empty();

  // Agregar la opción de seleccionar una opción
  $("#tabla").append(
    '<option value="0" selected disabled>Selecciona una opción</option>'
  );

  fetch(`${url}tabla/${id}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      result.forEach((element) => {
        var opc = `<option value="${element.id}">${element.nombre_tabla}</option>`;
        $("#tabla").append(opc);
        $("#tablaEdit").append(opc);
      });
    })
    .catch((err) => console.log("error", err));
  return false;
};
