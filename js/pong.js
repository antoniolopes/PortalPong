
var LEFT_RACKET_X = 30;
var RIGHT_RACKET_X = 570;

var RACKET_WIDTH = 5;
var RACKET_HEIGHT = 50;
var RACKET_SPEED = 3;
var RACKET_THREAD_DELAY = 20;

var DRAW_THREAD_DELAY = 20;

var BALL_SIZE = 10;
var BALL_THREAD_DELAY = 5;

var OBJECTS_COLOR = "#aaa";
var BLUE_PORTAL_COLOR = "#0059ff";
var ORANGE_PORTAL_COLOR = "#ffa500";
var MIDLINE_COLOR = "#777";

var MIDLINE_WIDTH = 1;

var PORTAL_WIDTH = 2;

var P1_KUP = 'Q'.charCodeAt();
var P1_KDW = 'A'.charCodeAt();
var P2_KUP = 'P'.charCodeAt();
var P2_KDW = 'L'.charCodeAt();
var START_KEY = ' '.charCodeAt();

var map = {P1_KUP: false, P1_KDW: false, P2_KUP: false, P2_KDW: false, START_KEY: false};

var left_racket_pos, right_racket_pos, ball_pos_x, ball_pos_y, ball_dir_x, ball_dir_y, ball_thread;

var player1_score = 0, player2_score = 0;

var ball_moving = false;

$(document).ready(function() {
	$('#info').center();
	$('#more_info_button').click(showInstructions);
	$('#bgoverlay,#close_info_button').click(closeInstructions);
	setDefaultGameValues();
	setKeyHandlers();
	drawGame();
	managePlayerKeyPresses();
});

function showInstructions(){
	$('#bgoverlay').fadeIn(100, function(){
		$('#info').fadeIn(100);
	});
}

function closeInstructions(){
	$('#info').fadeOut(100, function(){
		$('#bgoverlay').fadeOut(100);
	});
}

function setDefaultGameValues(){
	left_racket_pos = $('canvas').height() / 2 - RACKET_HEIGHT / 2;
	right_racket_pos = $('canvas').height() / 2 - RACKET_HEIGHT / 2;
	ball_pos_x = $('canvas').width() / 2;
	ball_pos_y = $('canvas').height() / 2;
}

function drawGame(){
	$("canvas").clearCanvas();
	// Draw middle line
	drawLine($("canvas").width()/2, 0, $("canvas").width()/2, $("canvas").height(), MIDLINE_COLOR, MIDLINE_WIDTH);
	// Draw left racket
	drawLine(LEFT_RACKET_X, left_racket_pos, LEFT_RACKET_X, left_racket_pos + RACKET_HEIGHT, OBJECTS_COLOR, RACKET_WIDTH);
	// Draw right racket
	drawLine(RIGHT_RACKET_X, right_racket_pos, RIGHT_RACKET_X, right_racket_pos + RACKET_HEIGHT, OBJECTS_COLOR, RACKET_WIDTH);
	// Draw blue portal
	drawLine($('canvas').width() / 2 - PORTAL_WIDTH, left_racket_pos, $('canvas').width() / 2 - PORTAL_WIDTH, left_racket_pos + RACKET_HEIGHT, BLUE_PORTAL_COLOR, PORTAL_WIDTH);
	// Draw orange portal
	drawLine($('canvas').width() / 2 + PORTAL_WIDTH, right_racket_pos, $('canvas').width() / 2 + PORTAL_WIDTH, right_racket_pos + RACKET_HEIGHT, ORANGE_PORTAL_COLOR, PORTAL_WIDTH);
	// Draw ball
	drawBall();
	// Update scores
	updateScores();
	// Set timeout to draw the game in the future
	setTimeout(drawGame, DRAW_THREAD_DELAY);
}

function updateScores(){
	$('#p1score').html(player1_score);
	$('#p2score').html(player2_score);
}

function managePlayerKeyPresses(){
	if(map[P1_KUP])
		left_racket_pos -= (left_racket_pos + RACKET_SPEED >= 0) ? RACKET_SPEED: 0;
	if(map[P1_KDW])
		left_racket_pos += (left_racket_pos + RACKET_HEIGHT - RACKET_SPEED <= $('canvas').height()) ? RACKET_SPEED: 0;
	if(map[P2_KUP])
		right_racket_pos -= (right_racket_pos + RACKET_SPEED >= 0) ? RACKET_SPEED: 0;
	if(map[P2_KDW])
		right_racket_pos += (right_racket_pos + RACKET_HEIGHT - RACKET_SPEED <= $('canvas').height()) ? RACKET_SPEED: 0;
	setTimeout(managePlayerKeyPresses, RACKET_THREAD_DELAY);
}

