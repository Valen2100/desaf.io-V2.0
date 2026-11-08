// posiblemente se divida en dos .js: uno para todos los desafios 
// y otros para cada desafio en particular

function generarLaberinto(n) {
    
    let casillas = new Map(); // El mapa tiene una key con el formato 'x-y' que marca las coordenas de la casilla
    // y el resultado almacena un arreglo de 4 elementos donde cada uno representa una casilla adyacente y su valor
    // si hay o no una pared, 0: pared, 1: entrada, [derecha, izquierda, superior, inferior]
    let inicio = `0-${n-1}`;
    visitarCasilla(casillas, inicio, n, [0,0,0,0]); // empieza a generar desde la casilla superior izquierda
    let salida = encontrarCallejonMasLejano(casillas, inicio);

    console.log(casillas);

    let contLab = document.getElementById("contLaberinto");
    let contLaberinto = document.createElement("div");
    contLaberinto.classList.add("laberinto");
    switch (n) {
        case 4: contLaberinto.classList.add("cuatro"); break;
        case 8: contLaberinto.classList.add("ocho"); break;
        case 16: contLaberinto.classList.add("dieciseis"); break;
        default:
    }
    contLab.replaceChildren(contLaberinto);
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
    console.log(casilla);
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

document.getElementById("empezar4").addEventListener("click", () => generarLaberinto(4));
document.getElementById("empezar8").addEventListener("click", () => generarLaberinto(8));
document.getElementById("empezar16").addEventListener("click", () => generarLaberinto(16));

// cambiar despues de tener generacion de laberinto
/*function empezarDesafio() {
    let finalizado = false;
    let celda = document.getElementById("1-1");
    celda.classList.add("jugador");

    document.addEventListener("keypress", function (event) {
        if (finalizado) return;
        if (event.key === "w") {
            moverJugador(celda, "arriba");
        } else if (event.key === "s") {
            moverJugador(celda, "abajo");
        } else if (event.key === "a") {
            moverJugador(celda, "izquierda");
        } else if (event.key === "d") {
            moverJugador(celda, "derecha");
        }
    })
}

function moverJugador(celda, direccion) {
    let [fila, columna] = celda.id.split("-").map(Number); // Obtiene la fila y columna de la celda actual
    celda.classList.remove("jugador"); // Remueve la clase "jugador" de la celda actual 
    let nuevaFila = fila;
    let nuevaColumna = columna;

    if (direccion === "arriba") {
        nuevaFila = fila - 1;
    } else if (direccion === "abajo") {
        nuevaFila = fila + 1;
    } else if (direccion === "izquierda") {
        nuevaColumna = columna - 1;
    } else if (direccion === "derecha") {
        nuevaColumna = columna + 1;
    }

    let nuevaCelda = document.getElementById(`${nuevaFila}-${nuevaColumna}`);
    // Verificamos que sea una direccion valida
    if (direccion === "arriba" && nuevaFila > 0) {
        if (nuevaCelda.classList.contains(""))
    }
}*/
