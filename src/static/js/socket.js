function Socket(url){
	this.socket = new WebSocket("ws://"+window.location.hostname+":8888/" + url);
	this.listeners = {};
	this.socket.onmessage = function(msg){
		var json = JSON.parse(msg.data);
		var callbacks = this.listeners[json.type];
		for(var i = 0; i < callbacks.size(); ++i){
			callbacks[i](json.payload);
		}
	};
}

Socket.prototype.write = function(type, payload){
	var data = {
		type: type,
		payload: payload
	};
	this.socket.send(JSON.stringify(data));
}

Socket.prototype.onMessage = function(type, callback){
	if(!(type in this.listeners)){
		this.listeners[type] = [];
	}
	this.listeners[type].push(callback);
}
