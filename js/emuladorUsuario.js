const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

$(function() {
    $("#ConsultaNUmber").click(function() {
        const telefono = $("#numero").val().trim();
        if (telefono !== '') {
            buscaData(telefono);
        } else {
            // console.error('Por favor, ingrese un número de teléfono válido.');
            Alert("Debe de llenar todos los campos", "error");
        }
    });
});

const buscaData = (telefono) => {
    var requestOptions = {
        method: "GET",
        headers: {
            "Authorization": token
        }
    };

    console.log("Realizando solicitud fetch a: ", `${url}ConsultaNumber/${telefono}`);

    fetch(`${url}ConsultaNumber/${telefono}`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener el numero.');
            }
            return response.json();
        })
        .then((resp) => { 
            let newHtml = '';
            let data = resp.promociones ? resp.promociones : resp;
            if (data.length > 0) {
                data.forEach((numero, res) => {
                    console.log("Procesando número: ", numero);
                    const conte = numero.notificacion > 0 ? `${numero.notificacion}` : `${numero.mistransacciones}/${numero.transacciones}`;
                    newHtml +=  `
                    <div class="row" style="border: 1px solid lightgrey; border-radius: 5px; margin: 5px; min-height: 75px;">
                        <div class="col-md-1" style="margin: auto 0; font-size: 1.4em;">
                            <img src="${numero.imgAkisi}" style="max-width: 100%;">
                        </div>
                        <div class="col-md-10" style="margin: auto 0;">${numero.nombre}</div>
                        <div class="col-md-1" style="margin: auto 0; text-align: center; font-size: 1.6em; font-weight: 600;">${conte}</div>
                    </div>`;
                });
            } else {
                newHtml = `<div class="row"><div class="col-md-12">${resp.textoSinInfo}</div></div>`;
            }
            $('#contEdita').html(newHtml);
        })
};


        const Alert = function(
            message,
            status // si se proceso correctamente la solicitud
        ) {
            toastr[`${status}`](message, `${status}`, {
                closeButton: true,
                tapToDismiss: false,
                positionClass: "toast-top-right",
                rtl: false,
            });
        };
