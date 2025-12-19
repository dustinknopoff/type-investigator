import { forEachGlyph } from "./src/fontFitting";
import { nthFlatten } from "./src/helpers";
import { type Font, parse } from "opentype.js";

// State
let font: Font | undefined;
let fontName: string = "";
let maxCharacters = 0;
let loading = false;

// DOM Elements
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const form = document.getElementById("form") as HTMLFormElement;
const pixelsInput = document.getElementById("pixels") as HTMLInputElement;
const fontFileInput = document.getElementById("fontFile") as HTMLInputElement;
const maxPixelsInput = document.getElementById("maxPixels") as HTMLInputElement;
const maxLinesInput = document.getElementById("maxLines") as HTMLInputElement;
let randomLines: string[] = [];

const loadingDiv = document.getElementById("loading") as HTMLDivElement;
const resultsDiv = document.getElementById("results") as HTMLDivElement;
const finalSpan = document.getElementById("final") as HTMLSpanElement;
const sentenceList = document.getElementById(
  "sentenceList",
) as HTMLUListElement;
const lineCountSpan = document.getElementById("lineCount") as HTMLSpanElement;
const maxPixelsDisplay2 = document.getElementById(
  "maxPixelsDisplay2",
) as HTMLSpanElement;

const textToRender = "The quick brown fox jumps over the lazy dog";

const demonstrateFont = () => {
  if (!font) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const pixelRatio = window.devicePixelRatio || 1;
  ctx.scale(pixelRatio, pixelRatio);
  const minPixels = font.getAdvanceWidth(textToRender, 18, { kerning: true });
  if (canvas.width < minPixels) {
    canvas.width = minPixels + 20;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  font.draw(ctx, textToRender, 0, 32, 18, {
    kerning: true,
    features: [
      { script: "arab", tags: ["init", "medi", "fina", "rlig"] },
      { script: "latn", tags: ["liga", "rlig"] },
    ],
  });
};

const fitInMax = (maxLength: number, line: string): number => {
  if (!font) return 0;
  const pixels = parseInt(pixelsInput.value) || 18;
  const maxLines = parseInt(maxLinesInput.value) || null;
  const words = line.replace("\n", "").split(" ");
  let text = "";
  let prevText = "";
  let lineLengths: number[] = [];
  let length = 0;

  for (let i = 0; i < words.length - 1; i++) {
    if (maxLines && lineLengths.length === maxLines) break;
    text = text ? `${text} ${words[i]}` : words[i];
    length = forEachGlyph(font, text, pixels);

    if (length >= maxLength) {
      if (!maxLines) return prevText.length;
      lineLengths.push(prevText.length);
      text = "";
      prevText = "";
      continue;
    }
    prevText = text;
  }

  return maxLines ? lineLengths.reduce((a, b) => a + b, 0) : line.length;
};

const avgFit = async () => {
  if (!font) return;
  loading = true;
  updateUI();
  const maxLines = parseInt(maxLinesInput.value) || null;
  const count = maxLines ? maxLines * 100 : 100;

  try {
    const res = await fetch(`/api/character-count?count=${count}`);
    let lines: string[] = (await res.json()).map(
      ({ text }: { text: string }) => text,
    );

    if (maxLines) lines = nthFlatten(lines, maxLines);
    randomLines = lines;

    const maxPixels = parseInt(maxPixelsInput.value) || 400;
    maxCharacters =
      lines.reduce((acc, line) => acc + fitInMax(maxPixels, line), 0) /
      lines.length;

    if (typeof umami !== "undefined") {
      umami.track("generate", { font: fontName, lineCount: maxLines });
    }
  } finally {
    loading = false;
    updateUI();
  }
};

const readOpenType = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  fontName = file.name;
  font = parse(await file.arrayBuffer());
  demonstrateFont();
  avgFit();
};

const updateUI = () => {
  const hasResults = !loading && randomLines.length > 0;

  loadingDiv.style.display = loading ? "block" : "none";
  resultsDiv.style.display = hasResults ? "block" : "none";

  if (hasResults) {
    finalSpan.textContent = Math.round(maxCharacters).toString();
    lineCountSpan.textContent = randomLines.length.toString();
    maxPixelsDisplay2.textContent = maxPixelsInput.value;

    sentenceList.innerHTML = randomLines
      .map((line) => `<li>${line}</li>`)
      .join("");
  }
};

fontFileInput.addEventListener("change", readOpenType);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  avgFit();
});

// Update display values
[maxPixelsInput, maxLinesInput].forEach((input) => {
  input.addEventListener("change", () => {
    document.getElementById("maxPixelsDisplay")!.textContent =
      maxPixelsInput.value;
    document.getElementById("maxLinesDisplay")!.textContent =
      maxLinesInput.value || "2";
  });
});
