import json
import logging
import urllib
import hashlib

import tornado.auth
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket

import os.path
import random

import quiz.config
import quiz.routes

USER_COOKIE = "quiz_user"

class BaseHandler(tornado.web.RequestHandler):
	def get_current_user(self):
		user_json = self.get_secure_cookie(USER_COOKIE)
		if not user_json:
			return None
		return tornado.escape.json_decode(user_json)

class BaseWSHandler(BaseHandler, tornado.websocket.WebSocketHandler):
	def on_message(self, message):
		message = json.loads(message)
		func = getattr(self,message['type'])

		pass

	def web_export(func):
		pass

class AuthLoginHandler(BaseHandler, tornado.auth.GoogleMixin):
	@tornado.web.asynchronous
	@tornado.gen.coroutine
	def get(self):
		if self.get_argument("openid.mode", None):
			user = yield self.get_authenticated_user()
			self.set_secure_cookie(USER_COOKIE, tornado.escape.json_encode(user))
			self.redirect("/quizlist")
			return
		self.authenticate_redirect(ax_attrs = ["name", "email"])

class AuthLogoutHandler(BaseHandler):
	def get(self):
		self.clear_cookie(USER_COOKIE)
		self.redirect("/")


class MainHandler(BaseHandler):
	def get(self):
		self.render("index.html", user = self.get_current_user())

class QuizOverviewHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self):
		self.render("quizlist.html", user = self.get_current_user())

class QuizOverviewWS(BaseWSHandler):

	def new_game():
		pass

	web_export("new_game")


def main():
	app = tornado.web.Application(
		[
			(r"/", MainHandler),
			(r"/login", AuthLoginHandler),
			(r"/logout", AuthLogoutHandler),
			(r"/quizlist", QuizOverviewHandler),
			(r"/quizlist_wz", QuizOverviewWS)
		],
		cookie_secret = config.COOKIE_SECRET,
		login_url = "/login",
		template_path = os.path.join(os.path.dirname(__file__), config.TEMPLATE_PATH),
		static_path = os.path.join(os.path.dirname(__file__), config.STATIC_PATH),
		xsrf_cookies = True,
		debug = True
	)
	app.listen(config.PORT)
	ioloop = tornado.ioloop.IOLoop.instance()
	ioloop.start()

if __name__ == "__main__":
	main()
