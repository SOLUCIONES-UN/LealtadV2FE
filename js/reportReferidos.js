const url = "http://localhost:3000/";
$(function () {

    $("#ConsultarReferido" ).click(function() {
        if ($("#FechaInicio").val() !=="" && $("#FechaFin").val() !=="") {
            GetReport();
        }else{
            Alert("Fecha inicial y fecha final es requerida, por favor vuelve a intentarlo.", "error");
        }
        
    });
  });

  const GetReport = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var raw = JSON.stringify({
      fechaInicial: $("#FechaInicio").val(),
      fechaFinal: $("#FechaFin").val(),
    });
    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      $("#TablaReporteReferidos").html(null);

      var contador = 1
      fetch(url + "reporteReferidos", requestOptions)
        .then((response) => response.json())
        .then((result) => {

          console.log(result);
    
          result.forEach((element) => {
            //let fecha = element.fecha.split("T");
            //let anio = fecha[0].split("-");
            //let hora = fecha[1].split(":");
            const { codigo } = element.codigosReferido;
            var listado = `
            <tr> 
              <th> 
              ${contador++}
              </th>
              <th>
              ${element.fecha}
              </th>
              <th>
              ${codigo}
              </th>
              <th>
              ${"plataforma"}
              </th>
              <th>
              ${element.refiriente}
              </th>
              <th>
              ${element.referido}
              </th>
            </tr>
            `;
            $("#TablaReporteReferidos").append(listado);
          });
        })
    
        .catch((error) => Alert(error, "error"));
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