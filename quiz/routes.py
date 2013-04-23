from quiz.handler import MainHandler, LoginHandler, LogoutHandler, QuizOverviewHandler, QuizOverviewWS

ROUTES = [
	(r"/", MainHandler),
	(r"/login", LoginHandler),
	(r"/logout", LogoutHandler),
	(r"/quizlist", QuizOverviewHandler),
	(r"/quizlist_wz", QuizOverviewWS)
]