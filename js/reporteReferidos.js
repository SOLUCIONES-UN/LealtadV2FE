const url = "http://localhost:3000/";
let token = localStorage.getItem("token");
let datosObtenidos = null; // Variable global para almacenar los datos obtenidos

$(function () {
  $("#btnDescargarExcel, #PantallaInfo, #tableData").hide();
  
  // Inicializar el plugin multiple-select
  $('#selectcampana').multipleSelect({
    filter: true,
    selectAll: true, // Habilitar la opción de seleccionar todos los elementos
    placeholder: "selecciona una opción",
  });

  getCampaniasActivas();
  
  function validarFechas() {
    const FechaInicio = document.getElementById('FechaInicio').value;
    const FechaFin = document.getElementById('FechaFin').value;
  
    if (FechaInicio === FechaFin) {
        Alert('Las fechas de inicio y fin no pueden ser iguales.','error');
    }
  }
  
  window.onload = function() {
    document.getElementById('FechaInicio').addEventListener('change', validarFechas);
    document.getElementById('FechaFin').addEventListener('change', validarFechas);
  }
  

  $("#btnConsultar").click(function () {
    if (
      $("#selectcampana").val() !== null && // Verificar si se ha seleccionado al menos una opción
      $("#selectcampana").val().length > 0 && // Verificar si se ha seleccionado al menos una opción
      $("#FechaInicio").val() !== "" &&
      $("#FechaFin").val() !== ""
    ) {
      getReport();
      $("#btnDescargarExcel, #PantallaInfo").show();
    } else {
      Alert("Necesita completar todos los campos.","error");
    }
  });

  $("#PantallaInfo").click(function () {
    if (datosObtenidos) {
      $("#tableData").show(); // Mostrar la tabla con el ID correcto
      mostrarDatosEnTabla(datosObtenidos);
    } else {
      Alert("Primero debes obtener los datos","error");
    }
  });
});

const getCampaniasActivas = () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`${url}Campania`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Campañas obtenidas:", result);
      // Limpiar el select antes de agregar opciones
      $("#selectcampana").empty();
      // Agregar opciones al select
      result.forEach((element) => {
        $("#selectcampana").append(`<option value="${element.nombre}">[${element.fechaInicio} - ${element.fechaFin}] ${element.nombre}</option>`);
      });
      // Actualizar el select múltiple después de agregar opciones
      $('#selectcampana').multipleSelect('refresh');
    })
    .catch((error) => {
      console.error("Error al obtener campañas:", error);
      Alert("Error al obtener campañas.","error");
    });
};

const getReport = () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const FechaInicio = $("#FechaInicio").val();
  const FechaFin = $("#FechaFin").val();
  const nombreCampania = $("#nombre").val();

  // Convertir las cadenas de fecha en objetos Date para la comparación
  const dateInicio = new Date(FechaInicio);
  const dateFin = new Date(FechaFin);

  // Comprueba si la fecha de inicio es mayor que la fecha de fin
  if (dateInicio > dateFin) {
    Alert("La Fecha Final no puede ser menor a fecha Inicial", "error");
    return; // Evitar hacer la llamada al servidor si la fecha de inicio es mayor
  }

  var raw = JSON.stringify({
    fechaInicio: FechaInicio,
    fechaFin: FechaFin,
    nombreCampania: nombreCampania,
    campanas: $("#selectcampana").val(),
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  $("#TbRepReferidos").html("");

  fetch(`${url}reporteReferidos/referidos`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      datosObtenidos = data;
      // Habilitar el botón PantallaInfo solo si hay datos
      if (datosObtenidos && datosObtenidos.length > 0) {
        $("#PantallaInfo").prop("disabled", false);
      } else {
        Alert("No se encontraron datos para las fechas seleccionadas.","error");
        $("#PantallaInfo").prop("disabled", true);
      }
    })
    .catch((error) => {
      console.error("Error al obtener reporte de referidos:", error);
      Alert("Error al obtener reporte de referidos.","error");
    });
};


