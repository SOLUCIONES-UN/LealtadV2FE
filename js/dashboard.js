let usuarioDashboardDashboard = JSON.parse(localStorage.getItem("infousuarioDashboard"));


const token = localStorage.getItem("token");

$(function() {
    $('#datosGrafica').hide();
    getparticipantes();
    getPromociones();
    getAllCountCoustomeName();
    getAllSumValor();
    getTransaccion();
    getReferidos();
    getAllCampanasActivasLastWeek();
    getAllPromocionesActivasLastWeek();
    getAllPromocionesActivas();
    getAllCampanasActivas();
    // mostrarGraficaCampañas();
});





const cerrarModalBtn = document.getElementById("cerrar-modal-btn");

// cerrarModalBtn.addEventListener("click", () => {

//   const modalInstance = new bootstrap.Modal(
//     document.getElementById("graficaModal")
//   );
//   modalInstance.hide();
// });

function displayNumCampanas(numCampanas) {
    const numCampanasElement = document.getElementById("num-campanas");
    numCampanasElement.textContent = numCampanas;
};

function getAllCampanasActivas() {
    const token = localStorage.getItem("token");

    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    fetch(`${url}Campania`, requestOptions)
        .then((response) => response.json())
        .then((result) => {

            console.log('\n\n\n\n Datos campania ' + result + "\n\n\n\n");
            const campanasActivas = result.filter((campana) => campana.estado === 1);
            const fechaActual = new Date();
            const datosCampañas = campanasActivas.map((campana) => {
                const fechaFin = new Date(campana.fechaFin);
                const tiempoRestante = fechaFin.getTime() - fechaActual.getTime();

                console.log("FECHA FIN ES " + campana.fechaFin);

                const año = fechaActual.getFullYear();
                const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
                const día = fechaActual.getDate().toString().padStart(2, '0');

                const fechaFormateada = `${año}-${mes}-${día}`;

                console.log(fechaFormateada); // Output: "2024-03-21"

                console.log("FECHA FIN ES " + campana.fechaFin);
                console.log("FECHA actual ES " + fechaFormateada);

                const fechaInicial = new Date(fechaFin);
                const fechaActualizada = new Date(fechaFormateada);

                console.log("FECHA INICIAL ANTES DE CALCULAR " + fechaInicial);
                console.log("FECHA fechaActualizada ANTES DE CALCULAR " + fechaActualizada);

                const diferenciaMs = fechaActualizada.getTime() - fechaInicial.getTime();

                const diferenciaDias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

                console.log("LA DIFERENCIA DE DIAS DE LAS FECHAS ES " + diferenciaDias);

                return {
                    nombre: campana.nombre,
                    diasRestantes: diferenciaDias,
                    fechaVencimiento: fechaFin.toLocaleDateString(),
                };

            });
            displayCampanas(datosCampañas);
            displayNumCampanas(campanasActivas.length);
        })
        .catch((error) => console.log("error", error));
}

function displayCampanas(campanas) {
    const tabla = document.getElementById("campaniatable");

    campanas.forEach((campana) => {
        const fila = tabla.insertRow();

        const celdaNombre = fila.insertCell(0);
        celdaNombre.textContent = campana.nombre;

        const celdaDiasRestantes = fila.insertCell(1);
        celdaDiasRestantes.textContent = `Vence en ${campana.diasRestantes} dias, ${campana.fechaVencimiento}`;

        console.log("LOS DIAS SON " + campana.diasRestantes);

        // Agregar clases de estilo según el número de días restantes
        if (campana.diasRestantes >= 10 || campana.diasRestantes <= 10 && campana.diasRestantes > 5) {
            celdaDiasRestantes.classList.add("verde");

        } else if (campana.diasRestantes <= 5 && campana.diasRestantes > 2) {
            celdaDiasRestantes.classList.add("amarillo");

        } else if (campana.diasRestantes <= 2) {
            celdaDiasRestantes.classList.add("rojo");
        }

    });
}

