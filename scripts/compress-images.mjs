import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

const IMG_DIR = 'public/images'
const MAX_WIDTH = 1600
const QUALITY = 78

const files = await readdir(IMG_DIR)

for (const file of files) {
  if (!/\.(jpg|jpeg|png)$/i.test(file)) continue
  const inputPath = join(IMG_DIR, file)
  const tempPath = join(IMG_DIR, `_tmp_${file}`)

  const before = (await stat(inputPath)).size

  await sharp(inputPath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tempPath)

  const after = (await stat(tempPath)).size

  // Replace original
  const { rename } = await import('fs/promises')
  await rename(tempPath, inputPath)

  const savings = (((before - after) / before) * 100).toFixed(1)
  console.log(`${file}: ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB (${savings}% smaller)`)
}

console.log('\nDone!')
