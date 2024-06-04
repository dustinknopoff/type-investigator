<svelte:head>
	<title>Type Investigator</title>
</svelte:head>

<a href="/">Try it out</a>
<h1>Type Investigator</h1>

<p>How can user-defined input be constrained to not truncate and/or wrap on a page? Let's say there's a fixed width of 600px available and this location will always use Roboto Medium at 22px.</p>

<p>The naive approach would be to type a bunch of `l`s or `m`s and count how many appear. This is unsufficient since, other than monospaced fonts, different characters take up different amounts of space. In the same vein, using a block of Lorem Ipsum text and then counting characters would be slightly better.</p>

<p>What about to make it closer to reality?</p>

<p>There's many approaches but Type Investigator has chosen to use [^1] (licensed under CC BY-SA 4.0) as a corpus of text to randomly use as the text to evaluate the maximum characters available.</p>

<p>This is achieved by:</p>

<ul>
<ol>Randomly selecting 100 sentences from the corpus.</ol>
<ol>For the given font and font size walk each word asking the font[^2] what width the fragment would require.</ol>
<ol>Stop once we're at the available pixel width or over</ol>
</ul>

<p>We then average the result of the 100 sentences to hopefully normalize the result</p>


[^1]: https://www.kaggle.com/datasets/mikeortman/wikipedia-sentences
[^2]: https://github.com/opentypejs/opentype.js/blob/a769436b36dd6c7170c4008c17ab98a6c1105296/README.md#fontgetadvancewidthtext-fontsize-options