function displayNumReferidos(numReferidos) {
    const numReferidosElement = document.getElementById("num-referidos");
    numReferidosElement.textContent = numReferidos;
};

// Función para obtener y mostrar todas las participaciones activas
function getAllParticipaciones() {
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    fetch(`${url}Participacion`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Data de participaciones:", result);
        })
        .catch((error) => console.log("Error al obtener participaciones:", error));
};


function getAllCountCoustomeName() {
    console.log('\n\n\n\n\n\n Estoy dentro de la funcion Count \n\n\n\n')
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
    };


    fetch(`${url}Participacion/count`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Data de count:", result);
            $('#clientesCount').text(result.totalParticipacions);
        })
        .catch((error) => console.log("Error al obtener la cantidad de clientes:", error));
};

function getAllSumValor() {
    console.log('\n\n\n\n\n\n Estoy dentro de la funcion Sum \n\n\n\n')
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
    };


    fetch(`${url}Participacion/sumarvalor`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Data de count:", result);
            $('#sumaValor').text("Q " + parseFloat(result.total).toFixed(2));
        })
        .catch((error) => console.log("Error al obtener el total de beneficios:", error));
};





//transacciones
function getTransaccion() {
    console.log('transaccion de backend')
    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
    };


    fetch(`${url}Transaccion/count`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Data de count:", result);
            $('#Transaccion').text(result.cantidad);
        })
        .catch((error) => console.log("Error al obtener el total de beneficios:", error));
};



//referidos


function getReferidos() {
    console.log('promociones de backend');
    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
    };

    fetch(`${url}Promocion/count`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Data de count promociones:", result);
            const cantidad = result.cantidad;
            const maxCantidad = 100; // Define el valor máximo que se puede alcanzar
            const porcentaje = (cantidad / maxCantidad) * 100;

            // Actualiza el texto y el ancho de la barra de progreso
            $('#Promocion').text(cantidad);
            $('#progressBarprom').css('width', porcentaje + '%');
            $('#progressBarprom').attr('aria-valuenow', porcentaje);
        })
        .catch((error) => console.log("Error al obtener el total de promociones:", error));
}


//promociones 

function getPromociones() {
    console.log('Transacción de backend');
    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
    };

    fetch(`${url}referidosIngresos/count`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Data de count referidos:", result);
            const cantidad = result.cantidad;
            const maxCantidad = 100; // Define el valor máximo que se puede alcanzar
            const porcentaje = (cantidad / maxCantidad) * 100;

            // Actualiza el texto y el ancho de la barra de progreso
            $('#Referidos').text(cantidad);
            $('#progressBar').css('width', porcentaje + '%');
            $('#progressBar').attr('aria-valuenow', porcentaje);
        })
        .catch((error) => console.log("Error al obtener el total de beneficios:", error));
}









function displayNumPromociones(numPromociones) {
    const numPromocionesElement = document.getElementById("num-promociones");
    numPromocionesElement.textContent = numPromociones;
};



function getAllPromocionesActivas() {
    const token = localStorage.getItem("token");

    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };


    fetch(`${url}Promocion`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            const promocionesActivas = result.filter(
                (promocion) => promocion.estado === 1
            );
            console.log(promocionesActivas);
            displayNumPromociones(promocionesActivas.length);
        })
        .catch((error) => console.log("error", error));
};

function displayNumCampanasLastWeek(numCampanas) {
    const numCampanasElement = document.getElementById("num-campanas-last-week");
    numCampanasElement.textContent = numCampanas;
};

function getAllCampanasActivasLastWeek() {
    const token = localStorage.getItem("token");
    const today = new Date();
    const lastWeekStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6
    );
    const lastWeekEnd = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    fetch(`${url}Campania`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            const campanasActivasLastWeek = result.filter(
                (campana) =>
                campana.estado === 1 &&
                new Date(campana.fechaCreacion) >= lastWeekStart &&
                new Date(campana.fechaCreacion) <= lastWeekEnd
            );
            console.log(
                "Campañas activas de la última semana:",
                campanasActivasLastWeek
            );
            displayNumCampanasLastWeek(campanasActivasLastWeek.length);
        })
        .catch((error) => console.log("error", error));
}


