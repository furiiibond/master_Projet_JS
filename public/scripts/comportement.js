var nave=navigator.userAgent.toLowerCase();
if (nave.indexOf("firefox") > -1) nave="Firefox"; else nave="Firefox";
var fenetre = document.getElementById('canvas');
var hh=canvas.getContext('2d');
hh.canvas.style.border="3px solid #000";
hh.translate(0.5,0.5);
var Xs,Ys;
var Xd=10,Yd=10;
var ct,xmin=Xd+30,xmax=xmin+6*a,ymin=Yd+30,ymax=ymin+6*a;
trace();
var isPlaying = false;
var startColor = "R";

// commandes ***********************
function choixRaz(){
    if (isPlaying === true) {
        if (confirm('Voulez-vous vraiment redémarrer la partie ?')) {

        } else {
            // Do nothing!
            console.log('Remise à 0 annuler !');
            return;
        }
    }
    console.log("Remise à 0 du plateau");
    console.table(defaultGrid);
    console.table(grid);
    grid = JSON.parse(JSON.stringify(defaultGrid));
    drawBoard();
    document.querySelector("h1").innerText = "Puissance 4";
    currentColor = startColor;
}

function initColor(color){  // initialisation de la couleur via sélecteur
    console.log(color);
    startColor = color;
    if (isPlaying === false)
        currentColor = color;
}

// on utilise ici le stockage localStorage du navigateur
function choixSave(){ // sauvegarde du plateau
    console.log("Sauvegarde du plateau");
    localStorage.setItem("Puissance4_grid", JSON.stringify(grid));
    localStorage.setItem("Puissance4_currentColor", currentColor);
    alert("Sauvegarde du plateau effectuée");
}

function restore() {
    console.log("Restauration du plateau");
    if (localStorage.getItem("Puissance4_grid") !== null) {
        grid = JSON.parse(localStorage.getItem("Puissance4_grid"));
        currentColor = localStorage.getItem("Puissance4_currentColor");
        //localStorage.clear();
        isPlaying = true;
        displayGrid();
    } else {
        alert("Aucune sauvegarde trouvée");
    }
}

function indications(){
    alert("Appuyer sur les touches numériques de votre clavier correspondantes aux colonnes de votre plateau")
}


//   ******************************************

function drawLine(xi,yi,xf,yf){
    hh.beginPath();
    hh.moveTo(xi,yi);
    hh.lineTo(xf,yf);
    hh.stroke();}

function cadre3D(x,y,w,ha){
    hh.strokeStyle="rgb(130,130,133)";
    drawLine(x,y+1,w-1,y+1);	drawLine(x,y,x,ha);
    drawLine(x+1,y,x+1,ha-1);   drawLine(x,y,w,y);
    hh.strokeStyle="rgb(230,230,230)";
    drawLine(x,ha,w,ha);	drawLine(w,y+1,w,ha);
    drawLine(x+1,ha-1,w,ha-1);	drawLine(w-1,y+2,w-1,ha);
}


function trace(){
    hh.font="bold 16px Arial";
    hh.textAlign="center";
    hh.fillStyle="silver";
    hh.fillRect(0,0,440,440);
    hh.fillStyle="black";
    hh.fillRect(Xd+20,Yd+20,370,370);
    hh.fillStyle="silver";
    hh.fillRect(xmin,ymin,350,350);
    // not usefull for this game
    //hh.fillStyle="silver";
    //hh.fillRect(388,160,12,55);
    //   hh.fillStyle="red";
    //hh.fillText("out",400,190);
    hh.lineWidth=1;
}

// game logic ***********************
// // // Put token in grid
const putTokenInGrid = ({ colIndex, color }) => {
    for (let i = grid.length - 1; i >= 0; i--) {
        if (grid[i][colIndex] === null) {
            grid[i][colIndex] = color;
            return [i, colIndex];
        }
    }
};
// Display grid

const rToken = 20;
const paddingToken = 5;
const redColor = "#C70000";
const yellowColor = "gold";

const drawBoard = () => {
    hh.clearRect(xmin, ymin, 350, 350);
    hh.fillStyle = "#000b8c";
    hh.fillRect(xmin, ymin, 350, 350);
    //   ctx.fill();

    for (let x = 0; x < grid[0].length; x++) {
        for (let y = 0; y < grid.length; y++) {
            putTokenByCoords({
                colIndex: x,
                rowIndex: y,
            });
        }
    }
};

const displayGrid = () => {
    console.table(grid);
    //   let isRed = true;
    for (let x = 0; x < grid[0].length; x++) {
        for (let y = 0; y < grid.length; y++) {
            if (grid[y][x] !== null) {
                putTokenByCoords({
                    colIndex: x,
                    rowIndex: y,
                    color: grid[y][x],
                });
            }
        }
    }
};

