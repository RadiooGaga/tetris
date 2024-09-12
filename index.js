import './style.css';
import { piezas } from './src/components/piezas';

const pixel = 20;
const columns = 20;
const rows = 30;

let counter = 0;
let lastTime = 0;

let updateAnimationFrameId;


// INICIAR CANVAS
const canvas = document.querySelector('.myCanvas');
canvas.width = pixel * columns;
canvas.height = pixel * rows;

// CONTEXTO 2D DEL CANVAS
const context = canvas.getContext('2d');
context.scale = pixel * pixel;

// MATRIZ 2D
let gameBoard = Array.from({ length: rows }, () => Array(columns).fill(0));
console.log(gameBoard)

// UNA PIEZA ACTIVA RANDOM, POR EJEMPLO, POSICIÓN 0
let currentPiece = {
    shape: piezas[0].shape,
    x: 7, // Posición inicial en el eje X (columna)
    y: 0, // Posición inicial en el eje Y (fila)
    color: piezas[0].color // Color de la pieza
};

// FUNCIÓN RELLENAR 
const fillSquare = (x, y, pixel, context, color) => {
    context.fillStyle = color;
    context.fillRect(x * pixel, y * pixel, pixel, pixel);  
};

// PINTAR EL CUADRADITO SI LA POSICIÓN COINCIDE CON VALOR 1
const paintSquare = (pixel, context, color) => {

    gameBoard.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                fillSquare(x, y, pixel, context, color);
                
            }
            
        });
    });
};

// FUNCIÓN PINTAR PIEZA
const printPiece = (pieza, x, y, context) => {   
    pieza.shape.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            if (value === 1) {
                fillSquare(x + colIndex, y + rowIndex, pixel, context, pieza.color);
            }
        });
    });
};

// MOVER PIEZA AL PRESIONAR TECLA
const moveThePiece = (e) => {
    removeCanvas(context, canvas); // Borra la pieza actual
    
    let nuevaX = currentPiece.x;
    console.log(nuevaX)
    let nuevaY = currentPiece.y;
    console.log(nuevaY)
    
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
        case ' ': // Barra espaciadora
        pauseTheGame()
        break;
    }



    // Verificar colisión antes de mover la pieza
    if (!verifyCollission(currentPiece, nuevaX, nuevaY)) {
        currentPiece.x = nuevaX;
        currentPiece.y = nuevaY;
    } else if (e.key === 'ArrowDown') {
        // Si hay colisión hacia abajo, fijar la pieza y generar una nueva
      fixThePiece(currentPiece);

            if (verifyCollission(currentPiece, currentPiece.x, currentPiece.y)) {
                gameOver();
                return; // Terminar la actualización
            } else {
                currentPiece = selectRandomPiece(piezas);
            }
    }

     // Rotar la pieza
    if (e.key === "ArrowUp") {
       
        const newShape = [];
        const rows = currentPiece.shape.length;
        const columns = currentPiece.shape[0].length;
    
        for (let i = 0; i < columns; i++) {
            const row = [];
            for (let j = rows - 1; j >= 0; j--) {
                row.push(currentPiece.shape[j][i]);
            }
            newShape.push(row);
        }
    
        // Probar la nueva shape
        const originalShape = currentPiece.shape;
        currentPiece.shape = newShape;
    
        if (verifyCollission(currentPiece, currentPiece.x, currentPiece.y)) {
            // Si hay colisión, revertir la rotación
            currentPiece.shape = originalShape;
        }
    }
    

    // REPINTAR PIEZA EN NUEVA POSICIÓN
    printPiece(currentPiece, currentPiece.x, currentPiece.y, context);
    paintSquare(pixel, context, "grey");
};




// FIJAR PIEZA AL TABLERO AL CHOCAR
const fixThePiece = (currentPiece) => {
    for (let i = 0; i < currentPiece.shape.length; i++) {
        for (let j = 0; j < currentPiece.shape[i].length; j++) {
            if (currentPiece.shape[i][j] === 1) {
                gameBoard[currentPiece.y + i][currentPiece.x + j] = 1; 
                // Fijar la pieza en el tablero
            }
        }
    }
    checkRows(gameBoard);
};



//BORRAR FILA AL QUEDAR LLENA
const removeRow = (grid, row) => {
    if (grid[row].every(value => value === 1)) {
        grid.splice(row, 1);
        grid.unshift(Array(columns).fill(0)); 
        // Añadir una fila vacía en la parte superior
    }
};

