const url = 'http://localhost:3000/';
let token = localStorage.getItem("token");

const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
};

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", token);

$(function () {
    let tabla = getTablaDb();
    getSelect();

    function validarDescripcion(descripcion) {
        const descripcionValida = /^[a-zA-Z0-9\s_\-<>()!.,;:;"']+$/g.test(descripcion);
        if (!descripcionValida) {
            $('.descripcion').addClass('is-invalid');
            $('.descripcion-error').text('La descripción no debe contener caracteres especiales inesperados').addClass('text-danger');
            return false;
        }
        $('.descripcion').removeClass('is-invalid');
        $('.descripcion-error').empty().removeClass('text-danger');
        return true;
    }

  
    $('#modalNew').on('show.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled",false);
    });

    $('#modalEdit').on('show.bs.modal', function () {
       
    });

    $('#modalNew').on('hidden.bs.modal', function () {
        limpiarFormulario();     
        $("#btnSubmit").attr("disabled",false);
    });

    $('#modalEdit').on('hidden.bs.modal', function () {
        limpiarFormulario();
        $("#btnSubmitEdit").attr("disabled",false);
    });

    $('#modalNew').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled",false);
    });

    $('#modalEdit').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmitEdit").attr("disabled",false);
    });

    $('#modalNew').find('[data-dismiss="modal"]').click(function () {
        limpiarFormulario();
        $("#btnSubmit").attr("disabled",false);
    });


    $('#formNew').submit(function () {

        const descripcion = $('#descripcion').val();
        const proyecto = $("#ruta").val();

        if (!validarDescripcion(descripcion)) {
            return false;
        }

        if(proyecto == 0 || proyecto == null){
            $('.ruta').addClass('is-invalid');
            $('.ruta-error').text('El campo departamento es obligatorio').addClass('text-danger');
            return false;   
        }

        $("#btnSubmit").attr("disabled",true);

        var raw = JSON.stringify({
            "nombre_tabla": $('#descripcion').val(),
            "idProyectos": $('#ruta').val()
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}tabladb`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code == "ok") {
                    limpiarFormulario();
                    tabla._fnAjaxUpdate();
                    $('#modalNew').modal('toggle');
                    Alert(result.message, 'success')
                } else {
                    Alert(result.message, 'error')
                }
            })
            .catch(error => { Alert(error.errors, 'error') });
           
        return false;
    });

    //eventos de edicion para un 

    $('#formEdit').submit(function () {

        const descripcion = $('#descripcionEdit').val();

        if (!validarDescripcion(descripcion)) {
            return false;
        }
        $("#btnSubmitEdit").attr("disabled", true);

        const id = $('#id').val();
        
        var raw = JSON.stringify({
            "nombre_tabla": $('#descripcionEdit').val(),
            "idProyecto": $('#rutaEdit').val(),
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}tabladb/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code == "ok") {
                    limpiarFormulario();
                    tabla._fnAjaxUpdate();
                    $('#modalEdit').modal('toggle');
                    Alert(result.message, 'success')
                } else {
                    Alert(result.message, 'error')
                }
            })
            .catch(error => { Alert(error.errors, 'error') });
        return false;
    });

    //eventos para la inhabilitacion de un proyecto
    $('#BtnDelete').click(function () {
        const id = $('#idDelete').val();
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${url}tabladb/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code == "ok") {
                    limpiarFormulario();
                    tabla._fnAjaxUpdate();
                    $('#modalDelete').modal('toggle');
                    Alert(result.message, 'success');
                } else {
                    Alert(result.message, 'error');
                }

            })
            .catch(error => { Alert(error.errors, 'error') });            
    })
});

//obtiene la lista de proyectos
const getTablaDb = () => {
    return $('#tableData').dataTable({
        ajax: {
            url: `${url}tabladb`,
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
            { data: "nombre_tabla" },
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
        // order: [[1, 'asc']],
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
        // Buttons with Dropdown
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
                    //Metodo para agregar un nuevo proyecto
                },
            },
        ],
    });
    
}

function limpiarFormulario() {
    $('#formNew').trigger("reset");
    $('#descripcion').val('');
    $('#ruta').val("");
    $('.descripcion').removeClass('is-invalid');
    $('.descripcion-error').empty().removeClass('text-danger');
    $('.ruta').removeClass('is-invalid');
    $('.ruta-error').empty().removeClass('text-danger');
}

const Alert = function (message, status) // si se proceso correctamente la solicitud
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
        redirect: 'follow', 
        headers: myHeaders
    };
    fetch(`${url}tabladb/${id}`, requestOptions)
        .then(response =>  response.json())
        .then(result => {
            // Procesar la respuesta exitosa
            $('#id').val(id);
            $('#descripcionEdit').val(result.nombre_tabla);
            $('#rutaEdit').val(result.idProyectos);
            $('#modalEdit').modal('toggle');
        })
        .catch(error => { Alert(error.message, 'error');});
}

const OpenDelete = (id) => { 
    limpiarFormulario();
    $("#idDelete").val(id);
    $("#modalDelete").modal("toggle");
}


const getSelect = ()=>{ 
    var requestOptions ={
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };
    $('#ruta').html('<option value="0" selected disabled>Selecciona una Opcion</option>');
    fetch(`${url}projects`,requestOptions)
        .then(response => response.json())
        .then(result =>{
            console.log(result);
      
    
            result.forEach(element=>{
                 
                var  opc = `<option value="${element.id}">${element.descripcion}</option>`; 
    
                $('#ruta').append(opc);
                $('#rutaEdit').append(opc);
            });
        })
        .catch(err => Alert(err.message, 'error'))
}

