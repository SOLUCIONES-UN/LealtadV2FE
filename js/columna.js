const url = 'http://localhost:3000/'

$(function () {
    let tabla = getColumnas();

    //evento submit del formulario
    $('#formNew').submit(function () {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "nombre": $('#nombre').val()
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}Columna`, requestOptions)
            .then(response => response.json())
            .then(result => {


                if (result.code == "ok") {
                    limpiarForm();
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


    $('#formEdit').submit(function () {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        const id = $('#id').val();

        var raw = JSON.stringify({
            "nombre": $('#nombreEdit').val()
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}Columna/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {


                if (result.code == "ok") {
                    limpiarForm();
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


    $('#BtnDelete').click(function () {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        const id = $('#idDelete').val();
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${url}Columna/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {


                if (result.code == "ok") {
                    limpiarForm();
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


//obtiene las Columnas
const getColumnas = () => {
    return $('#tableData').dataTable({
        ajax: {
            url: `${url}Columna`,
            type: "GET",
            datatype: "json",
            dataSrc: ""
        },
        columns: [
            { data: "id" },
            { data: "nombre" },
            {
                data: "id", render: function (data) {
                    return `
              <div class="btn-group">
                <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                    ${feather.icons['more-vertical'].toSvg({ class: 'font-small-4' })}
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                    <a href="#" onclick="OpenEdit(${data})" class="btn_edit dropdown-item">
                        ${feather.icons['archive'].toSvg({ class: 'font-small-4 mr-50' })} Actualizar
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
                    //Metodo para agregar un nuevo usuario
                },
            },
        ],
    });
}


const limpiarForm = () => {
    $('#formNew').trigger("reset");
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
        redirect: 'follow'
    };

    fetch(`${url}Columna/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            $('#id').val(id);
            $('#nombreEdit').val(result.nombre);
            $('#modalEdit').modal('toggle');
        })
        .catch(error => console.log('error', error));

}


const OpenDelete = (id) => {

    $('#idDelete').val(id);
    $('#modalDelete').modal('toggle');

}