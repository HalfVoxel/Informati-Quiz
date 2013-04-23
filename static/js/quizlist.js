var socket = new Socket("quizlist_ws");

function newGame () {
	socket.write("new-game");
}