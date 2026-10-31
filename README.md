# Solvey Image Compressor

Live demo: https://solveyofficial.github.io/image-compressor/

Make photos and images smaller, right in your browser. Open an image, compare
the original and the compressed version side by side, adjust the settings and
download the result. Useful for websites, email, and online forms that limit
photo and signature file sizes.

## Private by design

Everything runs on your device. Images are never uploaded, the app has no
analytics or tracking, and it loads no third-party resources. Once loaded, it
also works offline.

## Features

- One-click form presets: passport-style photo (200×230 px, under 50 KB) and
  signature (140×60 px, under 20 KB), the sizes many Indian exam and
  government forms ask for. The preset picks the highest quality that fits.
- Formats: MozJPEG, WebP, AVIF, JPEG XL, OxiPNG, QOI and WebP 2
- Resize, with several resampling methods
- Reduce the colour palette for smaller PNGs
- Side-by-side comparison with zoom
- Paste from the clipboard, or drag and drop

## Development

You need Node.js 22.

```sh
npm ci          # install dependencies
npm run dev     # development server at http://localhost:5000
npm run lint    # check formatting
npm run build   # production build in build/
```

To serve the app under a sub-path, set `BASE_PATH` when building, for example
`BASE_PATH=/image-compressor npm run build`. `SITE_ORIGIN` sets the address
used in link previews.

The image codecs ship prebuilt in `codecs/`. Each codec folder has the build
scripts used to compile it.

The build writes `build/THIRD_PARTY_NOTICES.md`, listing every bundled
package, font, codec and Rust crate with its licence. It is linked from the
app's footer as "Licences".

When the repository is public, every push to `main` is published to GitHub Pages.

## Licence

Apache License 2.0, see LICENSE and NOTICE. This is a modified version of
Squoosh. Some codecs carry their own licences, including GPL-3.0 for the
palette reduction codec; see THIRD_PARTY_NOTICES.md in the build.
