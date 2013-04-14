
var quizdata = {
  "categories": [
    "hardware",
    "web",
    "mobile",
    "cs",
    "software",
    "os",
    "languages",
    "history"
  ],
  "questions": [
    {
      "q": "?",
      "a": [
        "",
        "",
        "",
        ""
      ],
      "cat": ""
    },
    {
      "q": "What does <xmp><b><i></b></i></xmp> parse as in HTML?",
      "a": [
        "<xmp><b><i></i></b><i></i></xmp>",
        "<xmp><b><i></i></b><i></i></xmp> in quirks mode, else <xmp><b><i></i></b></xmp>",
        "<xmp><b><i></i></i></xmp>",
        "Syntax error"
      ],
      "desc": "<link to spec>",
      "cat": "web"
    },
    {
      "q": "What does <xmp>document.domain</xmp> do in JavaScript?",
      "a": [
        "Gets and sets the origin",
        "Gets the origin",
        "Gets the topmost domain",
        "Gets the document XML namespace"
      ],
      "desc": "<link>",
      "cat": "web"
    },
    {
      "q": "What does the following do in JavaScript?\n<xmp>try {\n\treturn 1;\n} finally {\n\treturn 2;\n}</xmp>",
      "a": [
        "Return 2",
        "Return 1",
        "Runtime error",
        "Syntax error"
      ],
      "cat": "languages"
    },
    {
      "q": "What is the following an example of in Haskell:\n<xmp>f = map (flip mod 13)</xmp>",
      "a": [
        "Pointfree style",
        "Pointless style",
        "Pointful style",
        "Pointwire style"
      ],
      "cat": "languages",
      "comm": "Gangnam style?"
    }
 ]};
var infquiz = function () {	
}

infquiz.solved = 0;
infquiz.answered = 0;
infquiz.currentQuestionIndex = 0;

/** Shuffles an array of unique values in place and returns the resulting index of the first element.
	NaNs are not allowed in the array */
function shuffle (arr) {
	var j=0;
	var tmp = arr[0];
	for (var i = arr.length-1,q;i >= 0;i--) { j = (Math.random()*(i+1))|0; q = arr[i]; arr[i] = arr[i-j]; arr[i-j] = q; }
	for (var i =0; i<arr.length;i++) if (arr[i] == tmp) return i;
	throw "NaNInArrayException";
}

infquiz.setupQuestions = function () {
	infquiz.totalQuestions = quizdata.questions.length;

	var st = $("<div id='qa-progress'></div>");
	var ul = $("<ul></ul>");
	
	for (var i =0;i<infquiz.totalQuestions;i++) {
		$("<li id='qa-statusbar-"+i+"'></li>").appendTo (ul);
	}

	ul.appendTo(st);
	st.appendTo ($("#question-wrapper"));

	$("<div id='qa-status'></div>").appendTo($("#question-wrapper"));
}

infquiz.showQuestion = function (qindex) {
	console.log (qindex);

	infquiz.currentQuestionIndex = qindex;
	infquiz.currentQuestion = quizdata.questions[qindex];
	var q = infquiz.currentQuestion;

	var wrapper = $("#question-wrapper");

	var b = $("<form role='dialog' data-type='action' id='question-dialog'></form>").appendTo (wrapper);

	$("<header>").addClass("question").html(q.q).appendTo (b);
	var ul = $("<ul class='btn-list small-block-grid-2 large-block-grid-4'>").appendTo(b);
	

	var answers = q.a.slice();
	infquiz.corrans = shuffle(answers);

	for (var i=0;i<answers.length;i++) {
		var j = i;
		var btn = $("<li class='btn-wrapper'><a class='btn-answer button radius' href='#'><span>" + answers[i] + "</span></li>");
		btn.click (function(i) {return function (e) {infquiz.answerQuestion(i); e.preventDefault ();}}(i));
		btn.appendTo(ul);
	}

	//$("<div class='qa-status'><p>" + infquiz.solved + " of " + infquiz.answers);
	infquiz.prettify();

}
infquiz.answerQuestion = function (index) {
	console.log ("Answered " + index);

	$(".btn-list").fadeOut('fast', function () { infquiz.showAnswer (index); });
	//$("#question-wrapper").fadeOut ('slow', );
}

infquiz.nextQuestion = function () {
	var g = $("#answer-group");
	g.add ("#question-dialog");

	var fn = function () {
		$("#answer-group").remove();
		$("#question-dialog").remove();
		infquiz.showQuestion (infquiz.currentQuestionIndex+1);
	};

	if (g.length > 0) g.fadeOut('fast', fn);
	else fn();
}

infquiz.showAnswer = function (index) {

	var ansgroup = $("<div id='answer-group'></div>");
	var anstext = infquiz.currentQuestion.a[0];
	if (anstext.indexOf('\n') != -1 || anstext.indexOf('<xmp>') != -1 || anstext.indexOf('<br>') != -1) {
		var ans = $("<div class='question-answer'>The answer was<br>"+anstext +"</div>");
	} else {
		var ans = $("<div class='question-answer'>The answer was '"+anstext +"'</div>");
	}
	ans.appendTo (ansgroup);

	if (index == infquiz.corrans) {
		console.log ("Correct!");
		infquiz.solved++;
		ans.addClass('correct');
		$("#qa-statusbar-"+infquiz.currentQuestionIndex).addClass("done-correct");
	} else {
		console.log ("Not Correct!");
		ans.addClass('incorrect');
		$("#qa-statusbar-"+infquiz.currentQuestionIndex).addClass("done-incorrect");
	}

	infquiz.answered++;

	$("#qa-status").html("<p>You have solved " + infquiz.solved + " of " + infquiz.answered + " questions</p>");

	console.log ("Shwowing answer");
	$(".btn-list").remove();
	
	var next = $("<a class='btn-answer button radius' href='#'><span>" + "Next Question" + "</span>");
	next.click (infquiz.nextQuestion);
	next.appendTo (ansgroup);

	ansgroup.appendTo($("#question-wrapper"));
	ansgroup.fadeOut(0);
	ansgroup.fadeIn ('fast');
	infquiz.prettify();
}

infquiz.prettify = function () {
	console.log ("Prettifying");
	$("xmp").removeClass("prettyprint").addClass("prettyprint");
	prettyPrint();
}

$(document).ready (function () {
	infquiz();
	infquiz.setupQuestions();
	infquiz.nextQuestion();
});