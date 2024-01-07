<script lang="ts">
	import Circle from '$lib/Circle.svelte';
import { parse } from 'opentype.js';

	let randomLines: string[] | undefined;
	let font: Font | undefined;
	let fontName: string;
	let pixels = 18;
	let maxPixels = 400;
	let canvas: HTMLCanvasElement;
	let canvasWidth = 600;
	const textToRender = 'The quick brown fox jumps over the lazy dog';
	let maxCharacters = 0
	let loading = false

	const demonstrateFont = () => {
		const ctx = canvas.getContext('2d');
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
		const words = line.replace('\n', '').split(' ');
		let text = ``;
		let prevText = ``
		for (let i = 0; i < words.length - 1; i++) {
			if (i === 0) {	
				text += `${words[i]}`;
			} else {
				text += ` ${words[i]}`;
			}
			length = font.forEachGlyph(text, 0, 0, pixels, { kerning: true }, function () {});
			if (length >= maxLength) {
				return prevText.length;
			}
			prevText = text;
		}
		return line.length;
	}

	function avgFit() {
		if (font) {
			loading = true
			fetch('/api/character-count')
			.then((r) => r.json())
			.then((r) => {
				randomLines = r.map(({ text }: { text: string}) => text);
				maxCharacters = randomLines!.reduce((acc, curr) => {
				const val = fitInMax(font, maxPixels, pixels, curr)
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
		<a href="https://github.com/dustinknopoff/type-investigator">See the code</a>
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
</style>
