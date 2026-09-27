import { readFile, writeFile } from 'node:fs/promises';

const directory = new URL('../public/assets/photos/', import.meta.url);
const { photos } = JSON.parse(await readFile(new URL('sources.json', directory), 'utf8'));
const requested = process.argv.slice(2);
if (requested.some(file => !photos.some(photo => photo.file === file))) {
  throw new Error('Unknown photo name. Use a file name from sources.json.');
}

for (const photo of photos.filter(photo => !requested.length || requested.includes(photo.file))) {
  for (const width of [640, 1600]) {
    const filename = `${photo.file}${width === 640 ? '-small' : ''}.webp`;
    const response = await fetch(`https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=${width}&q=80`, { signal: AbortSignal.timeout(30000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
      throw new Error(`Could not download ${filename}: ${response.status}`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(new URL(filename, directory), bytes);
    console.log(`${filename}: ${Math.round(bytes.length / 1024)} KB`);
  }
}
