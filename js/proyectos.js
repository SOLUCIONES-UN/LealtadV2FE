const url = 'http://localhost:3000/';
let token = localStorage.getItem("token");
var dataDeptoView = [];
var localidadesSeleccionadas = []; 
var dataDepaAndMuni = [];
var dataTableEdith = [];
var tableEditLocalidades;

const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
};

let clickCount = 0;

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

        $('#formNew input[type="text"]').val('');
        
  
        $('#departamento').val('').change();
        $('#municipio').val('').change();
    
        
        $('.descripcion').removeClass('is-invalid');
        $('.descripcion-error').empty().removeClass('text-danger');
        $('.ruta').removeClass('is-invalid');
        $('.ruta-error').empty().removeClass('text-danger');
        
    
        localidadesSeleccionadas = [];
        
        // Vaciar las tablas de localidades
        $('#tableLocalidad tbody').empty();
        $('#tableLocalidadEdit tbody').empty();
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
    localidadesSeleccionadas = [];
    dataDepaAndMuni = [];
    clickCount++;
    $("#btnSubmit").attr("disabled", false);
});

$('#modalEdit').on('show.bs.modal', function () {
    limpiarFormulario();
    localidadesSeleccionadas = [];
    dataDepaAndMuni = [];
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
        event.preventDefault();
    
        const descripcion = $('#descripcion').val();
        const ruta = $('#ruta').val();
    
        if (!validarDescripcion(descripcion) || !validarRuta(ruta)) {
            return false;
        }
    
        $("#btnSubmit").attr("disabled", true);
    
        var raw = JSON.stringify({
            "descripcion": descripcion,
            "ruta": ruta,
            "localidades": localidadesSeleccionadas 
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
                    tabla.api().ajax.reload();
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
            "id": id,
            "descripcion": descripcion,
            "ruta": ruta,
            "localidades": localidadesSeleccionadas 
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
                    tabla.api().ajax.reload(); 
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
                    tabla.api().ajax.reload(); 
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
    var departamentoId = $('#departamento').val();
    var municipioId = $('#municipio').val();

    $('#departamento').removeClass('is-invalid');
    $('#municipio').removeClass('is-invalid');
    $('#departamentoErrorVacio').hide();
    $('#departamentoErrorDuplicado').hide();
    $('#municipioErrorVacio').hide();
    $('#municipioErrorDuplicado').hide();


    if (!departamentoId || !municipioId) {
        if (!departamentoId) {
            $('#departamento').addClass('is-invalid');
            $('#departamentoErrorVacio').show();
        }
        if (!municipioId) {
            $('#municipio').addClass('is-invalid');
            $('#municipioErrorVacio').show();
        }

        setTimeout(function() {
            $('#departamento').removeClass('is-invalid');
            $('#departamentoErrorVacio').hide();
            $('#municipio').removeClass('is-invalid');
            $('#municipioErrorVacio').hide();
        }, 3000);

        return;
    }


    var registroExiste = $('#tableLocalidad tbody tr').filter(function() {
        return $(this).data('departamento-id') == departamentoId && $(this).data('municipio-id') == municipioId;
    }).length > 0;

    if (registroExiste) {
        $('#departamento').addClass('is-invalid');
        $('#municipio').addClass('is-invalid');
        $('#departamentoErrorDuplicado').show();
        $('#municipioErrorDuplicado').show();

        setTimeout(function() {
            $('#departamento').removeClass('is-invalid');
            $('#departamentoErrorDuplicado').hide();
            $('#municipio').removeClass('is-invalid');
            $('#municipioErrorDuplicado').hide();
        }, 3000);

        return;
    }

    var departamentoSeleccionado = $('#departamento option:selected').text();
    var municipioSeleccionado = $('#municipio option:selected').text();

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

    $('#addLocalidadEdit').click(function () {
        var departamentoId = $('#departamentoEdit').val();
        var municipioId = $('#municipioEdit').val();
    
       
        $('#departamentoEdit').removeClass('is-invalid');
        $('#municipioEdit').removeClass('is-invalid');
        $('#departamentoErrorVacioedit').hide();
        $('#departamentoErrorDuplicadoedit').hide();
        $('#municipioErrorVacioedit').hide();
        $('#municipioErrorDuplicadoedit').hide();
    
      
        if (!departamentoId || !municipioId) {
            if (!departamentoId) {
                $('#departamentoEdit').addClass('is-invalid');
                $('#departamentoErrorVacioedit').show();
            }
            if (!municipioId) {
                $('#municipioEdit').addClass('is-invalid');
                $('#municipioErrorVacioedit').show();
            }
    
           
            setTimeout(function() {
                $('#departamentoEdit').removeClass('is-invalid');
                $('#departamentoErrorVacioedit').hide();
                $('#municipioEdit').removeClass('is-invalid');
                $('#municipioErrorVacioedit').hide();
            }, 3000);
    
            return;
        }
    
    
        var registroExiste = $('#tableLocalidadEdit tbody tr').filter(function() {
            return $(this).data('departamento-id') == departamentoId && $(this).data('municipio-id') == municipioId;
        }).length > 0;
    
        if (registroExiste) {
            $('#departamentoEdit').addClass('is-invalid');
            $('#municipioEdit').addClass('is-invalid');
            $('#departamentoErrorDuplicadoedit').show();
            $('#municipioErrorDuplicadoedit').show();
    
            // Ocultar las validaciones después de 3 segundos
            setTimeout(function() {
                $('#departamentoEdit').removeClass('is-invalid');
                $('#departamentoErrorDuplicadoedit').hide();
                $('#municipioEdit').removeClass('is-invalid');
                $('#municipioErrorDuplicadoedit').hide();
            }, 3000);
    
            return;
        }
    
        var departamentoSeleccionado = $('#departamentoEdit option:selected').text();
        var municipioSeleccionado = $('#municipioEdit option:selected').text();
    
        var rowCount = $('#tableLocalidadEdit tbody tr').length;
    
        var newRow = '<tr data-departamento-id="' + departamentoId + '" data-municipio-id="' + municipioId + '">' +
            '<td>' + (rowCount + 1) + '</td>' +
            '<td>' + departamentoSeleccionado + '</td>' +
            '<td>' + municipioSeleccionado + '</td>' +
            '<td><a href="#" class="delete-row">' +
            feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) +
            '</a></td>' +
            '</tr>';
    
        $('#tableLocalidadEdit tbody').append(newRow);
    
        localidadesSeleccionadas.push({ departamentoId: departamentoId, municipioId: municipioId });
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
                      ">t" +
                      '<"d-flex justify-content-between mx-2 row mb-1"' +
                      '<"col-sm-12 col-md-6"i>' +
                      '<"col-sm-12 col-md-6"p>' +
                      ">",
                    language: {
                      sLengthMenu: "Show _MENU_",
                      search: "Buscar",
                      searchPlaceholder: "Buscar...",
                    },
                    // Buttons with Dropdown
                    buttons: [
                      {
                        text: "Nuevo",
                        className: "add-new btn btn-primary mt-50",
                        attr: {
                          "data-toggle": "modal",
                          "data-target": "#modalNew",
                        },
                        init: function (api, node, config) {
                          $(node).removeClass("btn-secondary");
                        },
                      },
                    ],
                    initComplete: function (settings, json) {
                      // Añadir estilos CSS después de que la tabla esté completa
                      $("<style>")
                        .prop("type", "text/css")
                        .html(
                          `
                          .dropdown-menu {    
                            position: absolute !important;
                            top: 100%;
                            left: 5 !important;
                            margin-left:  50px !important;
                            z-index: 1051 !important; /* Incrementa z-index para superar la paginación */
                            display: none;
                            white-space: nowrap;
                          }
                          .btn-group.show .dropdown-menu {
                            display: block;
                          }
                          #tableData {
                            position: relative !important;
                            z-index: 0 !important;
                          }
                          #tableData_wrapper .row:last-child {
                            margin-top: 50px; /* Ajusta este valor según sea necesario */
                          }
                        `
                        )
                        .appendTo("head");
                    },
                  });
                };



const getDepartamento = () => {
    return new Promise((resolve, reject) => {
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
                // Limpiar selects de departamentos
                $('#departamento').empty().append('<option value="" selected disabled>Selecciona una opción</option>');
                $('#departamentoEdit').empty().append('<option value="" selected disabled>Selecciona una opción</option>');

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
                        $('#municipio').html('<option value="" selected disabled>Selecciona una opción</option>'); // Limpiar municipios
                        getMunicipioByDepto(selectedId);
                    });
                }

                if (selectDepartamentoEdit) {
                    selectDepartamentoEdit.addEventListener('change', function () {
                        var selectedId = this.value;
                        $('#municipioEdit').html('<option value="" selected disabled>Selecciona una opción</option>'); // Limpiar municipios
                        getMunicipioByDepto(selectedId);
                    });
                }
                resolve();
            })
            .catch(error => {
                console.error('Error al obtener los departamentos:', error);
                reject(error);
            });
    });
};


