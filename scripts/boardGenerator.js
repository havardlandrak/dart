function generateBoard() {
    var players = document.getElementById("numplayers").value;
    if (!validNumber(players)) {
        // Do something here i guess
        // input into error box or something
        return;
    }
    updateBoard()
}

function updateBoard(players = document.getElementById("numplayers").value, newRoundflag = false) {
    if (players > 4 && !checkPassword()) {
        showBecca()
        return
    }
    hideBecca()

    if (document.getElementById("players-grid").innerHTML=="") {
        createScoreKeeper();
        addSingleRow(0);
        addSingleRow(1, true);
    }
    else if (newRoundflag) {
        createScoreKeeper();
        addSingleRow(1, true);
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
        inner += '<input id="missing' + player + '" class="center missingbox misplayer' + player + '" readonly disabled/>'
    }
    singlerow.innerHTML = inner;
    singlerow.className = "singlerow center";
    document.getElementById("score-grid").appendChild(singlerow);
}

function addSingleRow(row, overrideflag = false) {
    // TODO: only add row if any info on current row
    if (row != 0 && !overrideflag) {
        if (isEmptyRow(row - 1)) {
            return;
        }
    }
    var singlerow = document.createElement("div")
    var inner = "";
    for (var player = 0; player < 10; player++) {
        inner += '<input id="p' + player + 'r' + row + '" class="scorebox player' + player + '" onkeyup="handleKeyUp()"/>'
    }
    singlerow.innerHTML = inner;
    singlerow.className = "singlerow center";
    document.getElementById("players-grid").appendChild(singlerow);
}

function isEmptyRow(row) {
    for (var player = 0; player < 10; player++) {
        if (document.getElementById(generateCellId(player,row)).value != "") {
            return false;
        }
    }
    return true;
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
        if (current == "gointo" || current == "body") {
            if (e.ctrlKey && e.keyCode == 187) {
                addPlayer(parseInt(players))
            }
            else if (e.ctrlKey && e.keyCode == 189) {
                removePlayer(parseInt(players))
            }
            return
        }
        if (e.key == "Enter") {
            if (isMath(getCellValue(current)) && getRow(current) != 0) {
                doMath(current)
            }
            if (getRow(current) != 0) {
                addPreviousToCurrent(current)
            }
            if (isLastRow(current) && getPlayer(current) == parseInt(players) - 1) {
                addSingleRow(getRow(current)+1)
                updateBoard(parseInt(players))
            }
            handleKeyUp()
            goToNextPlayer(current)
        }
        else if (e.key == "ArrowDown" || e.key == "ArrowUp") {
            changeBox(current, e.key.split("row")[1], players)
        }
        else if (e.ctrlKey && e.keyCode == 187) {
            addPlayer(parseInt(players))
        }
        else if (e.ctrlKey && e.keyCode == 189) {
            removePlayer(parseInt(players))
        }
        else if (e.ctrlKey && e.keyCode == 82) {
            resetBoard()
        }
        else if (e.ctrlKey && e.keyCode == 78) {
            newRound()
        }
        else if (e.key == "Tab" && isLastRow(current) && getPlayer(current) == parseInt(players) - 1) {
            addSingleRow(getRow(current)+1)
            updateBoard(parseInt(players))
        }
}

function handleKeyUp() {
    var current = document.activeElement.id
    if (current == "goingto") {
        generateBoard()
    } 
    else if (getRow(current) != 0) {
        for (i = 0; i < 10; i++) {
            whatsMissing("p"+i+current.substring(2))
        }
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
        var score = parseInt(score)
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
    var currentInt = 0
    if (Number.isNaN(parseInt(getCellValue(current)))) {
        return
    }
    else {
        currentInt = parseInt(getCellValue(current))
    }

    var newValue = getScoreAbove(current) + currentInt
    document.getElementById(current).value = newValue
}

function checkScore(current) {
    try {
        var currentValue = Function(`'use strict'; return (${getCellValue(current)})`)()
    }
    catch {
        var currentValue = getCellValue(current)
    }
    if (current == "plus" || current == "minus") {
        return
    }
    var goingto = parseInt(document.getElementById("goingto").value)
    var color = "rgba(208, 208, 208, 0.80)"
    if (currentValue == "69") {
        color = "hotpink";
    }
    else if (currentValue == goingto) {
        color = "green"
    }
    else if (currentValue > goingto) {
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

function changeBox(current, direction) {
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
    try {
        document.getElementById(newCell).focus()
    } catch {
        console.log("Could not navigate to non-existing cell: " + newCell)
    }
}

function addPlayer(players = parseInt(document.getElementById("numplayers").value)) {
    players += 1
    if (players > 10 || players < 1) {
        return
    }
    document.getElementById("numplayers").value = players
    updateBoard(players)
}

function removePlayer(players = parseInt(document.getElementById("numplayers").value)) {
    players -= 1 
    if (players > 10 || players < 1) {
        return
    }
    document.getElementById("numplayers").value = players
    updateBoard(players)
}

function goToNextPlayer(current) {
    row = getRow(current)
    player = (parseInt(current.charAt(1)) + 1) % parseInt(document.getElementById("numplayers").value)
    if (player == 0) {
        row += 1;
    }
    try {
        document.getElementById(generateCellId(player, row)).focus()
    } catch {
        console.log("Could not navigate to non-existing cell: " + generateCellId(player, row))
    }
}

function generateCellId(player, row) {
    return "p"+player+"r"+row
}

function resetBoard() {
    document.getElementById("players-grid").innerHTML=""
    generateBoard()
}

function newRound() {
    var tempRow = document.getElementById("players-grid").firstElementChild
    document.getElementById("players-grid").innerHTML ="" 
    document.getElementById("players-grid").appendChild(tempRow)
    updateBoard(document.getElementById("numplayers").value, true)
}