import tornado.web
import tornado.websocket
import tornado.auth
import json

USER_COOKIE = "user"

class BaseHandler(tornado.web.RequestHandler):

	def get_current_user(self):
		user_json = self.get_secure_cookie(USER_COOKIE)
		if not user_json:
			return None
		return json.loads(user_json)

class BaseWSHandler(BaseHandler, tornado.websocket.WebSocketHandler):

	def on_message(self, message):
		message = json.loads(message)
		func = getattr(self,message['type'])

class LoginHandler(BaseHandler, tornado.auth.GoogleMixin):

	@tornado.web.asynchronous
	@tornado.gen.coroutine
	def get(self):
		if self.get_argument("openid.mode", None):
			user = yield self.get_authenticated_user()
			self.set_secure_cookie(USER_COOKIE, json.dumps(user))
			self.redirect("/quizlist")
			return
		self.authenticate_redirect(ax_attrs = ["name", "email"])

class LogoutHandler(BaseHandler):

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
	pass
