const url = "http://localhost:3000/";
let token = localStorage.getItem("token");
let datosObtenidos = null; // Variable global para almacenar los datos obtenidos
let archivadas = 0;

$(function () {
    $("#btnDescargarExcel, #PantallaInfo, #tableData").hide();
    
    // Inicializar el plugin multiple-select
    $('#selecCampania').multipleSelect({
      filter: true,
      selectAll: true, // Habilitar la opción de seleccionar todos los elementos
      placeholder: "",
    });
  
    getCampaniasActivas();
  
    $("#btnConsultar").click(function () {
      getReport();
  
      if (
        $("#selecCampania").val() !== null && // Verificar si se ha seleccionado al menos una opción
        $("#selecCampania").val().length > 0 && // Verificar si se ha seleccionado al menos una opción
        $("#FechaInicio").val() !== "" &&
        $("#FechaFin").val() !== ""
      ) {
        $("#btnDescargarExcel, #PantallaInfo").show();
      } else {
        alert("Necesita completar todos los campos.");
      }
    });
  
    $("#PantallaInfo").click(function () {
      if (datosObtenidos && datosObtenidos.participantesCamp && datosObtenidos.infoCustom) {
        $("#tableData").show(); // Mostrar la tabla con el ID correcto
        mostrarDatosEnTabla(datosObtenidos.participantesCamp, datosObtenidos.infoCustom);
      } else {
        // alert("Primero debes obtener los datos");  
      }
    });
  
    // Agregar evento de escucha al checkbox
    $("#checkboxArchivadas").on("change", function() {
      // Obtener el valor del checkbox
      archivadas = this.checked ? 1 : 0;
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
        $("#selecCampania").empty();
        // Agregar opciones al select
        result.forEach((element) => {
          $("#selecCampania").append(`<option value="${element.nombre}">[${element.fechaInicio} - ${element.fechaFin}] ${element.nombre}</option>`);
        });
        // Actualizar el select múltiple después de agregar opciones
        $('#selecCampania').multipleSelect('refresh');
      })
      .catch((error) => {
        console.error("Error al obtener campañas:", error);
        alert("Error al obtener campañas.");
      });
  };
  
  const getReport = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const fechaInicio = $("#FechaInicio").val();
    const fechaFin = $("#FechaFin").val();
    const campanias = $("#selecCampania").val();
    const archivadas = $("#checkboxArchivadas").val();
  
    if (!fechaInicio || !fechaFin) {
      console.error("Las fechas de inicio y fin son obligatorias.");
      return;
    }
  
    var raw = JSON.stringify({
      campanias: campanias,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      archivadas: archivadas
    });
  
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    $("#TbPartCampania").html("");
  
    fetch(`${url}ReporteParticipanteCampania/participantes`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        datosObtenidos = data;
        $("#PantallaInfo").prop("disabled", false);
      })
      .catch((error) => {
        console.error("Error al obtener reporte de referidos:", error);
        alert("Error al obtener reporte de referidos.");
      });
  };
  
  function mostrarDatosEnTabla(participantesCamp, infoCustom) {
    console.log("Datos para mostrar en la tabla:", participantesCamp, infoCustom);
  
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
  
    participantesCamp.forEach((element) => {
      const fechaParticipacion = formatearFechaHora(element.fechaParticipacion);
      const campanas = element.nombre_campania;
      const telefono_usuario = element.telefono_usuario;
      const nombre_usuario = element.nombre_usuario;
      const montopremio = element.valor;
      const codigo = element.codigo;
      const descripcion = element.premio;
      const descripcionTrx = element.descripcionTrx;
      // const montoTransaccion = element.montoTransaccion;
  
      table.row.add([
        contador++,
        fechaParticipacion,
        telefono_usuario,
        nombre_usuario,
        campanas,
        descripcion,
        montopremio,
        descripcionTrx,
        montopremio,
        codigo,
        fechaParticipacion,

      ]).draw();
    });
  }
 


document.getElementById("btnDescargarExcel").addEventListener("click", function () {
    console.log("Descargar Excel");
  
    const table = document.getElementById("TbPartCampania"); // Obtener la tabla
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
    { v: 'REPORTE DE PARTICIPANTES POR CAMPAÑA', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
  ];
  const headerRow2 = [
    { v: '', t: 's', s: { font: { name: 'Courier', sz: 12 } } },
    { v: '', t: 's', s: { font: { sz: 12 }, alignment: { horizontal: 'center' } } },
  ];
  const headerRow3 = [''];
  const headerRow4 = [
    '',
    { v: '#', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Fecha Acreditacion', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Telefono', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Nombre', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Campaña', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Premio', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Monto Premio', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Transaccion', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Monto Transaccion', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Codigo', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
    { v: 'Fecha Participacion', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal:'center' }, fill: { fgColor: { rgb: '595959' } } } },
];
  data.unshift(headerRow1, headerRow2, headerRow3, headerRow4);

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Ajustar el ancho de las columnas al contenido
  ws['!cols'] = [{wch:10}, {wch:10}, {wch:30}, {wch:30}, {wch:20}, {wch:15}, {wch:15}, {wch:20}, {wch:20},{wch:20}, {wch:20}, {wch:20},{wch:27}];

  // Combinar las celdas E1, F1 y G1
  if(!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push({s:{r:0,c:4}, e:{r:0,c:6}});

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Descargar el archivo Excel
  XLSX.writeFile(wb, "Reporte_Participantes.xlsx");
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
