# Type Investigator

How can user-defined input be constrained to not truncate and/or wrap on a page? Let's say there's a fixed width of 600px available and this location will always use Roboto Medium at 22px.

The naive approach would be to type a bunch of `l`s or `m`s and count how many appear. This is unsufficient since, other than monospaced fonts, different characters take up different amounts of space. In the same vein, using a block of Lorem Ipsum text and then counting characters would be slightly better.

What about to make it closer to reality? 

There's many approaches but Type Investigator has chosen to use [^1] (licensed under CC BY-SA 4.0) as a corpus of text to randomly use as the text to evaluate the maximum characters available.

This is achieved by:
1. Randomly selecting 100 sentences from the corpus. 
2. For the given font and font size walk each word asking the font[^2] what width the fragment would require.
3. Stop once we're at the available pixel width or over

We then average the result of the 100 sentences to hopefully normalize the result

[Try it out!](https://type-investigator.knopoff.dev)

## Just looking to understand how things are calculated?

Head to `packages/ui/src/routes/+page.svelte` and read through `avgFit` and `fitInMax`. Oddly moving this logic into it's own file breaks opentype's ability to read the font size.

## Development

Create a `.env` or `.envrc` file and expose a variable `POSTGRES_URL` which looks something like

`postgresql://username:password@url_or_ip_including_port/databasename`

Make sure you have Node 18+ and pnpm installed. For seeding a database, python3 is required

### Database

This step only needs to be done once per database.

Download the wikipedia sentences[^1] and save them in a file `wiki.txt` at the root of the this project

cd into packages/pre-processor

```shell
python3 -m venv venv
source venv/bin/activate
python3 load_pg.py
```

This will take around 10 minutes

### UI

cd into packages/ui

```shell
pnpm run dev -- --open
```

[^1]: https://www.kaggle.com/datasets/mikeortman/wikipedia-sentences
[^2]: https://github.com/opentypejs/opentype.js/blob/a769436b36dd6c7170c4008c17ab98a6c1105296/README.md#fontgetadvancewidthtext-fontsize-options