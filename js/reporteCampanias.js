const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

const headers = {"Authorization": token}

$(function () {
  getPromociones();

  $("#consultar-campa").on("click", function () {
    if (
      $("#selectcampa").val() !== 0 &&
      $("#FechaInicio").val() !== "" &&
      $("#FechaFin").val() !== ""
    ) {
      GetReport();
    } else {
      Alert("Debe de llenar todos los campos", "error");
    }
  });
});

document.querySelector('#excel-campa').addEventListener('click', () => {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: headers
      };

      const a = document.createElement('a');
            a.href = url + "reports/excel/reporteClientesContraCampanas"
          a.click();
    
      fetch(url + "reports/excel/reporteClientesContraCampanas", requestOptions)
        .then((response) => response.arrayBuffer)
        .then((result) => {

        })
        .catch((error) => Alert(error, "error"));
});

//funcion para llenar las promociones
const getPromociones = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: headers
  };

  fetch(url + "Campania", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      $("#selectcampa").html(
        "<option disabled selected value='0'>Elige una campaña</option>"
      );

      result.forEach((element) => {
        $("#selectcampa").append(
          '<option value="' + element.id + '">' + element.nombre + "</option>"
        );
      });
    })
    .catch((error) => Alert(error, "error"));
};

const GetReport = () => {

  var raw = JSON.stringify({
    promocion: $("#selectcampa").val(),
    fechaInicial: $("#FechaInicio").val(),
    fechaFinal: $("#FechaFin").val(),
  });

  /* var requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
    redirect: "follow",
  };
  $("#TablaReporteCampania").html(null);
  fetch(url + "reportePromocion", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);

      result.forEach((element) => {

        let fecha = element.fecha.split("T");
        let fecha2 = fecha[0].split("-");
        let hora = fecha[1].split(":");
        const { cupon, esPremio } = element.detallePromocion;
        const { descripcion } = element.detallePromocion.premioPromocion.premio;
        var listado = `
        <tr> 
          <th> 
          ${element.id}
          </th>
          <th>
          ${cupon}
          </th>
          <th>
          ${fecha2[2]}/${fecha2[1]}/${fecha2[0]} ${hora[0]}:${hora[1]}
          </th>
          <th>
          ${element.numeroTelefono}
          </th>
          <th>
          ${esPremio === 1 ? "SI" : "NO"}
          </th>
          <th>
          ${descripcion}
          </th>
        </tr>
        `;
        $("#TablaReporteCampania").append(listado);

      });
    })
    .catch((error) => Alert(error, "error")); */

    const datas = [
        {
            telefono: "50230349689",
            nombre: "Bryan Cristopher  García  Castillo ",
            campana: "REFIRIENDO",
            tipo: "1"
        },
        {
            telefono: "50230349689",
            nombre: "Bryan Cristopher  García  Castillo ",
            campana: "Refiere y Gana",
            tipo: "1"
        }
    ]

    datas.forEach((element, index) => {

/*         let fecha = element.fecha.split("T");
        let fecha2 = fecha[0].split("-");
        let hora = fecha[1].split(":");
        const { cupon, esPremio } = element.detallePromocion;
        const { descripcion } = element.detallePromocion.premioPromocion.premio; */
        var listado = `
        <tr> 
          <th> 
          ${index + 1}
          </th>
          <th>
          ${element.telefono}
          </th>
          <th>
          ${element.nombre}
          </th>
          <th>
          ${element.campana}
          </th>
          <th>
          ${element.tipo}
          </th>
        </tr>
        `;
        $("#TablaReporteCampania").append(listado);

      });


};


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
