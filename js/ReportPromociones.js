const url = "http://localhost:3000/";
let token = localStorage.getItem("token");
let datosObtenidos = null; 

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

    if (datosObtenidos) {
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
      $("#selectpromo").empty();

      result.forEach((element) => {
        // Agregar opciones al select
        $("#selectpromo").append(
          `<option value="${element.id}">[${element.fechaInicio} - ${element.fechaFin}] ${element.nombre}</option>`
        );
      });
      // Actualizar el select múltiple después de agregar opciones
      $('#selectpromo').multipleSelect('refresh');
    })
    .catch((error) => {
      console.error("Error al obtener promociones:", error);
      Alert("Error al obtener promociones: " + error.message);
    });
};

const getReport = () => {
  const fechaInicio = $("#FechaInicio").val();
  const fechaFin = $("#FechaFin").val();

  // Convertir las cadenas de fecha en objetos Date para la comparación
  const dateInicio = new Date(fechaInicio);
  const dateFin = new Date(fechaFin);

  // Comprueba si la fecha de inicio es mayor que la fecha de fin
  if (dateInicio > dateFin) {
    Alert("La Fecha Final no puede ser menor a fecha Inicial", "error");
    return; // Evitar hacer la llamada al servidor si la fecha de inicio es mayor
  }

  const myHeaders = new Headers({ "Content-Type": "application/json" });
  const body = JSON.stringify({
    promocion: $("#selectpromo").val(),
    fechaInicial: fechaInicio,
    fechaFinal: fechaFin,
  });

  fetch(url + "reportePromocion", { method: "POST", headers: myHeaders, body: body })
    .then(response => response.json())
    .then(result => {
      datosObtenidos = result;
      if (datosObtenidos.length === 0) {
        Alert("No se encontraron datos en las fechas seleccionadas", "error");
        $("#btnDescargarExcel, #PantallaInfo").hide();
      } else {
        $("#btnDescargarExcel, #PantallaInfo").show();
      }
      limpiarTabla();
    })
    .catch(error => {
      console.error("Error al obtener el informe de promociones:", error);
      alert("Error al obtener el informe: " + error.message);
    });
};
function limpiarTabla() {
  if ($.fn.DataTable.isDataTable('.datatables-basic')) {
    $('.datatables-basic').DataTable().clear().destroy();
  }
}

function formatearTelefono(telefono) {
  // Asumir código de país "502" si no está presente
  let codigoPais = '502';
  let numeroLocal = telefono;  // Ya debería ser solo el número local sin código de país
  // Comprobar si el número ya incluye el código de país
  if (telefono.length > 8) {
    codigoPais = telefono.substring(0, 3);
    numeroLocal = telefono.substring(3);
  }
  // Formatear a la estructura deseada
  return `(${codigoPais}) ${numeroLocal.substring(0, 4)}-${numeroLocal.substring(4)}`;
}


function mostrarDatosEnTabla(datos) {
  // Check if a DataTable instance already exists
  if ($.fn.DataTable.isDataTable('.datatables-basic')) {
    // Destroy the current instance
    $('.datatables-basic').DataTable().destroy();
    // Clear the table body to ensure fresh data insertion
    $('.datatables-basic tbody').empty();
  }
  let table = $('.datatables-basic').DataTable({
    destroy: true,
    order: [[0, 'asc']],
    ordering: true,
    language: {
      search: "Buscar:",
      searchPlaceholder: "Buscar",
      lengthMenu: "Mostrar _MENU_",
    },
    scrollX: true,
  });

  table.clear(); // Limpia los datos actuales de la tabla

  datos.forEach(element => {
    let telefonoFormateado = formatearTelefono(element.numeroTelefono);
    const fecha = formatearFechaHora(element.fecha);
    const monto = parseFloat(element.detallepromocion.premiopromocion.valor).toFixed(2);

    table.row.add([
      element.descripcion,
      telefonoFormateado,
      element.detallepromocion.premiopromocion.premio.premiocampania && element.detallepromocion.premiopromocion.premio.premiocampania[0] ? element.detallepromocion.premiopromocion.premio.premiocampania[0].etapa.campanium.nombre : '',
      element.detallepromocion.premiopromocion.premio.descripcion,
      monto,
      '',
      element.detallepromocion.cupon,
      '',
      fecha,
      fecha
    ]);
  });

  table.draw(); // Dibuja la tabla con los nuevos datos
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
    { v: 'REPORTE DE CÓDIGOS PROMOCIONALES', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
  ];
  const headerRow2 = [
    { v: '', t: 's', s: { font: { name: 'Courier', sz: 12 } } },
    { v: '', t: 's', s: { font: { sz: 12 }, alignment: { horizontal: 'center' } } },
  ];
  const headerRow3 = [''];
  const headerRow4 = [
    '',
    { v: 'NOMBRE', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'TELÉFONO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
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
  ws['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }];

  // Combinar las celdas E1, F1 y G1
  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push({ s: { r: 0, c: 4 }, e: { r: 0, c: 6 } });

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
