// Scripted By Adam Khoury in connection with the following video tutorial:
// http://www.youtube.com/watch?v=c_ohDPWmsM0

var new_memory_array = [];
var memory_values = [];
var memory_tile_ids = [];
var tiles_flipped = 0;
var game_started = false; 
var current_time = 0;
var timer;
//var time = '';
var current_level;
var url = "/game.json";
var current_object;
	
loadXMLDoc(url, function(object) {
	removeClasses('formContainer');
	current_object = object;
	//console.log(current_object);
	getLevels(object.levels);
	//var no_of_tiles = object.levels[0].tiles;
	var tiles = objectToArray(object.tiles);

	var radio_buttons = document.getElementsByName('level');
	//console.log(radio_buttons);
	var prev = null;
	for(var i = 0; i < radio_buttons.length; i++) {
    	radio_buttons[i].onclick = function() {
    		(prev)? prev.value :null;
        	if(this !== prev) {
            	prev = this;
        	}
        
        	current_level = getLevel(current_object, this.value);
        	getHighscore(current_object, 'highScore3', this.value);
        }
        
    }

    /* när man klickar på "starta spel" */
	document.getElementById('startGame').addEventListener('click', function() { 
		var levels = document.getElementsByName('level');
		for(var i = 0; i < levels.length; i++) {
		if(levels[i].checked) {
			level = levels[i].value;
			}
		}
		newBoard(tiles, level);
		//current_level = tiles;
		hideElement('formContainer');
		removeClasses('boardContainer');
	});

	/* när man klickar på "nästa nivå" */
	document.getElementById('nextLevel').addEventListener('click', function() {
		newBoard(tiles, current_level.nextlevel);
		//current_level = tiles;
		hideElement('endGameContainer');
		removeClasses('boardContainer');
	});
	current_level = getLevel(current_object, 4);
	getHighscore(current_object, 'highScore3');
	/*document.querySelector('[id^=tile_]').addEventListener('click', function() {
			alert(this.id);
	});*/
	
	//newBoard(2, tiles);
});
function loadXMLDoc(url, cb) {
   
	var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if(typeof cb === 'function') {
                cb(JSON.parse(xmlhttp.responseText));
            }
        }
    }

   xmlhttp.open("GET",url,true);
   xmlhttp.send();

}

//var memory_array = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H','I','I','J','J'];

/**
 * Shufflefunktion för vår array
 * @return {[type]} [description]
 */
Array.prototype.memory_tile_shuffle = function(){
    var i = this.length, j, temp;
    while(--i > 0){
        j = Math.floor(Math.random() * (i+1));
        temp = this[j];
        this[j] = this[i];
        this[i] = temp;
    }
}

function objectToArray(object) {
	var output_array = [];
	var length = Object.keys(object).length;
	for(var i = 0; i < length; i++) {
		output_array.push(object[i]);
	}
	return output_array;
}

/**
 * Rita ut spelplanen
 * @param  {Number} tiles Antalet brickor som ska ritas ut
 * @return {[type]}       [description]
 */
function newBoard(included_tiles, no_of_tiles) {

	var unique_tiles = no_of_tiles * (no_of_tiles / 2);
	var total_tiles = no_of_tiles * no_of_tiles;

	alert(total_tiles);
	var size = 100 / no_of_tiles; 

	/**
	 * Hur många brickor har vi vänt
	 * @type {Number}
	 */
	tiles_flipped = 0;
	/**
	 * Koden som ritar ut spelbrädet börjar blank
	 * @type {String}
	 */
	var output = '';

	/**
	 * Shuffla included_tiles med vår memory_tile_shuffle
	 */
    included_tiles.memory_tile_shuffle();

    /**
     * Hämta så många brickvärden som vår spelplan ska innehålla, lägg in varje två gånger
     */
    for(var i = 0; i < unique_tiles; i++){
		new_memory_array.push(included_tiles[i]);
		new_memory_array.push(included_tiles[i]);
	}

	/**
	 *	Shuffla vår new_memory_array
	 */
	new_memory_array.memory_tile_shuffle();

    /**
     * Rita ut varje bricka med en for-loop
     * @param  {Number} 	var i 	Börjar på noll, slutar på antalet brickor
     * @return {[type]}     [description]
     */
	for(var i = 0; i < new_memory_array.length; i++){
		output += '<div id="tile_'+i+'" style="width: '+size+'%; height: '+size+'%" onclick="memoryFlipTile(this,\''+new_memory_array[i]+'\')"></div>';
	}
	document.getElementById('memoryBoard').innerHTML = output;
}

