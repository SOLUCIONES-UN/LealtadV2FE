const url = "http://localhost:3000/";
$(function () {
  
});

$("#btnConsultar").click(function () {
  const headers = {
    "Content-Type": "application/json",
  };

  
  const fechaInicio = $("#fechaInicio").val();
  const fechaFin = $("#fechaFin").val();


  if (!fechaInicio || fechaInicio === "0") {
    alert("Seleccione una fecha de inicio");
    return; 
  }

  if (!fechaFin || fechaFin === "0") {
    alert("Seleccione una fecha de fin");
    return; 
  }

  
  var raw = JSON.stringify({
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
  });

  if ($("#fechaInicio").val() == "0") {
    alert("Seleccione una fecha de inicio");
  } else if ($("#fechaFin").val() == "0") {
    alert("Seleccione una fecha de fin");
  } else {
    var requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow",
    };

    fetch(`${url}ReporteParticipantes/ObtenerParticipacionesByFecha`,requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de campañas:", data);

   
        
        const canvas = document.getElementById("graficaParticipantes");
       ; 
        const ctx = canvas.getContext("2d");

        
        if (window.myChart) {
          window.myChart.destroy();
        }

        // Obtener datos para el gráfico
        const dataLabels = data.map((p) => `${p.nombre} - ${p.fecha}`); // Combinar nombre y fecha como etiquetas
        const participantes = data.map((p) => p.participantes);
        
        // Configuración del gráfico
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
                "rgba(165, 105, 189 )",
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
          responsive: false,// Establecer en false para mantener el tamaño constante
          scales: {
            y: {
              beginAtZero: true, // Empezar el eje Y desde cero
            },
          },
        };
        
        // Crear el gráfico
        window.myChart = new Chart(ctx, {
          type: "bar",
          data: chartData,
          options: chartOptions,
        });
        
      })
      .catch((error) =>
        console.error("Error al obtener los datos de las campañas:", error)
      );
  }
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