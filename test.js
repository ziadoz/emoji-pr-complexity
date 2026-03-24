'use strict';

// Stub out @actions/* so index.js can be required without a real GH context
const Module = require('module');
const _resolve = Module._resolveFilename.bind(Module);
Module._resolveFilename = (req, ...args) =>
  req === '@actions/core' || req === '@actions/github' ? req : _resolve(req, ...args);
require.cache['@actions/core']   = { id: '@actions/core',   exports: {}, loaded: true, children: [], filename: '@actions/core',   paths: [] };
require.cache['@actions/github'] = { id: '@actions/github', exports: {}, loaded: true, children: [], filename: '@actions/github', paths: [] };

const { score, emoji, stripEmoji } = require('./index');

let passed = 0, failed = 0;

function test(description, actual, expected) {
  if (actual === expected) {
    console.log(`  ✅ ${description}`);
    passed++;
  } else {
    console.error(`  ❌ ${description}`);
    console.error(`     expected: ${JSON.stringify(expected)}`);
    console.error(`     actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

function files(count, exts, changesEach) {
  return Array.from({ length: count }, (_, i) => ({
    filename: `file_${i}.${exts[i % exts.length]}`,
    changes:  changesEach,
  }));
}

// ── score() ──────────────────────────────────────────────────────────────────

console.log('\nscore()');

[
  // [description,                   files,                         expected]
  ['typo fix',                        files(1, ['md'],           2),   6  ],
  ['small bug fix',                   files(3, ['js', 'css'],   13),  16  ],
  ['new feature, full stack',         files(8, ['js','css','html','json'], 19), 40],
  ['large refactor',                  files(20, ['js','ts','json'],    20), 72],
  ['Laravel upgrade',                 files(500, ['php','json','yml','js','md'], 4), 1120],
].forEach(([desc, f, expected]) => test(desc, score(f), expected));

// ── emoji() ──────────────────────────────────────────────────────────────────

console.log('\nemoji()');

[
  [0,    '😊'],
  [15,   '😊'],
  [16,   '🙂'],
  [50,   '🙂'],
  [51,   '😐'],
  [120,  '😐'],
  [121,  '😠'],
  [250,  '😠'],
  [251,  '😡'],
  [500,  '😡'],
  [501,  '💀'],
  [9999, '💀'],
].forEach(([s, expected]) => test(`score ${s} → ${expected}`, emoji(s), expected));

// ── stripEmoji() ─────────────────────────────────────────────────────────────

console.log('\nstripEmoji()');

[
  ['😊 Fix a typo',          'Fix a typo'  ],
  ['🙂 Add login page',      'Add login page'],
  ['😐 Refactor auth',       'Refactor auth'],
  ['😠 Overhaul billing',    'Overhaul billing'],
  ['😡 Rewrite everything',  'Rewrite everything'],
  ['💀 The big one',         'The big one'  ],
  ['No emoji at all',        'No emoji at all'],
  ['😊😊 Double prefix',     '😊 Double prefix'],
].forEach(([input, expected]) => test(`"${input}"`, stripEmoji(input), expected));

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) process.exit(1);
