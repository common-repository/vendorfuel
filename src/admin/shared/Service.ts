import type { Params } from './Params';

export abstract class Service {
	public static async index(params: Params) {}
	public static async store(data: any) {}
	public static async show(id: number | string) {}
	public static async update(id: number | string, data: any) {}
	public static async destroy(id: number | string) {}
	public static async download(id: number | string, filename?: string) {}
}
