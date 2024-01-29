import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.e-BwA1xT.js","_app/immutable/chunks/scheduler.k-kUyWhY.js","_app/immutable/chunks/index.9gRhRhoS.js"];
export const stylesheets = ["_app/immutable/assets/2.FQrDnV56.css"];
export const fonts = [];
