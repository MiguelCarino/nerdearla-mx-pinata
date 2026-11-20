// ===== Arma tu piñata =====

// TODO 1 a 4: Los temas de tu fiesta. Quien juega elige uno con los botones de arriba,
// y al romper la piñata puede pedir un tema sorpresa.
// Cada tema decide el nombre de la fiesta, lo que se grita al romperla, los colores
// (el primero pinta también el título y los botones, así que elige uno oscuro) y qué trae adentro.
// El primero de la lista es el que aparece al abrir la página por primera vez.
const temas = [
  {
    id: 'rayos',
    nombre: '🩻 Rayos X',
    titulo: 'La posada de radiología',
    grito: '¡Se fracturó la piñata!',
    colores: ['#1F4AA8', '#00A6A6', '#F0505A'],
    dulces: ['🦴', '🩻', '💀', '🩺', '🍬', '🍭'],
  },
  {
    id: 'devs',
    nombre: '💻 Devs',
    titulo: 'La posada de los devs',
    grito: '¡Ya salió a producción!',
    colores: ['#7A2AB8', '#8BD346', '#00A6A6'],
    dulces: ['🐛', '☕', '💾', '🍕', '🚀', '🧉'],
  },
  {
    id: 'posada',
    nombre: '🪅 Posada',
    titulo: 'La posada de los Carino',
    grito: '¡Ya salieron los cacahuates!',
    colores: ['#E4007C', '#FF7A1A', '#1F4AA8'],
    dulces: ['🥜', '🍊', '🍬', '🍭', '🎋', '🍡'],
  },
  {
    id: 'cumple',
    nombre: '🎂 Cumple',
    titulo: 'El cumple de Miguel',
    grito: '¡Queremos pastel!',
    colores: ['#D9363E', '#FFC21A', '#7A2AB8'],
    dulces: ['🎂', '🎁', '🎈', '🍰', '🍬', '🍭'],
  },
];

// TODO 5: ¿Cuántos picos tiene tu piñata?
// La piñata tradicional tiene 7. Prueba con un número del 3 al 12.
const picos = 9;

// TODO 6: ¿Cuántos golpes aguanta antes de romperse?
const resistencia = 10;

// TODO 7: ¿Qué tan traviesa es la persona que jala la cuerda? Elige del 0 al 3.
// 0 = no se mueve, 1 = se mece, 2 = la suben, la bajan y le dan jalones, 3 = no tiene piedad
const travesura = 2;


// ===== A partir de aquí no necesitas cambiar nada, pero puedes explorar =====

const letra = [
  'Dale, dale, dale,',
  'no pierdas el tino,',
  'porque si lo pierdes,',
  'pierdes el camino.',
  'Ya le diste uno,',
  'ya le diste dos,',
  'ya le diste tres',
  '¡y tu tiempo se acabó!',
];
const golpesFuertes = ['¡Pum!', '¡Paf!', '¡Zas!', '¡Toing!', '¡Cuas!'];

const niveles = [
  { mecer: 0, subir: 0, rapidez: 1 },
  { mecer: 16, subir: 30, rapidez: 1.2 },
  { mecer: 26, subir: 80, rapidez: 1.5 },
  { mecer: 36, subir: 140, rapidez: 2.1 },
];

const limitar = (n, min, max) => Math.min(max, Math.max(min, Math.round(Number(n) || 0)));
const golpesNecesarios = limitar(resistencia, 1, 999);
const numeroDePicos = limitar(picos, 3, 12);
const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const movimiento = sinMovimiento ? niveles[0] : niveles[limitar(travesura, 0, 3)];
let contenido = ['🍬'];
let temaActual = null;

const titulo = document.querySelector('.titulo');
const selectorTemas = document.querySelector('#temas');
const mensaje = document.querySelector('.mensaje');
const botonSorpresa = document.querySelector('#sorpresa');
const dibujoInvitados = document.querySelector('#invitados');
const patio = document.querySelector('#patio');
const colgante = document.querySelector('#colgante');
const cuerda = document.querySelector('#cuerda');
const pinata = document.querySelector('#pinata');
const dibujo = document.querySelector('#dibujo');
const verso = document.querySelector('#verso');
const marcador = document.querySelector('#marcador');
const final = document.querySelector('#final');
const resumen = document.querySelector('#resumen');
const botonOtra = document.querySelector('#otra');
const capa = document.querySelector('#capa');
const palo = document.querySelector('#palo');
const bolsa = document.querySelector('#bolsa');
const contadorBolsa = document.querySelector('#contador-bolsa');

