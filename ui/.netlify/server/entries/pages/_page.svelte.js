import { c as create_ssr_component, d as add_attribute, e as escape } from "../../chunks/ssr.js";
import "opentype.js";
const css = {
  code: "#final.svelte-pef6ac.svelte-pef6ac{font-weight:800}#controls.svelte-pef6ac.svelte-pef6ac{display:flex;align-items:center;justify-content:center;flex-direction:column}button.svelte-pef6ac.svelte-pef6ac{max-width:250px}form.svelte-pef6ac.svelte-pef6ac{display:flex;flex-direction:column}form.svelte-pef6ac>.svelte-pef6ac{margin:10px}details#lines.svelte-pef6ac.svelte-pef6ac{margin-left:2rem;max-width:400px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let pixels = 18;
  let maxPixels = 400;
  let canvas;
  let canvasWidth = 600;
  let maxLines = null;
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-1l7aqz3_START -->${$$result.title = `<title>Type Investigator</title>`, ""}<!-- HEAD_svelte-1l7aqz3_END -->`, ""} <section id="controls" class="svelte-pef6ac"><canvas${add_attribute("width", canvasWidth, 0)}${add_attribute("height", 100, 0)}${add_attribute("this", canvas, 0)}></canvas> <form class="svelte-pef6ac"><a href="https://github.com/dustinknopoff/type-investigator/tree/main#just-looking-to-understand-how-things-are-calculated" class="svelte-pef6ac" data-svelte-h="svelte-9u2gqk">See the code</a> <label class="svelte-pef6ac">What fontSize?
		<input type="number" placeholder="18"${add_attribute("value", pixels, 0)}></label> <label class="svelte-pef6ac">Add the .ttf file
		<input type="file"></label> <label class="svelte-pef6ac">What is the maximum available space in pixels?
			<input type="number" placeholder="65"${add_attribute("value", maxPixels, 0)}></label> <label class="svelte-pef6ac">How many lines should we allow?
			<input type="number" placeholder="1"${add_attribute("value", maxLines, 0)}></label> <details id="lines" class="svelte-pef6ac"><summary data-svelte-h="svelte-shodkh">What does this mean?</summary> <p>If your available space is ${escape(maxPixels)} but you have ${escape(2)} lines available to overflow,
			we will calculate how many characters can be fit on each line word breaking</p> <p data-svelte-h="svelte-15w7pb1">For Example</p> <pre data-svelte-h="svelte-v81qis">This is super
important but 
we can only 
fit it in 
this width
			</pre></details> <button type="submit" class="svelte-pef6ac" data-svelte-h="svelte-1eut32w">Generate</button> ${``} ${``}</form> </section>`;
});
export {
  Page as default
};
