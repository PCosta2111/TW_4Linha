var d = 1;

function GetDescendants(node,p) {
	
	var desc = new Array(cols);

	var nPos;
	
	for(let i = 0 ; i < cols ; i++){
		desc[i] = new Array(cols);
		for(let l = 0 ; l < rows ; l++){
			desc[i][l] = new Array(cols);
			for(let c = 0 ; c < cols ; c++)
				desc[i][l][c] = node[l][c];
		}
	}
	
	
	for(let c=0; c < cols ; c++) {
		nPos = -1;
		//desc[c] = node.slice();
		//for(let i = 0 ; i < rows; i++) desc[c][i] = node[i].splice();
		//printMat(b);
		//printMat(desc[c]);
		//console.log(c);
		
		for(let l=0;  l<rows ; l++) {
			try{
				if( desc[c][l][c] != -1)
					break;
			}catch(e){ 
				//console.log("ERROR ON L = " + l  + " AND C = " + c);
				break;
			}
			nPos++;				
		}
		//desc[c].colPlayed=c;
		if(nPos != -1) 
			desc[c][nPos][c] = p;
		else
			desc[c] = null;
		
	}
	
	return desc;
}
	
function MinMax() {
	var v = 0;

	var maxP = 0;
	var max = Number.MIN_SAFE_INTEGER - 1;
	//state.depth=0;
	var succ = GetDescendants(b,playerTurn);
	//alert(succ[0][0][0]);
	for(let c=0; c<cols ; c++) {
		if(succ[c] != null){
			v = Min_Value(succ[c],0);
			//alert("Succ " + c + " is " + v); 
			if(v > max) {
				max = v;
				maxP = c;
			}
		}
	}
	
	return maxP;
	
}

function Max_Value(state,depth) {
	
	if(IsFinal(state) || depth >= d){
		//alert("Returned " + Utility(state,0) + " on max");
		//console.log("Max returned " + Utility(state,0));
		//printMat(state);
		return Utility(state,0);
	}
	
	succ = GetDescendants(state,0);
	
	var v = Number.MIN_SAFE_INTEGER - 1;
	for(let c = 0 ; c < cols ; c++) { 			
		if(succ[c] != null){
			v = Math.max(v, Min_Value(succ[c],depth+1)) ;
			//alert("v is " + v);
		}
	}
	//console.log("->Max returned " + v);
	return v;
}

function Min_Value(state,depth) {
	
	if(IsFinal(state) || depth >= d){
		//alert("Returned " + Utility(state,1) + " on min");
		//console.log("Min returned " + Utility(state,1));
		return Utility(state,1);
	}
	
	succ = GetDescendants(state,1);
	
	var v = Number.MAX_SAFE_INTEGER - 1;
	for(let c = 0 ; c < cols ; c++) { 			
		if(succ[c] != null){
			v = Math.min(v, Max_Value(succ[c],depth)) ;
			//alert("v is " + v);
		}
	}
	//console.log("->Min returned " + v);
	return v;
}


function Utility(b1,p) {
	if( IsFinal(b1) ) {
		if( p == 1) 
			return 512;
		else
			return -512;
		
	}else if( isDraw(b1) ){
		return 0;
	}
	
	
	var k;
	var sum=0;
	
	//6,7
	//rows,cols
	//Check horizontal
	for(let l=0; l< rows; l++) {
		for(let c=0; c< cols-3; c++) {
			
				console.log("( " + l + " , "  + c + ")");
			if((k = CompareThree(b1[l][c],b1[l][c+1],b1[l][c+2],b1[l][c+3])) != 0) {
				sum += k;
				
			}else if((k =  CompareTwo( b1[l][c],b1[l][c+1],b1[l][c+2],b1[l][c+3])) != 0){
					sum += k;
				
			}else if((k =  CompareOne( b1[l][c],b1[l][c+1],b1[l][c+2],b1[l][c+3])) != 0){
					sum += k;
			}
		}
	}
	
	// Check Vertical
	for(let l=0; l<rows-3; l++) {
		for(let c=0; c<cols; c++) {
			if((k= CompareThree(b1[l][c],b1[l+1][c],b1[l+2][c],b1[l+3][c])) != 0) {
				sum += k;
				
			}else if((k= CompareTwo(b1[l][c],b1[l+1][c],b1[l+2][c],b1[l+3][c])) != 0) {
						sum += k;
				
			}else if((k= CompareOne(b1[l][c],b1[l+1][c],b1[l+2][c],b1[l+3][c])) != 0) {
					sum += k;
			}
		}
	}
	
	// Check Diagonal
	for(let l = 0 ; l < rows-3 ; l++) {
		for(let c = l+1 ; c < cols-3 ; c++) {
			if((k= CompareThree(b1[l][c],b1[l+1][c+1],b1[l+2][c+2],b1[l+3][c+3])) != 0) {
				sum += k;
				
			}else if((k= CompareTwo(b1[l][c],b1[l+1][c+1],b1[l+2][c+2],b1[l+3][c+3])) != 0) {
					sum += k;
				
			}else if((k= CompareOne(b1[l][c],b1[l+1][c+1],b1[l+2][c+2],b1[l+3][c+3])) != 0) {
					sum += k;
			}
		}	
	}
	
	for(let l = 0 ; l < rows-3 ; l++) {
		for(let c = 0 ; c <= l ; c++) {
			if((k= CompareThree(b1[l][c],b1[l+1][c+1],b1[l+2][c+2],b1[l+3][c+3])) != 0) {
				sum += k;
				
			}else if((k= CompareTwo(b1[l][c],b1[l+1][c+1],b1[l+2][c+2],b1[l+3][c+3])) != 0) {
					sum += k;
				
			}else if((k= CompareOne(b1[l][c],b1[l+1][c+1],b1[l+2][c+2],b1[l+3][c+3])) != 0) {
					sum += k;
			}	
		}	
	}
	
	
	for(let l = 0 ; l < rows - 3 ; l++) {
		for(let c = 3 ; c <= (cols-2) - l ; c++) {
			if((k= CompareThree(b1[l][c],b1[l+1][c-1],b1[l+2][c-2],b1[l+3][c-3])) != 0) {
				sum += k;
				
			}else if((k= CompareTwo(b1[l][c],b1[l+1][c-1],b1[l+2][c-2],b1[l+3][c-3])) != 0) {
					sum += k;
				
			}else if((k= CompareOne(b1[l][c],b1[l+1][c-1],b1[l+2][c-2],b1[l+3][c-3])) != 0) {
					sum += k;
			}	
				
		}	
	}
	for(let l = 0 ; l < rows-3 ; l++) {
		for(let c = (cols-1)-l ; c <= (cols-1) ; c++) {
			if((k= CompareThree(b1[l][c],b1[l+1][c-1],b1[l+2][c-2],b1[l+3][c-3])) != 0) {
				sum += k;
				
			}else if((k= CompareTwo(b1[l][c],b1[l+1][c-1],b1[l+2][c-2],b1[l+3][c-3])) != 0) {
					sum += k;
				
			}else if((k= CompareOne(b1[l][c],b1[l+1][c-1],b1[l+2][c-2],b1[l+3][c-3])) != 0) {
					sum += k;
			}	
				
		}	
	}
	return -sum;
}

