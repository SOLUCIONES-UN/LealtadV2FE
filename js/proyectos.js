const url = 'http://localhost:3000/';
let token = localStorage.getItem("token");
var dataDeptoView = [];
var localidadesSeleccionadas = []; // Array para almacenar las localidades seleccionadas
var dataDepaAndMuni = [];
var dataTableEdith = [];
var tableEditLocalidades;

const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
};


let clickCount = 0; // Contador de clics en el botón de guardar

$(function () {
    let tabla = getProyectos();
    getMunicipios();
    getDepartamento();
    const containerArchivo = document.getElementById('containerArchivo');
    if (containerArchivo) {
        containerArchivo.style.display = 'none';
    }

    function validarDescripcion(descripcion) {
        const descripcionValida = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(descripcion.trim());
        if (!descripcionValida) {
            $('.descripcion').addClass('is-invalid');
            $('.descripcion-error').text('La descripción no admite caracteres especiales ni espacios en blanco, solo debe contener letras').addClass('text-danger');
            return false;
        }
        return true;
    }

    function validarRuta(ruta) {
        const rutaValida = /^[a-zA-Z\s!@#$%^/&*(),.?":{}|<>]+(?:\s[a-zA-Z\s!@#$%^/&*(),.?":{}|<>]+)*$/.test(ruta);
        if (!rutaValida) {
            $('.ruta').addClass('is-invalid');
            $('.ruta-error').text('La ruta no admite caracteres especiales ni espacios en blanco, solo debe contener letras').addClass('text-danger');
            return false;
        }
        return true;
    }

    function limpiarFormulario() {
        $('#descripcion').val('');
        $('#ruta').val('');
        $('.descripcion').removeClass('is-invalid');
        $('.descripcion-error').empty().removeClass('text-danger');
        $('.ruta').removeClass('is-invalid');
        $('.ruta-error').empty().removeClass('text-danger');
        localidadesSeleccionadas = []; // Limpiar las localidades seleccionadas
        $('#tableLocalidad tbody').empty(); // Limpiar la tabla de localidades
        $('#tableLocalidadEdit tbody').empty(); // Limpiar la tabla de localidades en edición
        $('#departamentoEdit').val('');
        $('#municipioEdit').val('0');
    }

    function Alert(message, status) {
        toastr[`${status}`](message, `${status}`, {
            closeButton: true,
            tapToDismiss: false,
            positionClass: 'toast-top-right',
            rtl: false
        });
    }

    $('#modalNew').on('show.bs.modal', function () {
        limpiarFormulario();
        clickCount++;
        $("#btnSubmit").attr("disabled", false);
    });

    $('#modalEdit').on('show.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled", false);
    });

    $('#modalNew').on('hidden.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled", false);
    });

    $('#modalEdit').on('hidden.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled", false);
    });

    $('#modalNew').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled", false);
    });

    $('#modalEdit').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled", false);
    });

    $('#formNew').submit(function (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    
        const descripcion = $('#descripcion').val();
        const ruta = $('#ruta').val();
    
        if (!validarDescripcion(descripcion) || !validarRuta(ruta)) {
            return false;
        }
    
        $("#btnSubmit").attr("disabled", true);
    
        var raw = JSON.stringify({
            "descripcion": descripcion,
            "ruta": ruta,
            "localidades": localidadesSeleccionadas // Incluir las localidades seleccionadas
        });
    
        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };
    
        fetch(`${url}projects`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(result => {
                if (result.code === "ok") {
                    limpiarFormulario();
                    $('#modalNew').modal('toggle');
                    Alert(result.message, 'success');
                    tabla.api().ajax.reload(); // Actualiza la tabla después de agregar
                } else {
                    Alert(result.message, 'error');
                }
            })
            .catch(error => {
                Alert(error.errors || 'Ha sucedido un error al intentar agregar un nuevo proyecto.', 'error');
                $("#btnSubmit").attr("disabled", false);
            });
    
        return false;
    });
    
    $('#formEdit').submit(function (event) {
        event.preventDefault();
    
        const descripcion = $('#descripcionEdit').val();
        const ruta = $('#rutaEdit').val();
    
        if (!validarDescripcion(descripcion) || !validarRuta(ruta)) {
            return false;
        }
    
        const id = $('#id').val();
    
        var raw = JSON.stringify({
            "descripcion": descripcion,
            "ruta": ruta,
            "localidades": localidadesSeleccionadas // Incluir las localidades seleccionadas
        });
    
        var requestOptions = {
            method: 'PUT',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };
    
        fetch(`${url}projects/${id}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(result => {
                if (result.code == "ok") {
                    limpiarFormulario();
                    $('#modalEdit').modal('toggle');
                    Alert(result.message, 'success');
                    // No recargamos la tabla aquí
                } else {
                    Alert(result.message, 'error');
                }
            })
            .catch(error => {
                Alert(error.errors || 'Ha sucedido un error al intentar actualizar el proyecto.', 'error');
                $("#btnSubmEdit").attr("disabled", false);
            });
    
        return false;
    });
    
    $('#BtnDelete').click(function () {
        const id = $('#idDelete').val();

        var requestOptions = {
            method: 'DELETE',
            headers: headers,
            redirect: 'follow'
        };

        fetch(`${url}projects/${id}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(result => {
                if (result.code == "ok") {
                    limpiarFormulario();
                    $('#modalDelete').modal('toggle');
                    Alert(result.message, 'success');
                    tabla.api().ajax.reload(); // Actualiza la tabla después de eliminar
                } else {
                    Alert(result.message, 'error');
                }
            })
            .catch(error => {
                Alert(error.errors || 'Ha sucedido un error al intentar inhabilitar el proyecto.', 'error');
            });
            return false;
    });

    $('#addLocalidad').click(function () {
        var departamentoSeleccionado = $('#departamento option:selected').text();
        var municipioSeleccionado = $('#municipio option:selected').text();
        var departamentoId = $('#departamento').val();
        var municipioId = $('#municipio').val();

        var rowCount = $('#tableLocalidad tbody tr').length;

        var newRow = '<tr data-departamento-id="' + departamentoId + '" data-municipio-id="' + municipioId + '">' +
            '<td>' + (rowCount + 1) + '</td>' +
            '<td>' + departamentoSeleccionado + '</td>' +
            '<td>' + municipioSeleccionado + '</td>' +
            '<td><a href="#" class="delete-row">' +
            feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) +
            '</a></td>' +
            '</tr>';

        $('#tableLocalidad tbody').append(newRow);

        localidadesSeleccionadas.push({ departamentoId: departamentoId, municipioId: municipioId });
    });

    $('#tableLocalidad').on('click', '.delete-row', function (event) {
        var rowIndex = $(this).closest('tr').index();
        $(this).closest('tr').remove();

        localidadesSeleccionadas.splice(rowIndex, 1);

        $('#tableLocalidad tbody tr').each(function (index) {
            $(this).find('td:first').text(index + 1);
        });
    });

    $('#tableLocalidadEdit').on('click', '.delete-row', function (event) {
        var rowIndex = $(this).closest('tr').index();
        $(this).closest('tr').remove();

        localidadesSeleccionadas.splice(rowIndex, 1);
        dataDepaAndMuni.splice(rowIndex, 1);

        $('#tableLocalidadEdit tbody tr').each(function (index) {
            $(this).find('td:first').text(index + 1);
        });
    });

    $('#addLocalidadEdit').on('click', function () {

        console.log('Localidades seleccionadas:', localidadesSeleccionadas);

        var departamentoSeleccionado = $('#departamentoEdit option:selected').text();
        var municipioSeleccionado = $('#municipioEdit option:selected').text();
        var departamentoId = $('#departamentoEdit').val();
        var municipioId = $('#municipioEdit').val();

        var rowCount = $('#tableLocalidadEdit tbody tr').length;

        var newRow = '<tr data-departamento-id="' + departamentoId + '" data-municipio-id="' + municipioId + '">' +
            '<td>' + (rowCount + 1) + '</td>' +
            '<td>' + departamentoSeleccionado + '</td>' +
            '<td>' + municipioSeleccionado + '</td>' 

        newRow += '<td><a  class="dropdown-item delete-row" onclick="deleteRow(' + rowCount + ')">' + feather.icons['trash-2'].toSvg({ class: 'font-small-4 ' }) + '</a></td>';
        newRow += '</tr>';

        $('#tableLocalidadEdit tbody').append(newRow);

        localidadesSeleccionadas.push({ departamentoId: departamentoId, municipioId: municipioId });
        dataDepaAndMuni.push({ departamentoId: +departamentoId, municipioId: +municipioId });

        console.log('Localidades seleccionadas:', dataDepaAndMuni);

    });

});

