import { Socket } from "socket.io";

import WebSocket from "../repositories/websocket";
import * as T from "../types/Payloads";
import io from "../services/server";

// Generic socket wrapper
io.on("connection", async (socket: Socket) => {

	await WebSocket.Connect(socket);

	// dm
	socket.on("whisper", (dm: T.IWhisper) => {
		WebSocket.Whisper(socket, dm);
	});

	// fetch api data
	socket.on("request", async () => {
		await WebSocket.Request(socket);
	});

	// disconnect
	socket.on("disconnect", () => {
		WebSocket.Disconnect(socket);
	});
});

export default io;