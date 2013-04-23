var socket = new WebSocket("ws://"+window.location.hostname+":8888/quizrt");

function send(data){
	socket.send(JSON.stringify(data));
}

socket.onopen = function() {
	console.log("Connected socket");
};

socket.onmessage = function(msg){
	msg = JSON.parse(msg.data);
	var type = msg.type;
	var payload = msg.payload;
	switch(type){
		case "question":
			loadQuestion(payload);
			break;
		case "feedback":
			feedback(payload);
			break;
		case "finished":
			finished(payload);
			break;
	}
};

function finished(payload){
	$("#question").hide();
	alert("You got " + correct + " out of " + totalQuestions);
	correct = 0;
	totalQuestions = 0;
	$("#start_quiz").show();
}

function loadQuestion(data){
	$("#question_text").text(data.q);
	for(var i = 0; i<=3; ++i){
		$("#alt"+i).text(data.a[i]);
	}
	if(data.desc){
		$("#question_desc").text(data.desc);
	} else {
		$("#question_desc").text("");
	}
}

var totalQuestions = 0;
var correct = 0;

function feedback(payload){
	totalQuestions++;
	console.log("Got feedback", payload);
	if(payload == "ac"){
		correct++;
	} else if(payload == "wa") {
	}
	setStatus();
	fetchQuestion();
}

function setStatus(){
	$("#correct_qs").text(correct);
	$("#total_qs").text(totalQuestions);
}

function fetchQuestion(){
	send({type: "fetch_question", payload: ""});
}

function startQuiz(){
	totalQuestions = 0;
	correct = 0;
	$("#start_quiz").hide();
	$("#question").show();
	setStatus();
	fetchQuestion();
}

function answer(id){
	console.log("Sending answer", id);
	send({type: "answer", payload: id});
}
