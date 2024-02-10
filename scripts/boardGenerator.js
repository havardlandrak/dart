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
        showInfo("becca")
        showInfo("password")
        return
    }
    hideInfo("becca")
    hideInfo("password")

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

function showInfo(cellid) {
    document.getElementById(cellid).className = "show center"
}

function hideInfo(cellid) {
    document.getElementById(cellid).className = "hide center"
}

function isLastRow(current) {
    return (getRow(current) == getRow(document.getElementById("players-grid").lastChild.lastChild.id));
}

function handleKeyPress(e) {
        var current = document.activeElement.id
        var players = document.getElementById("numplayers").value
        if (current == "gointo" || current == "body") {
            if (e.altKey && e.keyCode == 187) {
                addPlayer(parseInt(players))
            }
            else if (e.altKey && e.keyCode == 189) {
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
            if (getCellValue(current)[0] = "r" && getCellValue(current) > parseInt(document.getElementById("goingto").value)) {
                document.activeElement.value = "-"
            }
            handleKeyUp()
            goToNextPlayer(current, current);
        }
        else if (e.key == "ArrowDown" || e.key == "ArrowUp") {
            changeBox(current, e.key.split("row")[1], players)
        }
        else if (e.altKey && e.keyCode == 187) {
            addPlayer(parseInt(players))
        }
        else if (e.altKey && e.keyCode == 189) {
            removePlayer(parseInt(players))
        }
        else if (e.altKey && e.keyCode == 82) {
            resetBoard()
        }
        else if (e.altKey && e.keyCode == 78) {
            newRound()
        }
        else if (e.key == "Tab" && isLastRow(current) && getPlayer(current) == parseInt(players) - 1) {
            addSingleRow(getRow(current)+1)
            updateBoard(parseInt(players))
        }
}

function handleKeyUp() {
    var current = document.activeElement.id
    updateBoard(parseInt(document.getElementById("numplayers").value));
    if (current == "goingto") {
        generateBoard()
    } 
    else if (getRow(current) != 0) {
        for (i = 0; i < 10; i++) {
            whatsMissing("p"+i+current.substring(2))
        }
        checkScore(current)
    }
    checkIfClown(current)
}

function getCellValue(_id) {
    myValue = trimUntilHappy(document.getElementById(_id).value)

    return myValue;
}

function trimUntilHappy(myString) {
    if (!myString) return "";
    if (!isCharNumber(myString.slice(-1))) {
        myString = myString.slice(0, -1);
        myString = trimUntilHappy(myString)
    }
    return myString;
}

function isCharNumber(c) {
    return (c >= '0' && c <= '9') || c == ')' || c == '*';
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
            if (aboveIsNice(current)) {
                currentInt += Function(`'use strict'; return (${getCellValue(current)})`)()
            }
        }
    }
    catch {
        console.log("cant evaluate: " + getCellValue(current))
    }

    var totalInt = parseInt(document.getElementById("goingto").value);
    if (currentInt < 69) {
        document.getElementById("missing"+current.charAt(1)).value = (totalInt - currentInt) + " (" + (69 - currentInt) + ")"
    }
    else if (currentInt == 69 && document.getElementById(current).value.slice(-1) != '*') {
        document.getElementById("missing"+current.charAt(1)).value = "☺"
    }
    else if (currentInt < parseInt(document.getElementById("goingto").value) / 2) {
        document.getElementById("missing"+current.charAt(1)).value = (totalInt - currentInt) + " [" + (Math.ceil(parseInt(document.getElementById("goingto").value) / 2) - currentInt) + "]"
    }
    else {
        document.getElementById("missing"+current.charAt(1)).value = (totalInt - currentInt)
    }
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

function aboveIsNice(current){
    return (getScoreAbove(current) == 69 && getDifferentRow(current, getRow(current)-1).slice(-1)!="*")
}

function addPreviousToCurrent(current) {
    var currentInt = 0
    if (Number.isNaN(parseInt(getCellValue(current)))) {
        return
    }
    else {
        currentInt = parseInt(getCellValue(current))
    }
    if  (aboveIsNice(current)) {
        var newValue = getScoreAbove(current) + currentInt * 2
    }
    else {
        var newValue = getScoreAbove(current) + currentInt
    }
    
    var halfwayThere = parseInt(document.getElementById("goingto").value) / 2

    if (getScoreAbove(current) < halfwayThere && newValue >= halfwayThere) {
        JBJTime()
    }
    document.getElementById(current).value = newValue
}

