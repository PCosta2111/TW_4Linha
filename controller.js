var b = [];
var rows,cols;
var playerTurn; //0 : ME   1 : OPPONENT


function createBoard(){
	rows = document.getElementById("rows").value;
   
	cols = document.getElementById("cols").value;
	
	var radios = document.getElementsByName('first');

	
	alert(radios[0].checked);
	alert(radios[1].value);
	
	if (radios[0].checked && radios[0].value == "f_me")
		playerTurn = 0;
	else
		playerTurn = 1;
	
   
	var r;
	var text = "";
	var rLine = [];
	
	for (let c = 0; c < cols; c++) {
		text += "<div class = \"column\">";
		text += "<div class = \"placer\" onclick='dropCoin(" + c + ")'></div>";
		for (r = 0; r < rows; r++) {
			rLine.push(-1);
			text += "<div id = '" + r + "c" + c + "' class = \"cell\"></div>";
		}
		b.push(rLine);
		rLine = [];
		text += "</div>";
	}
	document.getElementById("board").innerHTML = text;
	printCurrenState();
	
}

function printCurrenState(){
	
	var text="";
	for(let l=0; l < rows; l++){
		text += "<p>";
		for(let c=0; c < cols; c++){
			text += " " + b[l][c];			
		}
		text+="</p>";
	}
	document.getElementById("currentState").innerHTML = text;
	
}

function dropCoin(c){
	var drop;
	if( b[0][c] != -1){
		alert("That column is full");
	}else{
		let x = -1;
		for(let i=1; i < rows; i++){
			if( b[i][c] != -1){
				x=1;
				drop = i-1;
				break;
			}
		}
		if( x == -1)
			drop = rows-1;
		
		b[drop][c] = playerTurn;
		
		if(playerTurn == 0)
			document.getElementById(drop + "c" + c).style.backgroundColor = "red";
		else
			document.getElementById(drop + "c" + c).style.backgroundColor = "yellow";
	
		
		switchPlayer();	
	}
	printCurrenState();
	
}

function switchPlayer(){
	if(playerTurn == 1)
		playerTurn = 0;
	else
		playerTurn = 1;
}

var boxArray = ['box1','box2'];
window.addEventListener('mouseup', function(){
	for(var i=0; i < boxArray.length; i++){
		var box = document.getElementById(boxArray[i]);
		if(event.target != box && event.target.parentNode != box){
			box.style.display='none';
		}
	}
});