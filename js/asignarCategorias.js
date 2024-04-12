const url = 'http://localhost:3000/';
let token = localStorage.getItem("token");

const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
};

$(function () {
    getCategorias();
    Usuario();
});

const getCategorias = () => {

    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch(`${url}categoria`, requestOptions)
        .then(response => response.json())
        .then(result => {
            result.forEach(element => {
                var opc = `<option value="${element.id}">${element.nombre}</option>`;
                $('#categorias').append(opc);
            });
        })
        .catch(error => console.log('error', error));

}

const getTransaccionesAsignadas = () => {

    $('#contenedor-derecho').html(null)

    const idCategoria = $('#categorias').val();

    var raw = JSON.stringify({
        "idCategoria": idCategoria
    });

    var requestOptions = {
        method: 'PATCH',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${url}asignarCategoria/asignados`, requestOptions)
        .then(response => response.json())
        .then(result => {
            result.forEach(element => {
                console.log(result)
                var opc = `<div class="form-check form-switch pl-2 pt-1">
            <input class="form-check-input permiso" type="checkbox" role="switch" id="checkpermisos${element.id}" value="${element.id}">
            <label class="form-check-label label-Asignado" for="checkpermisos${element.id}" style="font-size: 1rem;">${element.transaccion.nombre}</label>
            </div>`;
                $('#contenedor-derecho').append(opc);
            });
        })
        .catch(error => console.log('error', error));
}

const getTransaccionesNoAsignadas = () => {

    $('#contenedor-izquierdo').html(null)

    const idCategoria = $('#categorias').val();

    var raw = JSON.stringify({
        "idCategoria": idCategoria
    });

    var requestOptions = {
        method: 'PATCH',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${url}asignarCategoria/noAsignados`, requestOptions)
        .then(response => response.json())
        .then(result => {
            result.forEach(element => {
                console.log(result)
                var opc = `<div class="form-check form-switch pl-2 pt-1">
            <input class="form-check-input permiso" type="checkbox" role="switch" id="checkpermisos${element.id}" value="${element.id}">
            <label class="form-check-label label-no-Asignado" for="checkpermisos${element.id}" style="font-size: 1rem;">${element.nombre}</label>
            </div>`;
                $('#contenedor-izquierdo').append(opc);
            });
        })
        .catch(error => console.log('error', error));

    getTransaccionesAsignadas();
}

$('#categorias').on('change', function () {

    const idCategoria = $('#categorias').val();
    console.log('id categoria ' + idCategoria)

    if (idCategoria != null) {
        getTransaccionesNoAsignadas();
    }


})

// const Usuario = () => {

//     let usuario = JSON.parse(localStorage.getItem('infoUsuario'));
//     console.log(usuario.nombre)
//     $('.user-name').text(usuario.nombre);
//     $('.user-status').text(usuario.rol.descripcion);
// }

$('#btnAdd').click(function () {

    var data = [];

    $('.permiso:checked').each(function () {
        data.push({ idTransaccion: $(this).val(), idCategoria: $('#categorias').val() })
    });

    var raw = JSON.stringify({
        "data": data
    });

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${url}asignarCategoria`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.code == "ok") {
                getTransaccionesNoAsignadas();
                Alert(result.message, 'success')
            } else {
                Alert(result.message, 'error');
            }
        })
        .catch(error => {
            Alert(error, 'error')
        });
    return false;

})

$('#btnDelete').click(function () {

    let id = []

    $('.permiso:checked').each(function () {

        id.push($(this).val())
    });

    if (id.length == 0) {
        return Alert('Por favor seleccione al menos una categoría.', 'error')
    }

    var raw = JSON.stringify({
        "id": id
    });

    var requestOptions = {
        method: 'DELETE',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${url}asignarCategoria`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.code == "ok") {
                getTransaccionesNoAsignadas();
                Alert(result.message, 'success')
            } else {
                Alert(result.message, 'error');
            }
        })
        .catch(error => {
            Alert(error, 'error')
        });
    return false;
})

const Alert = function (message, status) {
    toastr[`${status}`](message, `${status}`, {
        closeButton: true,
        tapToDismiss: false,
        positionClass: 'toast-top-right',
        rtl: false
    });
}