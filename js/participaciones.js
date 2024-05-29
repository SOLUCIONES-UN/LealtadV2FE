const url = "http://localhost:3000/";
let token = localStorage.getItem("token");

$(function () {
  const getParticipaciones = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`${url}Participacion`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };

  getParticipaciones();
});
