const url = "http://localhost:3000/";
let token = localStorage.getItem("token");
let datosObtenidos = null; // Variable global para almacenar los datos obtenidos

$(function () {
  $("#btnDescargarExcel, #PantallaInfo").hide(); // Ocultar botones al inicio

  // Inicializar el plugin multiple-select
  $('#selectpromo').multipleSelect({
    filter: true,
    selectAll: true, // Habilitar la opción de seleccionar todos los elementos
    placeholder: "Elige una promoción",
  });

  getPromociones();

  $("#ConsultarPromo").on("click", function () {
    if (
      $("#selectpromo").val() !== null && // Verificar si se ha seleccionado al menos una opción
      $("#selectpromo").val().length > 0 && // Verificar si se ha seleccionado al menos una opción
      $("#FechaInicio").val() !== "" &&
      $("#FechaFin").val() !== ""
    ) {
      getReport();
    } else {
      Alert("Debe llenar todos los campos", "error");
    }
  });

  $("#PantallaInfo").on("click", function () {
    if (datosObtenidos !== undefined && datosObtenidos !== null) {
      mostrarDatosEnTabla(datosObtenidos);
    } else {
      Alert("Primero debes obtener los datos", "error");
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
      console.log("Promociones obtenidas:", result);
      // Limpiar el select antes de agregar opciones
      $("#selectpromo").empty();
      // Agregar la opción por defecto
      // $("#selectpromo").append(
      //   "<option disabled selected value='0'>Elige una promoción</option>"
      // );

      result.forEach((element) => {
        // Agregar opciones al select
        $("#selectpromo").append(
          // '<option value="' + element.id + '">' + element.nombre + "</option>"
          `<option value="${element.id}">[${element.fechaInicio} - ${element.fechaFin}] ${element.nombre}</option>`
        );
      });
      // Actualizar el select múltiple después de agregar opciones
      $('#selectpromo').multipleSelect('refresh');
    })
    .catch((error) => {
      console.error("Error al obtener promociones:", error);
      alert(error, "error");
    });
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
      datosObtenidos = result;
      $("#btnDescargarExcel, #PantallaInfo").show(); // Mostrar botones después de obtener los datos
    }).catch((error) => {
      console.error("Error al obtener el informe de promociones:", error);
      alert(error, "error");
    });
};

function mostrarDatosEnTabla(datos) {
  console.log("Datos para mostrar en la tabla:", datos);
  
  // Inicializa la tabla con DataTables
  let table = $('.datatables-basic').DataTable({
      order: [[0, 'asc']],
      ordering: true,
      language: {
          search: "Buscar:",
          searchPlaceholder: "Buscar",
          lengthMenu: "Mostrar _MENU_",
      },
      scrollX: true
  });
  
  // Limpia cualquier dato existente en la tabla
  table.clear().draw();
  
  datos.forEach((element) => {
    const fecha = formatearFechaHora(element.fecha);
    const { valor, } = element.detallepromocion.premiopromocion;
    const monto = parseFloat(element.detallepromocion.premiopromocion.valor).toFixed(2);
    const montoTransaccion = element.detallepromocion.premiopromocion.cantidad * monto;

    // Agrega una fila a la tabla
    table.row.add([
      element.descripcion,
      element.numeroTelefono,
      element.detallepromocion.premiopromocion.premio.premiocampania && element.detallepromocion.premiopromocion.premio.premiocampania[0] ? element.detallepromocion.premiopromocion.premio.premiocampania[0].etapa.campanium.nombre : '',
      element.detallepromocion.premiopromocion.premio.descripcion,
      monto,
      '',
      element.detallepromocion.cupon,
      '-',
      fecha,
      fecha
    ]).draw();
  });
}


document.getElementById("btnDescargarExcel").addEventListener("click", function () {
  console.log("Descargar Excel");

  const table = document.getElementById("TablaReportePromo"); // Obtener la tabla
  const wb = XLSX.utils.book_new(); // Crear un nuevo libro de Excel

  // Obtener los datos de la tabla
  const data = [];
  for (let i = 0; i < table.rows.length; i++) {
    const row = [];
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      row.push(table.rows[i].cells[j].innerText);
    }
    // Insertar una celda vacía al principio del array para iniciar desde la columna "A"
    row.unshift("");
    data.push(row);
  }

  // Agregar el encabezado
  // Agregar el encabezado
  const headerRow1 = [
    { v: '', t: 's', s: { font: { name: 'Courier', sz: 18 } } },
    { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
    { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
    { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
    { v: 'REPORTE DE PROMOCIONES', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
  ];
  const headerRow2 = [
    { v: '', t: 's', s: { font: { name: 'Courier', sz: 12 } } },
    { v: '', t: 's', s: { font: { sz: 12 }, alignment: { horizontal: 'center' } } },
  ];
  const headerRow3 = [''];
  const headerRow4 = [
    '',
    { v: 'NOMBRE', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'TELEFONO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'CAMPAÑA', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'PREMIO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'MONTO PREMIO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'TRANSACCIÓN', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'CÓDIGO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'MONTO TRANSACCIONES', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'FECHA ACREDITACIÓN', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'FECHA PARTICIPACIÓN', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
  ];
  data.unshift(headerRow1, headerRow2, headerRow3, headerRow4);

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Ajustar el ancho de las columnas al contenido
  ws['!cols'] = [{wch:15}, {wch:15}, {wch:12}, {wch:25}, {wch:20}, {wch:15}, {wch:15}, {wch:15}, {wch:15}, {wch:20}, {wch:20}];

  // Combinar las celdas E1, F1 y G1
  if(!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push({s:{r:0,c:4}, e:{r:0,c:6}});

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Descargar el archivo Excel
  XLSX.writeFile(wb, "reporte_promociones.xlsx");
});

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
