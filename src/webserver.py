#!/usr/bin/env python

import json
import logging

import tornado.auth
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.autoreload

import os.path
import random
import config

USER_COOKIE = "quiz_user"

class BaseHandler(tornado.web.RequestHandler):
	def get_current_user(self):
		user_json = self.get_secure_cookie(USER_COOKIE)
		if not user_json:
			return None
		return tornado.escape.json_decode(user_json)

class BaseWSHandler(BaseHandler, tornado.websocket.WebSocketHandler):
	def on_message(self, message):
		data = json.loads(message)
		data_type = data["type"]
		data_payload = data["payload"]
		getattr(self, data_type)(data_payload)
	
class MainHandler(BaseHandler):
	def get(self):
		self.render("index.html", user = self.get_current_user())

class AuthLoginHandler(BaseHandler, tornado.auth.GoogleMixin):
	@tornado.web.asynchronous
	@tornado.gen.coroutine
	def get(self):
		if self.get_argument("openid.mode", None):
			user = yield self.get_authenticated_user()
			self.set_secure_cookie(USER_COOKIE, tornado.escape.json_encode(user))
			self.redirect("/")
			return
		self.authenticate_redirect(ax_attrs=["name"])

class AuthLogoutHandler(BaseHandler):
	def get(self):
		self.clear_cookie(USER_COOKIE)
		self.write("You are now logged out")

class QuizOverviewHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self):
		self.render("quiz_list.html", user = self.get_current_user())

class QuizOverviewWS(BaseWSHandler):
	def new_game(data):
		pass

	def list_games(data):
		pass

	
def main():
	app = tornado.web.Application([
		(r"/", MainHandler),
		(r"/login", AuthLoginHandler),
		(r"/logout", AuthLogoutHandler),
	],
	cookie_secret=config.COOKIE_SECRET,
	login_url="/login",
	template_path=os.path.join(os.path.dirname(__file__), "templates"),
	static_path=os.path.join(os.path.dirname(__file__), "static"),
	xsrf_cookies=True)
	app.listen(options.port)
	ioloop = tornado.ioloop.IOLoop.instance()
	autoreload.start(ioloop)
	ioloop.start()

if __name__ == "__main__":
	main()