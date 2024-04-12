let usuarioDashboardDashboard = JSON.parse(localStorage.getItem("infousuarioDashboard"));


const token = localStorage.getItem("token");

$(function () {
  $('#datosGrafica').hide();
  
  getAllCountCoustomeName();
  getAllSumValor();
  getAllCampanasActivasLastWeek();
  getAllPromocionesActivasLastWeek();
  getAllPromocionesActivas();
  getAllCampanasActivas();
  mostrarGraficaCampañas();
});

//boton para volver a pagina anterior
$("#btnRegresar").click(function () {
  $('#datosGrafica').hide();
  
  $("#dataDashboard").show('low');

})

$("#ver-detalles-btn").click(function () {
  // var myModal = new bootstrap.Modal(document.getElementById("graficaModal"));
  // mostrarGraficaCampañas();

  $('#dataDashboard').hide();

  $('#datosGrafica').show();
  mostrarGraficaCampañas();
  // mostrarGraficaCampañas1();
  // $('#datosGrafica1').show();
  // mostrarGraficaCampañas2();
  // $('#datosGrafica2').show();
  // myModal.show();
});


function mostrarGraficaCampañas() {
  // Obtener el canvas
  
  const canvas = document.getElementById("graficaCampanas");
  
  const token = localStorage.getItem("token");
  // const token = localStorage.getItem("token");
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
    .then((data) => {
      if (!data) {
        console.error("La respuesta de la solicitud fetch es nula");
        return;
      }
      console.log("Datos de campañas:", data);

      const labels = data.map((campana) => campana.nombre);
      const numClientes = data.map((campana) => campana.numero_Clientes);
   
      const chartData = {
        labels: labels,
        datasets: [
          {
            label: "Número de clientes",
            data: numClientes,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };
      const chartOptions = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true // Esto asegura que la escala comience en cero
            }
          }]
        }
      };
      console.log("Labels:", labels);
      console.log("NumClientes:", numClientes);

      const ctx = canvas.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: chartOptions,
      });


    })
    .catch((error) =>
      console.error("Error al obtener datos de campañas:", error)
    );
}

// function mostrarGraficaCampañas1() {
//   // Obtener el canvas
//   const canvas = document.getElementById("graficaCampanas1");
//   var labels = [];
//   for (var i = 1; i <= 12; i++) {
//     labels.push('Columna ' + i);
//   }
//   var data = [];
//   for (var i = 0; i < 12; i++) {
//     data.push(Math.floor(Math.random() * 100)); // Generar valores aleatorios para cada columna
//   }


//   const token = localStorage.getItem("token");
//   const headers = {
//     Authorization: token,
//     "Content-Type": "application/json",
//   };

//   var requestOptions = {
//     method: "GET",
//     headers: headers,
//     redirect: "follow",
//   };

//   fetch(`${url}Campania`, requestOptions)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Datos de campañas:", data);

//       const labels = data.map((campaña) => campaña.nombre);
//       const numCampanas = data.map((campaña) => campaña.numero_campana);

//       const chartData = {
//         labels: labels,
//         datasets: [
//           {
//             label: "Número de Campanas",
//             data: [20, 10, 40, 33, 22, 32, 23, 53, 55, 66, 33, 44],
//             backgroundColor: "rgba(54, 162, 235, 0.2)",
//             borderColor: "rgba(54, 162, 235, 1)",
//             borderWidth: 1,
//           },
//         ],
//       };

//       const chartOptions = {
//         scales: {
//           yAxes: [{}],
//         },
//       };
//       console.log("Labels:", labels);
//       console.log("NumCampanas:", numCampanas);

//       const ctx = canvas.getContext("2d");
//       new Chart(ctx, {
//         type: "bar",
//         data: chartData,
//         options: chartOptions,
//       });


//     })
//     .catch((error) =>
//       console.error("Error al obtener datos de campañas:", error)
//     );
// }

// function mostrarGraficaCampañas2() {
//   // Obtener el canva
//   const canvas = document.getElementById("graficaCampanas2");
//   var labels = [];
//   for (var i = 1; i <= 12; i++) {
//     labels.push('Columna ' + i);
//   }
//   var data = [];
//   for (var i = 0; i < 12; i++) {
//     data.push(Math.floor(Math.random() * 100)); // Generar valores aleatorios para cada columna
//   }


//   const token = localStorage.getItem("token");
//   const headers = {
//     Authorization: token,
//     "Content-Type": "application/json",
//   };

//   var requestOptions = {
//     method: "GET",
//     headers: headers,
//     redirect: "follow",
//   };

//   fetch(`${url}Campania`, requestOptions)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Datos de campañas:", data);

//       const labels = data.map((campaña) => campaña.nombre);
//       const numCampanas = data.map((campaña) => campaña.numero_campana);

//       const chartData = {
//         labels: labels,
//         datasets: [
//           {
//             label: "Número de Campanas",
//             data: [20, 10, 40, 33, 22, 32, 23,],
//             backgroundColor: "rgba(54, 162, 235, 0.2)",
//             borderColor: "rgba(54, 162, 235, 1)",
//             borderWidth: 1,
//           },
//         ],
//       };

//       const chartOptions = {
//         scales: {
//           yAxes: [{}],
//         },
//       };
//       console.log("Labels:", labels);
//       console.log("NumCampanas:", numCampanas);

//       const ctx = canvas.getContext("2d");
//       new Chart(ctx, {
//         type: "bar",
//         data: chartData,
//         options: chartOptions,
//       });


//     })
//     .catch((error) =>
//       console.error("Error al obtener datos de campañas:", error)
//     );
// };



const cerrarModalBtn = document.getElementById("cerrar-modal-btn");

cerrarModalBtn.addEventListener("click", () => {

  const modalInstance = new bootstrap.Modal(
    document.getElementById("graficaModal")
  );
  modalInstance.hide();
});

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
    if (campana.diasRestantes>=10 || campana.diasRestantes <=10 && campana.diasRestantes>5) {
      celdaDiasRestantes.classList.add("verde");

    }else if(campana.diasRestantes <=5 && campana.diasRestantes >2){
      celdaDiasRestantes.classList.add("amarillo");

    }else if(campana.diasRestantes <= 2){
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



