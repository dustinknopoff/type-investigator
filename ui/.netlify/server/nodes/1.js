

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.TxublXq0.js","_app/immutable/chunks/scheduler.k-kUyWhY.js","_app/immutable/chunks/index.9gRhRhoS.js","_app/immutable/chunks/singletons.DrKzJXxS.js"];
export const stylesheets = [];
export const fonts = [];
