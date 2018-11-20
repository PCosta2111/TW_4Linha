var b = [];
var newGame;
var rows, cols;
var playerTurn; //0 : ME   1 : OPPONENT
var opp; // 0 : VS PLAYER   ;   1: VS CPU
var dif; // 0 : VS PLAYER   ;   1: VS CPU

var points = [0,0,0]; // 0 - P1    1 - P2    2 - CPU
	
var username;
var password;
var logForm;
var logGame;

/*
var objPeople = [
    {
        username: "pedro",
        password: "4linha"
    },
    {
        username: "guest",
        password: "guest"
    }
    ,
    {
        username: "",
        password: ""
    }
]
*/

window.onload = function() {
	const pointsTXT = document.getElementById("scores");	
	const msgBoard = document.getElementById("msgBoard");
}


function createBoard() {
	newGame = 1;
	
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

    if (radios[0].checked && radios[0].value == "f_me")
        playerTurn = 0;
    else
        playerTurn = 1;
	
    radios = document.getElementsByName('opponent');

    if (radios[0].checked && radios[0].value == "other_player")
        opp = 0;
    else
        opp = 1;
	
    radios = document.getElementsByName('ai_dif');
	
	if (radios[0].checked && radios[0].value == "d_easy")
        dif = 0;
    else
        dif = 1;
	


	b = new Array(cols);
	
    var r;
    var text = "";
    var rLine = [];

	for(let l = 0 ; l < rows ; l++){
		b[l] = new Array(cols);
		for(let c = 0 ; c < cols ; c++)
			b[l][c] = -1;
		
	}
	
	var bDiv = document.getElementById("board");
	while (bDiv.firstChild) {
		bDiv.removeChild(bDiv.firstChild);
	}
    for (let c = 0; c < cols; c++) {
		let divCol = document.createElement("div");
		divCol.classList.add("column");
		bDiv.appendChild(divCol);
		//text += "<div class = \"column\">";
        //text += "<div class = \"placer\" onclick='dropCoin(" + c + ")'></div>";
		let divPlacer = document.createElement("div");
		divPlacer.classList.add("placer");
		divPlacer.onclick = function(){ dropCoin(c); }
		divCol.appendChild(divPlacer);
        for (r = 0; r < rows; r++){
            //text += "<div id = '" + r + "c" + c + "' class = \"cell\"></div>";
			let divCell = document.createElement("div");
			divCell.classList.add("cell");
			divCell.id = r + "c" + c;
			divCol.appendChild(divCell);
		}
        //text += "</div>";
    }
   // document.getElementById("board").innerHTML = text;
	
    if (playerTurn == 1 && opp == 1) {
        cpuDropCoin();
    }else{
		msgBoard.innerHTML = "It is P" + (playerTurn+1) + " turn";
	}
	updateScores();
    //printCurrenState();

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
		
		//document.getElementById("currentState").innerHTML = Utility();
        if(checkWinners(drop,c)){
			msgBoard.innerHTML = "P" + (playerTurn+1) + " WINS!!!";
			if(playerTurn == 0)
				points[0]++;
			else
				points[1]++;
			newGame = -1;
			return;
		}else if(isDraw(b)){
			msgBoard.innerHTML = "It's a draw.";
			newGame = -1;
			return;
		}
        switchPlayer();
		if(opp == 1){
			cpuDropCoin();
		}else if(newGame > 0){
			msgBoard.innerHTML = "It is P" + (playerTurn+1) + " turn";
		}
    }
    //printCurrenState();
	
	


}

function cpuDropCoin() {
	
	if(newGame < 0)
		return;
	
	var drop;
	if( dif == 0){ //EASY DIFFICULTY - RANDOM CHOICE
		var c = selectRand(cols);
		while(b[0][c] != -1) { 
			c = selectRand(cols);
		}
				
	}else{	c = MinMax(); }
	
	
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
	
	//document.getElementById("currentState").innerHTML = Utility();
	if(checkWinners(drop,c)){
		msgBoard.innerHTML = "CPU has played on column " + (c+1) + ". CPU WINS!!";
		points[2]++;
		newGame = -1;
		
		return;
	}else if(isDraw(b)){
		msgBoard.innerHTML = "It's a draw.";
		newGame = -1;
		return;
	}else if(newGame > 0){
		switchPlayer();
		msgBoard.innerHTML = "CPU has played on column " + (c+1) + ". It is P1 turn";
	}


    //printCurrenState();

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
	updateScores();
	
}

function updateScores(){
	
	var s = document.getElementById('scores');
	while (s.firstChild) {
		s.removeChild(s.firstChild);
	}
    data = JSON.stringify({ size : { rows: parseInt(rows), columns: parseInt(cols)}});
    //console.log(JSON.stringify(data));
    var t="";
    fetch('http://twserver.alunos.dcc.fc.up.pt:8008/ranking',{
				method: 'POST', 
				body: data
			})
	.then(response => response.json())
	.then(//response => console.log(JSON.stringify(response))
		function(response){
		for(var v1 in response["ranking"]){
			let v = response["ranking"][v1];
			//console.log("Nick: " + v["nick"] + "| Jogos: " + v["games"] + "| Victorias: " + v["victories"] + );
			t = v["nick"] + " - " + v["games"] + " - " + v["victories"];
			s.appendChild(document.createTextNode(t));
			s.appendChild(document.createElement("br"));
		}
		
		//s.appendChild(document.createTextNode(t));
		}
		 );
    
}

function registLog() {

    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    //console.log(username , password);

    data = JSON.stringify({ nick: username , pass: password });
    //console.log(data);

    var t = 0;
    var v2;
    var v;
    fetch('http://twserver.alunos.dcc.fc.up.pt:8008/register',{
				method: 'POST', 
				body: data
			})
	.then(response => response.json())
	.then(
        function (response) {

            for (v2 in response) {
                if (v2 == "error") {
                    v = response[v2];
                    //alert(v2, v);
                    t = 1;
                    break;
                }
            }
            if (t == 0) {
                var logForm = document.getElementById("form");
                var logGame = document.getElementById("game");
                logForm.style.display = 'none';
                logGame.style.display = 'block';
            }
            else {
                alert(v2 + ": " + v);
            }
		}
	);
}

var boxArray = ['box1', 'box2'];
window.addEventListener('mouseup', function () {
	//document.getElementById('scores').innerHTML = "P1: " + points[0] + " </br>P2: " + points[1] + " </br>	CPU: " + points[2] + " </br>"
    
    
    for (var i = 0; i < boxArray.length; i++) {
        var box = document.getElementById(boxArray[i]);
        if (event.target != box && event.target.parentNode != box) {
            box.style.display = 'none';
        }
    }
});
