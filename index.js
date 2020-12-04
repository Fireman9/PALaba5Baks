const cube1 = document.getElementById("cube1");
const cube2 = document.getElementById("cube2");
const cube3 = document.getElementById("cube3");
const throwButton = document.getElementById("throwButton");
const msgContainer = document.getElementById("msgContainer");
const baksDiv = document.getElementById("baks");
const playerPointsDiv = document.getElementById("playerPoints");
const aiPointsDiv = document.getElementById("aiPoints");
const cubesCountSelect = document.getElementById("cubesCount");

// 0 - AI, 1 - Player turn
let turn;
let baks;
let playerScore = 0;
let aiScore = 0;
let cubesCount = 3;

let cubeFacesCoordinates = [
    {"x": 5, "y": -5, "z": 0},
    {"x": 5, "y": -95, "z": 0},
    {"x": -85, "y": 0, "z": -5},
    {"x": 95, "y": 0, "z": 5},
    {"x": 5, "y": 85, "z": 0},
    {"x": 185, "y": 5, "z": 0},
]

function getRandomThrow(max) {
    return Math.floor(Math.random() * Math.floor(max) + 1);
}

function rotate(cube) {
    let cubeThrow = getRandomThrow(6);
    let currentCord = [];
    let cord = cube.style.transform.replaceAll(/rotateX|rotateY|rotateZ|deg|\(|\)|/g, "");
    cord = "[" + cord + "]";
    cord = cord.replaceAll(" ", ",");
    cord = JSON.parse(cord);
    if (cord[0] - cubeFacesCoordinates[cubeThrow - 1].x < 360) {
        currentCord.push(cubeFacesCoordinates[cubeThrow - 1].x + 720);
    } else {
        currentCord.push(cubeFacesCoordinates[cubeThrow - 1].x);
    }
    if (cord[1] - cubeFacesCoordinates[cubeThrow - 1].y < 360) {
        currentCord.push(cubeFacesCoordinates[cubeThrow - 1].y + 720);
    } else {
        currentCord.push(cubeFacesCoordinates[cubeThrow - 1].y);
    }
    currentCord.push(cubeFacesCoordinates[cubeThrow - 1].z);
    cube.style.transform = `rotateX(${currentCord[0]}deg) rotateY(${currentCord[1]}deg) rotateZ(${currentCord[2]}deg)`;
    return cubeThrow;
}

function firstTurn() {
    throwButton.disabled = true;
    let aiScoreFirstTurn = 0;
    let playerScoreFirstTurn = 0;
    playerScoreFirstTurn = rotate(cube2);
    setTimeout(function () {
        msgContainer.innerText = "Кидок противника";
        aiScoreFirstTurn = rotate(cube2);
        setTimeout(function () {
            if (aiScoreFirstTurn > playerScoreFirstTurn) {
                turn = 0;
                msgContainer.innerText = "Ваш кидок на значення бакса";
                throwButton.onclick = setBaksByPlayer;
                throwButton.disabled = false;
            } else if (aiScoreFirstTurn < playerScoreFirstTurn) {
                turn = 1;
                msgContainer.innerText = "Кидок противника на значення бакса";
                baks = rotate(cube2);
                throwButton.onclick = simpleTurns;
                setTimeout(function () {
                    baksDiv.innerText = `Бакс: ${baks}`;
                    setTimeout(function () {
                        msgContainer.innerText = "Ваш кидок";
                        cube1.style.display = "";
                        cube3.style.display = "";
                        throwButton.disabled = false;
                        cubesCountSelect.disabled = false;
                    }, 1000);
                }, 3000);
            } else {
                msgContainer.innerText = "Порівну, кидайте ще раз";
                throwButton.disabled = false;
                cubesCountSelect.disabled = false;
            }
        }, 4000)
    }, 4000);
}

function setBaksByPlayer() {
    throwButton.disabled = true;
    baks = rotate(cube2);
    throwButton.onclick = simpleTurns;
    setTimeout(function () {
        baksDiv.innerText = `Бакс: ${baks}`;
        msgContainer.innerText = "Кидок противника";
        setTimeout(function () {
            cube1.style.display = "";
            cube3.style.display = "";
            setTimeout(simpleTurns, 100);
        }, 1000);
    }, 3000);
}

