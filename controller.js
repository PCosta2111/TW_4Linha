var b = [];
var newGame;
var rows, cols;
var playerTurn; //0 : ME   1 : OPPONENT
var opp; // 0 : VS PLAYER   ;   1: VS CPU

var points = [0,0,0]; // 0 - P1    1 - P2    2 - CPU
var pointsTXT = document.getElementById("scores");							

var msgBoard;	
var username;
var password;
var logForm;
var logGame;

var objPeople = [
    {
        username: "pedro",
        password: "4linha"
    },
    {
        username: "guest",
        password: "guest"
    }
]

function logIn() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    for(let i = 0; i < objPeople.length; i++) {
        if (username == objPeople[i].username && password == objPeople[i].password) {
            var logForm = document.getElementById("form");
            var logGame = document.getElementById("game");
            alert(username + " logged in!");
            logForm.style.display = 'none';
            logGame.style.display = 'block';
            
            

        }
    }
}

function createBoard() {
	newGame = 1;
	msgBoard = document.getElementById("msgBoard");
	
	msgBoard.innerHTML = "";
	
	document.getElementById("giveUp").style.display = "block";
	
	b = new Array();
	
    rows = document.getElementById("rows").value;

    cols = document.getElementById("cols").value;
	
	if( rows < 4 || rows > 8 || cols < 4 || cols > 8){
		alert("Rows and columns must be between 4 and 8");
		return;
	}
	
    var radios = document.getElementsByName('first');

    var radios_opp = document.getElementsByName('opponent');

	
	b = new Array(cols);
	
    //alert(radios[0].checked);
    //alert(radios[1].value);

    if (radios[0].checked && radios[0].value == "f_me")
        playerTurn = 0;
    else
        playerTurn = 1;


    if (radios_opp[0].checked && radios_opp[0].value == "other_player")
        opp = 0;
    else
        opp = 1;
	

    var r;
    var text = "";
    var rLine = [];

	for(let l = 0 ; l < rows ; l++){
		b[l] = new Array(cols);
		for(let c = 0 ; c < cols ; c++)
			b[l][c] = -1;
		
	}

    for (let c = 0; c < cols; c++) {
        text += "<div class = \"column\">";
        text += "<div class = \"placer\" onclick='dropCoin(" + c + ")'></div>";
        for (r = 0; r < rows; r++)
            text += "<div id = '" + r + "c" + c + "' class = \"cell\"></div>";
        text += "</div>";
    }
    document.getElementById("board").innerHTML = text;
	
    if (playerTurn == 1 && opp == 1) {
        cpuDropCoin();
    }else{
		msgBoard.innerHTML = "It is P" + (playerTurn+1) + " turn";
	}
    printCurrenState();

}

function printCurrenState() {

    var text = "";
    for (let l = 0; l < rows; l++) {
        text += "<p>";
        for (let c = 0; c < cols; c++) {
            text += " " + b[l][c];
        }
        text += "</p>";
    }
    document.getElementById("currentState").innerHTML = text;

}

function dropCoin(c) {
	if(newGame < 0)
		return;
    var drop;
    if (b[0][c] != -1) {
        alert("That column is full");
    } else {
        let x = -1;
        for (let i = 1; i < rows; i++) {
            if (b[i][c] != -1) {
                x = 1;
                drop = i - 1;
                break;
            }
        }
        if (x == -1)
            drop = rows - 1;

        b[drop][c] = playerTurn;

        if (playerTurn == 0)
            document.getElementById(drop + "c" + c).style.backgroundColor = "red";
        else
            document.getElementById(drop + "c" + c).style.backgroundColor = "yellow";

        if(checkWinners(drop,c)){
			msgBoard.innerHTML = "P" + (playerTurn+1) + " WINS!!!";
			if(playerTurn == 0)
				points[0]++;
			else
				points[1]++;
			newGame = -1;
		}
        switchPlayer();
    }
    printCurrenState();
	
	if(opp == 1){
		cpuDropCoin();
	}else if(newGame > 0){
		msgBoard.innerHTML = "It is P" + (playerTurn+1) + " turn";
	}


}