const getMunicipioByDepto = (idDepartamento) => {
    return new Promise((resolve, reject) => {
        $('#municipio').html('<option value="" selected disabled>Selecciona una opción</option>');
        $('#municipioEdit').html('<option value="" selected disabled>Selecciona una opción</option>');

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: { "Authorization": token }
        };

        fetch(`${url}Municipio/by/${idDepartamento}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                // Limpiar selects para evitar duplicados
                $('#municipio').empty().append('<option value="" selected disabled>Selecciona una opción</option>');
                $('#municipioEdit').empty().append('<option value="" selected disabled>Selecciona una opción</option>');

                result.forEach(element => {
                    var opc = `<option value="${element.id}">${element.nombre}</option>`;
                    $('#municipio').append(opc);
                    $('#municipioEdit').append(opc);
                });
                resolve();
            })
            .catch(err => {
                console.log('error', err);
                reject(err);
            });
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
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
    };

    fetch(`${url}projects/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            $("#id").val(id);
            $('#descripcionEdit').val(result.descripcion);
            $('#rutaEdit').val(result.ruta);
            dataTableEdith = result.departamento_proyectos;

            $('#tableLocalidadEdit tbody').empty();
            localidadesSeleccionadas = [];
            dataDepaAndMuni = [];

            getDepartamento().then(() => {
                result.departamento_proyectos.forEach((loc, index) => {
                    localidadesSeleccionadas.push({ departamentoId: loc.departamento.id, municipioId: loc.municipio.id });
                    dataDepaAndMuni.push({ departamentoId: loc.departamento.id, municipioId: loc.municipio.id });

                    var newRow = '<tr data-departamento-id="' + loc.departamento.id + '" data-municipio-id="' + loc.municipio.id + '">' +
                        '<td>' + (index + 1) + '</td>' +
                        '<td>' + loc.departamento.nombre + '</td>' +
                        '<td>' + loc.municipio.nombre + '</td>' +
                        '<td><a href="#" class="delete-row">' +
                        feather.icons['trash-2'].toSvg({ class: 'font-small-4 mr-50' }) +
                        '</a></td>' +
                        '</tr>';

                    $('#tableLocalidadEdit tbody').append(newRow);
                });

                if (result.departamento_proyectos.length > 0) {
                    var firstDepto = result.departamento_proyectos[0].departamento.id;
                    $('#departamentoEdit').val(firstDepto).change();
                    
                    setTimeout(() => {
                        result.departamento_proyectos.forEach(loc => {
                            $('#municipioEdit').append('<option value="' + loc.municipio.id + '">' + loc.municipio.nombre + '</option>');
                            $('#municipioEdit option[value="' + loc.municipio.id + '"]').prop('selected', true);
                        });
                    }, 1000); 
                }
            });

            $("#modalEdit").modal("toggle");
        })
        .catch((error) => console.log("error", error));
};



$('#departamentoEdit').on('change', function () {
    var departamentoId = $(this).val();
    getMunicipios(departamentoId);
});


const deleteRow = (data) => {
    console.log('ID:', data);
}

const OpenDelete = (id) => {
    $("#idDelete").val(id);
    $("#modalDelete").modal("toggle");
}