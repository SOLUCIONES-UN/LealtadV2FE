const url = 'http://localhost:3000/'
let token = localStorage.getItem("token");

$(function () {
    getRoles();
    let tabla = getUsuarios();
    Usuario()

    function validarNombreYusername(nombre, username) {
        const nombreValido = /^[a-zA-Z0-9\s]+$/.test(nombre.trim());
        const usernameValida = /^[a-zA-Z0-9\s]+$/.test(username.trim());

        if (!nombreValido) {
            $('#nombre').addClass('is-invalid');
            $('#nombreError').text('El nombre no admite caracteres especiales ni espacios en blanco').addClass('text-danger');
            return false;
        } else {
            $('#nombreEdit').removeClass('is-invalid');
            $('#nombreEditError').empty().removeClass('text-danger');
        }

        if (!usernameValida) {
            $('#username').addClass('is-invalid');
            $('#usernameError').text('El nombre de usuario no admite caracteres especiales ni espacios en blanco').addClass('text-danger');
            return false;
        } else {
            $('#usernameEdit').removeClass('is-invalid');
            $('#usernameEditError').empty().removeClass('text-danger');
        }

        return true;
    }




    $('#modalNew, #modalEdit').on('show.bs.modal', function () {
        limpiarForm();
    });

    $('#modalNew, #modalEdit').on('hidden.bs.modal', function () {
        limpiarForm();
    });

    $('#modalNew, #modalEdit').find('[data-dismiss="modal"]').click(function () {
        limpiarForm();
    });


    //evento submit del formulario
    $('#formNew').submit(function (e) {
        $('#btnSubmitAdd').prop('disabled', true);

        const nombre = $('#nombre').val();
        const username = $('#username').val();

        if (!validarNombreYusername(nombre, username)) {
            $('#btnSubmitAdd').prop('disabled', false);
            return false;
        }


        e.preventDefault();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);

        if ($('#password').val().trim() != $('#password2').val().trim()) {
            Alert('Las contraseñas no coinciden', 'error');
            return;
     
        }
        

        var raw = JSON.stringify({
            "username": $('#username').val(),
            "password": $('#password').val(),
            "nombre": $('#nombre').val(),
            "telefono": $('#telefono').val(),
            "emailNotificacion": $('#emailNotification').val(),
            "tipoUsuario": $("#tipoUsuario").val(),
            "idRol": $('#rol').val(),
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}Usuario`, requestOptions)
            .then(response => response.json())
            .then(result => {
                $('#btnSubmitAdd').prop('disabled', false);


                if (result.code == "ok") {
                    limpiarForm();
                    tabla._fnAjaxUpdate();
                    $('#modalNew').modal('toggle');
                    Alert(result.message, 'success')
                } else {
                    Alert(result.message, 'error')
                }

            })
            
            .catch(error => { 
                $('#btnSubmitAdd').prop('disabled', false);
                Alert(error.errors, 'error') });
        return false;
    });





    // para actualizar usuarios
    $('#formEdit').submit(function (e) {
        $('#btnSubmitEdit').prop('disabled', true);
        const nombre = $('#nombreEdit').val();
        const username = $('#usernameEdit').val();

        if (!validarNombreYusername(nombre, username)) {
            $('#btnSubmitEdit').prop('disabled', false);
            return false;
        }

        e.preventDefault();
        var myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);


        // if ($('#passwordEdit').val().trim() != $('#passwordEdit2').val().trim()) {
        //     Alert('Las contraseñas no coinciden', 'error');
        //     return;

        // }
        // console.log('Contraseñas correctas');

        var raw = JSON.stringify({
            "username": username,
            "password": $('#passwordEdit').val(),
            "nombre": $('#nombreEdit').val(),
            "telefono": $('#telefonoEdit').val(),
            "emailNotificacion": $('#emailEdit').val(),
            "tipoUsuario": $("#tipoUsuarioEdit").val(),
            "idRol": $('#rolActualizar').val(),
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${url}Usuario/${username}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                $('#btnSubmitEdit').prop('disabled', false);

                if (result.code == "ok") {
                    limpiarForm();
                    tabla._fnAjaxUpdate();
                    $('#modalEdit').modal('toggle');
                    Alert(result.message, 'success')
                } else {
                    Alert(result.message, 'error')
                }
            })
            .catch(error => { 
                $('#btnSubmitEdit').prop('disabled', false);
                Alert(error.errors, 'error') });
        return false;
    });


    // para borrar usuarios
    $('#BtnDelete').click(function () {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);


        const username = $('#usernameDelete').val();
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${url}Usuario/${username}`, requestOptions)
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

// const Usuario = () => {

//     let usuario = JSON.parse(localStorage.getItem('infoUsuario'));
//     console.log(usuario.nombre)
//     $('.user-name').text(usuario.nombre);
//     $('.user-status').text(usuario.rol.descripcion);
// }


//obtiene los usuarios
const getUsuarios = () => {
    return $('#tableData').dataTable({
        ajax: {
            url: `${url}Usuario`,
            type: "GET",
            datatype: "json",
            dataSrc: "",
            headers: { "Authorization": token }
        },

        columns: [

            { data: "nombre" },
            { data: "rol.descripcion" },
            {
                data: "username", render: function (data) {

                    return `
              <div class="btn-group">
                <a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">
                    ${feather.icons['more-vertical'].toSvg({ class: 'font-small-4' })}
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                    <a href="#" onclick="OpenEdit('${data}')" class="btn_edit dropdown-item">
                        ${feather.icons['archive'].toSvg({ class: 'font-small-4 mr-50' })} Actualizar
                    </a>
                
                <div class="dropdown-menu dropdown-menu-right">
                    <a href="#" onclick="OpenDelete('${data}')" class="btn_delete dropdown-item">
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
    $('#nombre').removeClass('is-invalid').val('');
    $('#username').removeClass('is-invalid').val('');
    $('#nombreError').empty();
    $('#usernameError').empty();
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


const OpenEdit = (username) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: { "Authorization": token }
    };

    fetch(`${url}Usuario/${username}`, requestOptions)
        .then(response => response.json())
        .then(result => {

            $('#usernameEdit').val(username);
            $('#nombreEdit').val(result.nombre);
            $('#passwordEdit').val(result.password);
            $('#telefonoEdit').val(result.telefono);
            $('#emailEdit').val(result.emailNotificacion);
            $('#tipoUsuarioEdit').val(result.tipoUsuario),
            $('#rolActualizar').val(result.idRol);
            $('#modalEdit').modal('toggle');
        })
        .catch(error => console.log('error', error));

}


const OpenDelete = (username) => {

    $('#usernameDelete').val(username);
    $('#modalDelete').modal('toggle');

}

const getRoles = () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: { "Authorization": token }
    };

    $('#rol').html('<option value="0" selected disabled>Selecciona una Opcion</option>');
    $('#rolActualizar').html('<option value="0" selected disabled>Selecciona una Opcion</option>');
    fetch(`${url}Rol`, requestOptions)
        .then(response => response.json())
        .then(result => {
            result.forEach(element => {
                var opc = `<option value="${element.id}">${element.descripcion}</option>`;
                $('#rol').append(opc);
                $('#rolActualizar').append(opc);
            });
        })
        .catch(error => console.log('error', error));

}


