// posiblemente se divida en dos .js: uno para todos los desafios 
// y otros para cada desafio en particular
let interRegresiva = null;
let interTimer = null;
let keydownEvent = null;

function generarLaberinto(n) {
    limpiarAnterior();
    let casillas = new Map(); // El mapa tiene una key con el formato 'x-y' que marca las coordenas de la casilla
    // y el resultado almacena un arreglo de 4 elementos donde cada uno representa una casilla adyacente y su valor
    // si hay o no una pared, 0: pared, 1: entrada, [derecha, izquierda, superior, inferior]
    let inicio = `0-${n-1}`;
    visitarCasilla(casillas, inicio, n, [0,0,0,0]); // empieza a generar desde la casilla superior izquierda
    let salida = encontrarCallejonMasLejano(casillas, inicio);

    let contLab = document.getElementById("contLaberinto");
    let contLaberinto = document.createElement("div");
    contLaberinto.classList.add("laberinto");
    switch (n) {
        case 4: contLaberinto.classList.add("cuatro"); break;
        case 8: contLaberinto.classList.add("ocho"); break;
        case 16: contLaberinto.classList.add("dieciseis"); break;
        default:
    }
    
    let c, celda;
    for (let y=n-1; y > -1; y--) {
        for (let x=0; x < n; x++) {
            let clave = `${x}-${y}`;
            c = casillas.get(clave);
            celda = document.createElement("div");
            celda.classList.add("celda");
            if (c[0] === 0) celda.classList.add("r");
            if (c[3] === 0) celda.classList.add("b");
            if (clave === salida) celda.classList.add("fin");
            contLaberinto.appendChild(celda);
        }
    }
    contLaberinto.firstChild.classList.add("inicio");

    let cuRegre = document.createElement("div");
    let segundos = 2;
    cuRegre.classList.add("regresiva");
    cuRegre.textContent = segundos+1;
    contLab.replaceChildren(cuRegre);
    interRegresiva = setInterval(() => {
        if (segundos <= 0) {
            clearInterval(interRegresiva);
            interRegresiva = null;
            contLab.replaceChildren(contLaberinto);
            activarMovilidad(casillas, n, salida);
        } else {
            cuRegre.textContent = segundos;
            segundos -= 1;
        }
    }, 1000);
}

function encontrarCallejonMasLejano(mapa, inicio) {
    let distancias = new Map([[inicio, 0]]);
    let pendientes = [inicio];
    let salida = inicio;
    let distanciaMaxima = -1;
    let direcciones = [[1,0], [-1,0], [0,1], [0,-1]];

    for (let i = 0; i < pendientes.length; i++) {
        let casilla = pendientes[i];
        let [x, y] = casilla.split("-").map(Number);
        let conexiones = mapa.get(casilla);
        let distancia = distancias.get(casilla);
        let grado = conexiones.filter(conexion => conexion === 1).length;

        if ((grado === 1 || mapa.size === 1) && distancia > distanciaMaxima) {
            salida = casilla;
            distanciaMaxima = distancia;
        }

        for (let direccion = 0; direccion < direcciones.length; direccion++) {
            if (conexiones[direccion] !== 1) continue;

            let [dx, dy] = direcciones[direccion];
            let adyacente = `${x + dx}-${y + dy}`;
            if (!distancias.has(adyacente)) {
                distancias.set(adyacente, distancia + 1);
                pendientes.push(adyacente);
            }
        }
    }

    return salida;
}