patio.style.setProperty('--subir', `${movimiento.subir}px`);

let golpes = 0;
let intentos = 0;
let rota = false;
let juntados = 0;
let linea = 0;
let conos = [];
let grietas = [];
let piezas = [];

// ----- Dibujo de la piñata (SVG) -----

const SVG = 'http://www.w3.org/2000/svg';
const RADIO = 62; // centro de la piñata
const LARGO = 112; // largo de cada pico

const azar = (min, max) => min + Math.random() * (max - min);
const polar = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
const entre = (p, q, f) => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f];
const xy = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

function crear(etiqueta, atributos, padre) {
  const elemento = document.createElementNS(SVG, etiqueta);
  for (const [nombre, valor] of Object.entries(atributos)) {
    elemento.setAttribute(nombre, valor);
  }
  padre.append(elemento);
  return elemento;
}

function dibujarPinata() {
  dibujo.replaceChildren();
  conos = [];

  // Los picos se reparten alrededor del centro, dejando un hueco arriba para la cuerda
  const paso = (2 * Math.PI) / numeroDePicos;
  const mitad = Math.min(paso * 0.42, 0.55);

  for (let i = 0; i < numeroDePicos; i++) {
    const angulo = -Math.PI / 2 + paso / 2 + i * paso;
    const base1 = polar(RADIO * 0.85, angulo - mitad);
    const base2 = polar(RADIO * 0.85, angulo + mitad);
    const punta = polar(RADIO + LARGO, angulo);
    const color = (i % 3) + 1;
    const franja = ((i + 1) % 3) + 1;

    const grupo = crear('g', {}, dibujo);

    // Borla de papel en la punta
    for (let k = -2; k <= 2; k++) {
      const fin = polar(RADIO + LARGO + 22, angulo + k * 0.06);
      crear('path', { d: `M${xy(punta)} L${xy(fin)}`, class: `borla trazo-${((i + k + 3) % 3) + 1}` }, grupo);
    }

    crear('path', { d: `M${xy(base1)} L${xy(punta)} L${xy(base2)} Z`, class: `relleno-${color} contorno` }, grupo);

    // Dos franjas en cada pico
    for (const [desde, hasta] of [[0.3, 0.42], [0.6, 0.69]]) {
      const puntos = [entre(base1, punta, desde), entre(base1, punta, hasta), entre(base2, punta, hasta), entre(base2, punta, desde)];
      crear('path', { d: `M${puntos.map(xy).join(' L')} Z`, class: `relleno-${franja}` }, grupo);
    }

    conos.push({ grupo, angulo, centro: polar(RADIO + LARGO * 0.45, angulo) });
  }

  // Centro con papel de china
  const cuerpo = crear('g', {}, dibujo);
  crear('circle', { r: RADIO, class: 'relleno-cuerpo contorno' }, cuerpo);
  [RADIO - 10, RADIO - 32].forEach((r, i) => {
    crear('circle', { r, class: `fleco trazo-${(i % 3) + 1}` }, cuerpo);
  });

  // Grietas: aparecen poco a poco con cada golpe
  const capaGrietas = crear('g', {}, dibujo);
  grietas = [];
  const total = 6;
  for (let i = 0; i < total; i++) {
    const angulo = (i / total) * 2 * Math.PI + azar(-0.3, 0.3);
    let r = azar(4, 18);
    let d = `M${xy(polar(r, angulo))}`;
    while (r < RADIO + 45) {
      r += azar(14, 24);
      d += ` L${xy(polar(r, angulo + azar(-0.35, 0.35)))}`;
    }
    grietas.push(crear('path', { d, class: 'grieta' }, capaGrietas));
  }
  grietas.sort(() => Math.random() - 0.5);
}

// ----- Temas -----

