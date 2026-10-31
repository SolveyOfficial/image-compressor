// Writes build/THIRD_PARTY_NOTICES.md: this app's licence, then every bundled
// JavaScript package, font, image codec and Rust crate with its licence.
// Codec licence texts that upstream did not ship live in licenses/.
import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(file, 'utf8').trim();
const pkgDir = (name) => path.join('node_modules', name);
const pkgLicence = (name) => {
  const dir = pkgDir(name);
  const file = fs.readdirSync(dir).find((f) => /^licen[cs]e/i.test(f));
  if (!file) throw new Error(`No licence file for ${name}`);
  return read(path.join(dir, file));
};
const pkgMeta = (name) =>
  JSON.parse(fs.readFileSync(path.join(pkgDir(name), 'package.json'), 'utf8'));

const block = (text) => ['```text', text, '```'].join('\n');
const section = (title, lines, texts) =>
  [`### ${title}`, '', ...lines, '', ...texts.map(block), ''].join('\n');

const out = [
  '# Third-party notices',
  '',
  'Solvey Image Compressor includes the software, fonts and image codecs listed',
  'below, each with its licence. Source code for every part, including the',
  'GPL and LGPL components, is in this repository.',
  '',
  '## This app',
  '',
  block(read('NOTICE')),
  '',
  block(read('LICENSE')),
  '',
  '## JavaScript packages',
  '',
];

for (const name of [
  'comlink',
  'file-drop-element',
  'idb-keyval',
  'linkstate',
  'pointer-tracker',
  'preact',
  'wasm-feature-detect',
]) {
  const meta = pkgMeta(name);
  out.push(section(`${name} ${meta.version}`, [`- Licence: ${meta.license}`], [pkgLicence(name)]));
}

out.push('## Fonts', '');
for (const [name, title] of [
  ['@fontsource-variable/inter', 'Inter'],
  ['@fontsource-variable/plus-jakarta-sans', 'Plus Jakarta Sans'],
]) {
  const meta = pkgMeta(name);
  out.push(section(`${title} ${meta.version}`, [`- Licence: ${meta.license}`], [pkgLicence(name)]));
}
out.push(
  section(
    'Roboto Mono (digits only, embedded in the stylesheet)',
    ['- Licence: Apache-2.0', '- Copyright Google LLC'],
    [read('licenses/spdx-Apache-2.0.txt')],
  ),
);

const codecs = [
  ['MozJPEG 3.3.1 (JPEG encoder)', 'IJG AND BSD-3-Clause AND Zlib', ['codecs/mozjpeg/LICENSE.codec.md']],
  ['libwebp (WebP, and sharpyuv used by AVIF)', 'BSD-3-Clause', ['codecs/webp/LICENSE.codec.md']],
  ['libavif 1.0.1 (AVIF)', 'BSD-2-Clause', ['licenses/libavif.txt']],
  ['libaom 3.7.0 (AV1, used by AVIF)', 'BSD-2-Clause, Alliance for Open Media Patent License 1.0', ['licenses/libaom.txt', 'licenses/libaom-PATENTS.txt']],
  ['libyuv (bundled in libaom)', 'BSD-3-Clause', ['licenses/libyuv.txt']],
  ['fastfeat (bundled in libaom)', 'BSD-3-Clause', ['licenses/fastfeat.txt']],
  ['vector (bundled in libaom)', 'MIT', ['licenses/vector.txt']],
  ['libjxl (JPEG XL)', 'BSD-3-Clause, with a patent grant', ['licenses/libjxl.txt', 'licenses/libjxl-PATENTS.txt']],
  ['highway (bundled in libjxl)', 'Apache-2.0 OR BSD-3-Clause', ['licenses/highway.txt']],
  ['brotli (bundled in libjxl)', 'MIT', ['licenses/brotli.txt']],
  ['skcms (bundled in libjxl)', 'BSD-3-Clause', ['licenses/skcms.txt']],
  ['libwebp2 (WebP 2)', 'Apache-2.0', ['licenses/libwebp2.txt']],
  ['QOI', 'MIT', ['licenses/qoi.txt']],
  ['butteraugli (image comparison)', 'Apache-2.0', ['licenses/butteraugli.txt']],
  ['libimagequant 2.12.1 ("Reduce palette")', 'GPL-3.0-or-later', ['codecs/imagequant/LICENSE.codec.md', 'licenses/spdx-GPL-3.0-or-later.txt']],
  ['OxiPNG (PNG)', 'MIT', ['codecs/oxipng/LICENSE.codec.md']],
  ['resize (image resizing)', 'MIT', ['codecs/resize/LICENSE.codec.md']],
  ['hqx wrapper ("Resize" pixel-art method)', 'Apache-2.0', ['codecs/hqx/LICENSE.codec.md']],
];
out.push('## Image codecs', '');
for (const [title, licence, files] of codecs) {
  out.push(section(title, [`- Licence: ${licence}`], files.map(read)));
}

const crates = JSON.parse(fs.readFileSync('licenses/rust-crates.json', 'utf8'));
out.push(
  '## Rust crates compiled into the codecs',
  '',
  'The full texts of these licences follow in the next section.',
  '',
  '| Crate | Version | Licence | Used by |',
  '| --- | --- | --- | --- |',
  ...crates.map((c) => `| ${c.name} | ${c.version} | ${c.license} | ${c.codecs.join(', ')} |`),
  '',
  '## Licence texts',
  '',
);
for (const id of ['MIT', 'Apache-2.0', 'Zlib', 'Unlicense', 'MPL-2.0', 'LGPL-2.1-or-later']) {
  out.push(section(id, [], [read(`licenses/spdx-${id}.txt`)]));
}

fs.writeFileSync('build/THIRD_PARTY_NOTICES.md', out.join('\n'));
console.log('Wrote build/THIRD_PARTY_NOTICES.md');
