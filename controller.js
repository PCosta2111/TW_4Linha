var b = [];
var newGame;
var rows, cols;
var playerTurn; //0 : ME   1 : OPPONENT
var opp; // 0 : VS PLAYER   ;   1: VS CPU

var points = [0,0,0]; // 0 - P1    1 - P2    2 - CPU
var pointsTXT = document.getElementById("scores");							

var msgBoard;		

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

        if(checkWinners()){
			alert("Winner winner chicken dinner");
			newGame = -1;
		}
        switchPlayer();
    }
    printCurrenState();
	
	if(opp == 1){
		cpuDropCoin();
		if(checkWinners()){
			alert("Winner winner bots for dinner");
			newGame = -1;
		}
	}else{
		msgBoard.innerHTML = "It is P" + (playerTurn+1) + " turn";
	}


}

function cpuDropCoin() {
	
	if(newGame < 0)
		return;

    var c = selectRand(cols);
    var drop;
    if (b[0][c] != -1) { }
    else {
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
		
        checkWinners();
        switchPlayer();
		
		msgBoard.innerHTML = "CPU has played on column " + (c+1) + ". It is P1 turn";
    }


    printCurrenState();

}

function checkWinners() {

	for(let l=0; l < rows; l++) {
		for(let c=0; c < cols-3; c++) {
				if( CompareFour(b[l][c],b[l][c+1],b[l][c+2],b[l][c+3])) 
					return true;
			
		}
	}
	// Check Vertical
	for(let l=0; l < rows-3; l++) {
		for(let c=0; c < cols; c++) {
			if( CompareFour(b[l][c],b[l+1][c],b[l+2][c],b[l+3][c])) 
				return true;
		}
	}
	
	// Check Diagonal
	for(let l = 0 ; l < rows-3 ; l++) {
		for(let c = l+1 ; c < cols-3 ; c++) {
			if( CompareFour(b[l][c],b[l+1][c+1],b[l+2][c+2],b[l+3][c+3])) 
				
				return true;
		}	
	}
	
	for(let l = 0 ; l < rows-3 ; l++) {
		for(let c = 0 ; c <= l ; c++) {
			if( CompareFour(b[l][c],b[l+1][c+1],b[l+2][c+2],b[l+3][c+3])) 
				return true;
		}	
	}
	
	
	for(let l = 0 ; l < rows-3 ; l++) {
		for(let c = 3 ; c <= cols - 2 - l ; c++) {
			if( CompareFour(b[l][c],b[l+1][c-1],b[l+2][c-2],b[l+3][c-3])) 
				return true;
				
		}	
	}
	/*for(int l = 0 ; l < rows-3 ; l++) {
		for(int c = 6-l ; c <= 6 ; c++) {
			if( CompareFour(state.board[l][c],state.board[l+1][c-1],state.board[l+2][c-2],state.board[l+3][c-3])) 
				return true;
		}	
	}*/
}

function CompareFour(a,b,c,d){
	if( a == b == c == d && a != -1){
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

var boxArray = ['box1', 'box2'];
window.addEventListener('mouseup', function () {
    for (var i = 0; i < boxArray.length; i++) {
        var box = document.getElementById(boxArray[i]);
        if (event.target != box && event.target.parentNode != box) {
            box.style.display = 'none';
        }
    }
});