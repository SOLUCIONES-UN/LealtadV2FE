

const url = "http://localhost:3000/";
let tokenGeneral = localStorage.getItem("token");
let globalData = [];



$(function() {
    $("#ConsultarReferido").click(function() {
        const fecha1 = $("#fecha1").val().trim();
        const fecha2 = $("#fecha2").val().trim();
        if (fecha1 !== '' && fecha2 !== '') {
            getParticipacionesFechasGeneral(fecha1, fecha2);
        } else {
            console.error('Por favor, ingresa ambas fechas.');
        }
    });
    

});



function validarFechas() {
    const fecha1 = document.getElementById('fecha1').value;
    const fecha2 = document.getElementById('fecha2').value;

    if (fecha1 && fecha2 && fecha1 >= fecha2) {
        Alert('La fecha fin debe ser mayor que la fecha de inicio.', 'error');
    }
}

window.onload = function() {
    document.getElementById('fecha1').addEventListener('blur', validarFechas);
    document.getElementById('fecha2').addEventListener('blur', validarFechas);
}




const getParticipacionesFechasGeneral = (fecha1, fecha2) => {
    var requestOptions = {
        method: "GET",
        headers: {
            "Authorization": tokenGeneral
        }
    };

    fetch(`${url}reporteGeneralReferido/${fecha1}/${fecha2}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos.');
            }
            return response.json();
        })
        .then(datos => {
          
            $("#MostrarTabla").css("display", "block");
            $("#excel").css("display", "block");
            $(".card-datatable").css("display", "block");
      
            $("#MostrarTabla").unbind().click(function() {
                mostrarDatosEnTabla(datos);
            });
            $("#excel").unbind().click(function() {
                generarExcel(datos);
            });
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            Alert('Ha ocurrido un error al obtener los datos.', 'error');
        });
};

const mostrarDatosEnTabla = (datos) => {
    if ($.fn.dataTable.isDataTable('.datatables-basic')) {
        $('.datatables-basic').DataTable().destroy();
    }
    let tabla = '';
    let contador = 1;
    datos.forEach(array => {
        array.forEach(dato => {
            tabla += `
                <tr>
                <td>${contador++}</td>
                <td>${dato.codigo}</td>
                <td>${dato.nombreReferidor}</td>
                    <td>${dato.userno}</td>
                    <td>${dato.nombreReferido}</td>
                    <td>${dato.noReferido}</td>
                    <td>${dato.fecha}</td>
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
    });
};




const generarExcel = (datos) => {
    const wb = XLSX.utils.book_new();

    const headerStyle = {
        font: { sz: 14, bold: true, color: { rgb: "000000" } },
        alignment: { horizontal: "center" },
        fill: { fgColor: { rgb: "CCCCCC" } }
    };

    const columnTitleStyle = {
        font: { sz: 12, bold: true, color: { rgb: "FFFFFF" } }, 
        fill: { fgColor: { rgb: "808080" } }, 
        alignment: { horizontal: "center" }
    };

    const dataCellStyle = {
        font: { sz: 11, color: { rgb: "000000" } },
        
    };

    const titles = ['               ','#','  CÓDIGO   ','   REFERIDOR   ','   NUMERO TEL.REFERIDOR  ','   REFERIDO  ', 'NUMERO TEL.REFERIDO ',  '   FECHA    '];
    
    const data = [
        [{ v: ' ' }, { v: 'REPORTE GENERAL DE REFERIDOS', s: {} }],
        [],
        [],
        titles.map(title => ({ v: title, s: title.trim() === '' ? {} : columnTitleStyle, headerStyle }))
    ];

    let lineNumber = 1;

    datos.forEach(array => {
        array.forEach(dato => {
            data.push([
                { v: ' '},
                { v: lineNumber++, s: dataCellStyle },
                { v: dato.codigo, s: dataCellStyle },
                { v: dato.nombreReferidor, s: dataCellStyle },  
                { v: dato.userno, s: dataCellStyle },
                { v: dato.nombreReferido, s: dataCellStyle },
                { v: dato.noReferido, s: dataCellStyle },             
                { v: dato.fecha, s: dataCellStyle }
            ]);
        });
    });

    const ws = XLSX.utils.aoa_to_sheet(data);

    const titleWidths = titles.map(title => title.length);

    ws['!cols'] = titleWidths.map(w => ({ wch: w }));

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Referidos');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Reporte_Referidos.xlsx');
};

const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
};







$("#MostrarTabla").click(function() {
    const fecha1 = $("#fecha1").val().trim();
    const fecha2 = $("#fecha2").val().trim();
    if (fecha1 !== '' && fecha2 !== '') {
        getParticipacionesFechasGeneral(fecha1, fecha2);
    } else {
        console.error('Por favor, ingresa ambas fechas.');
    }
});

const Alert = function(message, status) {
    toastr[`${status}`](message, `${status}`, {
        closeButton: true,
        tapToDismiss: false,
        positionClass: "toast-top-right",
        rtl: false,
    });
};