function IsFinal(b1){
	try{
		for(let l=0; l<rows; l++) {
			for(let c=0; c<cols-3; c++) {
					if( CompareFour(b1[l][c],b1[l][c+1],b1[l][c+2],b1[l][c+3])) 
						return true;
				
			}
		}
	}catch(e){}
		
	// Check Vertical
	try{
		for(let l=0; l<rows-3; l++) {
			for(let c=0; c<cols; c++) {
				if( CompareFour(b1[l][c],b1[l+1][c],b1[l+2][c],b1[l+3][c])) 
					return true;
			}
		}
	
	}catch(e){}
	
	try{
		// Check Diagonal
		for(let l = 0 ; l < rows-3 ; l++) {
			for(let c = l+1 ; c < cols-2 ; c++) {
				if( CompareFour(b1[l][c],b1[l+1][c+1],b1[l+2][c+2],b1[l+3][c+3])) 
					return true;
			}	
		}
	}catch(e){}
	
	try{
		for(let l = 0 ; l < rows-3 ; l++) {
			for(let c = 0 ; c <= l ; c++) {
				if( CompareFour(b1[l][c],b1[l+1][c+1],b1[l+2][c+2],b1[l+3][c+3])) 
					return true;
			}	
		}
	}catch(e){}
	
	try{
		for(let l = 0 ; l < rows-3 ; l++) {
			for(let c = 3 ; c <= (cols-2) - l ; c++) {
				if( CompareFour(b1[l][c],b1[l+1][c-1],b1[l+2][c-2],b1[l+3][c-3])) 
					return true;
					
			}	
		}
	}catch(e){}
	
	try{
		for(let l = 0 ; l < 3 ; l++) {
			for(let c = cols-1-l ; c <= (cols-1) ; c++) {
				if( CompareFour(b1[l][c],b1[l+1][c-1],b1[l+2][c-2],b1[l+3][c-3])) 
					return true;
			}	
		}
	}catch(e){}

	return false;
		
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
	
	
	
	//If it's here, then it's a draw
	//msgBoard.innerHTML = "It's a draw.";
	//newGame = -1;
}

function isDraw(b1){
	//Check for a draw
	for(let l = 0 ; l < rows ; l++){
		for(let c = 0 ; c < cols ; c++)
			if(b1[l][c] == -1)
				return false;
		
	}	
	return true;
}

function CompareFour(a,b,c,d){
	if( a == b && a == c && a== d && a != -1 && a != null){
		return true;
	}else{
		return false;
	}
}

function CompareThree(a,b,c,d) {
	if( (a == b && a == c && d == -1 && c != -1)  || (b == c && b == d && a == -1 && c != -1)) {
		if( b == 1 )
			return 50;
		else
			return -50;
	}else
		return 0;
}

function CompareTwo(a,b,c,d) {
	if(	( a == b && c == d  && d == -1 && b != -1 ) ||
		( b == c && a == d  && d == -1 && b != -1 ) ){
		if( b == 1 )
			return 10;
		else
			return -10;
	}
			
	if( c == d && b == a  && a == -1 && c != -1 ){
		if( c == 1 )
			return 10;
		else
			return -10;
	}else
		return 0;
		
		
}

function CompareOne(a,b,c,d) {
	if( b == c && c == d && b == -1 && a != -1 ) return (a == 1) ? 1 : -1;

	if( a == c && c == d && c == -1 && b != -1 ) return (b == 1) ? 1 : -1;
	
	if( b == a && a == d && d == -1 && c != -1 ) return (c == 1) ? 1 : -1;
	
	
	if ( b == c && c == a && a == -1 && d != -1 ) return (d == 1) ? 1 : -1;	
		else return 0;
}


function printMat(m){
	var t = "";
	for(let l = 0 ; l < rows ; l++){
		for(let c = 0 ; c < cols ; c++){
			t += m[l][c] + " , ";
		}
		t += "\n";
	}
	console.log(t);
	
}