function aplicarTema(tema) {
  temaActual = tema;
  tema.colores.forEach((color, i) => {
    document.documentElement.style.setProperty(`--color-${i + 1}`, color);
  });
  titulo.textContent = tema.titulo;
  mensaje.textContent = tema.grito;
  document.title = tema.titulo;
  contenido = tema.dulces.length > 0 ? tema.dulces : ['🍬'];
  for (const boton of selectorTemas.children) {
    boton.setAttribute('aria-pressed', String(boton.dataset.tema === tema.id));
  }
  // Recuerda el tema para la próxima visita (si el navegador lo permite)
  try { localStorage.setItem('tema', tema.id); } catch {}
}

function temaSorpresa() {
  const otros = temas.filter((tema) => tema !== temaActual);
  return otros.length > 0 ? otros[Math.floor(Math.random() * otros.length)] : temaActual;
}

function prepararTemas() {
  for (const tema of temas) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'tema';
    boton.dataset.tema = tema.id;
    boton.textContent = tema.nombre;
    boton.addEventListener('click', () => aplicarTema(tema));
    selectorTemas.append(boton);
  }
  let guardado = null;
  try { guardado = localStorage.getItem('tema'); } catch {}
  aplicarTema(temas.find((tema) => tema.id === guardado) || temas[0]);
}

// ----- Invitados al fondo (SVG) -----

const TINTA = '#2B1D14';
const invitados = [
  { x: 0, alto: 0.9, piel: '#D9A066', pelo: '#2B1D14', peinado: 'largo', prenda: 'vestido', color: 2, brazos: 'arriba' },
  { x: 88, alto: 1, piel: '#B9774A', pelo: '#111111', peinado: 'corto', prenda: 'playera', color: 1, brazos: 'saludo', gorro: 3 },
  { x: 176, alto: 0.68, piel: '#F2C9A0', pelo: '#5A3A22', peinado: 'chongo', prenda: 'vestido', color: 3, brazos: 'arriba' },
  { x: 352, alto: 0.72, piel: '#B9774A', pelo: '#2B1D14', peinado: 'corto', prenda: 'playera', color: 2, brazos: 'arriba', gorro: 1 },
  { x: 430, alto: 1, piel: '#F2C9A0', pelo: '#C9C2B8', peinado: 'chongo', prenda: 'vestido', color: 1, brazos: 'abajo' },
  { x: 520, alto: 0.94, piel: '#8D5A3B', pelo: '#111111', peinado: 'corto', prenda: 'playera', color: 3, brazos: 'arriba' },
];
const poses = {
  arriba: ['M25 92 L8 54', 'M55 92 L72 54'],
  saludo: ['M25 92 L14 132', 'M55 92 L74 56'],
  abajo: ['M25 92 L13 132', 'M55 92 L67 132'],
};