const drawWinner = (color) => {
    //   ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    //   ctx.fillStyle = color;
    title = document.querySelector("h1");
    title.innerText = `${currentColor} a gagné. Tapez la barre d'espace ou boutton RaZ pour redémarrer.`;
    title.style.color = currentColor === "R" ? redColor : yellowColor;
};

const putTokenByCoords = ({ colIndex, rowIndex, color = null }) => {
    const colOffset = 65;
    const rowOffset = 80;
    hh.beginPath();
    hh.arc(
        colIndex * rToken * 2 + colIndex * paddingToken * 2 + colOffset,
        rowIndex * rToken * 2 + rowIndex * paddingToken * 2 + rowOffset,
        rToken,
        0,
        2 * Math.PI
    );

    console.log("color", color);
    if (color) {
        hh.fillStyle = color === "R" ? redColor : yellowColor;
        hh.fill();
    }

    hh.stroke();
};

// event listeners ***********************
const onKeyUp = ({ keyCode }) => {
    console.log("onKeyUP");
    if (keyCode === 32) { // space bar = remise à zéro
        choixRaz();
    }
    if (keyCode >= 49 && keyCode <= 55) { // 49 = 1, 50 = 2, 51 = 3, 52 = 4, 53 = 5, 54 = 6, 55 = 7
        console.log("Good input");
        isPlaying = true; // on commence à jouer au premier coup
        const colIndex = keyCode - 49;
        let coord = putTokenInGrid({ colIndex, color: currentColor });

        console.log({ currentColor });
        const isWin = checkWin({ grid, color: currentColor }, coord); // check if there is a win
        if (isWin) {
            isPlaying = false;
            drawWinner();
        } else {
            toggleColor();
        }

        displayGrid();
    }
};

// check if there is a winner ****************************
// Check win
const checkWin = ({ grid, color }, coord) => {
    console.log("#checkWin color", color);
    console.table(grid);
    // check vertical
    const isWinVer = checkVertical({ grid, color });
    // check horizontal
    const isWinHor = checkHorizontal({ grid, color });
    // check diag
    const isWinDiagTLBR = checkDiag({ grid, color }, coord[0], coord[1]);
    const isWin = isWinVer || isWinHor || isWinDiagTLBR;
    console.log({ isWinVer, isWinHor, isWinDiagTLBR, isWin });
    return isWin;
};

const checkDiag = ({ grid, color } = {}, i,j) => {
    // Vérification diagonale
    let countDiag=0;
    let d=-Math.min(i,j);
    let ligne = grid.length;
    let colonne = grid[0].length;
    while(i+d<ligne&&j+d<colonne&&i+d>=0&&j+d>=0){

        if (grid[i+d][j+d]==color){
            countDiag++;
            d++;
        }
        else if (grid[i+d][j+d]!==color&&countDiag==4){
            d++;
        }
        else {
            countDiag=0;
            d++;
        }
    }

    // Vérification anti-diagonale
    let countAntiDiag=0;
    let a=-Math.min(i,colonne-1-j);
    while(i+a<ligne&&j-a<colonne&&i+a>=0&&j-a>=0){
        if (grid[i+a][j-a]==color){
            countAntiDiag++;
            a++;
        }
        else if (grid[i+a][j-a]!==color&&countAntiDiag==4){
            a++;
        }
        else {
            countAntiDiag=0;
            a++;
        }
    }
    return countDiag>=4||countAntiDiag>=4;
};

const checkHorizontal = ({ grid, color } = {}) => {
    for (let x = 0; x < grid[0].length - 3; x++) {
        for (let y = 0; y < grid.length; y++) {
            //   console.log(grid[y][x]);
            //   console.log(grid[y][x + 1]);
            //   console.log(grid[y][x + 2]);
            //   console.log(grid[y][x + 3]);
            if (
                grid[y][x] === color &&
                grid[y][x + 1] === color &&
                grid[y][x + 2] === color &&
                grid[y][x + 3] === color
            ) {
                //   if (
                //     color ===
                //     (grid[y][x] && grid[y][x + 1] && grid[y][x + 2] && grid[y][x + 3])
                //   ) {
                console.log("win hor");
                return true;
            }
        }
    }
    return false;
};

const checkVertical = ({ grid, color } = {}) => {
    for (let x = 0; x < grid[0].length; x++) {
        for (let y = 0; y < grid.length - 3; y++) {
            // console.log(grid[y][x]);
            // console.log(grid[y + 1][x]);
            // console.log(grid[y + 2][x]);
            // console.log(grid[y + 3][x]);
            // console.log("---");

            if (
                grid[y][x] === color &&
                grid[y + 1][x] === color &&
                grid[y + 2][x] === color &&
                grid[y + 3][x] === color
            ) {
                //   if (
                //     color ===
                //     (grid[y][x] && grid[y + 1][x] && grid[y + 2][x] && grid[y + 3][x])
                //   ) {
                console.log("win ver");
                return true;
            }
        }
        // console.log("--- end y");
    }
    // console.log("--- end x");
    return false;
};
// main ***********************
// Define HTML els
// Set up player & color
let currentColor = startColor; // start with red
const defaultGrid = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
];
let grid = JSON.parse(JSON.stringify(defaultGrid));
// Change color every round
const toggleColor = () => {
    currentColor = currentColor === "R" ? "Y" : "R";
};