function visitarCasilla(mapa, casilla, n, anterior) {
    mapa.set(casilla, anterior);
    let adyacente;
    let x, y, indAdy;
    x = +casilla.split('-')[0];
    y = +casilla.split('-')[1];
    let indices = [0,1,2,3];
    let adyacentes = [[x+1,y], [x-1,y], [x,y+1], [x,y-1]];
    // visitamos los adyacentes de la celda aleatoriamente, verificando si ya lo visitamos
    for (let i=0; i < 4; i++) {
        indAdy = indices.splice(Math.floor(Math.random() * indices.length), 1)[0];
        adyacente = adyacentes[indAdy];
        if (-1 < adyacente[0] && adyacente[0] < n &&
            -1 < adyacente[1] && adyacente[1] < n && 
            !mapa.has(`${adyacente[0]}-${adyacente[1]}`)) {
            mapa.get(`${x}-${y}`).splice(indAdy, 1, 1);
            let acceso = [0,0,0,0];
            acceso.splice(conversionAnterior(indAdy), 1, 1);
            visitarCasilla(mapa, `${adyacente[0]}-${adyacente[1]}`, n, acceso);
        }
    }
}

function conversionAnterior(n) {
    let r;
    if (n === 1 || n === 3) {
        r = n-1;
    } else {
        r = n+1;
    }
    return r;
}

function estructuraBase() {
    // Aca tal vez se pueda usar el temita de los templates imagino/?
    // Es lo que va dentro del contenedor con id "desafio" pero especificamente para el laberinto
    // capaz despues lo podemos reutilizar la pagina para todos los desafios en general y solo agregamos
    // el template base de cada desafio (por ejemplo, un template para el laberinto, otro para el buscaminas y asi)
}

function limpiarAnterior() { 
    // Elimina posibles eventos generados por el laberinto anterior
    clearInterval(interRegresiva);
    clearInterval(interTimer);
    document.removeEventListener("keydown", keydownEvent, false);
}

document.getElementById("empezar4").addEventListener("click", () => generarLaberinto(4));
document.getElementById("empezar8").addEventListener("click", () => generarLaberinto(8));
document.getElementById("empezar16").addEventListener("click", () => generarLaberinto(16));

function activarMovilidad(celdas, n, salida) {
    let elemJugador = document.createElement("div");
    let jugador = [0, n-1];
    keydownEvent = (event) => {
        let finalizado = false;
        if (event.key === "ArrowUp" || event.key === "w") {
            finalizado = salida === moverJugador(jugador, [0,0,1,0], celdas, laberinto, n);
        } else if (event.key === "ArrowDown" || event.key === "s") {
            finalizado = salida === moverJugador(jugador, [0,0,0,1], celdas, laberinto, n);
        } else if (event.key === "ArrowLeft" || event.key === "a") {
            finalizado = salida === moverJugador(jugador, [0,1,0,0], celdas, laberinto, n);
        } else if (event.key === "ArrowRight" || event.key === "d") {
            finalizado = salida === moverJugador(jugador, [1,0,0,0], celdas, laberinto, n);
        }
        if (finalizado) {
            document.removeEventListener("keydown", keydownEvent, false);
            clearInterval(interTimer);
            interTimer = null;
        }
    }
    elemJugador.classList.add("jugador");
    let laberinto = document.getElementById("contLaberinto").firstChild;
    let segundos = 0;
    interTimer = setInterval(() => {
        timer.textContent = segundos.toFixed(2);
        segundos += 0.01;
    }, 10);
    laberinto.firstChild.appendChild(elemJugador);
    document.addEventListener("keydown", keydownEvent, false);
}

function moverJugador(jugador, direccion, celdas, laberinto, n) {
    let newPosicion = [jugador[0]+direccion[0]-direccion[1], jugador[1]+direccion[2]-direccion[3]];
    if (newPosicion[0] < n && newPosicion[1] < n && 0 <= newPosicion[0] && 0 <= newPosicion[1] &&
        celdas.get(`${jugador[0]}-${jugador[1]}`)[direccion.indexOf(1)] === 1) {
        let elemJugador = laberinto.children[n*(n - 1 - jugador[1]) + jugador[0]].firstChild;
        jugador[0] = newPosicion[0];
        jugador[1] = newPosicion[1];
        laberinto.children[n*(n - 1 - jugador[1]) + jugador[0]].appendChild(elemJugador);
    }
    return `${jugador[0]}-${jugador[1]}`;
}