const getProyectos = () => {
    return $('#tableData').dataTable({
        ajax: {
            url: `${url}projects`,
            type: "GET",
            datatype: "json",
            dataSrc: "",
            headers: headers,
        },
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        return meta.row + 1;
                    }
                    return meta.row + 1;
                }
            },
            { data: "descripcion" },
            { data: "ruta" },
            {
                data: "id",
                render: function (data) {
                    return '<div class="btn-group">' +
                        '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                        feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                        '</a>' +
                        '<div class="dropdown-menu dropdown-menu-right">' +
                        '<a href="#" onclick="OpenEdit(' + data + ')" class="btn_edit dropdown-item">' +
                        feather.icons['archive'].toSvg({ class: 'font-small-4 mr-50' }) + ' Actualizar' +
                        '</a>' +
                        '<a href="#" onclick="OpenDelete(' + data + ')" class="btn_delete dropdown-item">' +
                        feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) + ' Inhabilitar' +
                        '</a>' +
                        '</div>' +
                        '</div>';
                }
            }
        ],
        dom:
            '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
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
        buttons: [
            {
                text: 'Nuevo',
                className: 'add-new btn btn-primary mt-50',
                attr: {
                    'data-toggle': 'modal',
                    'data-target': '#modalNew',
                },
                init: function (api, node, config) {
                    $(node).removeClass('btn-secondary');
                },
            },
        ],
    });
}

