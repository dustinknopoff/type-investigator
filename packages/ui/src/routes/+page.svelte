<script lang="ts">
	import Circle from '$lib/Circle.svelte';
	import { forEachGlyph } from '$lib/fontFitting';
	import { nthFlatten } from '$lib/helpers';
	import { Font, parse } from 'opentype.js';

	let randomLines: string[] | undefined;
	let font: Font | undefined;
	let fontName: string;
	let pixels = 18;
	let maxPixels = 400;
	let canvas: HTMLCanvasElement;
	let canvasWidth = 600;
	const textToRender = 'The quick brown fox jumps over the lazy dog';
	let maxCharacters = 0
	let maxLines: number | null = null
	let loading = false

	const demonstrateFont = () => {
		const ctx = canvas.getContext('2d');
		if (!ctx && !font) return
		const pixelRatio = window.devicePixelRatio || 1;
		ctx.scale(pixelRatio, pixelRatio);
		const minPixels = font.getAdvanceWidth(textToRender, 18, { kerning: true });
		if (canvasWidth < minPixels) {
			canvasWidth = minPixels + 20;
			canvas.width = canvasWidth;
		}
		ctx.clearRect(0, 0, canvasWidth, canvas.height);
		font.draw(ctx, 'The quick brown fox jumps over the lazy dog', 0, 32, 18, {
			kerning: true,
			features: [
				/**
				 * these 4 features are required to render Arabic text properly
				 * and shouldn't be turned off when rendering arabic text.
				 */
				{ script: 'arab', tags: ['init', 'medi', 'fina', 'rlig'] },
				{ script: 'latn', tags: ['liga', 'rlig'] }
			]
		});
	};

	function fitInMax(font: Font, maxLength: number, pixels: number = 18, line: string): number {
		let allowedLength = maxLength
		let lineLengths = []
		const words = line.replace('\n', '').split(' ');
		let text = ``;
		let prevText = ``;
		for (let i = 0; i < words.length - 1; i++) {
			if (maxLines && lineLengths.length - 1 === maxLines) {
				break
			}
			if (i === 0) {	
				text += `${words[i]}`;
			} else {
				text += ` ${words[i]}`;
			}
			length = forEachGlyph(font, text, pixels);
			if (length >= allowedLength) {
				if (!maxLines) {
					return prevText.length;
				}
				lineLengths.push(prevText.length)
			}
			prevText = text;
		}
		if (maxLines) {
			return lineLengths.reduce((acc, curr) => acc + curr, 0)
		} else {
			return line.length;
		}
	}

	function avgFit() {
		if (font) {
			loading = true
			fetch(`/api/character-count?count=${maxLines ? maxLines * 100 : 100}`)
			.then((r) => r.json())
			.then((r) => {
				randomLines = r.map(({ text }: { text: string}) => text);
				if (!randomLines) return
				if (maxLines) {
					randomLines = nthFlatten(randomLines, maxLines)
				}
				maxCharacters = randomLines!.reduce((acc, curr) => {
				const val = fitInMax(font!, maxPixels, pixels, curr)
				return acc + val
			}, 0) / randomLines.length
			loading = false
			});
		}
	}

	const readOpenType = async (event) => {
		let file = event.target.files[0];
		fontName = file.name;
		font = await parse(await file.arrayBuffer());
		demonstrateFont();
		avgFit();
	};

</script>

<svelte:head>
	<title>Type Investigator</title>
</svelte:head>

<section id="controls">
	<canvas bind:this={canvas} width={canvasWidth} height={100} />
	<form on:submit={avgFit}>
		<a href="https://github.com/dustinknopoff/type-investigator/tree/main#just-looking-to-understand-how-things-are-calculated">See the code</a>
		<label>
			What fontSize?
		<input type="number" placeholder="18" bind:value={pixels} />
		</label>
		<label>
			Add the .ttf file
		<input type="file" on:change={readOpenType} />
		</label>
		<label
			>What is the maximum available space in pixels?
			<input type="number" placeholder="65" bind:value={maxPixels} />
		</label>
		<label>How many lines should we allow?
			<input type="number" placeholder="2" bind:value={maxLines} />
		</label>
		<details id="lines">
			<summary>What does this mean?</summary>
			<p>If your available space is {maxPixels} but you have {maxLines || 2} lines available to overflow,
			we will calculate how many characters can be fit on each line word breaking</p>

			<p>For Example</p>
			<pre>
This is super
important but 
we can only 
fit it in 
this width
			</pre>
		</details>
		<button type="submit">Generate</button>
		{#if loading}
			<Circle />
		{/if}
		{#if !loading && font && fontName && maxPixels && randomLines}
			<hr />
			<p>For {randomLines.length} random sentences on Wikipedia, the average maximum character length for {maxPixels}px of space is <span id="final">{maxCharacters}</span> characters.</p>
			<details>
				<summary>The random sentences from wikipedia</summary>
				<ul>
					{#each randomLines as line}
						<li>{line}</li>
					{/each}
				</ul>
			</details>
		{/if}
	</form>
</section>

<style>
	#final {
		font-weight: 800;
	}

	#controls {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	button {
		max-width: 250px;
	}

	form {
		display: flex;
		flex-direction: column;
	}

	form > * {
		margin: 10px;
	}

	details#lines {
		margin-left: 2rem;
		max-width: 400px;
	}
</style>
