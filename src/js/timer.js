var game_started = false; 
var current_time = 0;
var timer;

document.getElementById('startGame').addEventListener('click', gameStatus);

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
}