const getDepartamento = () => {
    $('#departamento').html(null);
    $('#departamentoEdit').html(null);
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: { "Authorization": token }
    };

    fetch(`${url}Departamento`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(result => {
            $('#departamento').empty();
            $('#departamentoEdit').empty();

            $('#departamento').append('<option value="" selected disabled>Selecciona una opción</option>');
            $('#departamentoEdit').append('<option value="" selected disabled>Selecciona una opción</option>');

            result.forEach(element => {
                var opc = `<option value="${element.id}">${element.nombre}</option>`;
                $('#departamento').append(opc);
                $('#departamentoEdit').append(opc);
            });

            dataDeptoView = result;

            var selectDepartamento = document.getElementById('departamento');
            var selectDepartamentoEdit = document.getElementById('departamentoEdit');

            if (selectDepartamento) {
                selectDepartamento.addEventListener('change', function () {
                    var selectedId = this.value;
                    getMunicipioByDepto(selectedId);
                });
            }

            if (selectDepartamentoEdit) {
                selectDepartamentoEdit.addEventListener('change', function () {
                    var selectedId = this.value;
                    getMunicipioByDepto(selectedId);
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener los departamentos:', error);
        });
};

const getMunicipioByDepto = (idDepartamento) => {
    $('#municipio').html(null);
    $('#municipioEdit').html(null);

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: { "Authorization": token }
    };

    $('#municipio').append('<option value="" selected disabled>Selecciona una opción</option>');
    $('#municipioEdit').append('<option value="" selected disabled>Selecciona una opción</option>');

    fetch(`${url}Municipio/by/${idDepartamento}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            result.forEach(element => {
                var opc = `<option value="${element.id}">${element.nombre}</option>`;
                $('#municipio').append(opc);
                $('#municipioEdit').append(opc);
            });
        })
        .catch(err => {
            console.log('error', err);
        });
};

const getMunicipios = () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: { "Authorization": token }
    };

    fetch(`${url}Municipio`, requestOptions)
        .then(response => response.json())
        .then(result => {
            dataMunicipiosView = result;
            console.log('municipios', dataMunicipiosView)
        })
        .catch(error => console.log('error', error));
}

const OpenEdit = (id) => {

    var table;

    var requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
        redirect: 'follow'
    };

    // Obtener datos del proyecto
    fetch(`${url}projects/${id}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Error de autenticación: Token no válido o expirado.");
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            $('#tableLocalidadEdit').dataTable().fnDestroy();
            console.log('Project Data:', result);
            $('#id').val(id);
            $('#descripcionEdit').val(result.descripcion);
            $('#rutaEdit').val(result.ruta);
            dataTableEdith = result.departamento_proyectos; // Limpiar las localidades seleccionadas

            //$('#tableLocalidadEdit tbody').empty();

            result.departamento_proyectos.forEach((loc, index) => {

                localidadesSeleccionadas.push({ departamentoId: loc.departamento.id, municipioId: loc.municipio.id  });
                dataDepaAndMuni.push({ departamentoId: loc.departamento.id, municipioId: loc.municipio.id});
            });

            tableEditLocalidades = $('#tableLocalidadEdit').dataTable({
                data: dataTableEdith,
                searching: false,
                paging: false,
                columns: [
                    {
                        data: null,
                        render: function (data, type, row, meta) {
                            if (type === 'display') {
                                return meta.row + 1;
                            }
                            return meta.row + 1;
                        }
                    },
                    { data: "departamento.nombre" },
                    { data: "municipio.nombre" },
                    {
                        data: "id",
                        render: function (data) {
                            return `<a href="#" class="dropdown-item delete-row" onclick="deleteRow(${data})">${feather.icons['trash-2'].toSvg({ class: 'font-small-4 ml-2 ' })}</a>`
                        }
                    }
                ],
            });
const url = 'http://localhost:3000/';
let token = localStorage.getItem("token");
var dataDeptoView = [];
var localidadesSeleccionadas = []; // Array para almacenar las localidades seleccionadas
var dataDepaAndMuni = [];
var dataTableEdith = [];
var tableEditLocalidades;

const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
};

$(function () {
    let tabla = getProyectos();
    getMunicipios();
    getDepartamento();
    const containerArchivo = document.getElementById('containerArchivo');
    if (containerArchivo) {
        containerArchivo.style.display = 'none';
    }

    function validarDescripcion(descripcion) {
        const descripcionValida = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(descripcion.trim());
        if (!descripcionValida) {
            $('.descripcion').addClass('is-invalid');
            $('.descripcion-error').text('La descripción no admite caracteres especiales ni espacios en blanco, solo debe contener letras').addClass('text-danger');
            return false;
        }
        return true;
    }

    function validarRuta(ruta) {
        const rutaValida = /^[a-zA-Z\s!@#$%^/&*(),.?":{}|<>]+(?:\s[a-zA-Z\s!@#$%^/&*(),.?":{}|<>]+)*$/.test(ruta);
        if (!rutaValida) {
            $('.ruta').addClass('is-invalid');
            $('.ruta-error').text('La ruta no admite caracteres especiales ni espacios en blanco, solo debe contener letras').addClass('text-danger');
            return false;
        }
        return true;
    }

    function limpiarFormulario() {
        $('#descripcion').val('');
        $('#ruta').val('');
        $('.descripcion').removeClass('is-invalid');
        $('.descripcion-error').empty().removeClass('text-danger');
        $('.ruta').removeClass('is-invalid');
        $('.ruta-error').empty().removeClass('text-danger');
        localidadesSeleccionadas = []; // Limpiar las localidades seleccionadas
        $('#tableLocalidad tbody').empty(); // Limpiar la tabla de localidades
        $('#tableLocalidadEdit tbody').empty(); // Limpiar la tabla de localidades en edición
        $('#departamentoEdit').val('');
        $('#municipioEdit').val('0');
    }

    function Alert(message, status) {
        toastr[`${status}`](message, `${status}`, {
            closeButton: true,
            tapToDismiss: false,
            positionClass: 'toast-top-right',
            rtl: false
        });
    }

    $('#modalNew').on('show.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled", false);
    });

    $('#modalEdit').on('show.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled", false);
    });

    $('#modalNew').on('hidden.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled", false);
    });

    $('#modalEdit').on('hidden.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled", false);
    });

    $('#modalNew').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled", false);
    });

    $('#modalEdit').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmEdit").attr("disabled", false);
    });

    $('#formNew').submit(function (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        const descripcion = $('#descripcion').val();
        const ruta = $('#ruta').val();

        if (!validarDescripcion(descripcion) || !validarRuta(ruta)) {
            return false;
        }

        $("#btnSubmit").attr("disabled", true);

        var raw = JSON.stringify({
            "descripcion": descripcion,
            "ruta": ruta,
            "localidades": localidadesSeleccionadas // Incluir las localidades seleccionadas
        });

        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}projects`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(result => {
                if (result.code === "ok") {
                    limpiarFormulario();
                    $('#modalNew').modal('toggle');
                    Alert(result.message, 'success');
                    tabla.api().ajax.reload(); // Actualiza la tabla después de agregar
                } else {
                    Alert(result.message, 'error');
                }
            })
            .catch(error => {
                Alert(error.errors || 'Ha sucedido un error al intentar agregar un nuevo proyecto.', 'error');
                $("#btnSubmit").attr("disabled", false);
            });

        return false;
    });

    $('#formEdit').submit(function (event) {
        event.preventDefault();

        const descripcion = $('#descripcionEdit').val();
        const ruta = $('#rutaEdit').val();

        if (!validarDescripcion(descripcion) || !validarRuta(ruta)) {
            return false;
        }

        const id = $('#id').val();

        var raw = JSON.stringify({
            "descripcion": descripcion,
            "ruta": ruta,
            "localidades": localidadesSeleccionadas // Incluir las localidades seleccionadas
        });

        var requestOptions = {
            method: 'PUT',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}projects/${id}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(result => {
                if (result.code == "ok") {
                    limpiarFormulario();
                    $('#modalEdit').modal('toggle');
                    Alert(result.message, 'success');
                    // No recargamos la tabla aquí
                } else {
                    Alert(result.message, 'error');
                }
            })
            .catch(error => {
                Alert(error.errors || 'Ha sucedido un error al intentar actualizar el proyecto.', 'error');
                $("#btnSubmEdit").attr("disabled", false);
            });

        return false;
    });

    $('#BtnDelete').click(function () {
        const id = $('#idDelete').val();

        var requestOptions = {
            method: 'DELETE',
            headers: headers,
            redirect: 'follow'
        };

        fetch(`${url}projects/${id}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(result => {
                if (result.code == "ok") {
                    limpiarFormulario();
                    $('#modalDelete').modal('toggle');
                    Alert(result.message, 'success');
                    tabla.api().ajax.reload(); // Actualiza la tabla después de eliminar
                } else {
                    Alert(result.message, 'error');
                }
            })
            .catch(error => {
                Alert(error.errors || 'Ha sucedido un error al intentar inhabilitar el proyecto.', 'error');
            });
            return false;
    });

    $('#addLocalidad').click(function () {
        var departamentoSeleccionado = $('#departamento option:selected').text();
        var municipioSeleccionado = $('#municipio option:selected').text();
        var departamentoId = $('#departamento').val();
        var municipioId = $('#municipio').val();

        var rowCount = $('#tableLocalidad tbody tr').length;

        var newRow = '<tr data-departamento-id="' + departamentoId + '" data-municipio-id="' + municipioId + '">' +
            '<td>' + (rowCount + 1) + '</td>' +
            '<td>' + departamentoSeleccionado + '</td>' +
            '<td>' + municipioSeleccionado + '</td>' +
            '<td><a href="#" class="delete-row">' +
            feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) +
            '</a></td>' +
            '</tr>';

        $('#tableLocalidad tbody').append(newRow);

        localidadesSeleccionadas.push({ departamentoId: departamentoId, municipioId: municipioId });
    });

    $('#tableLocalidad').on('click', '.delete-row', function (event) {
        var rowIndex = $(this).closest('tr').index();
        $(this).closest('tr').remove();

        localidadesSeleccionadas.splice(rowIndex, 1);

        $('#tableLocalidad tbody tr').each(function (index) {
            $(this).find('td:first').text(index + 1);
        });
    });

    $('#tableLocalidadEdit').on('click', '.delete-row', function (event) {
        var rowIndex = $(this).closest('tr').index();
        $(this).closest('tr').remove();

        localidadesSeleccionadas.splice(rowIndex, 1);
        dataDepaAndMuni.splice(rowIndex, 1);

        $('#tableLocalidadEdit tbody tr').each(function (index) {
            $(this).find('td:first').text(index + 1);
        });
    });

    $('#addLocalidadEdit').on('click', function () {

        console.log('Localidades seleccionadas:', localidadesSeleccionadas);

        var departamentoSeleccionado = $('#departamentoEdit option:selected').text();
        var municipioSeleccionado = $('#municipioEdit option:selected').text();
        var departamentoId = $('#departamentoEdit').val();
        var municipioId = $('#municipioEdit').val();

        var rowCount = $('#tableLocalidadEdit tbody tr').length;

        var newRow = '<tr data-departamento-id="' + departamentoId + '" data-municipio-id="' + municipioId + '">' +
            '<td>' + (rowCount + 1) + '</td>' +
            '<td>' + departamentoSeleccionado + '</td>' +
            '<td>' + municipioSeleccionado + '</td>' 

        newRow += '<td><a  class="dropdown-item delete-row" onclick="deleteRow(' + rowCount + ')">' + feather.icons['trash-2'].toSvg({ class: 'font-small-4 ' }) + '</a></td>';
        newRow += '</tr>';

        $('#tableLocalidadEdit tbody').append(newRow);

        localidadesSeleccionadas.push({ departamentoId: departamentoId, municipioId: municipioId });
        dataDepaAndMuni.push({ departamentoId: +departamentoId, municipioId: +municipioId });

        console.log('Localidades seleccionadas:', dataDepaAndMuni);

    });

});

