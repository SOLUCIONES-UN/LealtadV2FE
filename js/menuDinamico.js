// const url = "http://localhost:3000/";
let usuario = JSON.parse(localStorage.getItem("infoUsuario"));
let addListeners = false;
let tokenMenuMenu;

$(function () {
  getMenuAccesible();
  verifytoken();
  validateSesion();
  Usuario();
});

const Usuario = () => {
  let usuario = JSON.parse(localStorage.getItem("infoUsuario"));
  if (usuario !== null && usuario.username !== null) {
    console.log(usuario.username);
    $(".user-name").text(usuario.nombre);
    $(".user-status").text(usuario.rol.descripcion);
  } else {
    console.log('El objeto de usuario o su propiedad "nombre" es null.');
    // Aquí puedes manejar el caso en el que el objeto de usuario o su propiedad "nombre" sean null
  }
};

const verifytoken = () => {
  tokenMenu = localStorage.getItem("token");

  if (tokenMenu == null) {
    window.location.href = "login.html";
  } else {
    const partes = tokenMenu.split(".");
    if (partes.length !== 3) {
      window.location.href = "login.html";
    }
  }
};

const verifyLogin = () => {
  tokenMenu = localStorage.getItem("token");

  if (tokenMenu == null) {
    window.location.href = "login.html";
  } else {
    const partes = tokenMenu.split(".");

    // Decodificar el payload (parte intermedia en base64)
    const payloadBase64 = partes[1];
    const payload = JSON.parse(atob(payloadBase64));

    // La fecha de expiración está en el campo "exp"
    if (payload.exp) {
      const expiracion = new Date(payload.exp * 1000); // El tiempo está en segundos, convertir a milisegundos
      const currentTime = new Date();

      let tiempoRestante = (expiracion - currentTime) / 1000 / 60;

      console.log(tiempoRestante);
      if (tiempoRestante <= 4 && !addListeners) {
        AlertSession("Su sesión está a punto de caducar", "warning");
        addListeners = true;

        $(document).on("mousedown", scrollHandler);
        $(document).on("keydown", scrollHandler);
        $(document).on("scroll", scrollHandler);
      }

      if (tiempoRestante <= 1) {
        AlertSession("Session Caducada", "error");

        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "login.html";
        }, 1000 * 3);
      } else {
        return;
      }
    } else {
      throw new Error("El tokenMenu no tiene una fecha de expiración");
    }
  }
};

const validateSesion = () => {
  setInterval(() => {
    verifyLogin();
  }, 1000 * 10);
};

function scrollHandler() {
  console.log("scroll");
  refreshSession(tokenMenu);
}

const refreshSession = async (tokenMenu) => {
  $(document).off("mousedown", scrollHandler);
  $(document).off("keydown", scrollHandler);
  $(document).off("scroll", scrollHandler);
  addListeners = false;

  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: tokenMenu },
  };

  fetch(`${url}loggin/getSession`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      localStorage.setItem("token", result.token);
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const AlertSession = function (message, status) {
  toastr[`${status}`](message, `${status}`, {
    closeButton: true,
    tapToDismiss: false,
    positionClass: "toast-top-right",
    rtl: false,
  });
};

const getMenuAccesible = () => {
  let menu;
  let pagina;
  let tokenMenu = localStorage.getItem("token");
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { Authorization: tokenMenu },
  };

  fetch(`${url}permisosUsuario/${usuario.username}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        menu = `
                    <li class=" navigation-header" id="administracion-li"><span data-i18n="Apps &amp; Pages">${element.descripcion}</span><i
                    data-feather="more-horizontal"></i>
                    </li>
                `;

        $("#main-menu-navigation").append(menu);

        element.paginas.forEach((element) => {
          var URLactual = window.location.href;
          var url = URLactual.split("/");
          var add = url[url.length - 1] === element.path ? "active" : "";
          pagina = `
                        <li class="nav-item pl-1 ${add}">
                            <a class="d-flex align-items-center" href="${element.path}">
                            <i class="feather-20" data-feather="${element.icono}"></i><span class="menu-title text-truncate"
                                data-i18n="${element.descripcion}">${element.descripcion}</span></a>
                        </li>
                    `;

          $("#main-menu-navigation").append(pagina);
        });

        if (feather) {
          feather.replace();
        }
      });
    })
    .catch((error) => console.log("error", error));
};
