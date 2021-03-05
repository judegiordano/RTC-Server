export interface IPaylaod {
	ok: boolean,
	data: any
}

export interface IPost {
	data: any
}

export interface IClient {
	id: string,
	connected: Date
}

export interface IWhisper {
	id: string,
	message: string
}

export interface IDm {
	from: string
	message: any
}