// Cada invitado se dibuja en una caja de 80 x 200 con los pies en el piso.
// La ropa usa los colores del tema, igual que la piñata.
function dibujarInvitados() {
  dibujoInvitados.replaceChildren();
  const borde = { stroke: TINTA, 'stroke-width': 3, 'stroke-linejoin': 'round' };

  invitados.forEach((persona, i) => {
    const { alto, piel, pelo } = persona;
    const lugar = crear('g', { transform: `translate(${persona.x + 40 * (1 - alto)} ${205 - 200 * alto}) scale(${alto})` }, dibujoInvitados);
    const g = crear('g', { class: 'invitado', style: `animation-delay: ${i * 0.09}s` }, lugar);

    if (persona.peinado === 'largo') crear('rect', { x: 17, y: 34, width: 46, height: 62, rx: 20, fill: pelo, ...borde }, g);
    if (persona.peinado === 'chongo') crear('circle', { cx: 40, cy: 28, r: 9, fill: pelo, ...borde }, g);

    for (const d of poses[persona.brazos]) {
      crear('path', { d, fill: 'none', stroke: TINTA, 'stroke-width': 15, 'stroke-linecap': 'round' }, g);
      crear('path', { d, fill: 'none', stroke: piel, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    }

    if (persona.prenda === 'vestido') {
      for (const x of [29, 43]) crear('rect', { x, y: 150, width: 8, height: 42, fill: piel, ...borde }, g);
    } else {
      for (const x of [24, 42]) crear('rect', { x, y: 136, width: 14, height: 56, fill: '#3B4A6B', ...borde }, g);
    }
    for (const cx of [31, 49]) crear('ellipse', { cx, cy: 195, rx: 9, ry: 5, fill: TINTA }, g);

    const torso = persona.prenda === 'vestido'
      ? 'M24 94q0-16 16-16q16 0 16 16L68 162H12Z'
      : 'M22 94q0-16 18-16q18 0 18 16V142H22Z';
    crear('path', { d: torso, class: `relleno-${persona.color}`, ...borde }, g);

    crear('circle', { cx: 40, cy: 54, r: 20, fill: piel, ...borde }, g);
    crear('path', { d: 'M20 54a20 20 0 0 1 40 0q-6-12-20-10q-14-2-20 10Z', fill: pelo, ...borde }, g);
    for (const cx of [33, 47]) crear('circle', { cx, cy: 57, r: 2.2, fill: TINTA }, g);
    crear('path', persona.brazos === 'abajo'
      ? { d: 'M33 64q7 6 14 0', fill: 'none', stroke: TINTA, 'stroke-width': 2.5, 'stroke-linecap': 'round' }
      : { d: 'M33 63q7 10 14 0Z', fill: TINTA, stroke: TINTA, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);

    if (persona.gorro) {
      crear('path', { d: 'M27 38L40 6L53 38Z', class: `relleno-${persona.gorro}`, ...borde }, g);
      crear('circle', { cx: 40, cy: 6, r: 5, fill: '#FFFDF9', ...borde }, g);
    }
  });
}

// ----- Golpes -----

function cantar() {
  verso.textContent = letra[linea % letra.length];
  linea++;
  reiniciarAnimacion(verso, 'nuevo');
}

function reiniciarAnimacion(elemento, clase) {
  elemento.classList.remove(clase);
  void elemento.offsetWidth;
  elemento.classList.add(clase);
}

function batear(x, y) {
  const lado = x < innerWidth / 2 ? 'izquierda' : 'derecha';
  palo.className = `palo ${lado}`;
  palo.style.left = `${x}px`;
  palo.style.top = `${y}px`;
  reiniciarAnimacion(palo, 'activo');
}

function mostrarTexto(x, y, texto, clase = '') {
  const pum = document.createElement('p');
  pum.className = `pum ${clase}`;
  pum.textContent = texto;
  pum.style.left = `${x}px`;
  pum.style.top = `${y}px`;
  pum.addEventListener('animationend', () => pum.remove());
  document.body.append(pum);
}

function pegar(x, y) {
  if (rota) return;
  golpes++;
  intentos++;
  cantar();
  batear(x, y);
  mostrarTexto(x, y, golpesFuertes[Math.floor(Math.random() * golpesFuertes.length)]);
  reiniciarAnimacion(dibujo, 'golpe');

  // Si le pegas del lado izquierdo, la piñata se va a la derecha (y al revés)
  const caja = pinata.getBoundingClientRect();
  const direccion = x < caja.left + caja.width / 2 ? -1 : 1;
  pendulo.velocidad += direccion * azar(70, 120);

  const visibles = Math.floor((golpes / golpesNecesarios) * (grietas.length + 1));
  grietas.forEach((grieta, i) => grieta.classList.toggle('visible', i < visibles));
  marcador.textContent = `Golpes: ${golpes}`;

  if (golpes >= golpesNecesarios) romper();
}

function fallar(x, y) {
  if (rota) return;
  intentos++;
  cantar();
  batear(x, y);
  mostrarTexto(x, y, '¡Aire!', 'aire');
}

// Con el dedo o el mouse: solo cuenta si tocas el dibujo
pinata.addEventListener('pointerdown', (evento) => {
  evento.stopPropagation();
  pegar(evento.clientX, evento.clientY);
});

// Con el teclado (Enter o espacio)
pinata.addEventListener('click', (evento) => {
  if (evento.detail !== 0) return;
  const caja = pinata.getBoundingClientRect();
  pegar(caja.left + caja.width * azar(0.3, 0.7), caja.top + caja.height * 0.5);
});

patio.addEventListener('pointerdown', (evento) => {
  if (evento.target.closest('.final')) return;
  fallar(evento.clientX, evento.clientY);
});

// ----- ¡Se rompió! -----

function agregarPieza(pieza) {
  capa.append(pieza.el);
  piezas.push({ giro: 0, vgiro: 0, gravedad: 1400, ...pieza });
}

function romper() {
  rota = true;
  // Las posiciones son relativas a la tarjeta, que es donde caen los dulces
  const origen = capa.getBoundingClientRect();
  const caja = dibujo.getBoundingClientRect();
  const tam = dibujo.offsetWidth;
  const centroX = caja.left + caja.width / 2 - origen.left;
  const centroY = caja.top + caja.height / 2 - origen.top;
  const escala = tam / 400;

  if (!sinMovimiento) {
    // Cada pico sale volando por su lado
    for (const cono of conos) {
      const svg = document.createElementNS(SVG, 'svg');
      svg.setAttribute('viewBox', '-200 -200 400 400');
      svg.setAttribute('class', 'fragmento');
      svg.style.width = svg.style.height = `${tam}px`;
      svg.style.transformOrigin = `${(cono.centro[0] + 200) * escala}px ${(cono.centro[1] + 200) * escala}px`;
      svg.append(cono.grupo.cloneNode(true));
      const fuerza = azar(220, 420);
      agregarPieza({
        el: svg,
        tipo: 'fragmento',
        x: centroX - tam / 2,
        y: centroY - tam / 2,
        vx: Math.cos(cono.angulo) * fuerza,
        vy: Math.sin(cono.angulo) * fuerza - 250,
        vgiro: azar(-300, 300),
        vida: 1.6,
      });
    }

    // Confeti de papel de china
    for (let i = 0; i < 45; i++) {
      const confeti = document.createElement('span');
      confeti.className = 'confeti';
      confeti.style.background = `var(${['--color-1', '--color-2', '--color-3', '--cuerpo'][i % 4]})`;
      agregarPieza({
        el: confeti,
        tipo: 'confeti',
        x: centroX + azar(-30, 30),
        y: centroY + azar(-30, 30),
        vx: azar(-380, 380),
        vy: azar(-650, -150),
        vgiro: azar(-720, 720),
        gravedad: 700,
        fase: azar(0, 6),
        vida: azar(2.5, 4),
      });
    }
  }

  // Los dulces caen al piso
  for (let i = 0; i < 28; i++) {
    const dulce = document.createElement('span');
    dulce.className = 'dulce';
    dulce.textContent = contenido[i % contenido.length];
    const pieza = {
      el: dulce,
      tipo: 'dulce',
      x: centroX + azar(-20, 20),
      y: centroY + azar(-20, 20),
      vx: azar(-280, 280),
      vy: azar(-560, -120),
      vgiro: azar(-400, 400),
      suelo: capa.clientHeight - azar(18, 46),
    };
    dulce.addEventListener('pointerdown', () => juntar(pieza));
    agregarPieza(pieza);
  }

  pinata.hidden = true;
  marcador.hidden = true;
  verso.textContent = '';
  bolsa.hidden = false;
  patio.classList.add('festejo');

  setTimeout(() => {
    resumen.textContent = `Le pegaste ${golpes} ${golpes === 1 ? 'vez' : 'veces'} en ${intentos} ${intentos === 1 ? 'intento' : 'intentos'}. Toca los dulces para juntarlos.`;
    final.hidden = false;
    botonOtra.focus({ preventScroll: true });
  }, 700);
}

function juntar(pieza) {
  if (pieza.juntado) return;
  pieza.juntado = true;
  const origen = capa.getBoundingClientRect();
  const destino = bolsa.getBoundingClientRect();
  const x = destino.left + destino.width / 2 - origen.left;
  const y = destino.top + destino.height / 2 - origen.top;
  pieza.el.style.transition = 'transform 0.45s cubic-bezier(0.5, -0.4, 0.7, 1), opacity 0.45s ease';
  pieza.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(0.4)`;
  pieza.el.style.opacity = '0';
  setTimeout(() => {
    pieza.el.remove();
    piezas = piezas.filter((otra) => otra !== pieza);
    juntados++;
    contadorBolsa.textContent = juntados;
    reiniciarAnimacion(bolsa, 'lleno');
  }, 450);
}

function colgarOtra() {
  piezas.forEach((pieza) => pieza.el.remove());
  piezas = [];
  golpes = 0;
  intentos = 0;
  linea = 0;
  rota = false;
  pendulo.angulo = 0;
  pendulo.velocidad = 0;
  dibujarPinata();
  pinata.hidden = false;
  marcador.hidden = false;
  marcador.textContent = 'Golpes: 0';
  verso.textContent = 'Toca la piñata para pegarle';
  final.hidden = true;
  patio.classList.remove('festejo');
  pinata.focus({ preventScroll: true });
}

botonOtra.addEventListener('click', colgarOtra);

// Otra piñata, pero con un tema distinto al que acabas de romper
botonSorpresa.addEventListener('click', () => {
  aplicarTema(temaSorpresa());
  colgarOtra();
});

// ----- Movimiento: la piñata se mece y la suben y bajan -----

const pendulo = { angulo: 0, velocidad: 0 };
let tiempo = 0;
let anterior = performance.now();
let largoCuerda = cuerda.offsetHeight;
let jalon = 0;
let siguienteJalon = azar(2, 4);
addEventListener('resize', () => { largoCuerda = cuerda.offsetHeight; });

function moverPiezas(dt) {
  for (const p of piezas) {
    if (p.juntado || p.quieto) continue;

    p.vy += p.gravedad * dt;
    if (p.tipo === 'confeti') {
      p.vx *= 1 - 1.8 * dt;
      p.vy = Math.min(p.vy, 130);
      p.x += Math.sin(tiempo * 6 + p.fase) * 40 * dt;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.giro += p.vgiro * dt;

    if (p.tipo === 'dulce') {
      if (p.y > p.suelo) {
        p.y = p.suelo;
        p.vy = Math.abs(p.vy) < 90 ? 0 : p.vy * -0.35;
        p.vx *= 0.6;
        p.vgiro *= 0.5;
        if (p.vy === 0 && Math.abs(p.vx) < 2) p.quieto = true;
      }
      const pared = capa.clientWidth - 20;
      if (p.x < 20 || p.x > pared) {
        p.x = Math.min(pared, Math.max(20, p.x));
        p.vx *= -0.5;
      }
      p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.giro}deg)`;
    } else {
      p.vida -= dt;
      p.el.style.opacity = Math.min(1, Math.max(0, p.vida));
      const centrar = p.tipo === 'confeti' ? ' translate(-50%, -50%)' : '';
      p.el.style.transform = `translate(${p.x}px, ${p.y}px)${centrar} rotate(${p.giro}deg)`;
    }
  }

  piezas = piezas.filter((p) => {
    if (p.vida !== undefined && p.vida <= 0) {
      p.el.remove();
      return false;
    }
    return true;
  });
}

function animar(ahora) {
  const dt = Math.min(0.05, (ahora - anterior) / 1000);
  anterior = ahora;
  tiempo += dt * movimiento.rapidez;

  // Un péndulo con resorte: se mece solo y reacciona a cada golpe
  // Dos vaivenes mezclados para que no sea fácil adivinar a dónde va
  const objetivo = movimiento.mecer * (0.65 * Math.sin(tiempo * 1.3) + 0.35 * Math.sin(tiempo * 2.9 + 1));
  pendulo.velocidad += (-(pendulo.angulo - objetivo) * 28 - pendulo.velocidad * 2.2) * dt;
  pendulo.angulo += pendulo.velocidad * dt;

  // De vez en cuando, quien jala la cuerda le da un jalón hacia arriba
  if (movimiento.subir > 0) {
    siguienteJalon -= dt;
    if (siguienteJalon <= 0) {
      jalon = 1;
      siguienteJalon = azar(1.5, 4) / movimiento.rapidez;
      pendulo.velocidad += azar(-3, 3) * movimiento.mecer;
    }
    jalon = Math.max(0, jalon - dt * 1.8);
  }
  const subida = 1 - Math.sin(jalon * Math.PI);
  const bajada = movimiento.subir * ((1 - Math.cos(tiempo * 1.6)) / 2) * (0.6 + 0.4 * Math.sin(tiempo * 0.5)) * subida;

  colgante.style.transform = `rotate(${pendulo.angulo}deg)`;
  cuerda.style.transform = `scaleY(${(largoCuerda + bajada) / largoCuerda})`;
  pinata.style.transform = `translateY(${bajada}px)`;

  moverPiezas(dt);
  requestAnimationFrame(animar);
}

prepararTemas();
dibujarInvitados();
dibujarPinata();
requestAnimationFrame(animar);
