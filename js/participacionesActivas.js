const url = "http://localhost:3000/";
let token = localStorage.getItem("token");
let datosObtenidos = null; // Variable global para almacenar los datos obtenidos
let archivadas = 0;
$(function() {
    $("#btnDescargarExcel, #PantallaInfo").hide(); // Ocultar botones al inicio

    // Inicializar el plugin multiple-select
    $('#selecCampania').multipleSelect({
        filter: true,
        selectAll: true, // Habilitar la opción de seleccionar todos los elementos
        placeholder: "Elige una promoción",
    });

   

    $("#ConsultarPromo").on("click", function() {
        if (
            $("#FechaInicio").val() !== "" &&
            $("#FechaFin").val() !== "" 
        ) {
            getReport();
        } else {
            Alert("Debe llenar todos los campos", "error");
        }
    });

    $("#PantallaInfo").on("click", function() {
        if (datosObtenidos) {
            mostrarDatosEnTabla(datosObtenidos);
        } else {
            Alert("Primero debes obtener los datos", "error");
        }
    });

    // Agregar evento de escucha al checkbox
    $("#checkboxArchivadas").on("change", function() {
        // Obtener el valor del checkbox
        archivadas = this.checked ? 1 : 0;
        // Llamar a la función getReport con el valor del checkbox como parámetro

    });
});



const getReport = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        fecha1: $("#FechaInicio").val(),
        fecha2: $("#FechaFin").val(),
        


    });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(url + "ParticipacionesActivas", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Datos del informe de oferCraft:", result);
            datosObtenidos = result;
            $("#btnDescargarExcel, #PantallaInfo").show(); // Mostrar botones después de obtener los datos
        })
        .catch((error) => {
            console.error("Error al obtener el informe de oferCraft:", error);
            alert(error, "error");
        });
};


function mostrarDatosEnTabla(datos) {
    console.log("Datos para mostrar en la tabla:", datos);
    $("#TablaReportePromo").empty();
    if ($.fn.dataTable.isDataTable('.datatables-basic')) {
        $('.datatables-basic').DataTable().destroy();
    }
    let tabla = '';
    datos.forEach((element) => {
        element.participaciones.forEach((participacion) => {
            const fecha = formatearFechaHora(participacion.fecha);
            const telefono = participacion.customerInfo ? participacion.customerInfo.telno : "Desconocido";
            const descripcionTrx = participacion.descripcionTrx || "Sin descripción";
            const valor = participacion.valor || "Sin valor";
            const nombre = participacion.customerInfo ? participacion.customerInfo.fname : "Sin nombre";
            const codigo = participacion.customerInfo ? participacion.customerInfo.customer_reference : "Sin código";
            const nombreCampania = participacion.campanium ? participacion.campanium.nombre : "Sin campaña";
            const fechaCreacion = participacion.campanium ? participacion.campanium.fechaCreacion : "Sin fecha";
            const premioDescripcion = participacion.premioDescripcion || "Sin premio";
            const premioMonto = participacion.detallepromocion && participacion.detallepromocion.premiopromocion ? parseFloat(participacion.detallepromocion.premiopromocion.valor).toFixed(2) : "0.00";
            const cupon = participacion.detallepromocion ? participacion.detallepromocion.cupon : "Sin cupón";

            tabla += `
        <tr> 
          <td>${fechaCreacion}</td>
          <td>${telefono}</td>
          <td>${nombre}</td>
          <td>${nombreCampania}</td>
          <td>${premioDescripcion}</td>
          <td>${valor}</td>
          <td>${descripcionTrx}</td>
          <td>${codigo}</td>
          <td>${premioMonto}</td>
          <td>${fecha}</td>
        </tr>
      `;
        });
    });
    $('.datatables-basic tbody').html(tabla);
    $('.datatables-basic').DataTable({
        order: [[0, 'asc']],
        ordering: true,
        language: {
            search: "Buscar:",
            searchPlaceholder: "Buscar",
            lengthMenu: "Mostrar _MENU_",
        },
        lengthMenu: [10, 25, 50, 100], // Opciones de cantidad de registros a mostrar
        dom: 'lrtip', // Posición de los elementos de control
        pagingType: "simple_numbers", // Tipo de paginación

    });
}


document.getElementById("btnDescargarExcel").addEventListener("click", function() {
    console.log("Descargar Excel");

    const table = document.getElementById("TablaReportePromo"); // Obtener la tabla
    const wb = XLSX.utils.book_new(); // Crear un nuevo libro de Excel

    // Obtener los datos de la tabla
    const data = [];
    let lineNumber = 1;

    for (let i = 0; i < table.rows.length; i++) {
        const row = [];
        row.push({ v: lineNumber++ });
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            row.push(table.rows[i].cells[j].innerText);
        }
        // Insertar una celda vacía al principio del array para iniciar desde la columna "A"
        row.unshift("");
        data.push(row);
    }

    // Agregar el encabezado
    const headerRow1 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 18 } } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: '', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
        { v: ' REPORTE DE NOTIFICACIONES  OFFERCRAFT', t: 's', s: { font: { sz: 18 }, alignment: { horizontal: 'center' } } },
    ];
    const headerRow2 = [
        { v: '', t: 's', s: { font: { name: 'Courier', sz: 12 } } },
        { v: '', t: 's', s: { font: { sz: 12 }, alignment: { horizontal: 'center' } } },
    ];
    const headerRow3 = [''];
    const headerRow4 = [
        '',
        { v: '#', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Fecha Acreditacion', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Telefono', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Nombre', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Campaña', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Premio', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Monto Premio', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Transaccion', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Codigo', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Monto Transaccion', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
        { v: 'Fecha Participacion', t: 's', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '808080' } } } },
    ];
    data.unshift(headerRow1, headerRow2, headerRow3, headerRow4);

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Ajustar el ancho de las columnas al contenido
    ws['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 25 }, // Ajuste de ancho para 'Campaña' y 'Fecha Participacion'
        { wch: 20 },
        { wch: 20 },
        { wch: 12 },
        { wch: 20 },
        { wch: 12 },
    ];

    // Combinar las celdas E1, F1 y G1
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 0, c: 4 }, e: { r: 0, c: 6 } });

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Descargar el archivo Excel
    XLSX.writeFile(wb, "reporte_OfferCraft.xlsx");
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

const Alert = function(message, status) {
    toastr[`${status}`](message, `${status}`, {
        closeButton: true,
        tapToDismiss: false,
        positionClass: "toast-top-right",
        rtl: false,
    });
};