/**
 * Vända en bricka
 * @param  {Object}	tile 	Brickan man vänder
 * @param  {Number} val  	Brickans värde - finns två av varje på brädet
 * @return {type} [description]
 */
function memoryFlipTile(tile,val){
	/* om det finns html i vår tile-variabel och det inte är klickat på två brickor... */
	if(tile.innerHTML == "" && memory_values.length < 2){
		if(game_started === false) {
			timer = setInterval(countTime, 1000);
			game_started = true;
		}

		/* gör brickans bakgrundsfärg till vit */
		tile.style.background = val;
		/* ta värdet i på brickan och rita ut det som HTML i boxen */
		tile.innerHTML = val;
		/* om det är första brickan som vänds av två: */
		if(memory_values.length == 0){
			/* lägg till värdet i memory_values */
			memory_values.push(val);
			/* lägg till brickans id i memory_tile_ids */
			memory_tile_ids.push(tile.id);
		/* om det är den andra brickan av två som vänds: */
		} else if(memory_values.length == 1){
			/* lägg till värdet i memory_values */
			memory_values.push(val);
			/* lägg till brickans id i memory_tile_ids */
			memory_tile_ids.push(tile.id);
			/* om de båda värdena som är lagrade i memory_values är lika: */
			if(memory_values[0] == memory_values[1]){
				/* öka värdet på tiles_flipped med två */
				tiles_flipped += 2;
				/* nollställ båda arrayerna memory_values och memory_tile_ids */
				memory_values = [];
            	memory_tile_ids = [];
				/* om hela brädet är tömt: */
				/* det ser vi genom att jämföra värdena på tiles_flipped och memory_array */
				if(tiles_flipped == new_memory_array.length){
					
					finishGame(current_object, current_level.tiles);
					/* nollställ html-elementet som spelplanen ligger i */
					//document.getElementById('memoryBoard').innerHTML = "";
					/* rita ut ett nytt bräde */
					//newBoard();
					

				}
			} else {
				setTimeout(flip2Back, 500);
			}
		}
	}
}

/**
 * Vända tillbaka brickorna om de är fel
 * @return {[type]} [description]
 */
function flip2Back(){
    // Flip the 2 tiles back over
    var tile_1 = document.getElementById(memory_tile_ids[0]);
    var tile_2 = document.getElementById(memory_tile_ids[1]);
    tile_1.style.background = 'red';
    tile_1.innerHTML = "";
    tile_2.style.background = 'red';
    tile_2.innerHTML = "";
    // Clear both arrays
    memory_values = [];
    memory_tile_ids = [];
}



//document.getElementById('startGame').addEventListener('click', gameStatus);

function gameStatus () { 
	if(game_started === false) {
		timer = setInterval(countTime, 1000);
		game_started = true;
	} // när spelet är slut : game_started = false; clearInterval(timer); 
}

function countTime() {
	current_time++;
	var time = '';
	var minutes = Math.floor(current_time/60);
	var remaining_seconds = current_time%60;

	if(minutes < 0) {
		if(remaining_seconds < 10) {
			time = '00:0' + remaining_seconds;
		} else {
			time = '00:' + remaining_seconds;
		} 
	} else {
		if(remaining_seconds < 10) {
			if(minutes < 10) { 
				time = '0' + minutes + ':0' + remaining_seconds;
			} else {
				time = minutes + ':0' + remaining_seconds;
			}
		} else {
			if(minutes < 10) {
				time = '0' + minutes + ':' + remaining_seconds;
			} else {
				time = minutes + ':' + remaining_seconds; 
			}

		} 
	}

	document.getElementById('timer').innerHTML = time;
	return time;
}