function simpleTurns() {
    throwButton.disabled = true;
    cubesCountSelect.disabled = true;
    let a, b, c;
    if (turn === 0) {
        if (aiScore === 13 && aiScore - playerScore > 7) {
            selectCubesCount(2);
        } else if (aiScore === 14 && aiScore - playerScore > 7) {
            selectCubesCount(1);
        } else {
            selectCubesCount(3);
        }
    }
    setTimeout(function () {
        if (cubesCount === 1) {
            b = rotate(cube2);
        } else if (cubesCount === 2) {
            a = rotate(cube1);
            b = rotate(cube2);
        } else {
            a = rotate(cube1);
            b = rotate(cube2);
            c = rotate(cube3);
        }
    }, 100)
    setTimeout(function () {
        if (turn === 0) {
            if (cubesCount === 1) {
                addPointsOne(b);
            } else if (cubesCount === 2) {
                addPointsTwo(a, b);
            } else {
                addPointsThree(a, b, c);
            }
            aiPointsDiv.innerText = aiScore.toString();
            selectCubesCount(parseInt(cubesCountSelect.value));
            if (checkForWin()) {
                throwButton.disabled = true;
                cubesCountSelect.disabled = true;
                return;
            }
            if (a !== baks && b !== baks && c !== baks && !(a === b && b === c)) {
                turn = 1;
                msgContainer.innerText = "Ваш кидок";
                throwButton.disabled = false;
                cubesCountSelect.disabled = false;
            } else {
                simpleTurns();
            }
        } else {
            if (cubesCount === 1) {
                addPointsOne(b);
            } else if (cubesCount === 2) {
                addPointsTwo(a, b);
            } else {
                addPointsThree(a, b, c);
            }
            playerPointsDiv.innerText = playerScore.toString();
            if (checkForWin()) {
                throwButton.disabled = true;
                cubesCountSelect.disabled = true;
                return;
            }
            if (a !== baks && b !== baks && c !== baks && !(a === b && b === c)) {
                turn = 0;
                msgContainer.innerText = "Кидок противника";
                throwButton.disabled = true;
                cubesCountSelect.disabled = true;
                simpleTurns();
            } else {
                throwButton.disabled = false;
                cubesCountSelect.disabled = false;
            }
        }
    }, 4100);
}

function addPointsOne(b) {
    let score = 0;
    if (turn === 0) {
        if (b === baks) {
            score++;
        }
        if (aiScore + score > 15) return;
        aiScore += score;
    } else {
        if (b === baks) {
            score++;
        }
        if (playerScore + score > 15) return;
        playerScore += score;
    }
}

function addPointsTwo(a, b) {
    let score = 0;
    if (turn === 0) {
        if (a === baks) {
            score++;
        }
        if (b === baks) {
            score++;
        }
        if (aiScore + score > 15) return;
        aiScore += score;
    } else {
        if (a === baks) {
            score++;
        }
        if (b === baks) {
            score++;
        }
        if (playerScore + score > 15) return;
        playerScore += score;
    }
}

function addPointsThree(a, b, c) {
    let score = 0;
    if (turn === 0) {
        if (a === b && b === c && c === baks) {
            aiScore = 15;
            return;
        } else if (a === b && b === c) {
            if (aiScore + 5 > 15) return;
            aiScore += 5;
        }
        if (a === baks) {
            score++;
        }
        if (b === baks) {
            score++;
        }
        if (c === baks) {
            score++;
        }
        if (aiScore + score > 15) return;
        aiScore += score;
    } else {
        if (a === b && b === c && c === baks) {
            playerScore = 15;
            return;
        } else if (a === b && b === c) {
            if (playerScore + 5 > 15) return;
            playerScore += 5;
        }
        if (a === baks) {
            score++;
        }
        if (b === baks) {
            score++;
        }
        if (c === baks) {
            score++;
        }
        if (playerScore + score > 15) return;
        playerScore += score;
    }
}

function checkForWin() {
    if (aiScore === 15) {
        msgContainer.innerText = "Комп'ютер виграв";
        return true;
    } else if (playerScore === 15) {
        msgContainer.innerText = "Ви виграли";
        return true;
    } else {
        return false;
    }
}

function selectCubesCount(count) {
    cubesCount = count;
    if (count === 1) {
        cube1.style.display = "none";
        cube2.style.display = "";
        cube3.style.display = "none";
    } else if (count === 2) {
        cube1.style.display = "";
        cube2.style.display = "";
        cube3.style.display = "none";
    } else {
        cube1.style.display = "";
        cube2.style.display = "";
        cube3.style.display = "";
    }
}

throwButton.onclick = firstTurn;