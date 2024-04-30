const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

$(function() {
    $("#ConsultaNUmber").click(function() {
        const telefono = $("#numero").val().trim();
        if (telefono !== '') {
            buscaData(telefono);
        } else {
            console.error('Por favor, ingrese un número de teléfono válido.');
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
            resp.forEach((numero) => {
                console.log("Procesando número: ", numero);
                // const conte = numero.notificacion>0 ? '' + numero.notificacion : '' + numero.mistransacciones + '/' + numero.transacciones;
                newHtml +=  `
                <div class="row" style="border: 1px solid lightgrey; border-radius: 5px; margin: 5px; min-height: 75px;">
                    <div class="col-md-1" style="margin: auto 0; font-size: 1.4em;">
                        <img src="${numero.imgAkisi}" style="max-width: 100%;">
                    </div>
                    <div class="col-md-10" style="margin: auto 0;">${numero.nombre}</div>
                    <div class="col-md-1" style="margin: auto 0; text-align: center; font-size: 1.6em; font-weight: 600;">${"0/1"}</div>
                </div>`;
            });
            if(newHtml==''){ newHtml = `<div class="row"><div class="col-md-12">No hay información disponible.</div></div>`; }
            $('#contEdita').html(newHtml);
        })
        .catch((error) => {
            console.error('Error en la solicitud:', error);
            alert('Ha ocurrido un error al obtener el número.');
        });
};
       
       // const url = "http://localhost:3000/";
        // let token = localStorage.getItem("token");

        // $(function() {


        //     $("#ConsultarPromo").on("click", function() {
        //         if (
        //             $("#selectpromo").val() !== 0 &&
        //             $("#FechaInicio").val() !== "" &&
        //             $("#FechaFin").val() !== ""
        //         ) {
        //             GetReport();
        //         } else {
        //             Alert("Debe de llenar todos los campos", "error");
        //         }
        //     });
        // });







        // const campanasUsuariosEmulador_get = (telefono) => {
        //     // Definimos los datos de la solicitud
        //     var requestOptions = {
        //         method: "GET",
        //         headers: {
        //             "Authorization": token
        //         }
        //     };

        //     // Hacemos la solicitud al backend
        //     fetch(`${url}ConsultaNumber/${telefono}`, requestOptions)
        //         .then((response) => {
        //             if (!response.ok) {
        //                 throw new Error('Error al obtener el numero.');
        //             }
        //             return response.json();
        //         })
        //         .then((numero) => {
        //             // Agregar la campaña obtenida a la tabla
        //             const row = `
        //                 <tr>
        //                     <td>${numero.id}</td>
        //                     <td>${numero.campaign.nombre}</td>
        //                 </tr>`;
        //             $("#TablaReportePromo").html(row); // Reemplazar el contenido de la tabla con el nuevo registro
        //         })
        //         .catch((error) => {
        //             console.error('Error en la solicitud:', error);
        //             // Manejar el error si ocurre
        //             Alert('Ha ocurrido un error al obtener el número.', 'error');
        //         });
        // };

        // // const Alert = function(
        // //     message,
        // //     status // si se proceso correctamente la solicitud
        // // ) {
        // //     toastr[`${status}`](message, `${status}`, {
        // //         closeButton: true,
        // //         tapToDismiss: false,
        // //         positionClass: "toast-top-right",
        // //         rtl: false,
        // //     });
        // // };


        // $("#ConsultaNUmber").click(function() {
        //     const telefono = $("#numero").val().trim();
        //     if (telefono !== '') {
        //         campanasUsuariosEmulador_get(telefono);
        //     } else {
        //         console.error('Por favor, ingrese un número de teléfono válido.');

        //     }
        // });










        // const GetNumeroById = (telefono) => {
        //     // Definimos los datos de la solicitud
        //     var requestOptions = {
        //         method: "GET",
        //         headers: {
        //             "Authorization": token
        //         }
        //     };

        //     // Hacemos la solicitud al backend
        //     fetch(`${url}ConsultaNumber/${telefono}`, requestOptions)
        //         .then((response) => {
        //             if (!response.ok) {
        //                 throw new Error('Error al obtener el numero.');
        //             }
        //             return response.json();
        //         })
        //         .then((numero) => {
        //             // Agregar la campaña obtenida a la tabla
        //             const row = `
        //                 <tr>
        //                     <td>${numero.id}</td>
        //                     <td>${numero.campaign.nombre}</td>
        //                 </tr>`;
        //             $("#TablaReportePromo").html(row); // Reemplazar el contenido de la tabla con el nuevo registro
        //         })
        //         .catch((error) => {
        //             console.error('Error en la solicitud:', error);
        //             // Manejar el error si ocurre
        //             Alert('Ha ocurrido un error al obtener el número.', 'error');
        //         });
        // };

        // // const Alert = function(
        // //     message,
        // //     status // si se proceso correctamente la solicitud
        // // ) {
        // //     toastr[`${status}`](message, `${status}`, {
        // //         closeButton: true,
        // //         tapToDismiss: false,
        // //         positionClass: "toast-top-right",
        // //         rtl: false,
        // //     });
        // // };


        // $("#ConsultaNUmber").click(function() {
        //     const telefono = $("#numero").val().trim();
        //     if (telefono !== '') {
        //         GetNumeroById(telefono);
        //     } else {
        //         console.error('Por favor, ingrese un número de teléfono válido.');

        //     }
        // });













        // const generaCampanasUsuarios = (referens) => {
        //     // Definimos los datos de la solicitud
        //     var requestOptions = {
        //         method: "GET",
        //         headers: {
        //             "Authorization": token
        //         }
        //     };

        //     // Hacemos la solicitud al backend
        //     fetch(`${url}ConsultaNumber/${referens}`, requestOptions)
        //         .then((response) => {
        //             if (!response.ok) {
        //                 throw new Error('Error al obtener el numero.');
        //             }
        //             return response.json();
        //         })
        //         .then((campanas) => {
        //             let rows = '';
        //             campanas.forEach((campana) => {
        //                 rows += `
        //                 <tr>
        //                     <td>${campana.id}</td>
        //                     <td>${campana.generaCampanasUsuarios.nombre}</td>
        //                     <!-- Agrega más celdas según sea necesario para otros atributos -->
        //                 </tr>`;
        //             });
        //             $("#TablaReportePromo").html(rows); // Reemplazar el contenido de la tabla con las filas generadas
        //         })
        //         .catch((error) => {
        //             console.error('Error en la solicitud:', error);
        //             // Manejar el error si ocurre
        //             Alert('Ha ocurrido un error al obtener las campañas.', 'error');
        //         });
        // };





        // const Alert = function(
        //     message,
        //     status // si se proceso correctamente la solicitud
        // ) {
        //     toastr[`${status}`](message, `${status}`, {
        //         closeButton: true,
        //         tapToDismiss: false,
        //         positionClass: "toast-top-right",
        //         rtl: false,
        //     });
        // };


        // $("#ConsultaNUmber").click(function() {
        //     const referens = $("#numero").val().trim();
        //     if (referens !== '') {
        //         generaCampanasUsuarios(referens);
        //     } else {
        //         console.error('Por favor, ingrese un número de teléfono válido.');

        //     }
        // });