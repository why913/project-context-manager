#!/usr/bin/env node
// Install this skill into the skills directory of every agent found on this machine.
// Zero dependencies. Copies (never symlinks) so it works on Windows without admin rights.
//
//   node install.mjs                 show what would happen (default)
//   node install.mjs --write         actually install
//   node install.mjs --list          list known targets and exit
//   node install.mjs --targets a,b   install only these targets
//   node install.mjs --all --write   install to every known target, detected or not

import { readFile, mkdir, rm, cp, access } from 'node:fs/promises'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir } from 'node:os'

const SRC = dirname(fileURLToPath(import.meta.url))
const HOME = homedir()
const h = (...p) => join(HOME, ...p)

// Files that make up the skill. Everything else in the repo stays behind.
const PAYLOAD = ['SKILL.md', 'references', 'LICENSE']

// User-scope skill directories, verified against each vendor's docs (2026-08).
// `detect` is the config dir whose presence means the agent is installed here.
const TARGETS = [
  { key: 'standard', name: 'Cross-agent standard', dir: h('.agents', 'skills'), detect: null,
    note: 'read by Codex, Cursor, Gemini, Copilot, Amp, Warp, Cline, Roo, Kilo' },
  { key: 'claude',   name: 'Claude Code',      dir: h('.claude', 'skills'),               detect: h('.claude') },
  { key: 'codex',    name: 'Codex CLI',        dir: h('.codex', 'skills'),                detect: h('.codex') },
  { key: 'cursor',   name: 'Cursor',           dir: h('.cursor', 'skills'),               detect: h('.cursor') },
  { key: 'gemini',   name: 'Gemini CLI',       dir: h('.gemini', 'skills'),               detect: h('.gemini') },
  { key: 'copilot',  name: 'GitHub Copilot',   dir: h('.copilot', 'skills'),              detect: h('.copilot') },
  { key: 'codebuddy', name: 'CodeBuddy',        dir: h('.codebuddy', 'skills'),            detect: h('.codebuddy') },
  { key: 'opencode', name: 'OpenCode',         dir: h('.config', 'opencode', 'skills'),   detect: h('.config', 'opencode') },
  { key: 'windsurf', name: 'Windsurf',         dir: h('.codeium', 'windsurf', 'skills'),  detect: h('.codeium', 'windsurf') },
  { key: 'cline',    name: 'Cline',            dir: h('.cline', 'skills'),                detect: h('.cline') },
  { key: 'roo',      name: 'Roo Code',         dir: h('.roo', 'skills'),                  detect: h('.roo') },
  { key: 'kilo',     name: 'Kilo Code',        dir: h('.kilocode', 'skills'),             detect: h('.kilocode') },
  { key: 'amp',      name: 'Amp',              dir: h('.config', 'agents', 'skills'),     detect: h('.config', 'amp') },
  { key: 'goose',    name: 'goose',            dir: h('.config', 'goose', 'skills'),      detect: h('.config', 'goose') },
  { key: 'factory',  name: 'Factory Droid',    dir: h('.factory', 'skills'),              detect: h('.factory') },
  { key: 'kiro',     name: 'Kiro',             dir: h('.kiro', 'skills'),                 detect: h('.kiro') },
  { key: 'crush',    name: 'Crush',            dir: h('.config', 'crush', 'skills'),      detect: h('.config', 'crush') },
  { key: 'pi',       name: 'Pi',               dir: h('.pi', 'agent', 'skills'),          detect: h('.pi') },
  // Antigravity uses .agent (singular) for workspaces and its own global path. Not a typo.
  { key: 'antigravity', name: 'Antigravity',   dir: h('.gemini', 'antigravity', 'global_skills'), detect: h('.gemini', 'antigravity') },
]

const exists = (p) => access(p).then(() => true, () => false)

async function skillName () {
  const fm = (await readFile(join(SRC, 'SKILL.md'), 'utf8')).match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const name = fm?.[1].match(/^name:\s*(.+)$/m)?.[1].trim()
  if (!name) throw new Error('SKILL.md has no `name` in its frontmatter')
  if (name !== basename(SRC)) {
    console.warn(`! frontmatter name "${name}" does not match directory "${basename(SRC)}".`)
    console.warn(`  VS Code / Copilot skip skills where these differ. Installing as "${name}".\n`)
  }
  return name
}

const args = process.argv.slice(2)
const has = (f) => args.includes(f)
const opt = (f) => { const i = args.indexOf(f); return i < 0 ? null : args[i + 1] }

if (has('--help') || has('-h')) {
  console.log(await readFile(fileURLToPath(import.meta.url), 'utf8')
    .then(s => s.split('\n').slice(1, 10).map(l => l.replace(/^\/\/ ?/, '')).join('\n')))
  process.exit(0)
}

if (has('--list')) {
  for (const t of TARGETS) console.log(`  ${t.key.padEnd(12)} ${t.name.padEnd(22)} ${t.dir}`)
  process.exit(0)
}

const name = await skillName()
const only = opt('--targets')?.split(',').map(s => s.trim()).filter(Boolean)
const write = has('--write')

let chosen = TARGETS
if (only) {
  const unknown = only.filter(k => !TARGETS.some(t => t.key === k))
  if (unknown.length) { console.error(`unknown target(s): ${unknown.join(', ')}  (see --list)`); process.exit(1) }
  chosen = TARGETS.filter(t => only.includes(t.key))
} else if (!has('--all')) {
  // The standard dir always applies; the rest only where that agent is present.
  chosen = []
  for (const t of TARGETS) if (!t.detect || await exists(t.detect)) chosen.push(t)
}

const plan = []
for (const t of chosen) plan.push({ ...t, replacing: await exists(join(t.dir, name)) })
const skipped = TARGETS.filter(t => !chosen.includes(t))

console.log(`\nskill: ${name}\nsource: ${SRC}\n`)
console.log(`will install to ${plan.length} location(s):`)
for (const t of plan) {
  console.log(`  ${t.replacing ? '~' : '+'} ${t.name.padEnd(22)} ${join(t.dir, name)}${t.replacing ? '   (replacing existing)' : ''}`)
  if (t.note) console.log(`    ${t.note}`)
}
if (skipped.length && !only) {
  console.log(`\nnot detected, skipped: ${skipped.map(t => t.name).join(', ')}`)
  console.log('  use --targets <key> to install anyway (see --list)')
}

if (!write) {
  console.log('\nthis was a dry run. add --write to install.\n')
  process.exit(0)
}

for (const t of plan) {
  const dest = join(t.dir, name)
  await mkdir(t.dir, { recursive: true })
  await rm(dest, { recursive: true, force: true })
  await mkdir(dest, { recursive: true })
  for (const f of PAYLOAD) {
    const from = join(SRC, f)
    if (await exists(from)) await cp(from, join(dest, f), { recursive: true })
  }
  console.log(`  installed  ${dest}`)
}
console.log(`\ndone. restart your agent session so it picks up the new skill.\n`)