const getProyectos = () => {
    return $('#tableData').dataTable({
        ajax: {
            url: `${url}projects`,
            type: "GET",
            datatype: "json",
            dataSrc: "",
            headers: headers,
        },
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        return meta.row + 1;
                    }
                    return meta.row + 1;
                }
            },
            { data: "descripcion" },
            { data: "ruta" },
            {
                data: "id",
                render: function (data) {
                    return '<div class="btn-group">' +
                        '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                        feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                        '</a>' +
                        '<div class="dropdown-menu dropdown-menu-right">' +
                        '<a href="#" onclick="OpenEdit(' + data + ')" class="btn_edit dropdown-item">' +
                        feather.icons['archive'].toSvg({ class: 'font-small-4 mr-50' }) + ' Actualizar' +
                        '</a>' +
                        '<a href="#" onclick="OpenDelete(' + data + ')" class="btn_delete dropdown-item">' +
                        feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) + ' Inhabilitar' +
                        '</a>' +
                        '</div>' +
                        '</div>';
                }
            }
        ],
        dom:
            '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
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
        buttons: [
            {
                text: 'Nuevo',
                className: 'add-new btn btn-primary mt-50',
                attr: {
                    'data-toggle': 'modal',
                    'data-target': '#modalNew',
                },
                init: function (api, node, config) {
                    $(node).removeClass('btn-secondary');
                },
            },
        ],
    });
}

