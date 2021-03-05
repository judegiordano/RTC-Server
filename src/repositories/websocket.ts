import { Socket, Server } from "socket.io";
import { AxiosResponse } from "axios";

import * as T from "../types/Payloads";
import Rest from "../services/rest";
import io from "../services/server";
import log from "../services/logger";

export default class WebSocket {

	private static connections: T.IClient[] = [];

	private static readonly io: Server = io;

	private static Error(socket: Socket, error: Error | any): void {
		try {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		} catch (e) {
			log.error(e);
		}
	}

	private static Respond(socket: Socket, payload: T.IPaylaod): void {
		try {
			socket.emit("response", { ok: payload.ok, data: payload.data });
		} catch (e) {
			WebSocket.Error(socket, e);
		}
	}

	public static async Connect(socket: Socket): Promise<void> {
		try {
			WebSocket.connections.push({ id: socket.id, connected: new Date() });
			log.info(WebSocket.connections);
			await socket.join(socket.id);
			WebSocket.Respond(socket, { ok: true, data: `joined room ${socket.id}` });
		} catch (e) {
			WebSocket.Error(socket, e);
		}
	}

	public static Disconnect(socket: Socket): void {
		try {
			WebSocket.connections = WebSocket.connections.filter(a => a.id !== socket.id);
			log.info(WebSocket.connections);
		} catch (e) {
			log.error(e);
		}
	}

	public static Whisper(socket: Socket, dm: T.IWhisper): void {
		try {
			const user: T.IClient = WebSocket.connections.find(a => a.id === dm.id);
			if (!user) throw "this user does not exist";

			WebSocket.io.to(user.id).emit("dm", { from: socket.id, message: dm.message } as T.IDm);
			WebSocket.Respond(socket, { ok: true, data: "message sent" });
		} catch (e) {
			log.error(e);
			WebSocket.Respond(socket, { ok: false, data: e });
		}
	}

	public static async Request(socket: Socket): Promise<void> {
		try {
			const _response: AxiosResponse = await Rest.Get();
			WebSocket.Respond(socket, { ok: true, data: _response });
		} catch (e) {
			log.error(e);
			WebSocket.Respond(socket, { ok: false, data: e });
		}
	}
}