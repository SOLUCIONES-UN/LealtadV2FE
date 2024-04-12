const url = 'http://localhost:3000/'
let token = localStorage.getItem("token");


let numeros = [];

$(function() {
    GetcampanasActivas();
    let tabla = GetEnviaPremio();
    Usuario();

    function validarDescripcion(descripcion) {
        console.log("esto biene ", descripcion)
        const descripcionValida = /^[a-zA-Z0-9\s]+$/.test(descripcion.trim());

        if (!descripcionValida) {
            $('.descripcion').addClass('is-invalid');
            $('.descripcion-error').text('La descripción no admite caracteres especiales ni espacios en blanco').addClass('text-danger');
            return false;
        }
        return true;
    }

    $('#modalNew').on('show.bs.modal', function() {
        limpiarFormulario();
    });

    $('#modalEdit').on('show.bs.modal', function() {
        limpiarFormulario();
    });

    $('#modalNew').on('hidden.bs.modal', function() {
        limpiarFormulario();
    });

    $('#modalEdit').on('hidden.bs.modal', function() {
        limpiarFormulario();
    });

    $('#modalNew').find('[data-dismiss="modal"]').click(function() {
        limpiarFormulario();
    });

    $('#modalEdit').find('[data-dismiss="modal"]').click(function() {
        limpiarFormulario();
    });





    $('#formNew').submit(function(event) {
        event.preventDefault();
        $('#btnSubmit').prop('disabled', true);
        console.log("Formulario enviado");

        // Obtener el ID de la campaña seleccionada
        const campaniaId = $('#campania').val();

        // Crear un array para almacenar los datos a enviar
        const dataArray = [];

        // Recorrer cada fila de la tabla de Excel
        $('#tablaExcelBody tr').each(function() {
            const numeroTelefono = $(this).find('td:eq(1)').text().trim();

            // Verificar que el número no esté vacío
            if (numeroTelefono !== '') {
                // Agregar el objeto con los datos al array
                dataArray.push({
                    telefono: numeroTelefono,
                    campania: campaniaId
                });
            }
        });

        // Realizar la solicitud POST para enviar el array al backend
        fetch(`${url}enviaPremio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(dataArray) // Enviar el array como JSON
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result.code == "ok") {
                    limpiarFormulario();
                    tabla._fnAjaxUpdate();
                    $('#modalNew').modal('toggle');
                    limpiarFormulario();
                    Alert(result.message, 'success');
                } else {
                    Alert(result.message, 'error');
                }
                $('#btnSubmit').prop('disabled', false);
            })
            .catch(error => {
                console.error('Error al enviar los datos:', error);
                $('#btnSubmit').prop('disabled', false);
            });
    });




    $('#telefono').on('input', function() {
        // Obtener el valor ingresado en el campo
        const telefono = $(this).val();

        // Verificar si el valor ingresado no es un número
        if (!(/^\d+$/.test(telefono))) {
            // Mostrar mensaje de error
            $('#telefonoError').text('Por favor, ingrese solo números.').addClass('text-danger');
            // Limpiar el valor no numérico ingresado
            $(this).val(telefono.replace(/\D/g, ''));
        } else {
            // Limpiar el mensaje de error si el valor es un número
            $('#telefonoError').text('').removeClass('text-danger');
        }
    });




    //eventos de edicion para un menu

    //eventos para la inhabilitacion de un menu
    $('#BtnDelete').click(function() {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        const id = $('#idDelete').val();
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${url}enviaPremio/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code == "ok") {
                    limpiarFormulario();
                    tabla._fnAjaxUpdate();
                    $('#modalDelete').modal('toggle');
                    Alert(result.message, 'success')
                } else {
                    Alert(result.message, 'error')
                }

            })
            .catch(error => { Alert(error.errors, 'error') });
    })
});

// const Usuario = () => {

//     let usuario = JSON.parse(localStorage.getItem('infoUsuario'));
//     console.log(usuario.nombre)
//     $('.user-name').text(usuario.nombre);
//     $('.user-status').text(usuario.rol.descripcion);
// }


//obtiene la lista de envio premio
const GetEnviaPremio = () => {
    return $('#tableData').dataTable({
        ajax: {
            url: `${url}enviaPremio`,
            type: "GET",
            datatype: "json",
            dataSrc: "",
            headers: { "Authorization": token }
        },
        columns: [{
                data: null,
                render: function(data, type, row, meta) {

                    if (type === 'display') {
                        return meta.row + 1;
                    }
                    return meta.row + 1;
                }
            },
            { data: "telefono" },



            { data: "campaign.nombre" },



            {
                data: "id",
                render: function(data) {

                    return `
              <div class="btn-group">
                <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                    ${feather.icons['more-vertical'].toSvg({ class: 'font-small-4' })}
                </a>
                
                <div class="dropdown-menu dropdown-menu-right">
                    <a href="#" onclick="OpenDelete(${data})" class="btn_delete dropdown-item">
                      ${feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' })} Inhabilitar
                    </a>
                </div>
                </div>
              </div> 
            `;
                }
            }
        ],
        // order: [[1, 'asc']],
        dom: '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
            '<"col-lg-12 col-xl-6" l>' +
            '<"col-lg-12 col-xl-6 pl-xl-75 pl-0"<"dt-action-buttons text-xl-right text-lg-left text-md-right text-left d-flex align-items-center justify-content-lg-end align-items-center flex-sm-nowrap flex-wrap mr-1"<"mr-1"f>B>>' +
            '>t' +
            '<"d-flex justify-content-between mx-2 row mb-1"' +
            '<"col-sm-12 col-md-6"i>' +
            '<"col-sm-12 col-md-6"p>' +
            '>',
        language: {
            sLengthMenu: 'Show _MENU_',
            search: 'Buscar',
            searchPlaceholder: 'Buscar...',
        },
        // Buttons with Dropdown
        buttons: [{
            text: 'Nuevo',
            className: 'add-new btn btn-primary mt-50',
            attr: {
                'data-toggle': 'modal',
                'data-target': '#modalNew',
            },
            init: function(api, node, config) {
                $(node).removeClass('btn-secondary');
                //Metodo para agregar un nuevo usuario
            },
        }, ],
    });
}

function limpiarFormulario() {
    $('#telefono').val('');
    $('#campania').val('');
    $('#tablaExcelBody').empty(); // Vaciar el contenido del cuerpo de la tabla
    $('#tipo-operacion').val('option');

    $('.tablaExcel').removeClass('is-invalid');
    $('.telefono').removeClass('is-invalid');
    $('.campania').removeClass('is-invalid');
    $('.telefono-error').empty().removeClass('text-danger');

    $('#campoNumero').hide();
    $('#campoExcel').hide();

    $('#excel-input').val('');

    $('#btnSubmit').prop('disabled', false);
}








const Alert = function(message, status) // si se proceso correctamente la solicitud
    {
        toastr[`${status}`](message, `${status}`, {
            closeButton: true,
            tapToDismiss: false,
            positionClass: 'toast-top-right',
            rtl: false
        });
    }


const OpenEdit = (id) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`${url}enviaPremio/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            $('#id').val(id);
            $('#telefonoEdit').val(result.telefono);
            $('#campaniaEdit').val(result.campania);
            $('#modalEdit').modal('toggle');
        })
        .catch(error => console.log('error', error));

}


const OpenDelete = (id) => {
    $('#idDelete').val(id);
    $('#modalDelete').modal('toggle');
}


const GetcampanasActivas = () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: { "Authorization": token }
    };

    $('#campania').html('<option value="0" selected disabled>Selecciona una Opcion</option>');
    $('#campaniaEdit').html('<option value="0" selected disabled>Selecciona una Opcion</option>');
    fetch(`${url}Campania`, requestOptions)
        .then(response => response.json())
        .then(result => {
            result.forEach(element => {
                var opc = `<option value="${element.id}">${element.descripcion}</option>`;
                $('#campania').append(opc);
                $('#campania').append(opc);
            });
        })
        .catch(error => console.log('error', error));

}

// const excelInput = document.getElementById('excel-input')
// console.log(excel-input)
const inputFile = document.getElementById("excel-input");

inputFile.addEventListener("change", function() {
    const extPermitidas = /(.xlsx)$/;

    if (!extPermitidas.exec(inputFile.value)) {
        Alert("El archivo debe ser un excel", "error");
        inputFile.value = ""; // Vacía el valor del input
    } else {
        readXlsxFile(inputFile.files[0]).then(function(data) {
            let tablaExcelBody = document.getElementById("tablaExcelBody");
            // tablaExcelBody.innerHTML = ""; // Vacía la tabla antes de agregar nuevos datos

            data.forEach((row, indexP) => {
                var tr = `<tr id="fila${indexP}">
                    <td>${indexP + 1}</td>
                    <td>${row[0]}</td>
                    <td><button class="btn btn-sm btn-danger btnEliminar">Eliminar</button></td>
                    <!-- Agrega más columnas según sea necesario -->
                </tr>`;
                tablaExcelBody.innerHTML += tr;
            });
        });
    }
});


// Obtener referencia al botón y al campo de entrada
const btnAgregarNumero = document.getElementById('btnAgregarNumero');
const inputTelefono = document.getElementById('telefono');

btnAgregarNumero.addEventListener('click', function() {
    const numeroTelefono = inputTelefono.value;

    if (numeroTelefono.trim() !== '') {
        const tablaExcelBody = document.getElementById('tablaExcelBody');
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>${tablaExcelBody.rows.length + 1}</td>
            <td>${numeroTelefono}</td>
            <td><button class="btn btn-sm btn-danger btnEliminar">Eliminar</button></td>
            <!-- Puedes agregar más columnas según sea necesario -->
        `;
        tablaExcelBody.appendChild(nuevaFila);


        inputTelefono.value = '';


    } else {

        alert('Por favor ingresa un número de teléfono');
    }
});


//funcion de el select para agregar numero o cargarlo 
$(document).ready(function() {
    //funcion de el select para agregar numero o cargarlo 
    $('#tipo-operacion').change(function() {
        var seleccionado = $(this).val();
        if (seleccionado === 'numero') {
            $('#campoNumero').show();
            $('#campoExcel').hide();
        } else if (seleccionado === 'excel') {
            $('#campoNumero').hide();
            $('#campoExcel').show();
        } else if (seleccionado === 'option') {
            $('#campoNumero').hide();
            $('#campoExcel').hide();
        }
    });
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btnEliminar')) {
        event.target.closest('tr').remove(); // Eliminar la fila más cercana que contiene el botón de eliminar
    }
});