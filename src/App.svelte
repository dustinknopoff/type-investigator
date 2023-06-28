<script lang="ts">
	import { parse } from "opentype.js"
	import { letters, LETTER_FREQUENCY } from "./lib/frequencies"
	let font
	let fontName
	let average
	let pixels = 18
	let canvas
	let canvasWidth = 600
	let customPixels
	const textToRender = "The quick brown fox jumps over the lazy dog"
	let customText = textToRender;

	function calculateAverageWidth() {
		const total = letters.reduce((accumulator, letter) => {
			const singleGlyphPixels: number = font.getAdvanceWidth(letter, pixels, { kerning: true})
			if (LETTER_FREQUENCY[letter]) {
				return accumulator + singleGlyphPixels + singleGlyphPixels * LETTER_FREQUENCY[letter]
			} else {
				return accumulator + singleGlyphPixels + singleGlyphPixels * 0.001
			}
		}, 0)
		average = total / letters.length
	}

	const demonstrateFont = () => {
		const ctx = canvas.getContext("2d")
		const pixelRatio = window.devicePixelRatio || 1
		ctx.scale(pixelRatio, pixelRatio)
		const minPixels = font.getAdvanceWidth(textToRender, 18, { kerning: true})
		if (canvasWidth < minPixels) {
			canvasWidth = minPixels + 20
			canvas.width = canvasWidth
		}
		ctx.clearRect(0, 0, canvasWidth, canvas.height)
		font.draw(ctx, "The quick brown fox jumps over the lazy dog", 0, 32, 18, {
			kerning: true,
			features: [
				/**
				 * these 4 features are required to render Arabic text properly
				 * and shouldn't be turned off when rendering arabic text.
				 */
				{ script: "arab", tags: ["init", "medi", "fina", "rlig"] },
				{ script: "latn", tags: ["liga", "rlig"] },
			],
		})
	}

	const readOpenType = async (event) => {
		let file = event.target.files[0]
		fontName = file.name
		font = await parse(await file.arrayBuffer())
		calculateAverageWidth()
		demonstrateFont()
	}

	const dynamism = () => {
		calculateAverageWidth()
	}

	const calculateSpecificWidth = () => {
		customPixels = font.getAdvanceWidth(customText, pixels, { kerning: true})
	}
</script>

<main>
	<section id="controls">
		<canvas bind:this={canvas} width={canvasWidth} height={100} />
		<form>
			<a href="https://github.com/dustinknopoff/type-investigator">See the code</a>
			<span>Specify the pixel size to show this font at and add the .ttf file.</span>
			<input type="number" placeholder="18" bind:value={pixels} on:change={dynamism} />
			<input type="file" on:change={readOpenType} />
			{#if font && fontName && pixels}
			<hr />
			<label for="custom">
				<span>Include specific characters to find out the exact pixels they will take up:</span>
				{#if customPixels}
					<span>{customPixels}px</span>
				{/if}
			</label>
			<input type="text" name="custom" bind:value={customText} on:change={calculateSpecificWidth} />
			{/if}
		</form>
		{#if font && fontName && pixels && average}
			<p>The average width in pixels for {fontName} at {pixels}px is {average}px</p>
		{/if}
	</section>
	<section id="explanation">
		<h2>How we calculate average pixel size of glyphs in a font</h2>
		<p>
			We utilize the open source library <a href="https://github.com/opentypejs/opentype.js">Opentype.js</a> to handle reading
			a font file and determining the width one or more glyphs will take at a given pixel size.
		</p>
		<p>
			For each ascii glyph, we give a weight to the calculated width of <code>1.001</code>. We consider lowercase
			letters to be more likely to be used and apply a weight based on their likelihood to appear in English
			<a href="#1">[1]</a>. The average is the sum of these weighted values divided by the number of ascii letters.
		</p>
		<p id="1">
			<a href="https://en.wikipedia.org/wiki/Letter_frequency">[1] https://en.wikipedia.org/wiki/Letter_frequency</a>
		</p>
	</section>
</main>

<style>
	main {
		min-height: 100dvh;
	}

	#controls {
		height: 90dvh;
		width: 100dvw;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	form {
		display: flex;
		flex-direction: column;
	}

	form > * {
		margin: 10px;
	}

	section#explanation {
		width: min(70ch, calc(100% - 32px));
		margin: 0 auto;
	}
</style>