function checkScore(current) {
    if (current == "plus" || current == "minus") {
        return
    }
    var currentValue = document.getElementById(current).value
    var goingto = parseInt(document.getElementById("goingto").value)

    var color = "rgba(208, 208, 208, 0.80)"
    if (currentValue == "69") {
        color = "hotpink";
    }
    else if (currentValue == goingto) {
        color = "green"
    }
    else if (currentValue == "-") {
        color = "red"
    }
    document.getElementById(current).style.backgroundColor = color
    // TODO: LA
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

function goToNextPlayer(current, navfrom) {
    row = getRow(current)
    player = (parseInt(current.charAt(1)) + 1) % parseInt(document.getElementById("numplayers").value)
    if (player == 0) {
        row += 1;
        if (isLastRow(current) && getPlayer(current) == parseInt(document.getElementById("numplayers").value) - 1) {
            addSingleRow(row);
        }
    }
    nextplayer = generateCellId(player, row);
    if (getRow(nextplayer) - 1 > getRow(navfrom)) {
        stopClown();
        stopMillionaire();
        try {
            document.getElementById(navfrom.split("r")[0] + "r" + (getRow(navfrom)+1)).focus()
        } catch {
            console.log("Could not navigate to non-existing cell: " + generateCellId(player, row));
            
        }
        return;
    }
    if (getLastValidScore(nextplayer) == parseInt(document.getElementById("goingto").value) || getCellValue(nextplayer)) {
        try {
            document.getElementById(nextplayer)
            goToNextPlayer(nextplayer, navfrom);
        }
        catch {
            stopClown();
            stopMillionaire();
            console.log("Could not navigate to non-existing cell: " + generateCellId(player, row));
            document.getElementById(current).focus()
        }
    }
    else {
        try {
            document.getElementById(nextplayer).focus()
        } catch {
            console.log("Could not navigate to non-existing cell: " + generateCellId(player, row));
            
        }
    }
    //checkIfClown(document.getElementById(generateCellId(player, row)).id)
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

function checkIfClown(current) {
    counter = 0;
    cellToCheck = current
    curVal = getCellValue(current);
    gointoVal = parseInt(document.getElementById("goingto").value)
    if (curVal == gointoVal) {
        stopClown();
        stopMillionaire();
        return;
    }
    while (getRow(cellToCheck) > 0) {
        if (getDifferentRow(current, getRow(cellToCheck) - 1).charAt(0) == '-' || getDifferentRow(current, getRow(cellToCheck) - 1) == "") {
            counter++
            cellToCheck = "p"+getPlayer(cellToCheck)+"r"+ (getRow(cellToCheck) - 1)
        }
        else {
            break
        }
    }
    if (counter == 2) {
        playMillionaire()
    }
    else {
        stopMillionaire()
    }
    if (counter >= 3) {
        playClown()
    }
    else {
        stopClown()
    }
}

// CLOWN

var soundFile = document.createElement("audio");
soundFile.preload = "auto";
soundFile.loop = true;

//Load the sound file (using a source element for expandability)
var src = document.createElement("source");
src.src = "music/clown.mp3";
soundFile.appendChild(src);

//Load the audio tag
//It auto plays as a fallback
soundFile.load();
soundFile.volume = 0.50;

function playClown() {
    soundFile.play();
}

function stopClown() {
    soundFile.pause()
}

// MILLIONAIRE

var soundFile2 = document.createElement("audio");
soundFile2.preload = "auto";

//Load the sound file (using a source element for expandability)
var src2 = document.createElement("source");
src2.src = "music/millionaire.mp3";
soundFile2.appendChild(src2);

//Load the audio tag
//It auto plays as a fallback
soundFile2.load();
soundFile2.volume = 0.50;
soundFile2.loop = true;

function playMillionaire() {
    soundFile2.play();
}

function stopMillionaire() {
    soundFile2.pause()
    soundFile2.currentTime = 0
}

// BJ TIME

var soundFile3 = document.createElement("audio");
soundFile3.preload = "auto";

//Load the sound file (using a source element for expandability)
var src3 = document.createElement("source");
src3.src = "music/oooh.mp3";
soundFile3.appendChild(src3);

//Load the audio tag
//It auto plays as a fallback
soundFile3.load();
soundFile3.volume = 1;

function JBJTime() {
    soundFile3.currentTime = 0
    soundFile3.play();
}

function play() {
//Set the current time for the audio file to the beginning
    soundFile.currentTime = 0.01;
    soundFile.volume = volume;
    soundFile.muted = false

//Due to a bug in Firefox, the audio needs to be played after a delay
setTimeout(function(){soundFile.play();},1);
}