function manageGameStart(){
	//console.log(map[START_KEY]);
	if(map[START_KEY] && !ball_moving){
		//console.log("Starting...");
		ball_dir_x = Math.random() < 0.5 ? -1 : 1;
		ball_dir_y = Math.random() < 0.5 ? -1 : 1;;
		ball_pos_x = $('canvas').width() / 2;
		ball_pos_y = $('canvas').height() / 2;
		ball_moving = true;
		moveBall();
	}
}

function moveBall(){
	//console.log("Moving ball: (" + ball_pos_x + "," + ball_pos_y + ")");
	ball_pos_x += ball_dir_x;
	ball_pos_y += ball_dir_y;

	// If the ball touches the top or the bottom of the canvas
	if (ball_pos_y <= 0 || ball_pos_y >= $('canvas').height() - BALL_SIZE / 2)
		ball_dir_y = -ball_dir_y;

	// If the ball touches the right racket
	if (ball_pos_x == RIGHT_RACKET_X - BALL_SIZE / 2 && ball_pos_y >= right_racket_pos - BALL_SIZE / 2 && ball_pos_y <= right_racket_pos + RACKET_HEIGHT + BALL_SIZE / 2)
		ball_dir_x = -ball_dir_x;
	
	// If the ball touches the left racket
	if (ball_pos_x == LEFT_RACKET_X + BALL_SIZE / 2 && ball_pos_y >= left_racket_pos - BALL_SIZE / 2 && ball_pos_y <= left_racket_pos + RACKET_HEIGHT + BALL_SIZE / 2)
		ball_dir_x = -ball_dir_x;

	// If the ball touches the blue portal
	if (ball_dir_x > 0 && ball_pos_x == $('canvas').width() / 2 - RACKET_WIDTH - BALL_SIZE / 2 && ball_pos_y >= left_racket_pos - BALL_SIZE / 2 && ball_pos_y <= left_racket_pos + RACKET_HEIGHT + BALL_SIZE / 2){
		ball_pos_y = right_racket_pos + (ball_pos_y - left_racket_pos);
		ball_pos_x = $('canvas').width() / 2 + RACKET_WIDTH + BALL_SIZE;
	}

	// If the ball touches the orange portal
	if (ball_dir_x < 0 && ball_pos_x == $('canvas').width() / 2 + RACKET_WIDTH + BALL_SIZE / 2 && ball_pos_y >= right_racket_pos - BALL_SIZE / 2 && ball_pos_y <= right_racket_pos + RACKET_HEIGHT + BALL_SIZE / 2){
		ball_pos_y = left_racket_pos + (ball_pos_y - right_racket_pos);
		ball_pos_x = $('canvas').width() / 2 - RACKET_WIDTH - BALL_SIZE;
	}

	// If the ball goes to the left of the left racket (player 1 scores)
	if (ball_pos_x < LEFT_RACKET_X - BALL_SIZE){
		player2_score++;
		ball_moving = false;

	// If the ball goes to the right of the of the right racket (player 2 scores)
	}else if(ball_pos_x > RIGHT_RACKET_X + BALL_SIZE){ 
		player1_score++;
		ball_moving = false;

	// Continue moving the ball
	}else
		ball_thread = setTimeout(moveBall, BALL_THREAD_DELAY);
}

function drawLine(x_1, y_1, x_2, y_2, color, stroke_width){
	$("canvas").drawLine({
		strokeStyle: color,
		strokeWidth: stroke_width,
		x1: x_1, y1: y_1,
	  	x2: x_2, y2: y_2
	});
}

function drawBall(){
	$("canvas").drawEllipse({
  		fillStyle: OBJECTS_COLOR,
  		x: ball_pos_x, y: ball_pos_y,
  		width: BALL_SIZE, height: BALL_SIZE
	});
}

function setKeyHandlers(){
	$(document).keydown(function(e) {
        map[e.keyCode] = true;
	}).keyup(function(e) {
		if(e.keyCode != START_KEY)
        	map[e.keyCode] = false;
        else
        	manageGameStart();
	});
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}