function cpuDropCoin() {
	
	if(newGame < 0)
		return;
    var c = selectRand(cols);
    var drop;
    while(b[0][c] != -1) { 
		c = selectRand(cols);
	}
	
	let x = -1;
	for (let i = 1; i < rows; i++) {
		if (b[i][c] != -1) {
			x = 1;
			drop = i - 1;
			break;
		}
	}
	if (x == -1)
		drop = rows - 1;

	b[drop][c] = playerTurn;

	if (playerTurn == 0)
		document.getElementById(drop + "c" + c).style.backgroundColor = "red";
	else
		document.getElementById(drop + "c" + c).style.backgroundColor = "yellow";
	
	if(checkWinners(drop,c)){
		msgBoard.innerHTML = "CPU has played on column " + (c+1) + ". CPU WINS!!";
		point[2]++;
		newGame = -1;
	}else if(newGame > 0){
		switchPlayer();
		msgBoard.innerHTML = "CPU has played on column " + (c+1) + ". It is P1 turn";
	}
    


    printCurrenState();

}

function checkWinners(pR,pC) {
	
	//Vertical 
	for(let l = pR-3; l <= pR + 3 ; l++){
		try{
			if(CompareFour(b[l][pC],b[l+1][pC],b[l+2][pC],b[l+3][pC])){
			return true;}
		}catch(e){}
	}
	//Horizontal 
	for(let c = pC-3; c <= pC + 3 ; c++){
		try{
			if(CompareFour(b[pR][c],b[pR][c+1],b[pR][c+2],b[pR][c+3])){
			return true;}
		}catch(e){}
	}
	
		
	//Diagonal RIGHT
	for(let c = pC-3; c <= pC+3 ; c++){
		try{
			if(CompareFour(b[c][c],b[c+1][c+1],b[c+2][c+2],b[c+3][c+3])){
			return true;}
		}catch(e){}
	}
	
	//Diagonal LEFT DOWN
	for(let c = 0; c <= 3 ; c++){
		try{
			if(CompareFour(b[pR+c][pC-c],b[pR+c-1][pC-c+1],b[pR+c-2][pC-c+2],b[pR+c-3][pC-c+3])){
			return true;}
		}catch(e){}
	}
	
	//Check for a draw
	for(let l = 0 ; l < rows ; l++){
		for(let c = 0 ; c < cols ; c++)
			if(b[l][c] == -1)
				return false;
		
	}
	
	//If it's here, then it's a draw
	msgBoard.innerHTML = "It's a draw.";
	newGame = -1;
}

function CompareFour(a,b,c,d){
	if( a == b && a == c && a== d && a != -1 && a != null){
		return true;
	}else{
		return false;
	}
}

function switchPlayer() {
    if (playerTurn == 1)
        playerTurn = 0;
    else
        playerTurn = 1;
}

function selectRand(n) {
    var ran = Math.floor(Math.random() * (n));
    return ran;
}

function giveUp(){
	if(newGame < 0)
		return;
	
	if(playerTurn == 0){
		if(opp == 1){
			msgBoard.innerHTML = "Player 1 drops out! CPU WINS!!";
			points[2]++;
		}else{
			msgBoard.innerHTML = "Player 1 drops out! P2 WINS!!";
			points[1]++;
		}
		newGame = -1;
	}else{
		
		msgBoard.innerHTML = "Player 2 drops out! P1 WINS!!";
		points[0]++;
	
		newGame = -1;
	}
	
}

var boxArray = ['box1', 'box2'];
window.addEventListener('mouseup', function () {
	document.getElementById('scores').innerHTML = "P1: " + points[0] + " </br>P2: " + points[1] + " </br>	CPU: " + points[2] + " </br>"
    for (var i = 0; i < boxArray.length; i++) {
        var box = document.getElementById(boxArray[i]);
        if (event.target != box && event.target.parentNode != box) {
            box.style.display = 'none';
        }
    }
});