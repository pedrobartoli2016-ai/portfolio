
/* EFECTO MOCO - PBE */
/* Versión original + miniaturas audiovisuales */

(() => {
  const NS = "http://www.w3.org/2000/svg";

  const COLOR = "#70ed25";
  const COLOR_CACTUS = "#668a45";
  const COLOR_OSCURO = "#142b1b";

  const CANTIDAD = 12;
  const GOTAS_VIAJERAS = 12;
  const DURACION_VIAJERA = 15000;

  /* Incluye las miniaturas de audiovisuales */
  const botones = document.querySelectorAll(
    ".boton, .nav-links a, .proyectos .proyecto, .contacto-portal-links a, .corto-info a, .pagina-audiovisuales a.corto-imagen, .spec-volver a, .spec-app, .volver-inicio-global"
  );

  function crearSVG(tipo) {
    return document.createElementNS(NS, tipo);
  }

  botones.forEach((boton, indice) => {
    boton.classList.add("moco-interactivo");

    boton.querySelectorAll(
      ".moco-gota, .moco-lateral, .moco-recorrido, .moco-unido"
    ).forEach(elemento => elemento.remove());

    const svg = crearSVG("svg");
    svg.classList.add("moco-unido");
    svg.setAttribute("aria-hidden", "true");

    svg.style.left = "-28px";
    svg.style.top = "-28px";
    svg.style.width = "calc(100% + 56px)";
    svg.style.height = "calc(100% + 163px)";
    svg.style.overflow = "visible";
    svg.style.pointerEvents = "none";

    /* Inicialmente oculto */
    svg.style.setProperty("visibility", "hidden", "important");

    /* MÁSCARA */

    const defs = crearSVG("defs");
    const mascara = crearSVG("mask");

    const idMascara = `mascara-moco-${indice}`;

    mascara.setAttribute("id", idMascara);
    mascara.setAttribute("maskUnits", "userSpaceOnUse");
    mascara.setAttribute("maskContentUnits", "userSpaceOnUse");

    const fondoMascara = crearSVG("rect");
    fondoMascara.setAttribute("fill", "white");

    const huecoMascara = crearSVG("rect");
    huecoMascara.setAttribute("fill", "black");
    huecoMascara.setAttribute("rx", "18");
    huecoMascara.setAttribute("ry", "18");

    mascara.appendChild(fondoMascara);
    mascara.appendChild(huecoMascara);
    defs.appendChild(mascara);
    svg.appendChild(defs);

    const grupoCapas = crearSVG("g");

    grupoCapas.setAttribute(
      "mask",
      `url(#${idMascara})`
    );

    /* TRES CAPAS */

    const formaOscura = crearSVG("path");
    formaOscura.setAttribute("fill", COLOR_OSCURO);
    formaOscura.setAttribute("fill-rule", "nonzero");

    const formaCactus = crearSVG("path");
    formaCactus.setAttribute("fill", COLOR_CACTUS);
    formaCactus.setAttribute("fill-rule", "nonzero");

    const forma = crearSVG("path");
    forma.setAttribute("fill", COLOR);
    forma.setAttribute("fill-rule", "nonzero");

    grupoCapas.appendChild(formaOscura);
    grupoCapas.appendChild(formaCactus);
    grupoCapas.appendChild(forma);

    svg.appendChild(grupoCapas);
    boton.appendChild(svg);

    let activo = false;
    let animacion = null;
    let inicioAnimacion = 0;

    function dibujar(tiempo) {
      const w = boton.offsetWidth;
      const h = boton.offsetHeight;

      if (!w || !h) return;

      svg.setAttribute(
        "viewBox",
        `-28 -28 ${w + 56} ${h + 163}`
      );

      fondoMascara.setAttribute("x", -28);
      fondoMascara.setAttribute("y", -28);
      fondoMascara.setAttribute("width", w + 56);
      fondoMascara.setAttribute("height", h + 163);

      huecoMascara.setAttribute("x", 0);
      huecoMascara.setAttribute("y", 0);
      huecoMascara.setAttribute("width", w);
      huecoMascara.setAttribute("height", h);

      const t = tiempo / 1000;

      /* RESPIRACIÓN DEL BORDE */

      const onda = Math.sin(t * 1.15 + indice);
      const grosor = 8 + onda * 2;

      const x0 = -grosor;
      const x1 = w + grosor;
      const y0 = -grosor;
      const base = h + grosor;

      let d = `
        M ${x0 + 22} ${y0}
        L ${x1 - 22} ${y0}
        Q ${x1} ${y0} ${x1} ${y0 + 22}
        L ${x1} ${base - 18}
        Q ${x1} ${base} ${x1 - 18} ${base}
      `;

      /* GOTAS INFERIORES */

      const paso = (w + 2 * grosor) / CANTIDAD;

      for (let i = CANTIDAD - 1; i >= 0; i--) {
        const centro = x0 + paso * (i + 0.5);

        const pulso = Math.sin(
          t * (0.65 + i * 0.035) + i * 1.7 + indice
        );

        const largo =
          17 + (i % 4) * 11 + (pulso + 1) * 12;

        const ancho = Math.min(
          12 + (i % 3) * 4,
          paso * 0.55
        );

        const derecha = centro + ancho / 2;
        const izquierda = centro - ancho / 2;
        const punta = base + largo;

        const esExtremo =
          i === 0 || i === CANTIDAD - 1;

        const baseGota = esExtremo
          ? base - 8
          : base;

        d += `
          L ${derecha} ${baseGota}

          C ${derecha - 2} ${base + largo * 0.4},
            ${centro + ancho * 0.38} ${punta},
            ${centro} ${punta}

          C ${centro - ancho * 0.38} ${punta},
            ${izquierda + 2} ${base + largo * 0.4},
            ${izquierda} ${baseGota}
        `;
      }

      d += `
        L ${x0 + 18} ${base}
        Q ${x0} ${base} ${x0} ${base - 18}
        L ${x0} ${y0 + 22}
        Q ${x0} ${y0} ${x0 + 22} ${y0}
        Z
      `;

      /* GOTAS VIAJERAS */

      const progresoBase =
        (((tiempo - inicioAnimacion) % DURACION_VIAJERA)
          + DURACION_VIAJERA)
        % DURACION_VIAJERA
        / DURACION_VIAJERA;

      for (
        let gota = 0;
        gota < GOTAS_VIAJERAS;
        gota++
      ) {
        const progreso =
          (progresoBase + gota / GOTAS_VIAJERAS) % 1;

        const margen = grosor + 1;

        const altoLateral = Math.max(1, h - 32);
        const anchoSuperior = Math.max(1, w - 32);

        const distanciaTotal =
          altoLateral * 2 + anchoSuperior;

        let distancia = progreso * distanciaTotal;

        let x, y, nx, ny, tx, ty;

        if (distancia < altoLateral) {
          /* SUBE POR LA IZQUIERDA */

          x = -margen;
          y = h - 16 - distancia;

          nx = -1;
          ny = 0;
          tx = 0;
          ty = -1;

        } else if (
          distancia < altoLateral + anchoSuperior
        ) {
          /* AVANZA POR ARRIBA */

          distancia -= altoLateral;

          x = 16 + distancia;
          y = -margen;

          nx = 0;
          ny = -1;
          tx = 1;
          ty = 0;

        } else {
          /* BAJA POR LA DERECHA */

          distancia -= altoLateral + anchoSuperior;

          x = w + margen;
          y = 16 + distancia;

          nx = 1;
          ny = 0;
          tx = 0;
          ty = 1;
        }

        const pulsoViajero = Math.sin(
          t * (0.55 + gota * 0.012)
          + gota * 1.7
          + indice
        );

        const largoViajero =
          7 + (pulsoViajero + 1) * 3 + (gota % 3);

        const mitadBase =
          15 + (gota % 5) * 2.5;

        function punto(tangente, normal) {
          const px =
            x + tx * tangente + nx * normal;

          const py =
            y + ty * tangente + ny * normal;

          return `${px} ${py}`;
        }

        /* DEFORMACIONES */

        const deformacion = Math.sin(
          t * 0.75 + gota * 2.3 + indice
        );

        const deformacion2 = Math.sin(
          t * 0.48 + gota * 3.1
        );

        const ladoIzquierdo =
          mitadBase * (0.75 + deformacion * 0.18);

        const ladoDerecho =
          mitadBase * (0.8 + deformacion2 * 0.17);

        const bulto1 =
          largoViajero *
          (0.65 + deformacion * 0.25);

        const bulto2 =
          largoViajero *
          (0.85 + deformacion2 * 0.2);

        const puntaDesplazada =
          deformacion * mitadBase * 0.22;

        /* FORMA VISCOSA */

        d += `
          M ${punto(-mitadBase, -7)}

          C ${punto(-mitadBase * 0.95, -1)},
            ${punto(-ladoIzquierdo, bulto1 * 0.65)},
            ${punto(-mitadBase * 0.58, bulto1)}

          C ${punto(-mitadBase * 0.42, bulto1 * 1.15)},
            ${punto(-mitadBase * 0.32, largoViajero * 0.85)},
            ${punto(puntaDesplazada, largoViajero)}

          C ${punto(mitadBase * 0.28, largoViajero * 1.05)},
            ${punto(mitadBase * 0.4, bulto2 * 0.75)},
            ${punto(mitadBase * 0.62, bulto2)}

          C ${punto(ladoDerecho * 0.9, bulto2 * 0.9)},
            ${punto(mitadBase * 0.95, 1)},
            ${punto(mitadBase, -7)}

          Q ${punto(0, -10)}
            ${punto(-mitadBase, -7)}

          Z
        `;
      }

      /* HUECO INTERIOR */

      d += `
        M 18 0
        Q 0 0 0 18
        L 0 ${h - 18}
        Q 0 ${h} 18 ${h}
        L ${w - 18} ${h}
        Q ${w} ${h} ${w} ${h - 18}
        L ${w} 18
        Q ${w} 0 ${w - 18} 0
        L 18 0
        Z
      `;

      /* CAPA OSCURA */

      formaOscura.setAttribute("d", d);

      const desplazamientoOscuroX =
        8 + Math.sin(t * 0.38 + indice + 1.4) * 3;

      const desplazamientoOscuroY =
        10 + Math.cos(t * 0.42 + indice + 0.8) * 3;

      formaOscura.setAttribute(
        "transform",
        `translate(${desplazamientoOscuroX} ${desplazamientoOscuroY})`
      );

      /* CAPA CACTUS */

      formaCactus.setAttribute("d", d);

      const desplazamientoX =
        4 + Math.sin(t * 0.55 + indice) * 2;

      const desplazamientoY =
        5 + Math.cos(t * 0.48 + indice) * 2;

      formaCactus.setAttribute(
        "transform",
        `translate(${desplazamientoX} ${desplazamientoY})`
      );

      /* CAPA LIMA */

      forma.setAttribute("d", d);
    }

    /* CONTROL DE ANIMACIÓN */

    function animar(tiempo) {
      if (!activo) return;

      dibujar(tiempo);
      animacion = requestAnimationFrame(animar);
    }

    function iniciar() {
      if (activo) return;

      activo = true;
      inicioAnimacion = performance.now();

      svg.style.setProperty(
        "visibility",
        "visible",
        "important"
      );

      animacion = requestAnimationFrame(animar);
    }

    function detener() {
      activo = false;

      if (animacion !== null) {
        cancelAnimationFrame(animacion);
        animacion = null;
      }

      svg.style.setProperty(
        "visibility",
        "hidden",
        "important"
      );
    }

    /* SOLO SE ACTIVA CON EL MOUSE */

    boton.addEventListener("mouseenter", iniciar);
    boton.addEventListener("mouseleave", detener);

    /* PRIMER DIBUJO, PERO OCULTO */

    dibujar(0);
  });
})();
