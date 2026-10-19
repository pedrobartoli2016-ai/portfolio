
/* BOTÓN VOLVER AL INICIO - GLOBAL */

document.addEventListener("DOMContentLoaded", () => {

  // No agregar el botón en la página principal
  const pagina = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  if (pagina === "index.html" || pagina === "") {
    return;
  }

  // Evitar duplicados
  if (document.querySelector(".volver-inicio-global")) {
    return;
  }

  // Buscar el logo PBE
  const logo = document.querySelector(".logo");

  if (!logo) return;

  // Crear el botón
  const boton = document.createElement("a");

  boton.href = "index.html";
  boton.className = "volver-inicio-global";
  boton.textContent = "← VOLVER AL INICIO";

  // Insertarlo al lado del logo
  logo.insertAdjacentElement("afterend", boton);

});
