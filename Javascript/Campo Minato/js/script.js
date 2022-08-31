function Difficolta(nome, numBombe, numRC, classe) {
    this.nome = nome;
    this.numBombe = numBombe;
    this.numRC = numRC;
    this.classe = classe;
}

var facile = new Difficolta('facile', 10, 10, 'inputF');
var medio = new Difficolta('medio', 40, 20, 'inputM');
var difficile = new Difficolta('difficile', 90, 30, 'inputD');
let btnFacile = document.getElementsByClassName('difficolta')[0];
let btnMedio = document.getElementsByClassName('difficolta')[1];
let btnDifficile = document.getElementsByClassName('difficolta')[2];




btnFacile.addEventListener('click', () => {
    let table = document.getElementById('table');
    table.className = 'table';
    esplosioni = 0;
    svuotaTable();
    flag = false;
    btnFlag.value = 'Flag : OFF';
    grid = creaGrid(facile);
    inputGrid = creaInputGrid(facile);
    avviaGioco(facile);
    riempiVicini(facile);
    riempiBombe(facile);

})
btnMedio.addEventListener('click', () => {
    let table = document.getElementById('table');
    table.classList.remove('table');
    table.classList.remove('tableD');
    table.classList.add('tableM');
    esplosioni = 0;
    svuotaTable();
    flag = false;
    btnFlag.value = 'Flag : OFF';
    grid = creaGrid(medio);
    inputGrid = creaInputGrid(medio);
    avviaGioco(medio);
    riempiVicini(medio);
    riempiBombe(medio);

})

btnDifficile.addEventListener('click', () => {
    let table = document.getElementById('table');
    table.classList.remove('table');
    table.classList.remove('tableM');
    table.classList.add('tableD');
    esplosioni = 0;
    svuotaTable();
    flag = false;
    btnFlag.value = 'Flag : OFF';
    grid = creaGrid(difficile);
    inputGrid = creaInputGrid(difficile);
    avviaGioco(difficile);
    riempiVicini(difficile);
    riempiBombe(difficile);

})

var numBombe = 10;
var grid = creaGrid(facile);
var inputGrid = creaInputGrid(facile);
var flag = false;
let btnFlag = document.getElementById('flag');
btnFlag.addEventListener('click', flagF);
document.addEventListener('keydown',flagF);

var h3 = document.querySelector('h3');
h3.innerHTML = `Bombe : ${facile.numRC}`;

var esplosioni = 0;

class Cella {
    constructor(r, c) {
        this.nome = "" + r + c;
        this.riga = r;
        this.scoppiato = false;
        this.colonna = c;
        this.bomba = false;
        this.elementiVicini = [];
    }
}

function svuotaTable() {
    let table = document.getElementById('table');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
}
function flagF(e) {
    if (e.key == 'f' || e.type == 'click') {
        if (flag) {
            flag = false;
            btnFlag.value = 'Flag : OFF';
            btnFlag.style.backgroundColor = 'white';
        } else {
            flag = true;
            btnFlag.value = 'Flag : ON';
            btnFlag.style.backgroundColor = 'red';
        }
    }
}

function creaGrid(diff) {
    let grid = [];
    for (let i = 0; i < diff.numRC; i++) {
        let nuovo = [];
        grid.push(nuovo);
    }
    return grid;
}

function creaInputGrid(diff) {
    let inputGrid = [];
    for (let i = 0; i < diff.numRC; i++) {
        let nuovo = [];
        inputGrid.push(nuovo);
    }
    return inputGrid;
}

function trovaVicini(r, c) {
    let vicini = [];
    switch (r) {
        case 0:
            switch (c) {
                case 0:
                    vicini.push(grid[r][c + 1]);
                    vicini.push(grid[r + 1][c]);
                    vicini.push(grid[r + 1][c + 1]);
                    break;
                case (grid[r].length - 1):
                    vicini.push(grid[r][c - 1]);
                    vicini.push(grid[r + 1][c]);
                    vicini.push(grid[r + 1][c - 1]);
                    break;
                default:
                    vicini.push(grid[r][c - 1]);
                    vicini.push(grid[r][c + 1]);
                    vicini.push(grid[r + 1][c]);
                    vicini.push(grid[r + 1][c + 1]);
                    vicini.push(grid[r + 1][c - 1]);
            }
            break;
        case (grid.length - 1):
            switch (c) {
                case 0:
                    vicini.push(grid[r][c + 1]);
                    vicini.push(grid[r - 1][c]);
                    vicini.push(grid[r - 1][c + 1]);
                    break;
                case (grid[r].length - 1):
                    vicini.push(grid[r][c - 1]);
                    vicini.push(grid[r - 1][c]);
                    vicini.push(grid[r - 1][c - 1]);
                    break;
                default:
                    vicini.push(grid[r][c - 1]);
                    vicini.push(grid[r][c + 1]);
                    vicini.push(grid[r - 1][c]);
                    vicini.push(grid[r - 1][c + 1]);
                    vicini.push(grid[r - 1][c - 1]);
            }
            break;
        default:
            switch (c) {
                case 0:
                    vicini.push(grid[r][c + 1]);
                    vicini.push(grid[r + 1][c]);
                    vicini.push(grid[r + 1][c + 1]);
                    vicini.push(grid[r - 1][c]);
                    vicini.push(grid[r - 1][c + 1]);
                    break;
                case (grid[r].length - 1):
                    vicini.push(grid[r][c - 1]);
                    vicini.push(grid[r + 1][c]);
                    vicini.push(grid[r + 1][c - 1]);
                    vicini.push(grid[r - 1][c]);
                    vicini.push(grid[r - 1][c - 1]);
                    break;
                default:
                    vicini.push(grid[r][c - 1]);
                    vicini.push(grid[r][c + 1]);
                    vicini.push(grid[r + 1][c]);
                    vicini.push(grid[r + 1][c + 1]);
                    vicini.push(grid[r + 1][c - 1]);
                    vicini.push(grid[r - 1][c]);
                    vicini.push(grid[r - 1][c + 1]);
                    vicini.push(grid[r - 1][c - 1]);
            }
    }

    return vicini;
}



