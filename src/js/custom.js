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

	/* ta bort eventuella klasser från formContainer */
	removeClasses('formContainer');

	/* låt variabeln current_object bli ett alias för vårt json-objekt */
	current_object = object;
	
	/* hämta alla våra nivåer och rita ut dem som radio buttons */
	makeLevelRadioButtons(object.levels);

	/* sätt current level till "Easy" */
	current_level = getLevel(current_object, 4);

	/* hämta alla brickor som finns lagrade i vårt json-objekt */
	var tiles = objectToArray(current_object.tiles);

	/* hämta alla radio buttons till en array */
	var radio_buttons = document.getElementsByName('level');
	
	/* en variabel som fördefinierat är noll för att vara tom */
	var prev = null;

	/* för varje radio button */
	for(var i = 0; i < radio_buttons.length; i++) {

		/* när man klickar på den */
    	radio_buttons[i].onclick = function() {

    		/* alltså, fan vet vad som händer här... witchcraft */
    		(prev) ? prev.value : null;
        	if(this !== prev) {
            	prev = this;
        	}
        
        	/* sätt current_level till den markerade radioknappens nivå */
        	current_level = getLevel(current_object, this.value);

        	/* hämta highscore för den markerade radioknappens nivå */
        	getHighscore(current_object, 'highScore3', this.value);
        }
        
    }

    /* när man klickar på "starta spel" */
	document.getElementById('startGame').addEventListener('click', function() {
		/* hämta alla radio buttons */ 
		var levels = document.getElementsByName('level');
		/* loopa igenom dem */
		for(var i = 0; i < levels.length; i++) {
			/* om en är checkad ska "levels" få dess värde, aka antalet tiles */
			if(levels[i].checked) {
				level = levels[i].value;
			}
		}

		/* newBoard får alla tiles som ska ritas ut från json samt hur många brickor som ska vara på en rad */
		newBoard(tiles, level);
		
		/* göm formContainer */
		hideElement('formContainer');

		/* visa boardContainer */
		removeClasses('boardContainer');
	});

	/* när man klickar på "nästa nivå" */
	document.getElementById('nextLevel').addEventListener('click', function() {
		
		/* newBoard for alla tiles och hur antalet tiles för nästa bana, som lagrats i current_level.nextlevel */
		newBoard(tiles, current_level.nextlevel);
		
		/* vi sätter current_level till nästa nivå */
		current_level = getLevel(current_object, current_level.nextlevel);

		/* göm endGameContainer */
		hideElement('endGameContainer');

		/* visa boardContainer */
		removeClasses('boardContainer');
	});

	/* när man klickar på "nästa nivå" */
	document.getElementById('sendAlias').addEventListener('click', function() {
		
		saveToFile(current_level.highscore, current_object);
		
	});

	/* hämta highscore för förstasidan, alla parametrar för det är förberedda i funktionen */
	getHighscore(current_object, 'highScore3');

});

