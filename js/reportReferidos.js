const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

$(function () {
  $("#ConsultarReferido").click(function () {
    if ($("#FechaInicio").val() !== "" && $("#FechaFin").val() !== "") {
      GetReport();
    } else {
      Alert(
        "Fecha inicial y fecha final es requerida, por favor vuelve a intentarlo.",
        "error"
      );
    }
  });
});


const GetReport = () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    fechaInicial: $("#FechaInicio").val(),
    fechaFinal: $("#FechaFin").val(),
    campanas: $("#campanas").val(),
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  $("#TablaReporteReferidos").html(""); // Limpiar tabla antes de agregar datos

  fetch(`${url}reporteReferidos/referidos`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Manejar los datos devueltos
      const resultadosPronet = data.resultadosPronet;
      const resultadosLealtadV2 = data.resultadosLealtadV2;

      // Manejar los resultados como lo necesites
      console.log("Resultados:", resultadosPronet);
      console.log("LealtadV2:", resultadosLealtadV2);

      // Mostrar los resultados en la tabla
      resultadosPronet.forEach((element) => {
        const { codigoReferidos } = element;
        const codigo = codigoReferidos ? codigoReferidos.codigo : "";
        const listado = `
          <tr> 
            <td>${element.fecha}</td>
            <td>${codigo}</td>
            <td>${element.plataforma}</td>
            <td>${element.refiriente}</td>
            <td>${element.referido}</td>
          </tr>
        `;
        $("#TablaReporteReferidos").append(listado);
      });

      // Mostrar los datos de lealtadV2 como lo necesites
      resultadosLealtadV2.forEach((item) => {
        // Aquí puedes manejar los datos de lealtadV2, como agregarlos a la tabla o mostrarlos en otro lugar de tu página
      });
    })
    .catch((error) => console.error(error));
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
