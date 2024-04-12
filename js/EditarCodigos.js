$(function () {
  $("#container1").hide();
});

$("#btnConsultar").click(function () {
 
  let phone= $("#phone").val();
 
  
  if(phone !== ""){
    


  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
 
  var raw = JSON.stringify({

    phone:phone,
    
    
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url}codigoReferidos/getCodigoReferidoByPhone`, requestOptions)
 
  .then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('La solicitud no fue exitosa');
    }
})
.then((result) => {
    if (result.length > 0) {
        let { id, codigo } = result[0];
        $("#id").val(id);
        $("#codigo").val(codigo);
        $("#container1").show("fast");
    } else {
        alert("El teléfono ingresado no es referido.");
    }
})
.catch((error) => {
    console.error('Error en la solicitud:', error);
    Alert("El teléfono ingresado no es referido", "error");
});
} else {
alert("El teléfono es requerido");
}

return false;
});

$("#btnCancelar").click(function () {
  $("#container1").hide("fast");
});

$("#formNew").submit(function () {

  const id = $("#id").val();
  const codigo = $("#codigo").val();

  $("#btnSubmit").attr("disabled", true);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    codigo: codigo,
    id: id,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url}codigoReferidos/actualizarCodigoReferido`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.code == "ok") {
        $("#container1").hide("fast");
        Alert(result.message, "success");
      } else {
        Alert(result.errors, "error");
      }

      $("#btnSubmit").attr("disabled", false);
    })
    .catch((error) => {
      Alert(error.errors, "error");
      $("#btnSubmit").attr("disabled", false);
    });

  return false;
});
