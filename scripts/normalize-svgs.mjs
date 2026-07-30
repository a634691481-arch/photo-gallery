#!/usr/bin/env node
/* eslint-disable no-undef */
/**
 * Normalize all illustration SVGs to a square 800x800 viewBox.
 * Wraps existing content in an outer <g> with translate+scale to center it.
 *
 * Run: node scripts/normalize-svgs.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'public/illustrations'
const TARGET = 800

const svgOpenRe = /<svg\b[^>]*>/
const viewBoxRe = /viewBox="0 0 ([\d.]+) ([\d.]+)"/
const widthRe = /width="([\d.]+)"/
const heightRe = /height="([\d.]+)"/
const svgCloseRe = /<\/svg>\s*$/

for (const file of readdirSync(dir)) {
  if (!file.endsWith('.svg')) continue
  const path = join(dir, file)
  let src = readFileSync(path, 'utf8')

  // capture dims from viewBox (most reliable)
  const vbm = src.match(viewBoxRe)
  if (!vbm) {
    console.warn(`skip ${file}: no viewBox`)
    continue
  }
  const vw = parseFloat(vbm[1])
  const vh = parseFloat(vbm[2])
  const scale = TARGET / Math.max(vw, vh)
  const offX = (TARGET - vw * scale) / 2
  const offY = (TARGET - vh * scale) / 2

  // 1. re-write width / height / viewBox
  src = src.replace(widthRe, `width="${TARGET}"`)
  src = src.replace(heightRe, `height="${TARGET}"`)
  src = src.replace(viewBoxRe, `viewBox="0 0 ${TARGET} ${TARGET}"`)

  // 2. inject <g> wrapper right after <svg ...> opening tag
  const wrapOpen = `<g transform="translate(${offX.toFixed(3)} ${offY.toFixed(3)}) scale(${scale.toFixed(6)})">`
  // ensure the wrapper is added once, after the <svg> tag
  if (
    !src.includes(
      `transform="translate(${offX.toFixed(3)} ${offY.toFixed(3)}) scale(${scale.toFixed(6)})"`,
    )
  ) {
    src = src.replace(svgOpenRe, (m) => `${m}${wrapOpen}`)
  }

  // 3. add matching closing </g> right before </svg>
  //    We count existing <g ...> vs </g> indent: simplest — append one extra </g>
  //    immediately before the final </svg>.
  if (src.match(/<\/svg>(\r?\n)?\s*$/) && !src.endsWith(wrapOpen + '</g></svg>')) {
    src = src.replace(svgCloseRe, `</g></svg>\n`)
  }

  writeFileSync(path, src, 'utf8')
  console.log(
    `ok ${file}: ${vw}x${vh} -> ${TARGET}x${TARGET} scale=${scale.toFixed(4)} off=(${offX.toFixed(2)}, ${offY.toFixed(2)})`,
  )
}

console.log('done')