const getDepartamento = () => {
    $('#departamento').html(null);
    $('#departamentoEdit').html(null);
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: { "Authorization": token }
    };

    fetch(`${url}Departamento`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(result => {
            $('#departamento').empty();
            $('#departamentoEdit').empty();

            $('#departamento').append('<option value="" selected disabled>Selecciona una opción</option>');
            $('#departamentoEdit').append('<option value="" selected disabled>Selecciona una opción</option>');

            result.forEach(element => {
                var opc = `<option value="${element.id}">${element.nombre}</option>`;
                $('#departamento').append(opc);
                $('#departamentoEdit').append(opc);
            });

            dataDeptoView = result;

            var selectDepartamento = document.getElementById('departamento');
            var selectDepartamentoEdit = document.getElementById('departamentoEdit');

            if (selectDepartamento) {
                selectDepartamento.addEventListener('change', function () {
                    var selectedId = this.value;
                    getMunicipioByDepto(selectedId);
                });
            }

            if (selectDepartamentoEdit) {
                selectDepartamentoEdit.addEventListener('change', function () {
                    var selectedId = this.value;
                    getMunicipioByDepto(selectedId);
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener los departamentos:', error);
        });
};

const getMunicipioByDepto = (idDepartamento) => {
    $('#municipio').html(null);
    $('#municipioEdit').html(null);

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: { "Authorization": token }
    };

    $('#municipio').append('<option value="" selected disabled>Selecciona una opción</option>');
    $('#municipioEdit').append('<option value="" selected disabled>Selecciona una opción</option>');

    fetch(`${url}Municipio/by/${idDepartamento}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            result.forEach(element => {
                var opc = `<option value="${element.id}">${element.nombre}</option>`;
                $('#municipio').append(opc);
                $('#municipioEdit').append(opc);
            });
        })
        .catch(err => {
            console.log('error', err);
        });
};

const getMunicipios = () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: { "Authorization": token }
    };

    fetch(`${url}Municipio`, requestOptions)
        .then(response => response.json())
        .then(result => {
            dataMunicipiosView = result;
            console.log('municipios', dataMunicipiosView)
        })
        .catch(error => console.log('error', error));
}

const OpenEdit = (id) => {

    var table;

    var requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
        redirect: 'follow'
    };

    // Obtener datos del proyecto
    fetch(`${url}projects/${id}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Error de autenticación: Token no válido o expirado.");
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            $('#tableLocalidadEdit').dataTable().fnDestroy();
            console.log('Project Data:', result);
            $('#id').val(id);
            $('#descripcionEdit').val(result.descripcion);
            $('#rutaEdit').val(result.ruta);
            dataTableEdith = result.departamento_proyectos; // Limpiar las localidades seleccionadas

            //$('#tableLocalidadEdit tbody').empty();

            result.departamento_proyectos.forEach((loc, index) => {

                localidadesSeleccionadas.push({ departamentoId: loc.departamento.id, municipioId: loc.municipio.id  });
                dataDepaAndMuni.push({ departamentoId: loc.departamento.id, municipioId: loc.municipio.id});
            });

            tableEditLocalidades = $('#tableLocalidadEdit').dataTable({
                data: dataTableEdith,
                searching: false,
                paging: false,
                columns: [
                    {
                        data: null,
                        render: function (data, type, row, meta) {
                            if (type === 'display') {
                                return meta.row + 1;
                            }
                            return meta.row + 1;
                        }
                    },
                    { data: "departamento.nombre" },
                    { data: "municipio.nombre" },
                    {
                        data: "id",
                        render: function (data) {
                            return `<a href="#" class="dropdown-item delete-row" onclick="deleteRow(${data})">${feather.icons['trash-2'].toSvg({ class: 'font-small-4 ml-2 ' })}</a>`
                        }
                    }
                ],
            });


            //table.reload();
            $('#modalEdit').modal('toggle');
            tableEditLocalidades.fnDraw();

        })
        .catch(error => {
            console.error("Error en la solicitud GET:", error);
            Alert("Error al obtener datos del proyecto", 'error');
        })
}

const deleteRow = (data) => {
    console.log('ID:', data);
}

const OpenDelete = (id) => {
    $("#idDelete").val(id);
    $("#modalDelete").modal("toggle");
}



            //table.reload();
            $('#modalEdit').modal('toggle');
            tableEditLocalidades.fnDraw();

        })
        .catch(error => {
            console.error("Error en la solicitud GET:", error);
            Alert("Error al obtener datos del proyecto", 'error');
        })
}

const deleteRow = (data) => {
    console.log('ID:', data);
}

const OpenDelete = (id) => {
    $("#idDelete").val(id);
    $("#modalDelete").modal("toggle");
}