// VERIFICAR FILAS
const checkRows = (grid) => {
    for (let row = rows - 1; row >= 0; row--) {
        removeRow(grid, row);
    }
};


// SELECCIONAR UNA PIEZA ALEATORIA
const selectRandomPiece = (piezas) => {
    console.log("NUEVA PIEZA")
    const keysOfThePieces = Object.keys(piezas);

    // Verificar que hay claves en el objeto 'piezas'
    if (keysOfThePieces.length === 0) {
        throw new Error('El objeto de piezas está vacío.');
    }

    // Generar un índice aleatorio dentro del rango del array de piezas
    const randomPiece = Math.floor(Math.random() * keysOfThePieces.length);
    console.log("INDEX OF PIEZA:" , randomPiece)
    const selectedPiece = piezas[randomPiece];

    return {
        shape: selectedPiece.shape,
        x: 7, // Posición inicial en el eje X
        y: 0, // Posición inicial en el eje Y
        color: selectedPiece.color
    };
};


// BORRAR CANVAS
const removeCanvas = (context, canvas) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
};


// VERIFICAR COLISIÓN
const verifyCollission = (pieza, x, y) => {
    const leftLimit = x;
    const rightLimit = x + pieza.shape[0].length;
    const downLimit = y + pieza.shape.length;

    if (leftLimit < 0 || rightLimit > columns || downLimit > rows) {
        return true; // Colisión!
       
    }  
    

    // verificar colisión con otras piezas
    for (let i = 0; i < pieza.shape.length; i++) {
        for (let j = 0; j < pieza.shape[i].length; j++) {
            if (pieza.shape[i][j] === 1) {
                const xTablero = x + j;
                const yTablero = y + i;
    
                // Verificar si la posición está ocupada en el tablero
                if (
                    yTablero >= 0 && yTablero < rows &&
                    xTablero >= 0 && xTablero < columns &&
                    gameBoard[yTablero][xTablero] === 1
                ) {
                    return true; // Colisión con otra pieza
                }
            }
        }
    }
    return false; // No hay colisión
};


// GAME OVER
const verificarGameOver = () => {
    for (let x = 0; x < columns; x++) {
        if (gameBoard[0][x] === 1) {
            return true; // Hay una pieza en la fila superior
        }
    }
    return false;
};



// ACTUALIZAR EL ESTADO DEL JUEGO
function update(time = 0) {

    if (isPaused) {
        updateAnimationFrameId = window.requestAnimationFrame(update);
        return;
    }

    const deltaTime = time - lastTime;
    lastTime = time;
    counter += deltaTime;

    if (counter > 1000) {
        // Mover la pieza hacia abajo
        let nuevaY = currentPiece.y + 1;

        // Verificar colisión antes de mover
        if (!verifyCollission(currentPiece, currentPiece.x, nuevaY)) {
            currentPiece.y = nuevaY;
        } else {
            // Fijar la pieza y generar una nueva si colisiona
            fixThePiece(currentPiece);
            if (verificarGameOver()) {
                alert("game over");
                return; // Terminar la actualización
            }
            currentPiece = selectRandomPiece(piezas);
        }

        // Reiniciar contador
        counter = 0;
    }

    // Borra el canvas y vuelve a dibujar la pieza y el tablero
    removeCanvas(context, canvas);
    printPiece(currentPiece, currentPiece.x, currentPiece.y, context);
    paintSquare(pixel, context, "grey");

    updateAnimationFrameId = window.requestAnimationFrame(update);
    
}



// INICIAR JUEGO
const board = () => {
    const tetrisContainer = document.querySelector('#tetrisContainer');
    document.body.appendChild(tetrisContainer);

    // DIBUJAR PIEZA INICIAL
    printPiece(currentPiece, currentPiece.x, currentPiece.y, context);

    // MOVER PIEZA
    document.addEventListener('keydown', (e) => moveThePiece(e));
};

// PAUSAR EL JUEGO
let isPaused = false; // Variable para controlar el estado de pausa
const pauseTheGame = () => {
    isPaused = !isPaused; // Alternar entre pausa y reanudación

    if (isPaused) {
        console.log('Juego pausado');
        cancelAnimationFrame(updateAnimationFrameId);
    } else {
        console.log('Juego reanudado');
        update();
    }
};

board(piezas);
update();

