function generateBoard() {
    var players = document.getElementById("numplayers").value;
    if (!validNumber(players)) {
        // Do something here i guess
        // input into error box or something
        return;
    }
    updateBoard(players)
}

function updateBoard(players) {
    if (players > 4 && !checkPassword()) {
        showBecca()
        return
    }
    hideBecca()

    if (document.getElementById("players-grid").innerHTML=="") {
        createScoreKeeper()
        addSingleRow(0);
    }
    updatePlayers(players)
}

function updatePlayers(players) {
    showPlayers(10)
    hidePlayers(players)
}

function createScoreKeeper() {
    var singlerow = document.createElement("div")
    var inner = "";
    for (var player = 0; player < 10; player++) {
        inner += '<input id="missing' + player + '" class="center missingbox misplayer' + player + '" readonly onkeydown="return handleKeyPress(event)"/>'
    }
    singlerow.innerHTML = inner;
    singlerow.className = "singlerow center";
    document.getElementById("score-grid").appendChild(singlerow);
}

function addSingleRow(row) {
    // TODO: only add row if any info on current row
    var singlerow = document.createElement("div")
    var inner = "";
    for (var player = 0; player < 10; player++) {
        inner += '<input id="p' + player + 'r' + row + '" class="scorebox player' + player + '" onkeyup="handleKeyUp()" onkeydown="return handleKeyPress(event)"/>'
    }
    singlerow.innerHTML = inner;
    singlerow.className = "singlerow center";
    document.getElementById("players-grid").appendChild(singlerow);
}

function hidePlayers(players) {
    for (var player = 9; player > players-1; player--) {
        Array.from(document.getElementsByClassName("player"+player)).forEach(element => {
            element.className = "scorebox player"+player+" hide";
        });
        Array.from(document.getElementsByClassName("misplayer"+player)).forEach(element => {
            element.className = "center missingbox misplayer"+player+" hide";
        });
    }
}

function showPlayers(players) {
    for (player = 0; player < players; player++) {
        Array.from(document.getElementsByClassName("player"+player)).forEach(element => {
            element.className = "scorebox player"+player+" show";
        });
        Array.from(document.getElementsByClassName("misplayer"+player)).forEach(element => {
            element.className = "center missingbox misplayer"+player+" show";
        });
    }
}

function validNumber(input) {
    var out
    try {
        out = parseInt(input);
        if (out > 1 || out < 10) {
            return out;
        }
        return false
    }
    catch {
        console.log("not a number");
        return false
    }
}

function checkPassword() {
    console.log("The password is 'dart'")
    return (document.getElementById("password").value == "dart" || document.getElementById("password").value == "rebeccaebest")
}

function showBecca() {
    document.getElementById("becca").className = "show center"
    document.getElementById("password").className = "show center"
}

function hideBecca() {
    document.getElementById("becca").className = "hide center"
    document.getElementById("password").className = "hide center"
}

function isLastRow(current) {
    return (getRow(current) == getRow(document.getElementById("players-grid").lastChild.lastChild.id));
}

function handleKeyPress(e) {
        var current = document.activeElement.id
        var players = document.getElementById("numplayers").value
        if (e.key == "Enter") {
            if (getRow(current) == 0) {
                return;
            }
            if (isMath(getCellValue(current))) {
                doMath(current)
            }
            if (getRow(current) != 1) {
                addPreviousToCurrent(current)
            }
            if (isLastRow(current) && getPlayer(current) == parseInt(players) - 1) {
                addSingleRow(getRow(current)+1)
                updateBoard(parseInt(players))
            }
            goToNextPlayer(current)
        }
        else if (e.key == "ArrowDown" || e.key == "ArrowUp" || e.key == "ArrowLeft" || e.key == "ArrowRight") {
            changeBox(current, e.key.split("row")[1], players)
        }
        else if (e.key == "Alt") {
            addPlayer(parseInt(players))
        }
        else if (e.key == "Tab" && isLastRow(current) && getPlayer(current) == parseInt(players) - 1) {
            addSingleRow(getRow(current)+1)
            updateBoard(parseInt(players))
        }
}

function handleKeyUp() {
    var current = document.activeElement.id
    for (i = 0; i < 10; i++) {
        whatsMissing("p"+i+current.substring(2))
    }

    if (getRow(current) != 0) {
        checkScore(current)
    }
}