/**
 * Funktion för att läsa in externa filer och returnera resultatet som JSON
 * @param  {string}   	url - filen som ska läsas in
 * @param  {object} 	cb  - funktionen som håller objektet
 * @return {object}     ett objekt
 */
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
		output += 
			'<div class="tile" id="tile_'+i+'" style="width: '+size+'%; height: '+size+'%" onclick="memoryFlipTile(this,\''+new_memory_array[i]+'\')">' +
			'<div class="flipper">' +
				'<div class="front">' +
					//<!-- front content -->
				'</div>' +
				'<div class="back" style="background: url(px/'+new_memory_array[i]+'.jpg)">' +
					//<!-- back content -->
				'</div>' +
			'</div>' +
			'</div>';
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
	if(!tile.hasAttribute('data-flipped') && memory_values.length < 2){
		if(game_started === false) {
			timer = setInterval(countTime, 1000);
			game_started = true;
		}

		tile.setAttribute('data-flipped', true);

		/* gör brickans bakgrundsfärg till vit */
		if(val[0] === '#') {
			//tile.style.background = val;
		}
		else {
			//tile.style.background = 'url(px/'+val+'.jpg)';
		}
		/* ta värdet i på brickan och rita ut det som HTML i boxen */
		//tile.innerHTML = val;
		//tile.innerHTML = 
			
		
		var flipper = tile.querySelector('.flipper');
		flipperShow(flipper);

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
				/* lägg till fadeklass på brickorna */
            	var tile_1 = document.getElementById(memory_tile_ids[0]);
    			var tile_2 = document.getElementById(memory_tile_ids[1]);
    			fadeTile(tile_1);
    			fadeTile(tile_2);
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
				setTimeout(flip2Back, 1500);
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
    tile_1.removeAttribute('data-flipped');
    tile_2.removeAttribute('data-flipped');
    var flipper_1 = tile_1.querySelector('.flipper');
    var flipper_2 = tile_2.querySelector('.flipper');
    flipperHide(flipper_1);
    flipperHide(flipper_2);
    //tile_1.style.background = 'transparent';
    //tile_1.innerHTML = "";
    //tile_2.style.background = 'transparent';
    //tile_2.innerHTML = "";
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

function makeLevelRadioButtons(object) {

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

function flipperShow(e){
	e.className = 'flipper animate';
}

function flipperHide(e){
	e.className = 'flipper';
}

function fadeTile(e) {
	e.className = 'tile fadeout';
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
	if(current_level.highscore = isTimeOnHighscore(current_level.highscore, current_time)) {

		// här ska det poppa upp så man kan skriva in sitt namn som sen sparas
		document.getElementById('isTimeOnHighScore').innerHTML = 'You did it in '+current_time+' seconds. That\'s good enough for the highscore board!';
		removeClasses('highScoreContainer');
		removeClasses('endGameHighScoreForm');
	}
	else {
		// här ska det visas att du inte var bra nog för highscore
		removeClasses('playAgain');
		document.getElementById('isTimeOnHighScore').innerHTML = 'Sorry kitten, but your time of '+current_time+' seconds is waaaaaay to slow...';
	}
	current_time = 0;
}

/**
 * Hämtar allt som har med en nivå att göra
 * @param  {object} object - hela vårt JSON-objekt
 * @param  {number} num    - antalet tiles som vår nivå ska innehålla
 * @return {object}        - ett objekt med namn, tiles, highscore och ev. nästa nivå
 */
 function getLevel(object, num){
 	
 	/* hur många nivåer det finns */
	var length = Object.keys(object.levels).length;

	/* tomma variabler som används sen */
	var name;
	var tiles;
	var nextlevel = false;

	/* för varje nivå */
	for(var i = 0; i < length; i++){
		/* om antalet tiles på nivån motsvarar vår variabel "num" */
		if(object.levels[i].tiles === Number(num)) {

			/* lägg in nivåns info i variabler */
			name 	= object.levels[i].name;
			tiles 	= object.levels[i].tiles;

			/* hämta highscoren som hör till nivån */
			highscore = object.highscore[tiles] ? object.highscore[tiles] : [];

			/* kolla om det finns en nästa nivå, annars sätts den till false */
			nextlevel = object.levels[Number(i+1)] ? object.levels[i+1].tiles : false;
		}
	}

	/* spara allt i ett objekt */
	obj = {
		'name': name,
		'tiles': tiles,
		'highscore': highscore,
		'nextlevel': nextlevel
	}

	/* returnera objektet */
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
		name: false,
		time: myTime
	};

	tempHighscoreList.push(tempObj);
	tempHighscoreList = tempHighscoreList.sort(compare).slice(0, 10);

	var is_highscore = false;
	var length = Object.keys(tempHighscoreList).length;

	for(var i = 0; i < length; i++) {
		//is_highscore = tempHighscoreList[i].time === tempObj.time && !tempObj.name ? true : false;
		if(tempHighscoreList[i].time === tempObj.time && !tempObj.name) {
			is_highscore = true;
		}
		if(is_highscore) return tempHighscoreList;
	}

	return is_highscore;

}

function saveToFile(highscore, object) {

	// läsa av namnet man skrivit in i input
	var newAlias = document.getElementById('alias').value;
	
	// loopa igenom newHighscoreList och lägga till namnet på den rad där det är tomt
	var length = Object.keys(highscore).length;
	for(var i = 0; i < length; i++) {
		if(!highscore[i].name) {
			highscore[i].name = newAlias;
		}
	}

	// Byta ut befintlig highscoreList i objektet
	object.highscore[current_level.tiles] = highscore;

	// spara ner objektet via ajax och php till filen game(2).json
	var ajax = new XMLHttpRequest();
	ajax.open("POST", "saveobject.php", true);
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	object_json_string = JSON.stringify(object);
	ajax.send('object='+object_json_string);

	// dölj input och visa highscore
	/* göm endGameContainer */
	hideElement('endGameHigscoreForm');
	hideElement('endGameHigscore');

	// rita ut rätt highscore
	getHighscore(object, 'highScore10', current_level.tiles, 10);

	/* visa boardContainer */
	removeClasses('endGameHighscore');

}

document.getElementById('mainMenu').addEventListener('click', function() {

		removeClasses('formContainer');

		hideElement('endGameContainer');

});








