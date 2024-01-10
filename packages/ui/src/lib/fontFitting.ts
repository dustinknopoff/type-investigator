import { type Font } from "opentype.js"


export type Measure = (text: string, fontSize: number) => number;

export function fitInMax(font: Font, maxLength: number, pixels = 18, line: string): number {
    const words = line.replace('\n', '').split(' ');
    let text = ``;
    let prevText = ``
    for (let i = 0; i < words.length - 1; i++) {
        if (i === 0) {
            text += `${words[i]}`;
        } else {
            text += ` ${words[i]}`;
        }
        const length = forEachGlyph(font,line, pixels);
        if (length >= maxLength) {
            return prevText.length;
        }
        prevText = text;
    }
    return line.length;
}

export function forEachGlyph(font: Font, text: string, fontSize: number) {
    let x = 0;
    const options = Object.assign({}, font.defaultRenderOptions);
    const fontScale = 1 / font.unitsPerEm * fontSize;
    const glyphs = font.stringToGlyphs(text, options);
    let kerningLookups;
    if (options.kerning) {
        const script = font.position.getDefaultScriptName();
        kerningLookups = font.position.getKerningTables(script, options.language);
    }
    for (let i = 0; i < glyphs.length; i += 1) {
        const glyph = glyphs[i];
        if (glyph.advanceWidth) {
            x += glyph.advanceWidth * fontScale;
        }

        if (options.kerning && i < glyphs.length - 1) {
            // We should apply position adjustment lookups in a more generic way.
            // Here we only use the xAdvance value.
            const kerningValue = kerningLookups ?
                font.position.getKerningValue(kerningLookups, glyph.index, glyphs[i + 1].index) :
                font.getKerningValue(glyph, glyphs[i + 1]);
            x += kerningValue * fontScale;
        }

        if (options.letterSpacing) {
            x += options.letterSpacing * fontSize;
        } else if (options.tracking) {
            x += (options.tracking / 1000) * fontSize;
        }
    }
    return x;
}