function getCellValue(_id) {
    return document.getElementById(_id).value;
}

function getRow(_id) {
    return parseInt(_id.split("r")[1]);
}

function getPlayer(_id) {
    return parseInt(_id.charAt(1));
}

function getDifferentRow(_id, row) {
    var idDiff = _id.split("r")[0] + "r" + row
    return getCellValue(idDiff);
}

function whatsMissing(current) {
    var currentInt = getLastValidScore(current)
    try {
        if (document.getElementById(current) == document.activeElement && Number.isInteger(parseInt(getCellValue(current)))) {
            currentInt += Function(`'use strict'; return (${getCellValue(current)})`)()
        }
    }
    catch {
        console.log("cant evaluate: " + getCellValue(current))
    }

    var totalInt = parseInt(document.getElementById("goingto").value);
    document.getElementById("missing"+current.charAt(1)).value = (totalInt - currentInt)
}

function getScoreAbove(current) {
    var prevRow = getRow(current) - 1
    if (prevRow <= 0) {
        return 0;
    }
    var score = getDifferentRow(current, prevRow)
    if (getDifferentRow(current, prevRow).charAt(0) == '-' || getDifferentRow(current, prevRow) == "") {
        return getScoreAbove("p"+getPlayer(current)+"r"+(getRow(current)-1))
    }
    try {
        var score = parseInt(getDifferentRow(current, prevRow))
        return score;
    }
    catch {
        console.log("Write numbers or '-' you fool")
    }
}

// if active square, get score from above recursively else return furthest down score
function getLastValidScore(current) {
    var player = getPlayer(current)
    var row = getRow(document.getElementById("players-grid").lastChild.lastChild.id) + 1
    if (document.getElementById(current) == document.activeElement) {
        row = getRow(document.activeElement.id)
    }
    return getScoreAbove("p"+player+"r"+row)
    
}

function addPreviousToCurrent(current) {
    var newValue = getScoreAbove(current) + parseInt(getCellValue(current))
    document.getElementById(current).value = newValue
}

function checkScore(current) {
    var currentValue = parseInt(getCellValue(current))
    var color = "rgba(208, 208, 208, 0.80)"
    if (getCellValue(current) == "69") {
        color = "hotpink";
    }
    else if (currentValue == parseInt(document.getElementById("goingto").value)) {
        color = "green"
    }
    else if (currentValue > parseInt(document.getElementById("goingto").value)) {
        color = "red"
    }
    document.getElementById(current).style.backgroundColor = color
}

function isMath(text) {
    return !Number.isInteger(text);
}

function doMath(current) {
    try {
        document.getElementById(current).value = Function(`'use strict'; return (${getCellValue(current)})`)()
    }
    catch {
        console.log("tried")
    }
}

function changeBox(current, direction, players) {
    if (current.charAt(0) != "p") {
        return;
    }
    var player = parseInt(current.charAt(1))
    var row = getRow(current)
    if (direction == "Down") {
        if (isLastRow(current)) {
            addSingleRow(getRow(current)+1)
            updatePlayers(document.getElementById("numplayers").value)
        }
        row += 1;
    }
    else if (direction == "Up") {
        if (getRow(current) != 0) {
            row -= 1;
        }
    }
    else if (direction == "Right") {
        if (player != getCellValue("numplayers") - 1) {
            player += 1;
        }
    }
    else if (direction == "Left") {
        if (player != 0) {
            player -= 1;
        }
    }
    var newCell = "p"+player+"r"+row
    document.getElementById(newCell).focus()
}

function addPlayer(players) {
    players += 1
    document.getElementById("numplayers").value = players
    updateBoard(players)
}

function removePlayer(players) {
    players -= 1 
    document.getElementById("numplayers").value = players
    updateBoard(players)
}

function goToNextPlayer(current) {
    row = getRow(current)
    player = (parseInt(current.charAt(1)) + 1) % parseInt(document.getElementById("numplayers").value)
    if (player == 0) {
        row += 1;
    }
    document.getElementById(generateCellId(player, row)).focus()
}

function generateCellId(player, row) {
    return "p"+player+"r"+row
}