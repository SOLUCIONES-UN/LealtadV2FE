const url = "http://localhost:3000/";
let token = localStorage.getItem("token");
$(function () {

    $("#ConsultarReferido" ).click(function() {
        if ($("#FechaInicio").val() !=="" && $("#FechaFin").val() !=="") {
            GetReport();
        }else{
            Alert("Fecha inicial y fecha final es requerida, por favor vuelve a intentarlo.", "error");
        }
        
    });
  });



const getParticipacionesFechasGeneral = (fecha1, fecha2) => {
    // Definimos los datos de la solicitud
    var requestOptions = {
        method: "GET",
        headers: {
            "Authorization": token
        }
    };

    // Hacemos la solicitud al backend
    fetch(`${url}reporteGeneralReferido/${fecha1}/${fecha2}`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos.');
            }
            return response.json();
        })


        .then((datos) => {
            // Agregar la campaña obtenida a la tabla
            const row = `
                <tr>
                    <td>${datos.fecha}</td>
                    <td>${datos.codigo}</td>
                </tr>`;
            $("#TablaReporteReferidos").html(row); // Reemplazar el contenido de la tabla con el nuevo registro
        })


        // .then((datos) => {
        //     // Aquí puedes procesar los datos obtenidos
        //     let tabla = '';
        //     datos.forEach((dato, index) => {
        //         tabla += `
        //             <tr>
        //                 <td>${index + 1}</td>
        //                 <td>${dato.fecha}</td>
        //                 <td>${dato.codigo}</td>
        //                 <td>Descripción</td> <!-- Reemplaza esto con la descripción correspondiente -->
        //                 <td>${dato.nombreReferido}</td>
        //                 <td>${dato.userno}</td>
        //                 <td>${dato.noReferido}</td>
        //             </tr>
        //         `;
        //     });
        //     $("#TablaReporteReferidos").html(tabla);
        // })

        
        .catch((error) => {
            console.error('Error en la solicitud:', error);
            // Manejar el error si ocurre
            Alert('Ha ocurrido un error al obtener los datos.', 'error');
        });
};

$("#ConsultarReferido").click(function() {
    const fecha1 = $("#fecha1").val().trim();
    const fecha2 = $("#fecha2").val().trim();
    if (fecha1 !== '' && fecha2 !== '') {
        getParticipacionesFechasGeneral(fecha1, fecha2);
    } else {
        console.error('Por favor, ingrese fechas válidas.');
    }
});

