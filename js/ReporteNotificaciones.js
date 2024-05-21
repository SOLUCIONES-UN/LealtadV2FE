const url = "http://localhost:3000/";
let tokenOfercraft = localStorage.getItem("token");
let datosObtenidos = null; // Variable global para almacenar los datos obtenidos

$(function() {
    $("#btnDescargarExcel, #PantallaInfo, #Reenviar, #tableData").hide(); // Ocultar botones al inicio

    $("#ConsultaParticipacion").on("click", function() {
        if ($("#fechaInicio").val() !== "" && $("#fechaFin").val() !== "") {
            // Mostrar los botones al hacer clic en "Consultar"
            $("#btnDescargarExcel, #PantallaInfo, #Reenviar").show();
            getReport();
        } else {
            Alert("Debe llenar todos los campos", "error");
        }
    });

    $("#PantallaInfo").on("click", function() {
        if (datosObtenidos) {
            mostrarDatosEnTabla(datosObtenidos);
              $("#tableData").show(); 
        } else {
            Alert("Primero debes obtener los datos", "error");
        }
    });
});

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
                $("#btnDescargarExcel, #PantallaInfo").show(); // Mostrar botones después de obtener los datos
            } else {
                console.error("El formato de los datos obtenidos no es correcto", result);
                // Alert("El formato de los datos obtenidos no es correcto", "error");
            }
        })
        .catch((error) => {
            console.error("Error al obtener el informe de oferCraft:", error);
            Alert(error.message, "error");
        });
};

function mostrarDatosEnTabla(datos) {
    console.log("Datos para mostrar en la tabla:", datos);
    $('#tableData').DataTable({
        data: datos,
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
        scrollX: true,
    
    });

      
    let tabla = '';
    let contador = 1; // Contador para la columna de número

    datos.forEach((element) => {
        const telefono = element.telefono || "Desconocido";
        const nombre = element.nombre || "Sin nombre";
        const campana = element.campana || "Sin campaña";
        const fecha = element.fecha || "Sin fecha";
        const premio = element.premio || "Sin premio";

        tabla += `
            <tr>
                <td><input type="checkbox" class="selectRow"></td>
                <td>${contador++}</td>
                <td>${telefono}</td>
                <td>${nombre}</td>
                <td>${campana}</td>
                <td>${fecha}</td>
                <td>${premio}</td>
            </tr>
        `;
    });

    $('#TbPararticipantes').html(tabla);

    // Manejar la selección de todas las filas
    $('#selectAll').on('click', function () {
        const rows = $('#tableData').DataTable().rows({ 'search': 'applied' }).nodes();
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    // Manejar la selección de filas individualess
    $('#TbPararticipantes').on('click', '.selectRow', function () {
        if (!this.checked) {
            const el = $('#selectAll').get(0);
            if (el && el.checked && ('indeterminate' in el)) {
                el.indeterminate = true;
            }
        }
    });

    // Evento para mostrar la cantidad de filas seleccionadas
    $('#Reenviar').on('click', function () {
        const selectedRows = $('#tableData').DataTable().rows('.selected').data().length;
        alert(selectedRows + ' fila(s) seleccionada(s)');
    });
}

document.addEventListener("DOMContentLoaded", function() {
    $('#tableData').DataTable(); // Inicializar DataTable

    document.getElementById("btnDescargarExcel").addEventListener("click", function() {
        console.log("Descargar Excel");

        const table = document.getElementById("TbPararticipantes");
        const wb = XLSX.utils.book_new();

        // Obtener los datos de la tabla sin la columna de checkboxes
        const data = [];
        let lineNumber = 1;

        for (let i = 0; i < table.rows.length; i++) {
            const row = [];
            row.push(lineNumber++);
            for (let j = 1; j < table.rows[i].cells.length; j++) {
                row.push(table.rows[i].cells[j].innerText);
            }
            data.push(row);
        }

        // Agregar el encabezado
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
            { v: 'Telefono', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
            { v: 'Cliente', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
            { v: 'Campaña', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
            { v: 'Fecha', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
            { v: 'Premio', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        ];
        data.unshift(headerRow1, headerRow2, headerRow3, headerRow4);

        const ws = XLSX.utils.aoa_to_sheet(data);

        // Ajustar el ancho de las columnas al contenido
        ws['!cols'] = [
            { wch: 5 }, // Número columna
            { wch: 20 },
            { wch: 20 }, // Teléfono columna
            { wch: 40 }, // Cliente columna
            { wch: 40 }, // Campaña columna
            { wch: 25 }, // Fecha columna
            { wch: 25 }, // Premio columna
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
        XLSX.writeFile(wb, 'reporte_notificaciones.xlsx');
    });
});


function formatearFechaHora(fechaHora) {
    const fecha = new Date(fechaHora);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, "0");
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
}

const Alert = function(message, status) {
    toastr[`${status}`](message, `${status}`, {
        closeButton: true,
        tapToDismiss: false,
        positionClass: "toast-top-right",
        rtl: false,
    });
};
