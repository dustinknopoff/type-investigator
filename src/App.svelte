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
  let customText

	function calculateAverageWidth() {
		const total = letters.reduce((accumulator, letter) => {
			const singleGlyphPixels: number = font.getAdvanceWidth(letter, pixels)
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
		const textToRender = "The quick brown fox jumps over the lazy dog"
		const minPixels = font.getAdvanceWidth(textToRender, 18)
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
    console.log(customText)
    customPixels = font.getAdvanceWidth(customText, pixels)
    console.log(customPixels)
  }
</script>

<main>
	<section id="controls">
		<canvas bind:this={canvas} width={canvasWidth} height={100} />
		<form>
			<span>Specify the pixel side to show this font at and add the .ttf file.</span>
			<input type="number" placeholder="18" bind:value={pixels} on:change={dynamism} />
			<input type="file" on:change={readOpenType} />
      <label for="custom">
        <span>Include specific characters to find out the exact pixels they will take up:</span>
        {#if customPixels}
          <span>{customPixels}px</span>
        {/if}
      </label>
      <input type="text" name="custom" bind:value={customText} on:change={calculateSpecificWidth} />
		</form>
		{#if font && fontName && pixels && average}
			<p>The average width in pixels for {fontName} at {pixels}px is {average}px</p>
		{/if}
	</section>
  <section id="explanation">

  </section>
</main>

<style>
  main {
    min-height: 100dvh;
  }


	#controls {
		height: 100dvh;
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
</style>
