let usuarioDashboardDashboard = JSON.parse(
    localStorage.getItem("infousuarioDashboard")
);

const token = localStorage.getItem("token");

$(function() {
    $('#datosGrafica').hide();
    getparticipantes();
    getPromocionessem();
    getProyectos();
    getAllCountCoustomeName();
    getAllSumValor();
    getTransaccion();
    getReferidos();
    getAllCampanasActivasLastWeek();
    getAllPromocionesActivasLastWeek();
    getAllPromocionesActivas();
    getAllCampanasActivas();
    // getAllCampanasSEm();
    getnewCampanias();
    getAllclientes();
    // mostrarGraficaCampañas();
});





function getnewCampanias() {
    console.log('Obteniendo nuevas campañas del backend');
    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
    };

    fetch(`${url}Campania/new`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la respuesta del servidor');
            }
            return response.json();
        })
        .then((result) => {
            console.log("Datos de las nuevas campañas:", result);
            const cantidad = result.campanias; // Revisa este cambio
            const maxCantidad = 100; // Define el valor máximo que se puede alcanzar
            const porcentaje = (cantidad / maxCantidad) * 100;

            // Actualiza el texto y el ancho de la barra de progreso
            $('#newcampanias').text(cantidad);
            $('#progresbarcampania').css('width', porcentaje + '%');
            $('#progresbarcampania').attr('aria-valuenow', porcentaje);



        })
        .catch((error) => console.log("Error al obtener las nuevas campañas:", error));
}



const cerrarModalBtn = document.getElementById("cerrar-modal-btn");




function getAllCampanasActivas() {
    console.log('transaccion de backend')
    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
    };

    fetch(`${url}Campania/count`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Data de campanias todas", result);
            $('#num-campanas').text(result.cantidad);
        })
        .catch((error) => console.log("Error al obtener el total de beneficios:", error));
};



function getAllCampanasSEm() {
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

    fetch(`${url}Campania/sem`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log('Campañas recibidas:', result);

            const campanasActivas = result.filter((campana) => campana.estado === 1);
            const fechaActual = new Date();

            const datosCampañas = campanasActivas.map((campana) => {
                const fechaFin = new Date(campana.fechaFin);
                const tiempoRestante = fechaFin - fechaActual;
                const diasRestantes = Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24));

                return {
                    nombre: campana.nombre,
                    diasRestantes: diasRestantes,
                    fechaVencimiento: fechaFin.toLocaleDateString(),
                };
            });

            // Ordenar las campañas por días restantes
            datosCampañas.sort((a, b) => a.diasRestantes - b.diasRestantes);

            // Mostrar las campañas ordenadas en la tabla
            displayCampanas(datosCampañas);


        })
        .catch((error) => console.log("Error al obtener las campañas activas:", error));
}


document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById("graficaCampanas1").getContext("2d");

    // Obtener los nombres de las campañas dinámicamente
    getAllCampanasSEm();

    function getAllCampanasSEm() {
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

        fetch(`${url}Campania/sem`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log('Campañas recibidas:', result);

                const campanasActivas = result.filter((campana) => campana.estado === 1);
                const fechaActual = new Date();

                const nombresCampañas = campanasActivas.map((campana) => campana.nombre);

                // Crear el gráfico después de obtener los nombres de las campañas
                createChart(nombresCampañas);
            })
            .catch((error) => console.log("Error al obtener las campañas activas:", error));
    }

    function createChart(labels) {
        // Datos para las 6 barras
        const data = [25, 20, 15, 10, 5, 3]; // Datos quemados

        const backgroundColors = [
            "rgba(255, 112, 67)", // Color más vibrante para la primera barra
            "rgba(240, 98, 146)", // Color más vibrante para la segunda barra
            "rgba(115, 103, 240)", // Color más vibrante para la tercera barra
            "rgba(57, 73, 171)", // Color más vibrante para la cuarta barra
            "rgba(57, 73, 171)", // Color más vibrante para la quinta barra
            "rgba(41, 182, 246)" // Color para la sexta barra
        ];

        // Configuración del gráfico
        const chartData = {
            labels: labels,
            datasets: [{
                label: "Número de Campañas",
                data: data,
                backgroundColor: backgroundColors,
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            }]
        };

        const chartOptions = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const campaignIndex = tooltipItem.index;
                        const campaignName = data.labels[campaignIndex];
                        return campaignName;
                    }
                }
            }
        };

        // Crear la gráfica
        new Chart(ctx, {
            type: "bar",
            data: chartData,
            options: chartOptions
        });
    }
});





