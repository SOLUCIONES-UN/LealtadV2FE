const url = "http://localhost:3000/";

let token = localStorage.getItem("token");

const headers = {
  Authorization: token,
  "Content-Type": "application/json",
};

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

const Alert = function (message, status) {
  toastr[`${status}`](message, `${status}`, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: "toast-top-right",
    rtl: false,
  });
};

$(function () {
  getCampaniasActivas();

  Usuario();

  $("#btnTestear").click(function () {
    var id = $("#campania option:selected").val();

    var raw = JSON.stringify({
      transaccionData: {
        descripcion: "Recarga de Saldo",
        valor: 10,
      },
      customer_id: 13838,
    });

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow",
    };

    let statusCode = 0;

    fetch(`${url}trxCampanias/Testear`, requestOptions)
      .then((response) => {
        statusCode = response.status;
        if (statusCode == 200) {
          return Alert("Testeo efectuado.", "success");
        } else if (statusCode == 500) {
          return Alert(response.body.errors ?? "Error al testear.", "error");
        }
        response.json();
      })
      .then(async (data) => {
        data.forEach((element, index) => {
          const {
            datosCampania,
            validacionPresupuesto,
            validacionEtapa,
            otrasValidaciones,
            premios,
          } = element;

          //porcentaje presupuesto
          const porPresupuesto =
            (parseFloat(validacionPresupuesto.presupuestoUtilizado) * 100) /
            parseFloat(validacionPresupuesto.presupuesto);
          const porNewPresupuesto =
            (parseFloat(validacionPresupuesto.presupuestoNew) * 100) /
            parseFloat(validacionPresupuesto.presupuesto);

          //porcentaje de participaciones
          const porLimite =
            (parseInt(validacionPresupuesto.cantParticipaciones) * 100) /
            parseInt(validacionPresupuesto.limiteGanadores);
          const porNewLimite =
            ((parseInt(validacionPresupuesto.cantParticipaciones) + 1) * 100) /
            parseInt(validacionPresupuesto.presupuesto);

          //porcentaje de etapa
          const porEtapas =
            (parseInt(validacionEtapa.etapaActual) * 100) /
            parseInt(validacionEtapa.totalEtapas);
          const porNewEtapas =
            ((parseInt(validacionEtapa.etapaActual) + 1) * 100) /
            parseInt(validacionEtapa.totalEtapas);

          var html = ` <div class="card p-1">
                    <div class="row">
                      <div class="col-md-12">
                        <h5><b>${datosCampania.nombre}</b></h5>
                      </div>
                      <div class="col-md-3">
                        <h5><small>Presupuesto Q. ${validacionPresupuesto.presupuesto.toFixed(
                          2
                        )} / Q. ${validacionPresupuesto.presupuestoUtilizado.toFixed(
            2
          )} + ${premios[0].valor}</small></h5>
                            <div class="progress p-0" style="width: 100%; height: 15%">
                                <div class="progress-bar" role="progressbar" style="width: ${porPresupuesto.toFixed(
                                  2
                                )}%;"></div>
                                <div class="progress-bar" role="progressbar" style="width: ${porNewPresupuesto.toFixed(
                                  2
                                )}%; background-color: chartreuse;" aria-valuemax="+15"></div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <h5><small>Limite Participantes ${
                              validacionPresupuesto.limiteGanadores
                            } /  ${
            validacionPresupuesto.cantParticipaciones
          } + 1</small></h5>
                                <div class="progress p-0" style="width: 90%; height: 15%">
                                    <div class="progress-bar" role="progressbar" style="width: ${porLimite}%;"></div>
                                    <div class="progress-bar" role="progressbar" style="width: ${porNewLimite}%; background-color:chartreuse;"></div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <h5><small>Etapas ${
                              validacionEtapa.totalEtapas
                            } /  ${
            validacionEtapa.etapaActual
          }  + 1</small></h5>
                            <div class="progress p-0" style="width: 100%; height: 15%">
                                <div class="progress-bar" role="progressbar" style="width: ${porEtapas}%;"></div>
                                <div class="progress-bar" role="progressbar" style="width: ${porNewEtapas}%; background-color:chartreuse;"></div>
                            </div>
                      </div>
                      <div class="col-md-2">
                        <a class="text-secundary" data-toggle="collapse" href="#detalle${index}" role="button" aria-expanded="false" aria-controls="detalle${index}"> Mostrar Detalle <i data-feather="arrow-down"></i></a>
                      </div>
                      <div class="col-md-2">
                        <button class="btn btn-success btn-block">Premiar</button>
                      </div>
                    </div>
                    <div class="collapse" id="detalle${index}">
                      <div class="card card-body">
                        <p>${datosCampania.descripcion}</p>
                        <div class='row'>
                            <div class='col-md-3'>
                                <div class='row'>`;

          let cumplidas = otrasValidaciones.filter((x) => x.valido === 1);
          let noCumplidas = otrasValidaciones.filter((x) => x.valido === 0);

          console.log(cumplidas);

          html += `<div class='col-md-12'>
                                    <h5 class='text-center'>Transacciones Cumplidas</h5>
                                </div>`;

          cumplidas.forEach((item) => {
            html += `
                                    <div class='col-md-4 text-center'>
                                        <span class='text-success' data-bs-toggle="tooltip" data-bs-html="true" title="${item.nombre}"><i class='feather-35' data-feather="${item.icono}"></i></span><br/>
                                        <span class='text-success'>${item.nombre}</span>
                                    </div>`;
          });

          html += `</div>
                            </div>
                            <div class='col-md-3'>
                                <div class='row'>
                                    <div class='col-md-12'>
                                        <h5 class='text-center'>Transacciones No Cumplidas</h5>
                                    </div>`;

          noCumplidas.forEach((item) => {
            html += `
                                <div class='col-md-4 text-center'>
                                    <span class='text-danger'><i class='feather-35' data-feather="${item.icono}"  data-bs-toggle="tooltip" data-bs-placement="bottom" title="${item.nombre}"></i></span><br/>
                                    <span class='text-danger'>${item.nombre}</span>
                                </div>`;
          });

          html += `</div>
                            <div class='col-md-6'></div>
                        </div>
                      </div>
                    </div>
                  </div>`;
          $("#PnResumen").append(html);
        });

        if (feather) {
          feather.replace({ width: 50, height: 50 });
        }
      })
      .catch((error) => console.log("error", error));
  });
});
// const Usuario = () => {

//     let usuario = JSON.parse(localStorage.getItem('infoUsuario'));
//     console.log(usuario.nombre)
//     $('.user-name').text(usuario.nombre);
//     $('.user-status').text(usuario.rol.descripcion);
// }

const getCampaniasActivas = () => {
  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  fetch(`${url}Campania`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      $("#campania").html('<option value="0">Seleccione Una Opcion</option>');

      result.forEach((element) => {
        $("#campania").append(
          '<option value="' + element.id + '">' + element.nombre + "</option>"
        );
      });
    })
    .catch((error) => console.log("error", error));
};