function displayNumPromocionesLastWeek(numPromociones) {
    const numPromocionesElement = document.getElementById(
        "num-promociones-last-week"
    );
    numPromocionesElement.textContent = numPromociones;
};

function getAllPromocionesActivasLastWeek() {
    const token = localStorage.getItem("token");
    const today = new Date();
    const lastWeekStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6
    );
    const lastWeekEnd = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    fetch(`${url}Promocion`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            const promocionesActivasLastWeek = result.filter(
                (promocion) =>
                promocion.estado === 1 &&
                new Date(promocion.fechaCreacion) >= lastWeekStart &&
                new Date(promocion.fechaCreacion) <= lastWeekEnd
            );
            console.log(
                "Promociones activas de la última semana:",
                promocionesActivasLastWeek
            );
            displayNumPromocionesLastWeek(promocionesActivasLastWeek.length);
        })
        .catch((error) => console.log("error", error));
};






//flotante div



const cards = document.querySelectorAll('.card');
for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    card.addEventListener('mousemove', rotate);
    card.addEventListener('mouseout', stopRotate);
}

function rotate(e) {
    const cardItem = this.querySelector('.card-item');
    const halfHeight = cardItem.offsetHeight / 2;

    cardItem.style.transform = 'rotateX(' + -(e.offsetY - halfHeight) / 7 + 'deg) rotateY(' + (e.offsetX - halfHeight) / 7 + 'deg)';
}

function stopRotate() {
    const cardItem = this.querySelector('.card-item');
    cardItem.style.transform = 'rotate(0)';
}





function getAllTransaccionesActivas() {
    const token = localStorage.getItem("token");

    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };


    fetch(`${url}Transaccion`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            const transaccionActivas = result.filter(
                (transaccion) => transaccion.estado === 1
            );
            console.log('esto traebn las transacciones', transaccionActivas);
            displayNumTransaccion(transaccionActivas.length);
        })
        .catch((error) => console.log("error", error));
};




function displayNumTransaccion(numTransaccion) {
    const numTransaccionElement = document.getElementById("num-Transacciones");
    numTransaccionElement.textContent = numTransaccion;
};







const getparticipantes = () => {
    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    return $('#tableData').dataTable({
        ajax: {
            url: `${url}Participante`,
            type: "GET",
            datatype: "json",
            dataSrc: function(json) {
                console.log('Datos recibidos del servidor:', json); // Inspecciona los datos recibidos
                if (json && Array.isArray(json)) {
                    return json;
                } else {
                    console.error('La respuesta no es un array:', json);
                    return [];
                }
            },
            error: function(xhr, status, error) {
                console.error('Error en la solicitud Ajax:', status, error);
                console.error('Respuesta del servidor:', xhr.responseText);
            },
            headers: headers
        },
        columns: [{
                data: null,
                render: function(data, type, row, meta) {
                    if (type === 'display') {
                        return meta.row + 1;
                    }
                    return meta.row + 1;
                }
            },
            { data: "id" },
            { data: "campanium.nombre" }, // Nombre de la campaña
            // Fecha de creación de la campaña
            {
                data: "campanium.fechaCreacion"

            }
        ],
        dom: '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
            '<"col-lg-12 col-xl-6" l>' +
            '<"col-lg-12 col-xl-6 pl-xl-75 pl-0"<"dt-action-buttons text-xl-right text-lg-left text-md-right text-left d-flex align-items-center justify-content-lg-end align-items-center flex-sm-nowrap flex-wrap mr-1"<"mr-1"f>B>>' +
            '>t' +
            '<"d-flex justify-content-between mx-2 row mb-1"' +
            '<"col-sm-12 col-md-6"i>' +
            '<"col-sm-12 col-md-6"p>' +
            '>',
    });
}