function avviaGioco(diff) {
    h3.innerHTML = `Bombe : ${diff.numBombe}`;
    document.getElementById('modal').style.display = 'none';
    for (let r = 0; r < diff.numRC; r++) {
        for (let c = 0; c < diff.numRC; c++) {
            grid[r][c] = new Cella(r, c);
            let input = document.createElement('input');
            input.type = 'button';
            input.classList.add(diff.classe);
            inputGrid[r][c] = input;

            input.addEventListener('click', function () {
                //SE LA BANDIERA E' ATTIVA
                if (flag) {
                    if (input.value != 'FL') {
                        input.value = 'FL';
                        input.style.color = 'red';
                    }
                    else {
                        input.value = '';
                    }
                    return;
                }
                this.disabled = 'disabled';
                //SE IL BOTTONE CONTIENE UNA BOMBA
                if (grid[r][c].bomba == true) {
                    grid[r][c].scoppiato = true;
                    this.style.backgroundColor = `lightgrey`;
                    this.value = 'B';
                    this.style.color = 'red';
                    for (let r = 0; r < diff.numRC; r++) {
                        for (let c = 0; c < diff.numRC; c++) {
                            if (grid[r][c].bomba == true && grid[r][c].scoppiato == false) {
                                inputGrid[r][c].click();
                            }
                        }
                    }
                    sconfitta(diff);
                    return;
                }
                //SE IL BOTTONE NON CONTINE UNA BOMBA
                if (grid[r][c].scoppiato == false) {
                    esplosioni++;
                }
                grid[r][c].scoppiato = true;
                this.style.backgroundColor = `lightgrey`;
                let value = contaBombe(r, c);

                stabilisciColore(this, value);

                if (value == 0) {
                    input.value = '';
                    for (let i = 0; i < grid[r][c].elementiVicini.length; i++) {
                        let riga = grid[r][c].elementiVicini[i].riga;
                        let colonna = grid[r][c].elementiVicini[i].colonna;
                        if (grid[r][c].elementiVicini[i].scoppiato == false) {
                            inputGrid[riga][colonna].click();
                        }
                    }
                }
                if (esplosioni == (diff.numRC * diff.numRC) - diff.numBombe) vittoria(diff);
            });


            let table = document.getElementById('table');
            table.appendChild(input);
        }
    }
}



function riempiVicini(diff) {
    for (let r = 0; r < diff.numRC; r++) {
        for (let c = 0; c < diff.numRC; c++) {
            grid[r][c].elementiVicini = trovaVicini(r, c);
        }
    }
}

function contaBombe(r, c) {
    let contatore = 0;
    for (let i = 0; i < grid[r][c].elementiVicini.length; i++) {
        if (grid[r][c].elementiVicini[i].bomba == true) {
            contatore++;
        }
    }
    return contatore;
}

function riempiBombe(diff) {
    let i = 0;
    while (i < diff.numBombe) {
        let indiceBomba1 = Math.round(Math.random() * (diff.numRC - 1));
        let indiceBomba2 = Math.round(Math.random() * (diff.numRC - 1));
        if (grid[indiceBomba1][indiceBomba2].bomba == false) {
            grid[indiceBomba1][indiceBomba2].bomba = true;

            i++;
        }

    }
}

function sconfitta(diff) {
    document.getElementById('modal').style.display = 'block';
    document.querySelector('#modal h2').innerHTML = 'Hai Perso';
    for (let r = 0; r < inputGrid.length; r++) {
        for (let c = 0; c < inputGrid[r].length; c++) {
            inputGrid[r][c].disabled = 'disabled';
        }
    }

    document.getElementById('giocaAncora').addEventListener('click', () => {
        esplosioni = 0;
        svuotaTable();
        flag = false;
        btnFlag.value = 'Flag : OFF';
        grid = creaGrid(diff);
        inputGrid = creaInputGrid(diff);
        avviaGioco(diff);
        riempiVicini(diff);
        riempiBombe(diff);

    });
}

function vittoria(diff) {
    document.getElementById('modal').style.display = 'block';
    document.querySelector('#modal h2').innerHTML = 'Hai Vinto';
    for (let r = 0; r < inputGrid.length; r++) {
        for (let c = 0; c < inputGrid[r].length; c++) {
            inputGrid[r][c].disabled = 'disabled';
        }
    }

    document.getElementById('giocaAncora').addEventListener('click', () => {
        esplosioni = 0;
        svuotaTable();
        flag = false;
        btnFlag.value = 'Flag : OFF';
        grid = creaGrid(diff);
        inputGrid = creaInputGrid(diff);
        avviaGioco(diff);
        riempiVicini(diff);
        riempiBombe(diff);

    });
}

function stabilisciColore(input, valore) {
    switch (valore) {
        case 0:
            break;
        case 1:
            input.value = valore;
            input.style.color = 'blue';
            break;
        case 2:
            input.value = valore;
            input.style.color = 'red';
            break;
        case 3:
            input.value = valore;
            input.style.color = 'green';
            break;
        case 4:
            input.value = valore;
            input.style.color = 'orange';
            break;
        default:
            input.value = valore;
            input.style.color = 'purple';
    }
}



avviaGioco(facile);
riempiVicini(facile);

riempiBombe(facile);




