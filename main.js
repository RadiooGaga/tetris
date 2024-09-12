import './style.css';
import { piezas } from './src/components/piezas';

const pixel = 20;
const columnas = 20;
const filas = 30;








// Inicialización del tablero vacío (matriz 2D)
let tableroDeJuego = Array.from({ length: filas }, () => Array(columnas).fill(0));
console.log(tableroDeJuego)

const pintarTablero = (pixel, context, color) => {
  for (let index = 0; index < tableroDeJuego.length; index++) {
    const fila = tableroDeJuego[index];
    for (let jota = 0; jota < fila.length; jota++) {
      const posicion = fila[jota];
      
      if (posicion === 1) {
        pintarPixel(jota, index, pixel, context, color)
      }
    }
  }
}

const pintarPixel = (x, y, pixel, context, color) => {
  context.fillStyle = color;
  context.fillRect(x * pixel, y * pixel, pixel, pixel);
};


//pintar pieza
export const printPieza = (pieza_, x, y, context) => {
  const pieza = pieza_.forma;
  
  for (let i = 0; i < pieza.length; i++) {
    const fila = pieza[i];
    for (let j = 0; j < fila.length; j++) {
      const square = fila[j];
      if (square === 1) {
        pintarPixel(x + j, y + i, pixel, context, pieza_.color);
      }
    }
  }
};

// Función para verificar colisiones
const verificarColision = (pieza, x, y) => {
  const limiteIzdo = x;
  const limiteDcho = x + pieza.forma[0].length;
  const limiteInferior = y + pieza.forma.length;

    if (
      limiteIzdo < 0 || 
      limiteDcho > columnas ||
      limiteInferior > filas - 1 
    ) {

      return true; // Hay una colisión
  }  
  
  // Verificar colisión con otras piezas en el tablero
  for (let i = 0; i < pieza.forma.length; i++) {
    for (let j = 0; j < pieza.forma[i].length; j++) {
      if (pieza.forma[i][j] === 1) {
        const xTablero = x + j;
        const yTablero = y + i;

        // Verificar si la posición está ocupada en el tablero
        if (yTablero >= 0 && yTablero < filas && xTablero >= 0 && xTablero < columnas) {
          if (tableroDeJuego[yTablero][xTablero] === 1) {
            return true; // Colisión con otra pieza en el tablero
          }
        }
      }
    }
  }
  return false;
};


// Función para "fijar" una pieza en el tablero una vez que choca
const fijarPieza = (piezaActiva) => {

  for (let i = 0; i < piezaActiva.forma.length; i++) {
    for (let j = 0; j < piezaActiva.forma[i].length; j++) {
      if (piezaActiva.forma[i][j] === 1) {
        tableroDeJuego[piezaActiva.y + i][piezaActiva.x + j] = 1; 
        // Fijar la pieza en el tablero
      }
    }
  }
};

const seleccionarPiezaAleatoria = (piezas) => {
  console.log("NUEVA PIEZA")
  
  const clavesPiezas = Object.keys(piezas);

  // Verificar que hay claves en el objeto 'piezas'
  if (clavesPiezas.length === 0) {
    throw new Error('El objeto de piezas está vacío.');
  }

  // Generar un índice aleatorio dentro del rango del array de piezas
  const indiceAleatorio = Math.floor(Math.random() * clavesPiezas.length);
  console.log("INDICE DE PIEZA:" , indiceAleatorio)
  const piezaSeleccionada = piezas[indiceAleatorio];

  // Verificar que la pieza seleccionada no sea undefined
  if (!piezaSeleccionada || !piezaSeleccionada.forma || !piezaSeleccionada.color) {
    throw new Error('La pieza seleccionada es indefinida o está incompleta.');
  }

  return {
    forma: piezaSeleccionada.forma,
    x: 7, // Posición inicial en el eje X
    y: 0, // Posición inicial en el eje Y
    color: piezaSeleccionada.color
  };
};



// UNA PIEZA ACTIVA RANDOM, POR EJEMPLO, POSICION 0
let piezaActiva = {
  forma: piezas[0].forma, 
  x: 7, // Posición inicial en el eje X (columna)
  y: 0, // Posición inicial en el eje Y (fila)
  color: piezas[0].color // Color de la pieza
};

// Función para borrar el canvas
const borrarCanvas = (context, canvas) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

// Función para mover la pieza cuando se presiona una tecla
const moverPieza = (e, context, canvas, piezas) => {
 
  borrarCanvas(context, canvas); // Borra la pieza actual
  

  let nuevaX = piezaActiva.x;
  let nuevaY = piezaActiva.y;
  
  switch (e.key) {
    case 'ArrowLeft': // Mover a la izquierda
      nuevaX--;
      break;
    case 'ArrowRight': // Mover a la derecha
      nuevaX++;
      break;
    case 'ArrowDown': // Mover hacia abajo
      nuevaY++;
      break;
  }

  if (!verificarColision(piezaActiva, nuevaX, nuevaY)) {
    
    // Si no hay colisión, actualizar la posición de la pieza
    piezaActiva.x = nuevaX;
    piezaActiva.y = nuevaY;
    console.log("por aqui 1")
  } else if (e.key === 'ArrowDown') {
    // Si hay colisión con el suelo o con otra pieza, fijar la pieza en el tablero
    fijarPieza(piezaActiva);
  
    console.log("por aqui 2")
    // Generar una nueva pieza y restablecer su posición
    piezaActiva = seleccionarPiezaAleatoria(piezas);

  } 

  // Volver a pintar la pieza en la nueva posición
  printPieza(piezaActiva, piezaActiva.x, piezaActiva.y, context);
  pintarTablero(pixel, context, "grey")
};

  





const tablero = (piezas) => {
  
  const tetrisContainer = document.querySelector('#tetrisContainer');
  const canvas = document.querySelector('.myCanvas');

  canvas.width = pixel * columnas;
  canvas.height = pixel * filas;
  
  //CONTEXTO 2D DEL CANVAS
  const context = canvas.getContext('2d');

  document.body.appendChild(tetrisContainer)



  // DIBUJAR PIEZA INICIAL
  printPieza(piezaActiva, piezaActiva.x, piezaActiva.y, context);

  //MOVER PIEZA
  document.addEventListener('keydown', (e) => moverPieza(e, context, canvas, piezas));
};


tablero(piezas);







