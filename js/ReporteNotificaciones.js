

const url = "http://localhost:3000/";
let tokenOfercraft = localStorage.getItem("token");
let datosObtenidos = null; // Variable global para almacenar los datos obtenidos

$(document).ready(function() {
    // Ocultar botones y tabla al inicio
    $("#btnDescargarExcel, #PantallaInfo, #Reenviar, .datatables-basic").hide();

    // Evento al hacer clic en "Consultar"
    $("#ConsultaParticipacion").on("click", function() {
        if ($("#fechaInicio").val() !== "" && $("#fechaFin").val() !== "") {
            getReport(); // Obtener datos al hacer clic en "Consultar"
        } else {
            Alert("Debe llenar todos los campos", "error");
        }
    });

    // Evento al hacer clic en "PantallaInfo"
    $("#PantallaInfo").on("click", function() {
        if (datosObtenidos) {
            mostrarDatosEnTabla(datosObtenidos);
            $(".datatables-basic").show(); // Mostrar tabla después de obtener datos
        } else {
            Alert("Primero debes obtener los datos", "error");
        }
    });

    // Evento al hacer clic en "Descargar Excel"
    $('#btnDescargarExcel').on("click", function() {
        descargarExcel(); // Descargar datos en Excel
    });
}); 

// Función para obtener el reporte de la API
const getReport = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const fechaInicio = $("#fechaInicio").val();
    const fechaFin = $("#fechaFin").val();

    if (!fechaInicio || !fechaFin) {
        console.error("Las fechas de inicio y fin son obligatorias.");
        return;
    }

    var raw = JSON.stringify({
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
    });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(`${url}ReporteNotificaciones/Notificacion`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Datos del informe de oferCraft:", result);
            if (result.queryNotificaciones && result.customerinfo) {
                datosObtenidos = [...result.queryNotificaciones, ...result.customerinfo];
                $("#btnDescargarExcel, #PantallaInfo, #Reenviar").show(); // Mostrar botones después de obtener los datos
            } else {
                console.error("El formato de los datos obtenidos no es correcto", result);
                Alert("El formato de los datos obtenidos no es correcto", "error");
            }
        })
        .catch((error) => {
            console.error("Error al obtener el informe de oferCraft:", error);
            Alert(error.message, "error");
        });
};


function mostrarDatosEnTabla(datos) {
  console.log("Datos para mostrar en la tabla:", datos);
  if (!Array.isArray(datos)) {
    console.error("Los datos no son un array:", datos);
    return;
  }

  // Inicializa la tabla si no está inicializada
  if (!$.fn.DataTable.isDataTable('#tableData')) {
    let tabla = $('.datatables-basic').DataTable({

        columnDefs: [
        { "defaultContent": "-", "targets": "_all" }
      ],
      order: [[1, 'asc']], // Ajuste para ordenar por la segunda columna (No.)
            ordering: true,
            language: {
        search: "Buscar:",
        searchPlaceholder: "Buscar",
        lengthMenu: "Mostrar _MENU_",
      },
      scrollX: true,
      columns: [
        { width: "5%" },   // Ancho de la columna de checkboxes
        { width: "20%" },   // Ancho de la columna de números
        { width: "20%" },  // Ancho de la columna de teléfono
        { width: "40%" },  // Ancho de la columna de cliente
        { width: "50%" },  // Ancho de la columna de campaña
        { width: "40%" },  // Ancho de la columna de fecha
        { width: "40%" }
    ]

    });
  
// 
//   let tabla = $('#tableData').DataTable();
//   console.log(tabla);

  // Limpia cualquier dato existente en la tabla
  tabla.clear().draw();


datos.forEach((element, index) => {
    const telefonoFormateado = formatTelefonoGuatemala(element.telefono);
    const nombreCompleto = element.nombre || "Sin nombre";
    const campana = element.campana || "Sin campaña";
    const fecha = element.fecha || "Sin fecha";
    const premio = element.premio || "Sin premio";

    tabla += `
    <tr> 
      <td><input type="checkbox" class="selectAll"></td>
      <td>${index + 1 }</td>
      <td>${telefonoFormateado}</td>
      <td>${nombreCompleto}</td>
      <td>${campana}</td>
      <td>${fecha}</td>
      <td>${premio}</td>
    </tr>
  `;
});
$('.datatables-basic tbody').html(tabla);

}
}
const formatTelefonoGuatemala = (telefono) => {
    const codigoPais = telefono.slice(0, 3); // Código de país (502)
    const parte1 = telefono.slice(3, 7);    // Primeros 4 dígitos
    const parte2 = telefono.slice(7);       // Últimos 4 dígitos
    return `(${codigoPais}) ${parte1}-${parte2}`; // Formato (502) 1234-5678
};

function descargarExcel() {
    const tabla = document.getElementById("TbPararticipantes");
    const wb = XLSX.utils.book_new();

    const data = [];
    let lineNumber = 1;

    for (let i = 0; i < tabla.rows.length; i++) {
        const row = [];
        row.push(lineNumber++);
        for (let j = 1; j < tabla.rows[i].cells.length; j++) {
            row.push(tabla.rows[i].cells[j].innerText);
        }
        data.push(row);
    }

    const headerRow1 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 18} } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: ' REPORTE DE NOTIFICACIONES', t: 's', s: { font: { sz: 18}, alignment: { horizontal: 'center' } } },
    ];
    const headerRow2 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 12 } } },
        { v: '', t: 's', s: { font: { sz: 12 }, alignment: { horizontal: 'center' } } },
    ];
    const headerRow3 = [''];
    const headerRow4 = [
        { v: '#', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'No.', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'TELÉFONO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'CLIENTE', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'CAMPAÑA', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'FECHA', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'PREMIO', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    ];
    data.unshift(headerRow1, headerRow2, headerRow3, headerRow4);

    const ws = XLSX.utils.aoa_to_sheet(data);

    ws['!cols'] = [
        { wch: 5 },
        { wch: 20 },
        { wch: 20 },
        { wch: 40 },
        { wch: 40 },
        { wch: 25 },
        { wch: 25 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'reporte_notificaciones.xlsx');
}

function formatearFechaHora(fechaHora) {
    const fecha = new Date(fechaHora);
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