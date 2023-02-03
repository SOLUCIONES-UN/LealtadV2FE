const url = 'http://localhost:3000/'

$(function () {
    getRols()
    getMenus()
    //getPaginas()

})


const getRols = () =>{

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      
    };

    fetch(`${url}Rol`, requestOptions)
    .then(response => response.json())
    .then(result => {
      result.forEach(element => {
        var opc = `<option value="${element.id}">${element.descripcion}</option>`;
        $('#Rols').append(opc);
      });
    })
    .catch(error => console.log('error', error));

}

const getMenus = () =>{

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      
    };

    fetch(`${url}Menu`, requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
      result.forEach(element => {
        var opc = `<option value="${element.id}">${element.descripcion}</option>`;
        $('#menu').append(opc);
      });
    })
    .catch(error => console.log('error', error));

}

const obtenerPermisos = () => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    $('#contenedor-izquierdo').html(null)

    const idMenu = $('#menu').val();
    const idRol = $('#Rols').val();

    var raw = JSON.stringify({
        "idRol": idRol,
        "idMenu": idMenu
    });

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      
    };

    fetch(`${url}permisosUsuario/NoAsignados`, requestOptions)
    .then(response => response.json())
    .then(result => {
      result.forEach(element => {
        var opc = `<div class="form-check form-switch pl-2 pt-1">
            <input class="form-check-input permiso" type="checkbox" role="switch" id="checkpermisos${element.id}" value="${element.id}">
            <label class="form-check-label label-no-Asignado" for="checkpermisos${element.id}" style="font-size: 1rem;">${element.descripcion}</label>
            </div>`;
        $('#contenedor-izquierdo').append(opc);
      });
    })
    .catch(error => console.log('error', error));

    getAsignados()

}

$('#menu').on('change', function(){

    const idMenu = $('#menu').val();
    const idRol = $('#Rols').val();
    console.log(idMenu, idRol)

    if( idMenu != null && idRol != null ){
        obtenerPermisos()
    }
})


$('#btnAdd').click(function () {
    var data  = [];
    $('.permiso:checked').each(function() {
       data.push({ idPagina: $(this).val(), idRol : 1, username: 'JEstivenA'})
    });


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log(data)

    var raw = JSON.stringify({
        "data": data
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${url}permisosUsuario`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if(result.code == "ok"){
                    obtenerPermisos()
                    Alert(result.message, 'success')
                } else{
                   Alert(result.message, 'error');
                }
            })
            .catch(error => {Alert(error, 'error')
            });
    return false;
})

$('#btnDelete').click(function(){
    let id = []

    $('.permiso:checked').each(function() {
        
        id.push($(this).val())
    });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "id": id
    });

    console.log(raw);

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${url}permisosUsuario`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if(result.code == "ok"){
                    obtenerPermisos()
                    Alert(result.message, 'success')
                } else{
                   Alert(result.message, 'error');
                }
            })
            .catch(error => {Alert(error, 'error')
            });
    return false;

     
})

const getAsignados = () => {

     var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    $('#contenedor-derecho').html(null)
    
    const idMenu = $('#menu').val();
    const idRol = $('#Rols').val();

    var raw = JSON.stringify({
        "idRol": idRol,
        "idMenu": idMenu
    });

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      
    };

    fetch(`${url}permisosUsuario/Asignados`, requestOptions)
    .then(response => response.json())
    .then(result => {
      result.forEach(element => {
        console.log(result)
        var opc = `<div class="form-check form-switch pl-2 pt-1">
            <input class="form-check-input permiso" type="checkbox" role="switch" id="checkpermisos${element.id}" value="${element.id}">
            <label class="form-check-label label-Asignado" for="checkpermisos${element.id}" style="font-size: 1rem;">${element.pagina.descripcion}</label>
            </div>`;
        $('#contenedor-derecho').append(opc);
      });
    })
    .catch(error => console.log('error', error));
}

const Alert = function(message, status){
    toastr[`${status}`](message, `${status}`, {
        closeButton: true,
        tapToDismiss: false,
        positionClass: 'toast-top-right',
        rtl: false
      });
}