function getLevels(object) {

	var output = '';
	var length = Object.keys(object).length;

	for(var i = 0; i < length; i++) {
		if (i === 1) {

			var checked = 'checked="checked"';
		} else {

			var checked = '';
		}

		output += '<label><input type="radio" name="level" value="'+object[i].tiles+'" '+checked+'> '+object[i].name+'</label>';
	}

	document.getElementById('levels').innerHTML = output;

}

function hideElement(id){
	document.getElementById(id).className='hide';
}

function removeClasses(id){
	document.getElementById(id).className='';
}

function finishGame(object, tiles){
	
	//console.log(object);
	/* nollställ spelplanen */
	document.getElementById('memoryBoard').innerHTML = '';
	/* nollställ memory arrays */
	new_memory_array = [];
	memory_values = [];
	/* game status sätts till false för att kunna starta nytt spel */
	game_started = false; 
	/* timer-funktionen stannar */					
	clearInterval(timer); 
	hideElement('boardContainer');
	removeClasses('endGameContainer');
	if(isTimeOnHighscore(current_level.highscore, current_time)) {
		// här ska det poppa upp så man kan skriva in sitt namn som sen sparas
		document.getElementById('isTimeOnHighScore').innerHTML = 'You did it, awsm!';
		removeClasses('highScoreContainer');
	}
	else {
		// här ska det visas att du inte var bra nog för highscore
		document.getElementById('isTimeOnHighScore').innerHTML = 'Sorry katten det här gick segt...';
	}
	current_time = 0;
	getHighscore(object, 'highScore10', current_level.tiles, 10);
}

 function getLevel(object, num){
 	
	var length = Object.keys(object.levels).length;
	var name;
	var tiles;
	var nextlevel = false;

	for(var i = 0; i < length; i++){
		if(object.levels[i].tiles === Number(num)) {
			name 	= object.levels[i].name;
			tiles 	= object.levels[i].tiles;
			highscore = object.highscore[tiles] ? object.highscore[tiles] : [];
			nextlevel = object.levels[Number(i+1)] ? object.levels[i+1].tiles : false;
		}
	}

	obj = {
		'name': name,
		'tiles': tiles,
		'highscore': highscore,
		'nextlevel': nextlevel
	}

	console.log(obj);
	return obj;
}

function getHighscore(object, elementId, level, rows) {

	level = typeof level !== 'undefined' ? level : 4;
	rows = typeof rows !== 'undefined' ? rows : 3;

	/* finns en highscore för svårighetsgraden hämtas den, annars gör vi en tom array */
	var highscore = object.highscore[level] ? object.highscore[level] : [];
	highscore = highscore.sort(compare);
	/* är antalet rader i arrayen mindre än antalet rader vi vill hämta tar vi det värdet, annars vårt förvalda värde */
	var length = Object.keys(highscore).length < rows ? Object.keys(highscore).length : rows;
	
	var output = '';

	for(var i = 0; i < length; i++) {
			output += '<tr><td>'+highscore[i].name+'</td><td>'+highscore[i].time+'</td></tr>';
	}

	document.getElementById(elementId).innerHTML = output;

	var level_spans = document.getElementsByClassName('levelName');

	for(var i = 0; i < level_spans.length; i++) {
		level_spans[i].innerHTML = current_level.name;
	}

}

function compare(a,b) {
	if (a.time < b.time) { 
    	return -1;
	} else if (a.time > b.time) { 
		return 1;
	} else {  
    	return 0;
	}
}

function isTimeOnHighscore(highscoreList, myTime) {
	var tempHighscoreList = highscoreList ? highscoreList : [];
	var tempObj = {
		name: '',
		time: myTime
	};

	tempHighscoreList.push(tempObj);
	tempHighscoreList = tempHighscoreList.sort(compare).slice(0, 10);

	var is_highscore = false;
	var length = Object.keys(tempHighscoreList).length

	for(var i = 0; i < length; i++) {
		is_highscore = tempHighscoreList[i].time === tempObj.time ? true : false;
		if(is_highscore) return is_highscore;
	}

	return is_highscore;

}















