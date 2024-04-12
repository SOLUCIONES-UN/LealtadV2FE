const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

$(function () {

  // Deshabilitar el botón al inicio
  $("#btnDescargarExcel").prop("disabled", true);
  getPromociones();

  $("#ConsultarPromo").on("click", function () {
    if (
      $("#selectpromo").val() !== "0" &&
      $("#FechaInicio").val() !== "" &&
      $("#FechaFin").val() !== ""
    ) {
      getReport();
    } else {
      Alert("Debe llenar todos los campos", "error");
    }
  });
});

const getPromociones = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: token },
  };

  fetch(url + "Promocion", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Promociones obtenidas:", result); // Agregar console.log para ver las promociones obtenidas
      $("#selectpromo").html(
        "<option disabled selected value='0'>Elige una promoción</option>"
      );

      result.forEach((element) => {
        $("#selectpromo").append(
          '<option value="' + element.id + '">' + element.nombre + "</option>"
        );
      });
    })
    .catch((error) => alert(error, "error"));
};

const getReport = () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    promocion: $("#selectpromo").val(),
    fechaInicial: $("#FechaInicio").val(),
    fechaFinal: $("#FechaFin").val(),
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(url + "reportePromocion", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Datos del informe de promociones:", result); 
      mostrarDatosEnTabla(result);
    })
    .catch((error) => alert(error, "error"));
};

document.getElementById("btnDescargarExcel").addEventListener("click", function () {
  const table = document.getElementById("tableData"); // Obtener la tabla
  const wb = XLSX.utils.book_new(); // Crear un nuevo libro de Excel

  // Obtener los datos de la tabla
  const data = [];
  const headers = [];
  for (let i = 0; i < table.rows.length; i++) {
    const row = [];
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      if (i === 0) {
        // Obtener los nombres de las columnas de la primera fila
        headers.push(table.rows[i].cells[j].innerText);
      } else {
        row.push(table.rows[i].cells[j].innerText);
      }
    }
    if (i !== 0) {
      data.push(row);
    }
  }

  // Agregar los datos y los nombres de las columnas a una hoja
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Descargar el archivo Excel
  XLSX.writeFile(wb, "reporte_promociones.xlsx");
});

function mostrarDatosEnTabla(datos) {
  console.log("Datos para mostrar en la tabla:", datos); 
  $("#TablaReportePromo").empty(); 
  datos.forEach((element) => {
    const fecha = formatearFechaHora(element.fecha);
    const { cupon, esPremio, descripcion } =
      element.detallepromocion.premiopromocion;
    const monto = parseFloat(
      element.detallepromocion.premiopromocion.valor
    ).toFixed(2);
    const montoTransaccion =
      element.detallepromocion.premiopromocion.cantidad * monto;

    const fila = `
      <tr> 
        <td>${element.fecha}</td>
        <td>${element.numeroTelefono}</td>
        <td>${element.descripcion}</td>
        <td>${element.id}</td>
        <td>${element.detallepromocion.premiopromocion.premio.descripcion}</td>
        <td>${monto}</td>
        <td>${element.detallepromocion.premiopromocion.idPromocion}</td>
        <td>${element.detallepromocion.cupon}</td>
        <td>${montoTransaccion}</td>
        <td>${fecha}</td>
      </tr>
    `;
    $("#TablaReportePromo").append(fila);
  });

  // Habilitar el botón de descarga de Excel una vez que se muestra la tabla
  $("#btnDescargarExcel").prop("disabled", false);
}

function formatearFechaHora(fechaHora) {
  const fecha = new Date(fechaHora);
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  return `${dia}/${mes}/${año}`;
}

const Alert = function (message, status) {
  toastr[`${status}`](message, `${status}`, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: "toast-top-right",
    rtl: false,
  });
};