const init = () => {
    attachFromDOM();
    addEventListeners();

    drawBoard();
    displayGrid();
    // checkWin({ grid, color: "Y" });
    // console.table(grid);
    // ctx.translate(50, 50);
};

const attachFromDOM = () => {
    canvasEl = document.querySelector("#canvas");
    ctx = canvasEl.getContext("2d");
};

const addEventListeners = () => {
    // Add event listeners
    // // Get input from keyboard to play
    // <el>.addEventListener(<eventName: String>, Callback:Function(event) );
    console.log("#addEventListeners");
    document.addEventListener("keyup", onKeyUp);
};

window.addEventListener("load", init);

// test du vinqueur ******************************************
// Les tests suivants permettent de vérifier que le choix du vainqueur fonctionne correctement.

const gridNumbered = [
    ["x0;y0", "x1;y0", "x2;y0", "x3;y0", "x4;y0", "x5;y0", "x6;y0"],
    ["x0;y1", "x1;y1", "x2;y1", "x3;y1", "x4;y1", "x5;y1", "x6;y1"],
    ["x0;y2", "x1;y2", "x2;y2", "x3;y2", "x4;y2", "x5;y2", "x6;y2"],
    ["x0;y3", "x1;y3", "x2;y3", "x3;y3", "x4;y3", "x5;y3", "x6;y3"],
    ["x0;y4", "x1;y4", "x2;y4", "x3;y4", "x4;y4", "x5;y4", "x6;y4"],
    ["x0;y5", "x1;y5", "x2;y5", "x3;y5", "x4;y5", "x5;y5", "x6;y5"],
];
const gridNumbered2 = [
    ["x0;y0", "x1;y0", "x2;y0", "x3;y0", "x4;y0", "x5;y0", "x6;y0"],
    ["x0;y1", "x1;y1", "x2;y1", "x3;y1", "x4;y1", "x5;y1", "x6;y1"],
    ["R", "x1;y2", "x2;y2", "x3;y2", "x4;y2", "x5;y2", "x6;y2"],
    ["R", "x1;y3", "x2;y3", "x3;y3", "x4;y3", "x5;y3", "x6;y3"],
    ["R", "x1;y4", "x2;y4", "x3;y4", "x4;y4", "x5;y4", "x6;y4"],
    ["R", "x1;y5", "x2;y5", "x3;y5", "x4;y5", "x5;y5", "x6;y5"],
];

const gridNumbered3 = [
    ["x0;y0", "x1;y0", "x2;y0", "x3;y0", "x4;y0", "x5;y0", "x6;y0"],
    ["x0;y1", "x1;y1", "x2;y1", "x3;y1", "x4;y1", "x5;y1", "x6;y1"],
    ["x0;y2", "R", "R", "R", "R", "x5;y2", "x6;y2"],
    ["x0;y3", "x1;y3", "x2;y3", "x3;y3", "x4;y3", "x5;y3", "x6;y3"],
    ["x0;y4", "x1;y4", "x2;y4", "x3;y4", "x4;y4", "x5;y4", "x6;y4"],
    ["x0;y5", "x1;y5", "x2;y5", "x3;y5", "x4;y5", "x5;y5", "x6;y5"],
];

const gridNumbered4 = [
    ["R", "x1;y0", "x2;y0", "x3;y0", "x4;y0", "x5;y0", "x6;y0"],
    ["Y", "x1;y1", "x2;y1", "x3;y1", "x4;y1", "x5;y1", "x6;y1"],
    ["R", null, null, null, "R", "x5;y2", "x6;y2"],
    ["Y", "x1;y3", "x2;y3", "x3;y3", "x4;y3", "x5;y3", "x6;y3"],
    ["x0;y4", "x1;y4", "x2;y4", "x3;y4", "x4;y4", "x5;y4", "x6;y4"],
    ["x0;y5", "x1;y5", "x2;y5", "x3;y5", "x4;y5", "x5;y5", "x6;y5"],
];

const obj = {
    grid: gridNumbered,
    color: "R",
};
const obj2 = {
    grid: gridNumbered2,
    color: "R",
};
const obj3 = {
    grid: gridNumbered3,
    color: "R",
};
const obj4 = {
    grid: gridNumbered4,
    color: "R",
};
const isTestWin1 = checkVertical(obj);
const isTestWin2 = checkVertical(obj2);
console.log(false === isTestWin1);
console.log(true === isTestWin2);

const isTestWin3 = checkVertical(obj);
const isTestWin4 = checkVertical(obj2);
console.log(false === isTestWin3);
console.log(true === isTestWin4);

const isTestWin5 = checkVertical(obj4);
console.log(false === isTestWin5);