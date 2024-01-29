export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.ANb_Mp1O.js","app":"_app/immutable/entry/app.6_GPWMuk.js","imports":["_app/immutable/entry/start.ANb_Mp1O.js","_app/immutable/chunks/scheduler.k-kUyWhY.js","_app/immutable/chunks/singletons.DrKzJXxS.js","_app/immutable/entry/app.6_GPWMuk.js","_app/immutable/chunks/scheduler.k-kUyWhY.js","_app/immutable/chunks/index.9gRhRhoS.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			{
				id: "/api/character-count",
				pattern: /^\/api\/character-count\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/character-count/_server.ts.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
