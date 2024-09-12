
const root = document.documentElement;
//colores
const colorRed = getComputedStyle(root).getPropertyValue('--rtc--color-red').trim();
const colorBlue = getComputedStyle(root).getPropertyValue('--rtc--color-blue').trim();
const colorGreen = getComputedStyle(root).getPropertyValue('--rtc--color-green').trim();
const coloryellow = getComputedStyle(root).getPropertyValue('--rtc--color-yellow').trim();
const colorPurple = getComputedStyle(root).getPropertyValue('--rtc--color-purple').trim();
const colorPink = getComputedStyle(root).getPropertyValue('--rtc--color-pink').trim();
const colorTurquoise = getComputedStyle(root).getPropertyValue('--rtc--color-turquoise').trim();


export const piezas =  {

    0:{
        color: colorRed, shape: [[1, 1, 1, 1]]
    },

    1: {
        color: colorBlue, shape:[ 
        [1, 1],
        [1, 1]]
    },

    2:{
        color: colorGreen, shape: [
      [0, 1, 0],
      [1, 1, 1]]
    },

    3: {
        color: coloryellow, shape: [
        [1, 0, 0],
        [1, 1, 1]
      ]
    },

    4: {
        color: colorPurple , shape:[
            [ 0, 0, 1],
            [ 1, 1, 1]
        ]
    },

    5:{
        color: colorPink, shape:[
            [0, 1, 1],
            [1, 1, 0]
        ]
    },

    6: {
        color: colorTurquoise, shape:[
            [1, 1, 0],
            [0, 1, 1]
        ]
    }
    
}


