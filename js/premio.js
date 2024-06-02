const url = "http://localhost:3000/";

let token = localStorage.getItem("token");
const headers = {
  Authorization: token,
  "Content-Type": "application/json",
};

$(function () {
  let tabla = getPremios();

  function validarDescripcion(descripcion) {
    const descValido = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(descripcion.trim());

    if (!descValido) {
      $("#descripcion").addClass("is-invalid");
      $("#desc-error")
        .text("El nombre no admite caracteres especiales ni espacios en blanco")
        .addClass("text-danger");
      return false;
    }
    return true;
  }

  //Usuario();

  $("#modalNew").on("show.bs.modal", function () {
    limpiarFormulario();
    $("#btnSubmit").attr("disabled", false);
  });

  $("#modalEdit").on("show.bs.modal", function () {
    $("#btnSubmitEdit").attr("disabled", false);
  });

  $("#modalNew").on("hidden.bs.modal", function () {
    limpiarFormulario();
    $("#btnSubmit").attr("disabled", false);
  });

  $("#modalEdit").on("hidden.bs.modal", function () {
    limpiarFormulario();
    $("#btnSubmitEdit").attr("disabled", false);
  });

  $("#modalNew")
    .find('[data-dismiss="modal"]')
    .click(function () {
      limpiarFormulario();
      $("#btnSubmit").attr("disabled", false);
    });

  $("#modalEdit")
    .find('[data-dismiss="modal"]')
    .click(function () {
      limpiarFormulario();
      $("#btnSubmitEdit").attr("disabled", false);
    });

  //evento submit del formulario
  $("#formNew").submit(function () {
    if (
      $("#tipoTransaccion").val() === null ||
      $("#tipoTransaccion").val() === undefined
    ) {
      $("#tipoTransaccion").addClass("is-invalid");
      $("#tipoTransaccion-error")
        .text("El campo tipo transaccion es obligatorio")
        .addClass("text-danger");
      return false;
    }

    var valor = $("#tipoTransaccion").val();
    var infoUsuario = JSON.parse(localStorage.getItem("infoUsuario"));

    if (valor !== "0") {
      if (valor === "1") {
        if (
          $("#transaccion").val() === null ||
          $("#transaccion").val() === undefined
        ) {
          $("#transaccion").addClass("is-invalid");
          $("#transaccion-error")
            .text("El campo transaccion es obligatorio")
            .addClass("text-danger");
          return false;
        }

        var raw = JSON.stringify({
          idTransaccion: $("#transaccion").val(),
          tipoTransaccion: valor,
          usuario: infoUsuario.username,
        });
      } else if (valor === "2") {
        const descripcion = $("#descripcion").val();

        if (validarDescripcion(descripcion)) {
          return false;
        }

        var raw = JSON.stringify({
          tipoTransaccion: valor,
          descripcion: descripcion,
          link: $("#link").val(),
          claveSecreta: $("#clave").val(),
          usuario: infoUsuario.username,
        });
      }
    }

    $("#btnSubmit").attr("disabled", true);

    //return false;

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Premio`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
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
    const id = $("#id").val();
    var valor = $("#tipoTransaccionEdit").val();
    var infoUsuario = JSON.parse(localStorage.getItem("infoUsuario"));

    if (valor !== "0") {
      if (valor === "1") {
        var raw = JSON.stringify({
          descripcion: $("#descripcionEditPremio").val(),
          link: "",
          claveSecreta: "",
          idTransaccion: $("#transaccionEdit").val(),
          tipoTransaccion: valor,
          usuario: infoUsuario.username,
        });
      } else if (valor === "2") {
        const descripcion = $("#descripcion").val();

        if (validarDescripcion(descripcion)) {
          return false;
        }

        var raw = JSON.stringify({
          descripcion: $("#descripcionEdit").val(),
          link: $("#linkEdit").val(),
          claveSecreta: $("#claveEdit").val(),
          tipoTransaccion: valor,
          usuario: infoUsuario.username,
        });
      }
    }

    $("#btnSubmitEdit").attr("disabled", true);

    var requestOptions = {
      method: "PUT",
      headers: headers,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}Premio/${id}`, requestOptions)
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
    const id = $("#idDelete").val();
    var requestOptions = {
      method: "DELETE",
      headers: headers,
      redirect: "follow",
    };

    fetch(`${url}Premio/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.code == "ok") {
          limpiarForm();
          tabla._fnAjaxUpdate();
          $("#modalDelete").modal("toggle");
          Alert(result.mesagge, "success");
        } else {
          Alert(result.mesagge, "error");
        }
      })
      .catch((error) => {
        Alert(error, "error");
      });
  });
});


function limpiarFormulario() {
  $("#tipoTransaccion").val("0");
  $("#tipoForm").empty();
}

const getPremios = () => {
  var tipoTransaccion;

  return $("#tableData").dataTable({
    ajax: {
      url: `${url}Premio`,
      type: "GET",
      datatype: "json",
      dataSrc: "",
      headers: headers,
    },
    columns: [
      { data: "id" },
      {
        data: "descripcion",
        render: function (data) {
          if (data == null) {
            return "Premio por transaccion";
          } else {
            return data;
          }
        },
      },
    //   {
    //     data: "tipo",
    //     render: function (data) {
    //       if (data == 1) {
    //         return "Transaccion";
    //       } else if (data == 2) {
    //         return "OfertCraft";
    //       }
    //     },
    //   },
     
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

    //Buttons with Dropdown
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

const limpiarForm = () => {
  $("#formNew").trigger("reset");
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
    headers: headers,
  };

  fetch(`${url}Premio/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      $("#id").val(id);
      $("#tipoTransaccionEdit").val(result.tipo);
      tipoTransaccionFormEdit(result.idTransaccion);
      if (result.tipo == 1) {
        $("#descripcionEditPremio").val(result.descripcion);
        $("#nombreEdit").val(result.nombre);
        $("#transaccionEdit").val(result.idTransaccion);
      } else if (result.tipo == 2) {
        $("#descripcionEdit").val(result.descripcion);
        $("#nombreEdit").val(result.nombre);
        $("#linkEdit").val(result.link);
        $("#claveEdit").val(result.claveSecreta);
      }
      $("#modalEdit").modal("toggle");
    })
    .catch((error) => console.log("error", error));
};

const OpenDelete = (id) => {
  $("#idDelete").val(id);
  $("#modalDelete").modal("toggle");
};

function tipoTransaccionForm() {

  var valor = $("#tipoTransaccion").val();

  if (valor !== "0") {
    if (valor === "1") {
      $("#tipoForm").empty();

      $("#tipoForm").append(`
                
                <div class="form-group">
                    <label class="form-label" for="basic-icon-default-fullname">Transaccion</label>
                    <select type="text" class="form-control dt-full-name" id="transaccion" placeholder="Transaccion"
                    name="transaccion" aria-label="" aria-describedby="basic-icon-default-fullname2" required >
                    </select>
                    <div id="transaccion-error" class="invalid-feedback transaccion-error"></div>
                </div>
            `);

      getTrasacciones();
    } else if (valor === "2") {
      $("#tipoForm").empty();

      $("#tipoForm").append(`
                <div class="form-group">
                    <label class="form-label" for="basic-icon-default-fullname">Descripción</label>
                    <input type="text" class="form-control dt-full-name" id="descripcion" placeholder="Descripcion del premio"
                    name="descripcion" aria-label="" aria-describedby="basic-icon-default-fullname2" required />
                    <div id="desc-error" class="invalid-feedback depa-error"></div>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="basic-icon-default-fullname">Link</label>
                    <input type="text" class="form-control dt-full-name" id="link" placeholder="Link"
                    name="link" aria-label="" aria-describedby="basic-icon-default-fullname2" required />
                </div>
                <div class="form-group">
                    <label class="form-label" for="basic-icon-default-fullname">Clave</label>
                    <input type="text" class="form-control dt-full-name" id="clave" placeholder="Clave"
                    name="clave" aria-label="" aria-describedby="basic-icon-default-fullname2" required />
                </div>`);
    }
  }
}

function tipoTransaccionFormEdit(idTransaccion) {
  var valor = $("#tipoTransaccionEdit").val();


  if (valor !== "0") {
    if (valor === "1") {
      $("#tipoFormEdit").empty();

      $("#tipoFormEdit").append(`
                
                <div class="form-group">
                    <label class="form-label" for="basic-icon-default-fullname">Transaccion</label>
                    <select type="text" class="form-control dt-full-name" id="transaccionEdit" placeholder="Transaccion" name="transaccionEdit" aria-label="" aria-describedby="basic-icon-default-fullname2" required >
                    </select>
                </div>
            `);

      getTrasacciones(idTransaccion);
    } else if (valor === "2") {
      $("#tipoFormEdit").empty();

      $("#tipoFormEdit").append(`
                <div class="form-group">
                    <label class="form-label" for="basic-icon-default-fullname">Descripcion</label>
                    <input type="text" class="form-control dt-full-name" id="descripcionEdit" placeholder="Descripcion del premio"
                    name="descripcionEdit" aria-label="" aria-describedby="basic-icon-default-fullname2" required />
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="basic-icon-default-fullname">Link</label>
                    <input type="text" class="form-control dt-full-name" id="linkEdit" placeholder="Link"
                    name="linkEdit" aria-label="" aria-describedby="basic-icon-default-fullname2" required />
                </div>
                <div class="form-group">
                    <label class="form-label" for="basic-icon-default-fullname">Clave</label>
                    <input type="text" class="form-control dt-full-name" id="claveEdit" placeholder="Clave"
                    name="claveEdit" aria-label="" aria-describedby="basic-icon-default-fullname2" required />
                </div>`);
    }
  }
}

const getTrasacciones = (idTransaccion) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: headers,
  };

  $("#transaccion").html(
    '<option value="0" selected disabled>Selecciona una Opcion</option>'
  );

  fetch(`${url}Transaccion`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        var opc = `<option value="${element.id}">${element.nombre}</option>`;
        if (element.id === idTransaccion) {
          opc = `<option value="${element.id}" selected>${element.nombre}</option>`;
        }

        $("#transaccion").append(opc);
        $("#transaccionEdit").append(opc);
      });
    })
    .catch((error) => console.log("error", error));
};

function limpiarCampos() {
  $("#tipoTransaccion").val("0");

  $("#tipoForm").empty();
}
