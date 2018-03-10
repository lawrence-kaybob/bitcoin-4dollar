var redis  = require("redis")
var json = require()
var client = redis.createClient();

var savedAddress = {
	id: '6g98dfai7mg4',
	channelId: 'emulator',
	user: { id: 'default-user', name: 'User' },
	conversation: { id: 'iiciialk5fla' },
	bot: { id: 'default-bot', name: 'Bot'},
	serviceUrl: 'http://localhost:56569'
};

client.get(savedAddress.id, function(err, reply) {
	console.log(reply.toString());
});
client.quit();