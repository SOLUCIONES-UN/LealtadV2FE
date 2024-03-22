let usuarioDashboardDashboard = JSON.parse(localStorage.getItem("infousuarioDashboard"));

$(function () {
    getAllPromocionesActivas();
    getAllCampanasActivas();
    getAllCampanasActivasLastWeek();
    getAllPromocionesActivasLastWeek();

    $("#ver-detalles-btn").click(function () {
        //$("#graficaModal").modal("show");
        var myModal = new bootstrap.Modal(document.getElementById("graficaModal"));
        mostrarGraficaCampañas();
        myModal.show();
    });
});


function mostrarGraficaCampañas() {
  // Obtener el canvas
  const canvas = document.getElementById("graficaCampañas");

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
    .then((data) => {
      console.log("Datos de campañas:", data);

      const labels = data.map((campaña) => campaña.nombre);
      const numClientes = data.map((campaña) => campaña.numero_clientes);

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: "Número de clientes",
            data: [20,10,40,33],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };

      const chartOptions = {
        scales: {
          yAxes: [{}],
        },
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


const cerrarModalBtn = document.getElementById("cerrar-modal-btn");

cerrarModalBtn.addEventListener("click", () => {

  const modalInstance = new bootstrap.Modal(
    document.getElementById("graficaModal")
  );
  modalInstance.hide();
});

const displayNumCampanas = (numCampanas) => {
  const numCampanasElement = document.getElementById("num-campanas");
  numCampanasElement.textContent = numCampanas;
};

const getAllCampanasActivas = () => {
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
      const campanasActivas = result.filter((campana) => campana.estado === 1);
      console.log(campanasActivas);
      displayNumCampanas(campanasActivas.length);
    })
    .catch((error) => console.log("error", error));
};

const displayNumReferidos = (numReferidos) => {
  const numReferidosElement = document.getElementById("num-referidos");
  numReferidosElement.textContent = numReferidos;
};

// Función para obtener y mostrar todas las participaciones activas
const getAllParticipaciones = () => {
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

const displayNumPromociones = (numPromociones) => {
  const numPromocionesElement = document.getElementById("num-promociones");
  numPromocionesElement.textContent = numPromociones;
};

const getAllPromocionesActivas = () => {
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

const displayNumCampanasLastWeek = (numCampanas) => {
  const numCampanasElement = document.getElementById("num-campanas-last-week");
  numCampanasElement.textContent = numCampanas;
};

const getAllCampanasActivasLastWeek = () => {
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
};


const displayNumPromocionesLastWeek = (numPromociones) => {
  const numPromocionesElement = document.getElementById(
    "num-promociones-last-week"
  );
  numPromocionesElement.textContent = numPromociones;
};

const getAllPromocionesActivasLastWeek = () => {
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

