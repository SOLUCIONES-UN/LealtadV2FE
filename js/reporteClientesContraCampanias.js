const url = "http://localhost:3000/"
let token = localStorage.getItem("token");

var infoExportar;
$(function () {

    function formatearTelefono(telefono) {
        // Extraer el código de país y el número local asumiendo que el número tiene 11 dígitos
        let codigoPais = telefono.substring(0, 3);
        let numeroLocal = telefono.substring(3);
        return `(${codigoPais}) ${numeroLocal.substring(0, 4)}-${numeroLocal.substring(4)}`;
    }

    //formato para date picker
    $('#fecha_inicio').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end, label) { });
    $('#fecha_fin').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end, label) { });

    $('#btnExportarInfo').click(function () {
        $('#btnConsultarInfo').hide();
        $("#btnExportarInfo").attr("disabled", true);
        $("#btnExportarInfo").text("Generando...");
        $('#btnPantallaInfo').hide();
        const wb = XLSX.utils.book_new();
        let row1 = [
            { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
            { v: 'REPORTE DE CAMPAÑAS ACUMULATIVAS', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
        ];
        let row2 = [
            { v: '', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
            { v: 'Reporte de clientes en una campaña', t: 's', s: { font: { sz: 16 }, alignment: { horizontal: 'center' } } },
        ];
        let row3 = [''];
        let row4 = [
            '',
            { v: 'NO.', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
            { v: 'TELÉFONO', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
            { v: 'CLIENTE', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
            { v: 'CAMPAÑA', t: 's', s: { font: { bold: true, color: { rgb: 'ffffff' } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: '595959' } } } },
        ];
        let infoFinal = [row1, row2, row3, row4];
        var contador = 1;
        var longitud1 = 0;
        var longitud2 = 0;
        var longitud3 = 0;
        var longitud4 = 0;
        infoExportar.forEach(function (informacion) {

            let telefonoFormateado = formatearTelefono(informacion.telefono); // Formatear teléfono antes de agregarlo
            if (longitud1 < String(contador).length)
                longitud1 = String(contador).length;

            if (longitud2 < String(telefonoFormateado).length)
                longitud2 = String(telefonoFormateado).length;

            if (longitud3 < String(informacion.nombre).length)
                longitud3 = String(informacion.nombre).length;

            if (longitud4 < String(informacion.campania).length)
                longitud4 = String(informacion.campania).length;

            let rowInfo = [
                '',
                { v: contador, t: 's' },
                { v: telefonoFormateado, t: 's' },
                { v: informacion.nombre, t: 's' },
                { v: informacion.campania, t: 's' },
            ];
            infoFinal.push(rowInfo);
            contador += 1;
        });
        // let row2 = [1, 2, 3];
        // let row3 = [
        // 	{ v: 'Courier 24', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
        // 	{ v: 'bold', t: 's', s: { font: { bold: true, color: { rgb: 'FFFF0000' } } } },
        // 	{ v: 'filled', t: 's', s: { fill: { fgColor: { rgb: 'FFE9E9E9' } } } },
        // 	{ v: 'line break\n"test"', t: 's', s: { alignment: { wrapText:true } } },
        // ]
        const ws = XLSX.utils.aoa_to_sheet(infoFinal);
        // ws['!cols'] = [{ width: 30 }, { width: 20 }, { width: 20 }]
        ws['!cols'] = [
            { width: 15 },
            { width: longitud1 + 2 },
            { width: longitud2 + 2 },
            { width: longitud3 + 2 },
            { width: longitud4 + 2 }
        ]
        console.log(ws['!cols'])
        ws['!merges'] = [
            { s: { r: 1, c: 1 }, e: { r: 1, c: 4 } },
            { s: { r: 0, c: 1 }, e: { r: 0, c: 4 } }
        ]
        const ws2 = XLSX.utils.aoa_to_sheet([row4]);
        XLSX.utils.book_append_sheet(wb, ws, 'Usuario notificados');
        XLSX.writeFile(wb, "reporte_participando.xlsx");
        $('#btnConsultarInfo').show();
        $("#btnExportarInfo").attr("disabled", false);
        $("#btnExportarInfo").text("Descargar Excel");
        $('#btnPantallaInfo').show();
    });

    $('#btnPantallaInfo').click(function () {
        if ($.fn.DataTable.isDataTable('.datatables-basic')) {
            $('.datatables-basic').DataTable().destroy();
            $('.datatables-basic tbody').empty();
          }
        $('#btnConsultarInfo').hide();
        $('#btnExportarInfo').hide();
        $("#btnPantallaInfo").attr("disabled", true);
        $("#btnPantallaInfo").text("Generando...");
        $('#btnPantallaInfo').show();
        var tds = "";
        var count = 1;
        $.each(infoExportar, function () {
            let telefonoFormateado = formatearTelefono(this.telefono);
            if (this.tipo == 2) {
                tds += `
                    <tr style="background-color: red; color: white;">
                        <td>${count}</td>
                        <td>${telefonoFormateado}</td>
                        <td>${this.nombre}</td>
                        <td>${this.campania}</td>
                    </tr>
                `;
                count++;
            } else {
                tds += `
                    <tr>
                        <td>${count}</td>
                        <td>${telefonoFormateado}</td>
                        <td>${this.nombre}</td>
                        <td>${this.campania}</td>
                    </tr>
                `;
                count++;
            }
        });
        $('#btnConsultarInfo').show();
        $('#btnExportarInfo').show();
        $("#btnPantallaInfo").attr("disabled", false);
        $("#btnPantallaInfo").text("Mostrar en Pantalla");
    });

    // Ocultar botones al inicio
    $('#btnExportarInfo, #btnPantallaInfo').hide();

    $('#btnConsultarInfo').click(function () {


        // Llamada AJAX al backend
        $.ajax({
            type: 'GET',
            url: `${url}ConsultaReporteAcumulado/`,
            contentType: "application/json; charset=utf-8",
            beforeSend: function() {
                $("#btnConsultarInfo").attr("disabled", true).text("Consultando...");
                $('#btnExportarInfo, #btnPantallaInfo').hide();
                $('#tableData').DataTable().clear().destroy(); // Limpia y destruye DataTable
            },
            success: function(data) {
                infoExportar = data; // Almacenar los datos recibidos
                $('#btnExportarInfo, #btnPantallaInfo').show();
                $("#btnConsultarInfo").attr("disabled", false).text("Consultar");
            },
            error: function() {
                Alert("Error al obtener los datos");
                $("#btnConsultarInfo").attr("disabled", false).text("Consultar");
            }
        });
    });

    // Función para actualizar la tabla
    $('#btnPantallaInfo').click(function() {
        actualizarTabla(infoExportar); // Mostrar datos en la tabla
    });

    function actualizarTabla(datos) {
        var tBody = $('#tableData tbody');
        tBody.empty(); // Limpiar tabla existente

        if (datos.length === 0) {
            tBody.append('<tr><td colspan="4">No hay datos para mostrar.</td></tr>');
        } else {
            $.each(datos, function (index, item) {
                let telefonoFormateado = formatearTelefono(this.telefono); // Formatear teléfono antes de agregarlo
                var row = `<tr>
                    <td>${index + 1}</td>
                    <td>${telefonoFormateado || ''}</td>
                    <td>${item.nombre || ''}</td>
                    <td>${item.campania || ''}</td>
                </tr>`;
                tBody.append(row);
            });
        }

        // Re-inicializar la DataTable
        // // Limpia cualquier dato existente en la tabla
        // table.clear().draw();
        
        $('#tableData').DataTable({
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
});
