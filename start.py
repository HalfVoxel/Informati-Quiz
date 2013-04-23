import tornado.ioloop
import tornado.web

import os.path

import quiz.config
import quiz.routes

def main():
	app = tornado.web.Application(
		quiz.routes.ROUTES,
		cookie_secret = quiz.config.COOKIE_SECRET,
		login_url = "/login",
		template_path = os.path.join(os.path.dirname(__file__), quiz.config.TEMPLATE_PATH),
		static_path = os.path.join(os.path.dirname(__file__), quiz.config.STATIC_PATH),
		xsrf_cookies = True,
		debug = True
	)
	app.listen(quiz.config.PORT)
	ioloop = tornado.ioloop.IOLoop.instance()
	ioloop.start()

if __name__ == "__main__":
	main()