function mostrarDatosEnTabla(datos) {
  console.log("Datos para mostrar en la tabla:", datos);
  if (!Array.isArray(datos)) {
    console.error("Los datos no son un array:", datos);
    return;
  }

  if (!$.fn.DataTable.isDataTable('#tableData')) {
    $('#tableData').DataTable({
      columnDefs: [
        { "defaultContent": "-", "targets": "_all" }
      ],
      order: [[0, 'asc']],
      ordering: true,
      language: {
        search: "Buscar:",
        searchPlaceholder: "Buscar",
        lengthMenu: "Mostrar _MENU_",
      },
      scrollX: true
    });
  }

  let table = $('#tableData').DataTable();

  // Limpia cualquier dato existente en la tabla
  table.clear().draw();

  let contador = 1;

  
  datos.forEach((element) => {
    const fechaHora = formatearFechaHora(element.fecha);
    const campanas = element.nombre_campania; // Nombre de la campaña
    const opcion = element.opcion_referido || "No aplica";
    const formatTelefonoGuatemala = element.telefono_usuario;
    const nombreUsuario = element.nombre_usuario || "No aplica";
    const montopremio = element.valor || "No aplica";
    
    // Asegúrate de que customerInfo tenga al menos un elemento antes de acceder a él
    const customerInfo = (Array.isArray(element.customerInfo) && element.customerInfo.length > 0) ? element.customerInfo[0] : {};
    const codigo = customerInfo.codigo || "No aplica";
    const nombreReferido = customerInfo.nombreReferido || "No aplica";
    const telefReferido = customerInfo.noreferido || "No aplica";
   

    // Agrega una fila a la tabla
    table.row.add([
      contador++,
      opcion,
      campanas,
      codigo,
      formatTelefonoGuatemala,
      nombreUsuario,
      fechaHora,
      element.descripcionTrx,
      montopremio,
      telefReferido,
      nombreReferido,
    ]).draw();
  });
}

const formatTelefonoGuatemala = (telefono) => {
  const codigoPais = telefono.slice(0, 3); // Código de país (502)
  const parte1 = telefono.slice(3, 7);    // Primeros 4 dígitos
  const parte2 = telefono.slice(7);       // Últimos 4 dígitos
  return `(${codigoPais}) ${parte1}-${parte2}`; // Formato (502) 1234-5678
};

document.getElementById("btnDescargarExcel").addEventListener("click", function () {
  console.log("Descargar Excel");

  const table = document.getElementById("TbRepReferidos"); // Obtener la tabla
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
    { v: 'REPORTE DE REFERIDOS', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
  ];
  const headerRow2 = [
    { v: '', t: 's', s: { font: { name: 'Courier', sz: 12 } } },
    { v: '', t: 's', s: { font: { sz: 12 }, alignment: { horizontal: 'center' } } },
  ];
  const headerRow3 = [''];
  const headerRow4 = [
    '',
    { v: '#', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'MEDIO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'CAMPAÑA', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'CÓDIGO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'TELÉFONO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'NOMBRE USUARIO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'FECHA y HORA', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'TRANSACCIÓN', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'MONTO PREMIO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'TELÉFONO REFERIDO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    { v: 'NOMBRE REFERIDO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },

  ];
  data.unshift(headerRow1, headerRow2, headerRow3, headerRow4);

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Ajustar el ancho de las columnas al contenido
  ws['!cols'] = [{wch:15}, {wch:15}, {wch:12}, {wch:25}, {wch:20}, {wch:15}, {wch:15}, {wch:20}, {wch:20}, {wch:20}, {wch:25}];

  // Combinar las celdas E1, F1 y G1
  if(!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push({s:{r:0,c:4}, e:{r:0,c:6}});

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Descargar el archivo Excel
  XLSX.writeFile(wb, "Reporte_Referidos.xlsx");
});

function formatearFechaHora(fechaHora) {
  if (!fechaHora) return ''; // Si la fecha es nula o indefinida, devuelve una cadena vacía

  const fecha = new Date(fechaHora);
  if (isNaN(fecha.getTime())) return ''; // Si la fecha es inválida, devuelve una cadena vacía

  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  return `${dia}/${mes}/${año} ${horas}:${minutos}`;
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