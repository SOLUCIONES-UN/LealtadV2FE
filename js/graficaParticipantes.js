const url = "http://localhost:3000/";
$(function () {
  
});

$("#btnConsultar").click(function () {
  const headers = {
    "Content-Type": "application/json",
  };

  
   const FechaInicio = $("#fechaInicio").val();
  const FechaFin = $("#fechaFin").val();


  // Convertir las cadenas de fecha en objetos Date para la comparación
  const dateInicio = new Date(FechaInicio);
  const dateFin = new Date(FechaFin);

  // Comprueba si la fecha de inicio es mayor que la fecha de fin
  if (dateInicio > dateFin) {
    Alert("La Fecha Final no puede ser menor a fecha Inicial", "error");
    return; // Evitar hacer la llamada al servidor si la fecha de inicio es mayor
  }

    const raw = JSON.stringify({
      fechaInicio: FechaInicio,
      fechaFin: FechaFin,
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}ReporteParticipantes/ObtenerParticipacionesByFecha`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de campañas:", data);
        if (data.length === 0) {
          Alert("No hay participaciones para las fechas seleccionadas", "error");
          return;
        }

        const canvas = document.getElementById("graficaParticipantes");
        const ctx = canvas.getContext("2d");

        const dataLabels = data.map((p) => `${p.nombre} - ${p.fecha}`);
        const participantes = data.map((p) => p.participantes);

        if (window.myChart) {
          window.myChart.data.labels = dataLabels;
          window.myChart.data.datasets[0].data = participantes;
          window.myChart.update();
        } else {
          const chartData = {
            labels: dataLabels,
            datasets: [
              {
                label: "Participantes",
                data: participantes,
                backgroundColor: [
                  "rgba(41, 182, 246)",
                  "rgba(129, 199, 132)",
                  "rgba(21, 101, 192)",
                  "rgba(165, 105, 189)",
                  "rgba(102, 102, 255)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          };

          const chartOptions = {
            maintainAspectRatio: true,
            responsive: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          };

          window.myChart = new Chart(ctx, {
            type: "bar",
            data: chartData,
            options: chartOptions,
          });
        }
      })
      .catch((error) =>
        console.error("Error al obtener los datos de las campañas:", error)
      );
  });
let chartType = "bar"; // Variable para controlar el tipo de gráfico actual

$("#btnGrafCircular").click(function () {

  
  if (window.myChart) {
    // Destruir el gráfico existente
    window.myChart.destroy();

    // Cambiar el tipo de gráfico
    chartType = chartType === "bar" ? "doughnut" : "bar";

    // Obtener los datos para el nuevo gráfico
    const chartData = window.myChart.config.data;
    const labels = chartData.labels;
    const data = chartData.datasets[0].data;

    let rowHTML = '<div class="row">';
    labels.forEach((label, index) => {
      rowHTML += `<div class="col-md-3">Fecha: ${label.split(" - ")[1]}, Campaña: ${label.split(" - ")[0]}, Participantes: ${data[index]}</div>`;
      if ((index + 1) % 4 === 0) {
        rowHTML += '</div><div class="row">';
      }
    });
    rowHTML += '</div>';
    $("#listaDatos").html(rowHTML);

    // Crear el nuevo gráfico con maintainAspectRatio establecido en false
    const canvas = document.getElementById("graficaParticipantes");
    const ctx = canvas.getContext("2d");
    window.myChart = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: "Participantes",
            data: data,
            backgroundColor: [
              "rgba(41, 182, 246)",
              "rgba(129, 199, 132)",
              "rgba(21, 101, 192)",
              "rgba(165, 105, 189 )",
              "rgba(102, 102, 255)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(253, 254, 254)",
              "rgba(253, 254, 254)",
              "rgba(253, 254, 254)",
              "rgba(253, 254, 254)",
              "rgba(253, 254, 254)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Establecer en false para mantener el tamaño constante
      },
    });
  }
});
document.getElementById('btnGrafCircular').addEventListener('click', function() {
  var container = document.getElementById('container');
  if (container.style.display === 'none') {
      container.style.display = 'block'; // Mostrar el contenedor
  } else {
      container.style.display = 'none'; // Ocultar el contenedor
  }
});
const Alert = function (
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