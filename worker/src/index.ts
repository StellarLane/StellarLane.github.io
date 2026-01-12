/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		// 根路径检查
		if (key === '') {
			return new Response('Hi!', { status: 200 });
		}

		// 只允许 GET 和 HEAD
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			return new Response('Method Not Allowed', { status: 405 });
		}

		// 从 R2 获取对象
		const object = await env.MY_BUCKET.get(key);

		if (object === null) {
			return new Response('Not Found', { status: 404 });
		}

		// 设置响应头
		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);
		headers.set('Cache-Control', 'public, max-age=31536000, immutable');
		headers.set('Access-Control-Allow-Origin', 'https://stellarlane.github.io');
		headers.set('Cache-Control', 'public, max-age=31536000');
		return new Response(object.body, {
			headers,
		});
	},
} satisfies ExportedHandler<Env>;
