const url = "http://localhost:3000/";

$(function () {
  getAnios();
});

function getAnios() {
  fetch(`${url}ReporteParticipantes/aniosValidos`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Datos de años:", data);
      let options = `<option value="0">AÑO</option>`;
      data.forEach((d) => {
        options += `<option value="${d.anioValido}">${d.anioValido}</option>`;
      });

      $("#anoCampanas").html(options);
    })
    .catch((error) => console.error("Error al obtener los anios:", error));
}

function getMeses(event) {
  const headers = {
    "Content-Type": "application/json",
  };
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    anioValido: event.target.value,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url}ReporteParticipantes/mesesValidos`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("Datos de aios:", data);
      let options = `<option value="0">MES</option>`;
      data.forEach((d) => {
        options += `<option value="${
          d.mesValido < 10 ? "0" + d.mesValido : d.mesValido
        }">${d.mesValido < 10 ? "0" + d.mesValido : d.mesValido}</option>`;
      });

      $("#mesCampana").html(options);
    })
    .catch((error) => console.error("Error al obtener los anios:", error));
}
$("#btnConsultar").click(function () {
  const headers = {
    "Content-Type": "application/json",
  };

  var raw = JSON.stringify({
    anio: $("#anoCampanas").val(),
    mes: $("#mesCampana").val(),
  });

  if ($("#anoCampanas").val() == "0") {
    alert("Seleccione un año");
  } else if ($("#mesCampana").val() == "0") {
    alert("Seleccione un mes");
  } else {
    var requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${url}ReporteParticipantes/ObtenerParticipacionesByFecha`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de campañas:", data);

        // Obtener el canvas y su contexto
        const canvas = document.getElementById("graficaParticipantes");
        const ctx = canvas.getContext("2d");

        // Destruir el gráfico existente si existe
        if (window.myChart) {
          window.myChart.destroy();
        }

        // Obtener datos para el gráfico
        const labels = data.map((c) => c.nombre);
        const participantes = data.map((c) => c.participantes);

        // Configuración del gráfico
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: "Participantes",
              data: participantes,
              backgroundColor: "rgba(117, 85, 245)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        };

        const chartOptions = {
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
