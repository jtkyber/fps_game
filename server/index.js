const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const ws = require('ws');
const server = app.listen(port);
const { v4: uuidv4 } = require('uuid');

const wss = new ws.Server({ noServer: true });

const clients = new Map();

wss.on('connection', (socket, request) => {
	console.log('Client has connected');
	const id = uuidv4();
	clients.set(socket, id);
	socket.send(JSON.stringify({ action: 'set-user-id', data: id }));

	socket.on('message', e => {
		const event = JSON.parse(e);

		switch (event?.action) {
			case 'send-user-to-clients':
				for (let [key, value] of clients) {
					if (value !== event.id)
						key.send(JSON.stringify({ action: 'send-user-to-clients', data: event.id }));
				}
				break;
			case 'update-player-pos':
				for (let [key, value] of clients) {
					if (value !== event.id)
						key.send(
							JSON.stringify({
								action: 'update-player-pos',
								data: { playerId: event.id, x: event.data.x, y: event.data.y },
							})
						);
				}
				break;
		}
	});

	socket.on('close', () => {
		console.log('Client has disconnected');
		for (let [key, value] of clients) {
			key.send(
				JSON.stringify({
					action: 'remove-player',
					data: clients.get(socket),
				})
			);
		}
		clients.delete(socket);
	});
});

server.on('upgrade', (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, socket => {
		wss.emit('connection', socket, request);
	});
});