function displayCampanas(campanas) {
    const tabla = document.getElementById("campaniatable");

    // Limpiar la tabla antes de llenarla
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Nombre de la Campaña</th>
                <th>Días Restantes y Fecha de Vencimiento</th>
            </tr>
        </thead>
    `;

    const tbody = document.createElement('tbody');
    tabla.appendChild(tbody);

    campanas.forEach((campana) => {
        const fila = tbody.insertRow();

        const celdaNombre = fila.insertCell(0);
        celdaNombre.textContent = campana.nombre;

        const celdaDiasRestantes = fila.insertCell(1);
        celdaDiasRestantes.textContent = `Vence en ${campana.diasRestantes} días, ${campana.fechaVencimiento}`;

        // Agregar clases de estilo según el número de días restantes
        if (campana.diasRestantes <= 5) {
            fila.style.color = "red";
        } else if (campana.diasRestantes <= 15) {
            fila.style.color = "orange";
        } else if (campana.diasRestantes <= 30) {
            fila.style.color = "green";
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    getAllCampanasSEm();
});





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



//Proyectos

function getProyectos() {
    console.log('transaccion de backend')
    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    var requestOptions = {
        method: "GET",
        headers: headers,
    };


    fetch(`${url}projects/count`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log("Data de count proyectos :", result);
            $('#Proyectos').text(result.cantidad);
        })
        .catch((error) => console.log("Error al obtener el total de beneficios:", error));
};



//referidos




function getPromocionessem() {
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
            $('#progressBarxx').css('width', porcentaje + '%');
            $('#progressBarxx').attr('aria-valuenow', porcentaje);
        })
        .catch((error) => console.log("Error al obtener el total de promociones:", error));
}


//promociones 

function getReferidos() {
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




//promociones activas 
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


            console.log("Data de count referidos:", result);
            const cantidad = promocionesActivas.length;
            const maxCantidad = 100; // Define el valor máximo que se puede alcanzar
            const porcentaje = (cantidad / maxCantidad) * 100;

            // Actualiza el texto y el ancho de la barra de progreso
            $('#numpromociones').text(cantidad);
            $('#progressBarprom').css('width', porcentaje + '%');
            $('#progressBarprom').attr('aria-valuenow', porcentaje);

        })
        .catch((error) => console.log("error", error));
};



//clientes 
function displayNumClientes(numClientes) {
    const numClientesElement = document.getElementById("numclientes");
    numClientesElement.textContent = parseInt(numClientes);
}

function getAllclientes() {
    const token = localStorage.getItem("token");

    const headers = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    fetch(`${url}ParticipacionesActivas/clientes`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            const cantidad = result.customer_count;
            console.log("Data de count clientes toda la data:", result);

            const maxCantidad = 100;
            const porcentaje = (cantidad / maxCantidad) * 100;

            document.getElementById('numclientes').textContent = cantidad;
            document.getElementById('numclientes-porcentaje').textContent = Math.round(porcentaje); // Redondear el porcentaje
            const progressBarClientes = document.getElementById('progressBarClientes');
            progressBarClientes.style.width = porcentaje + '%';
            progressBarClientes.setAttribute('aria-valuenow', porcentaje);
        })
        .catch((error) => console.log("error", error));
}










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
                    // Filtrar las filas que tienen datos undefined
                    const filteredData = json.filter(row => {
                        return row.customerInfo !== undefined && row.campanium !== undefined;
                    });
                    return filteredData;
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
            {
                data: null,
                render: function(data, type, row) {
                    if (row.customerInfo) {
                        return `${row.customerInfo.fname} ${row.customerInfo.lname}`;
                    } else {
                        console.error('customerInfo es undefined para la fila:', row);
                        return 'N/A'; // O cualquier valor por defecto que prefieras
                    }
                }
            },
            { data: "campanium.nombre" },
            { data: "campanium.fechaCreacion" }
        ],
        dom: '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
            '<"col-lg-12 col-xl-6" l>' +
            '<"col-lg-12 col-xl-6 pl-xl-75 pl-0"<"dt-action-buttons text-xl-right text-lg-left text-md-right text-left d-flex align-items-center justify-content-lg-end align-items-center flex-sm-nowrap flex-wrap mr-1"<"mr-1"f>B>>' +
            '>t' +
            '<"d-flex justify-content-between mx-2 row mb-1"' +
            '<"col-sm-12 col-md-6"i>' +
            '<"col-sm-12 col-md-6"p>' +
            '>',
        language: {
            sLengthMenu: "Mostrar _MENU_",
            search: "",
            searchPlaceholder: "Buscar...",
        },
    });
}

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